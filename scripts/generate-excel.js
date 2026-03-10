const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../public/data');
const OUTPUT_DIR = path.resolve(__dirname, '../public/downloads');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function styleHeader(ws) {
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2B3E50' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
}

async function generateSpotsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/spots.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Spots (文学名所)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 28 },
    { header: '番号', key: 'field_local_number', width: 8 },
    { header: '地名', key: 'title', width: 20 },
    { header: '地名（ふりがな）', key: 'field_spot_name_furigana', width: 20 },
    { header: '地名（ローマ字）', key: 'field_spot_name_romaji', width: 20 },
    { header: '旧国名', key: 'field_kuni', width: 15 },
    { header: '都道府県', key: 'field_prefecture', width: 15 },
    { header: '緯度', key: 'lat', width: 12 },
    { header: '経度', key: 'lng', width: 12 },
    { header: '歌枕', key: 'field_utamakura', width: 10 },
    { header: '名所', key: 'field_meisho', width: 10 },
    { header: '歌枕としての意味', key: 'field_utamakura_meaning', width: 30 },
    { header: '歌枕としての特徴', key: 'field_utamakura_features', width: 30 },
    { header: '歌枕としての連想', key: 'field_utamakura_associations', width: 30 },
    { header: '地勢', key: 'field_topography', width: 30 },
    { header: '地勢（日本語）', key: 'field_topography_ja', width: 40 },
    { header: '地勢（英語）', key: 'field_topography_en', width: 40 },
    { header: '沿革（日本語）', key: 'field_history_ja', width: 40 },
    { header: '沿革（英語）', key: 'field_history_en', width: 40 },
    { header: '備考', key: 'field_memo', width: 30 },
    { header: 'No examples', key: 'field_no_examples', width: 10 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      field_local_number: a.field_local_number,
      title: a.title,
      field_spot_name_furigana: a.field_spot_name_furigana,
      field_spot_name_romaji: a.field_spot_name_romaji,
      field_kuni: a.field_kuni,
      field_prefecture: a.field_prefecture,
      lat: a.field_geo?.lat,
      lng: a.field_geo?.lon,
      field_utamakura: a.field_utamakura ? 'Yes' : 'No',
      field_meisho: a.field_meisho ? 'Yes' : 'No',
      field_utamakura_meaning: a.field_utamakura_meaning,
      field_utamakura_features: a.field_utamakura_features,
      field_utamakura_associations: a.field_utamakura_associations,
      field_topography: a.field_topography,
      field_topography_ja: stripHtml(a.field_topography_ja?.value || ''),
      field_topography_en: stripHtml(a.field_topography_en?.value || ''),
      field_history_ja: stripHtml(a.field_history_ja?.value || ''),
      field_history_en: stripHtml(a.field_history_en?.value || ''),
      field_memo: stripHtml(a.field_memo?.value || a.field_memo || ''),
      field_no_examples: a.field_no_examples ? 'Yes' : 'No',
    });
  }

  console.log(`  ✓ Spots: ${data.data.length} rows`);
}

async function generateDocumentsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/documents.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Documents (資料)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 28 },
    { header: '番号', key: 'field_number', width: 8 },
    { header: '題名', key: 'title', width: 25 },
    { header: '題名（ふりがな）', key: 'field_document_name_furigana', width: 25 },
    { header: '題名（ローマ字）', key: 'field_document_name_romaji', width: 25 },
    { header: '著者', key: 'field_author_name_kanji', width: 20 },
    { header: '著者（ふりがな）', key: 'field_author_name_furigana', width: 20 },
    { header: '著者（ローマ字）', key: 'field_author_name_romaji', width: 20 },
    { header: 'ジャンル', key: 'field_genre', width: 15 },
    { header: '年', key: 'field_year', width: 15 },
    { header: '依拠本文', key: 'field_source_text', width: 20 },
    { header: '参照テキスト', key: 'field_reference_text', width: 20 },
    { header: '出版社', key: 'field_publisher', width: 20 },
    { header: '出版地', key: 'field_publication_place', width: 15 },
    { header: '出版場所', key: 'field_publication_location', width: 15 },
    { header: 'リンク', key: 'field_link', width: 40 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    const links = Array.isArray(a.field_link) ? a.field_link : (a.field_link ? [a.field_link] : []);
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      field_number: a.field_number,
      title: a.title,
      field_document_name_furigana: a.field_document_name_furigana,
      field_document_name_romaji: a.field_document_name_romaji,
      field_author_name_kanji: stripHtml(a.field_author_name_kanji || ''),
      field_author_name_furigana: a.field_author_name_furigana,
      field_author_name_romaji: a.field_author_name_romaji,
      field_genre: a.field_genre,
      field_year: a.field_year,
      field_source_text: a.field_source_text,
      field_reference_text: a.field_reference_text,
      field_publisher: a.field_publisher,
      field_publication_place: a.field_publication_place,
      field_publication_location: a.field_publication_location,
      field_link: links.map(l => l.uri).join(', '),
    });
  }

  console.log(`  ✓ Documents: ${data.data.length} rows`);
}

async function generatePoemsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/poems.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Poems (和歌)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 28 },
    { header: '資料番号', key: 'field_document_numbering', width: 15 },
    { header: '詞書', key: 'field_kotobagaki', width: 30 },
    { header: '詞書（長）', key: 'field_kotobagaki_long', width: 40 },
    { header: 'テクスト', key: 'field_text', width: 40 },
    { header: 'テクスト（ローマ字）', key: 'field_text_romaji', width: 40 },
    { header: 'テクスト（ローマ字・長）', key: 'field_text_romaji_long', width: 40 },
    { header: '巻・部立', key: 'field_volume', width: 15 },
    { header: '著者', key: 'field_author', width: 15 },
    { header: '著者（ローマ字）', key: 'field_author_romaji', width: 20 },
    { header: '地名の形', key: 'field_place_form', width: 15 },
    { header: 'リンク', key: 'field_link', width: 40 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    const links = Array.isArray(a.field_link) ? a.field_link : (a.field_link ? [a.field_link] : []);
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      field_document_numbering: a.field_document_numbering,
      field_kotobagaki: stripHtml(a.field_kotobagaki?.value || a.field_kotobagaki || ''),
      field_kotobagaki_long: stripHtml(a.field_kotobagaki_long?.value || a.field_kotobagaki_long || ''),
      field_text: stripHtml(a.field_text?.value || a.field_text || ''),
      field_text_romaji: a.field_text_romaji || '',
      field_text_romaji_long: a.field_text_romaji_long || '',
      field_volume: a.field_volume,
      field_author: a.field_author,
      field_author_romaji: a.field_author_romaji || '',
      field_place_form: a.field_place_form,
      field_link: links.map(l => l.uri).join(', '),
    });
  }

  console.log(`  ✓ Poems: ${data.data.length} rows`);
}

async function generateSanbunsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/sanbuns.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Sanbuns (物語・説話)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 28 },
    { header: '題名', key: 'title', width: 25 },
    { header: '章段', key: 'field_chapter', width: 20 },
    { header: 'テクスト', key: 'field_text', width: 40 },
    { header: '活字本頁', key: 'field_page_number', width: 12 },
    { header: '地名の形', key: 'field_place_form', width: 15 },
    { header: '見出し（内部）', key: 'field_midashi_internal', width: 20 },
    { header: 'リンク', key: 'field_link', width: 40 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    const links = Array.isArray(a.field_link) ? a.field_link : (a.field_link ? [a.field_link] : []);
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      title: a.title,
      field_chapter: a.field_chapter,
      field_text: stripHtml(a.field_text?.value || a.field_text || ''),
      field_page_number: a.field_page_number,
      field_place_form: a.field_place_form,
      field_midashi_internal: a.field_midashi_internal,
      field_link: links.map(l => l.uri).join(', '),
    });
  }

  console.log(`  ✓ Sanbuns: ${data.data.length} rows`);
}

async function generateYokyokusSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/yokyokus.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Yokyokus (謡曲)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 28 },
    { header: '資料番号', key: 'field_document_numbering', width: 15 },
    { header: '題名', key: 'title', width: 25 },
    { header: 'テクスト', key: 'field_text', width: 40 },
    { header: 'コンテクスト', key: 'field_context', width: 30 },
    { header: '場面説明', key: 'field_scene_description', width: 30 },
    { header: '場面説明（英語）', key: 'field_scene_description_eng', width: 30 },
    { header: '考察', key: 'field_commentary', width: 30 },
    { header: '考察（英語）', key: 'field_commentary_eng', width: 30 },
    { header: '地名の形', key: 'field_place_form', width: 15 },
    { header: 'セリフ別番号', key: 'field_line', width: 15 },
    { header: 'No examples', key: 'field_no_examples', width: 10 },
    { header: 'リンク', key: 'field_link', width: 40 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    const links = Array.isArray(a.field_link) ? a.field_link : (a.field_link ? [a.field_link] : []);
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      field_document_numbering: a.field_document_numbering,
      title: a.title,
      field_text: stripHtml(a.field_text?.value || a.field_text || ''),
      field_context: stripHtml(a.field_context?.value || a.field_context || ''),
      field_scene_description: stripHtml(a.field_scene_description?.value || a.field_scene_description || ''),
      field_scene_description_eng: stripHtml(a.field_scene_description_eng?.value || a.field_scene_description_eng || ''),
      field_commentary: stripHtml(a.field_commentary?.value || a.field_commentary || ''),
      field_commentary_eng: stripHtml(a.field_commentary_eng?.value || a.field_commentary_eng || ''),
      field_place_form: a.field_place_form,
      field_line: a.field_line,
      field_no_examples: a.field_no_examples ? 'Yes' : 'No',
      field_link: links.map(l => l.uri).join(', '),
    });
  }

  console.log(`  ✓ Yokyokus: ${data.data.length} rows`);
}

async function generateImagesSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/images.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Images (絵図等)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 38 },
    { header: '順番', key: 'field_index', width: 8 },
    { header: '題名', key: 'title', width: 30 },
    { header: 'IIIFマニフェスト', key: 'field_manifest', width: 50 },
    { header: 'リンク', key: 'field_link', width: 50 },
    { header: 'コマ', key: 'field_pos', width: 10 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    const links = Array.isArray(a.field_link) ? a.field_link : (a.field_link ? [a.field_link] : []);
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      field_index: a.field_index,
      title: a.title,
      field_manifest: a.field_manifest?.uri || '',
      field_link: links.map(l => l.uri).join(', '),
      field_pos: a.field_pos,
    });
  }

  console.log(`  ✓ Images: ${data.data.length} rows`);
}

async function generatePoemsTranslationsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/poems_translations.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Poems Translations (和歌翻訳)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 38 },
    { header: '題名', key: 'title', width: 25 },
    { header: 'テクスト', key: 'field_text', width: 50 },
    { header: '出典', key: 'field_source', width: 30 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      title: a.title,
      field_text: stripHtml(a.field_text?.value || a.field_text || ''),
      field_source: stripHtml(a.field_source?.value || a.field_source || ''),
    });
  }

  console.log(`  ✓ Poems Translations: ${data.data.length} rows`);
}

async function generateSanbunsTranslationsSheet(wb) {
  const data = loadJson(path.join(DATA_DIR, 'jsonapi/node/sanbuns_translations.json'));
  if (!data) return;

  const ws = wb.addWorksheet('Sanbuns Translations (物語翻訳)');
  ws.columns = [
    { header: 'NID', key: 'nid', width: 8 },
    { header: 'ID', key: 'field_id', width: 38 },
    { header: '題名', key: 'title', width: 25 },
    { header: 'テクスト', key: 'field_text', width: 50 },
    { header: '出典', key: 'field_source', width: 30 },
  ];

  styleHeader(ws);

  for (const item of data.data) {
    const a = item.attributes;
    ws.addRow({
      nid: a.drupal_internal__nid,
      field_id: a.field_id,
      title: a.title,
      field_text: stripHtml(a.field_text?.value || a.field_text || ''),
      field_source: stripHtml(a.field_source?.value || a.field_source || ''),
    });
  }

  console.log(`  ✓ Sanbuns Translations: ${data.data.length} rows`);
}

async function main() {
  console.log('Generating Excel dataset...\n');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Digital Literary Map of Japan';
  wb.created = new Date();

  await generateSpotsSheet(wb);
  await generateDocumentsSheet(wb);
  await generatePoemsSheet(wb);
  await generatePoemsTranslationsSheet(wb);
  await generateSanbunsSheet(wb);
  await generateSanbunsTranslationsSheet(wb);
  await generateYokyokusSheet(wb);
  await generateImagesSheet(wb);

  const outputPath = path.join(OUTPUT_DIR, 'dlm-dataset.xlsx');
  await wb.xlsx.writeFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`\n✅ Generated: ${outputPath} (${(stats.size / 1024).toFixed(0)} KB)`);

  // Generate dataset-meta.json for the dataset page
  const sheetsMeta = wb.worksheets.map(ws => ({
    name: ws.name,
    count: ws.rowCount - 1, // exclude header row
  }));

  const meta = {
    generatedAt: new Date().toISOString().split('T')[0],
    fileSize: `${(stats.size / 1024).toFixed(0)} KB`,
    sheetCount: sheetsMeta.length,
    totalRows: sheetsMeta.reduce((sum, s) => sum + s.count, 0),
    sheets: sheetsMeta,
  };

  const metaPath = path.join(OUTPUT_DIR, 'dataset-meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`✅ Generated: ${metaPath}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
