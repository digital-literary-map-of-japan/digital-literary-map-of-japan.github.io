const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = path.resolve(__dirname, '../public/downloads/dlm-dataset.xlsx');
const META_PATH = path.resolve(__dirname, '../public/downloads/dataset-meta.json');
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');
const DATA_JS_PATH = path.resolve(__dirname, '../assets/js/data.js');

// 固定ページID（assets/js/data.js 用）
const PAGE_IDS = {
  '緯度経度': '2bd8d311-6024-4dfc-98c2-f9fd0c4a1477',
  '歌枕としての意味': '03d91050-7593-49b9-b24d-2e1172555b4b',
  '歌枕としての特徴': 'bb6ff42f-443a-4e7f-bc25-8b6b4a168462',
  '連想': 'e68cd44b-ad42-4bb4-96ca-9df04ccd42a3',
  '地誌情報': '72528a60-1435-4539-9ad1-ed375aafac7a',
  '歴史': '6f9a7010-4306-4c7e-9702-c1f5d433d374',
  'URL': 'c332309b-603d-4c40-af9f-947931dd5286',
  'contact': '0a3c695c-d8ba-45c7-9f11-0ec60eabd34c',
  'about': '70719d64-1529-4fcf-960d-b03c8ed56a96',
  'legend': 'c1f814ad-9822-4338-9cf1-aebc75da2351',
};

function saveData(data, filePath) {
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function cellToStr(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    if (Array.isArray(val.richText)) {
      return val.richText.map(r => r.text || '').join('');
    }
    if (val.text !== undefined) return String(val.text);
    if (val.result !== undefined) return String(val.result);
  }
  return String(val);
}

function cellToNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = Number(cellToStr(val));
  return Number.isNaN(n) ? null : n;
}

function sheetToRows(ws) {
  if (!ws) return [];
  const headerRow = ws.getRow(1);
  const headers = {};
  headerRow.eachCell((cell, colNumber) => {
    const h = cellToStr(cell.value).trim();
    if (h) headers[h] = colNumber;
  });

  const rows = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    if (!row || !row.hasValues) continue;
    const obj = {};
    for (const [h, col] of Object.entries(headers)) {
      obj[h] = cellToStr(row.getCell(col).value);
    }
    rows.push(obj);
  }
  return rows;
}

function toHtmlObj(str, nullIfEmpty = true) {
  const s = (str || '').trim();
  if (!s) {
    return nullIfEmpty ? null : { value: '', format: 'basic_html', processed: '' };
  }
  const html = /<[a-z][\s\S]*>/i.test(s)
    ? s
    : `<p>${s.split(/\r?\n/).join('<br />')}</p>`;
  return {
    value: html,
    format: 'basic_html',
    processed: html,
  };
}

function parseLinks(str) {
  const s = (str || '').trim();
  if (!s) return [];
  return s
    .split(',')
    .map(u => u.trim())
    .filter(Boolean)
    .map(uri => ({ uri, title: null, options: [] }));
}

function buildSpots(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const lat = cellToNum(r['緯度']);
      const lng = cellToNum(r['経度']);
      return {
        type: 'node--spots',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          field_local_number: r['番号'] || null,
          title: r['地名'] || '',
          field_spot_name_furigana: r['地名（ふりがな）'] || null,
          field_spot_name_romaji: r['地名（ローマ字）'] || null,
          field_kuni: r['旧国名'] || null,
          field_prefecture: r['都道府県'] || null,
          field_geo: lat !== null && lng !== null ? { lat, lon: lng } : null,
          field_utamakura: r['歌枕'] === 'Yes',
          field_meisho: r['名所'] === 'Yes',
          field_utamakura_meaning: r['歌枕としての意味'] || null,
          field_utamakura_features: r['歌枕としての特徴'] || null,
          field_utamakura_associations: r['歌枕としての連想'] || null,
          field_topography: toHtmlObj(r['地勢'], true),
          field_topography_ja: toHtmlObj(r['地勢（日本語）'], false),
          field_topography_en: toHtmlObj(r['地勢（英語）'], false),
          field_history_ja: toHtmlObj(r['沿革（日本語）'], false),
          field_history_en: toHtmlObj(r['沿革（英語）'], false),
          field_memo: toHtmlObj(r['備考'], true),
          field_no_examples: r['No examples'] === 'Yes',
        },
      };
    }),
    included: [],
  };
}

function buildDocuments(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      return {
        type: 'node--documents',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          field_number: r['番号'] || null,
          title: r['題名'] || '',
          field_document_name_furigana: r['題名（ふりがな）'] || null,
          field_document_name_romaji: r['題名（ローマ字）'] || null,
          field_author_name_kanji: r['著者'] || null,
          field_author_name_furigana: r['著者（ふりがな）'] || null,
          field_author_name_romaji: r['著者（ローマ字）'] || null,
          field_genre: r['ジャンル'] || null,
          field_year: r['年'] || null,
          field_source_text: r['依拠本文'] || null,
          field_reference_text: r['参照テキスト'] || null,
          field_publisher: r['出版社'] || null,
          field_publication_place: r['出版地'] || null,
          field_publication_location: r['出版場所'] || null,
          field_link: parseLinks(r['リンク']),
        },
      };
    }),
    included: [],
  };
}

function buildPoems(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const spotId = r['名所ID'] || '';
      const docId = r['資料ID'] || '';
      return {
        type: 'node--poems',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          field_document_numbering: r['資料番号'] || null,
          field_kotobagaki: r['詞書'] || null,
          field_kotobagaki_long: r['詞書（長）'] || null,
          field_text: r['テクスト'] || null,
          field_text_romaji: r['テクスト（ローマ字）'] || null,
          field_text_romaji_long: r['テクスト（ローマ字・長）'] || null,
          field_volume: r['巻・部立'] || null,
          field_author: r['著者'] || null,
          field_author_romaji: r['著者（ローマ字）'] || null,
          field_place_form: r['地名の形'] || null,
          field_link: parseLinks(r['リンク']),
        },
        relationships: {
          field_spot: {
            data: spotId ? { type: 'node--spots', id: spotId } : null,
          },
          field_document: {
            data: docId ? { type: 'node--documents', id: docId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildPoemsTranslations(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const poemId = r['和歌ID'] || '';
      return {
        type: 'node--poems_translations',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          title: r['題名'] || null,
          field_text: r['テクスト'] || null,
          field_source: r['出典'] || null,
        },
        relationships: {
          field_poem: {
            data: poemId ? { type: 'node--poems', id: poemId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildSanbuns(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const spotId = r['名所ID'] || '';
      const docId = r['資料ID'] || '';
      const rawText = (r['テクスト'] || '').trim();
      return {
        type: 'node--sanbuns',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          title: r['題名'] || null,
          field_chapter: r['章段'] || null,
          field_text: rawText ? rawText.split(/\r?\n/).join('<br />') : null,
          field_page_number: r['活字本頁'] || null,
          field_place_form: r['地名の形'] || null,
          field_midashi_internal: r['見出し（内部）'] || null,
          field_link: parseLinks(r['リンク']),
        },
        relationships: {
          field_spot: {
            data: spotId ? { type: 'node--spots', id: spotId } : null,
          },
          field_document: {
            data: docId ? { type: 'node--documents', id: docId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildSanbunsTranslations(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const sanbunId = r['物語ID'] || '';
      return {
        type: 'node--sanbuns_translations',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          title: r['題名'] || null,
          field_text: r['テクスト'] || null,
          field_source: r['出典'] || null,
        },
        relationships: {
          field_sanbun: {
            data: sanbunId ? { type: 'node--sanbuns', id: sanbunId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildYokyokus(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'] || null;
      const spotId = r['名所ID'] || '';
      const docId = r['資料ID'] || '';
      return {
        type: 'node--yokyokus',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          field_document_numbering: r['資料番号'] || null,
          title: r['題名'] || null,
          field_text: r['テクスト'] || null,
          field_context: toHtmlObj(r['コンテクスト'], true),
          field_scene_description: toHtmlObj(r['場面説明'], true),
          field_scene_description_eng: toHtmlObj(r['場面説明（英語）'], true),
          field_commentary: toHtmlObj(r['考察'], true),
          field_commentary_eng: toHtmlObj(r['考察（英語）'], true),
          field_place_form: r['地名の形'] || null,
          field_line: r['セリフ別番号'] || null,
          field_no_examples: r['No examples'] === 'Yes',
          field_link: parseLinks(r['リンク']),
        },
        relationships: {
          field_spot: {
            data: spotId ? { type: 'node--spots', id: spotId } : null,
          },
          field_document: {
            data: docId ? { type: 'node--documents', id: docId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildImages(rows) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const field_id = r['ID'];
      const spotId = r['名所ID'] || '';
      const manifestUri = (r['IIIFマニフェスト'] || '').trim();
      return {
        type: 'node--images',
        id: field_id || String(nid),
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          field_index: cellToNum(r['順番']),
          title: r['題名'] || null,
          field_manifest: manifestUri ? { uri: manifestUri, title: null, options: [] } : null,
          field_link: parseLinks(r['リンク']),
          field_pos: cellToNum(r['コマ']),
        },
        relationships: {
          field_spot: {
            data: spotId ? { type: 'node--spots', id: spotId } : null,
          },
        },
      };
    }),
    included: [],
  };
}

function buildPages(rows, lang) {
  return {
    data: rows.map(r => {
      const nid = cellToNum(r['NID']);
      const uuid = r['UUID'];
      const field_id = r['ID'] || null;
      const title = lang === 'en' ? (r['題名（英語）'] || r['題名（日本語）']) : r['題名（日本語）'];
      const bodyRaw = lang === 'en' ? (r['本文（英語）'] || r['本文（日本語）']) : r['本文（日本語）'];
      const processed = (bodyRaw || '').replace(/\r\n/g, '\n');
      return {
        type: 'node--page',
        id: uuid,
        attributes: {
          drupal_internal__nid: nid,
          field_id,
          title: title || '',
          body: {
            value: bodyRaw || '',
            format: 'basic_html',
            processed,
            summary: '',
          },
        },
      };
    }),
    included: [],
  };
}

async function main() {
  console.log('====================================');
  console.log('Building data from Excel master...');
  console.log(`Source: ${EXCEL_PATH}`);
  console.log('====================================\n');

  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel master file not found: ${EXCEL_PATH}`);
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);

  const spotsData = buildSpots(sheetToRows(wb.getWorksheet('Spots (文学名所)')));
  const documentsData = buildDocuments(sheetToRows(wb.getWorksheet('Documents (資料)')));
  const poemsData = buildPoems(sheetToRows(wb.getWorksheet('Poems (和歌)')));
  const poemsTranslationsData = buildPoemsTranslations(sheetToRows(wb.getWorksheet('Poems Translations (和歌翻訳)')));
  const sanbunsData = buildSanbuns(sheetToRows(wb.getWorksheet('Sanbuns (物語・説話)')));
  const sanbunsTranslationsData = buildSanbunsTranslations(sheetToRows(wb.getWorksheet('Sanbuns Translations (物語翻訳)')));
  const yokyokusData = buildYokyokus(sheetToRows(wb.getWorksheet('Yokyokus (謡曲)')));
  const imagesData = buildImages(sheetToRows(wb.getWorksheet('Images (絵図等)')));

  const pageRows = sheetToRows(wb.getWorksheet('Pages (固定ページ)'));
  const pagesJa = buildPages(pageRows, 'ja');
  const pagesEn = buildPages(pageRows, 'en');

  const contentMap = {
    spots: spotsData,
    documents: documentsData,
    poems: poemsData,
    poems_translations: poemsTranslationsData,
    sanbuns: sanbunsData,
    sanbuns_translations: sanbunsTranslationsData,
    yokyokus: yokyokusData,
    images: imagesData,
  };

  // Save JA and EN node JSON files
  for (const lang of ['ja', 'en']) {
    const langOutputPath = lang === 'en' ? path.join(OUTPUT_DIR, 'en') : OUTPUT_DIR;
    const nodeDir = path.join(langOutputPath, 'jsonapi', 'node');

    for (const [type, data] of Object.entries(contentMap)) {
      saveData(data, path.join(nodeDir, `${type}.json`));
    }

    const pagesData = lang === 'en' ? pagesEn : pagesJa;
    saveData(pagesData, path.join(nodeDir, 'page.json'));

    for (const pageItem of pagesData.data) {
      saveData({ data: pageItem }, path.join(nodeDir, 'page', `${pageItem.id}.json`));
    }
  }

  console.log(`✓ Saved node JSON files (spots: ${spotsData.data.length}, documents: ${documentsData.data.length}, poems: ${poemsData.data.length}, sanbuns: ${sanbunsData.data.length}, yokyokus: ${yokyokusData.data.length}, images: ${imagesData.data.length}, pages: ${pagesJa.data.length})`);

  // Generate /api/{poems,sanbuns,yokyokus}.json
  const apiTypes = {
    poems: poemsData,
    sanbuns: sanbunsData,
    yokyokus: yokyokusData,
  };
  for (const [endpoint, data] of Object.entries(apiTypes)) {
    const apiList = data.data.map(item => ({
      document_id: item.relationships?.field_document?.data?.id || '',
      spot_id: item.relationships?.field_spot?.data?.id || '',
    }));
    saveData(apiList, path.join(OUTPUT_DIR, 'api', `${endpoint}.json`));
  }
  console.log('✓ Generated api/{poems,sanbuns,yokyokus}.json');

  // Generate spot details (jsonapi/index/data/{fieldId}.json)
  const indexContentTypes = [poemsData, sanbunsData, yokyokusData, imagesData];
  for (const spot of spotsData.data) {
    const fieldId = spot.attributes.field_id;
    const spotId = spot.id;
    const spotDetails = { data: [], included: [] };

    for (const contentData of indexContentTypes) {
      for (const item of contentData.data) {
        const spotRef = item.relationships?.field_spot?.data;
        if (spotRef && spotRef.id === spotId) {
          spotDetails.data.push(item);
        }
      }
    }

    saveData(spotDetails, path.join(OUTPUT_DIR, 'jsonapi', 'index', 'data', `${fieldId}.json`));
  }
  console.log(`✓ Generated ${spotsData.data.length} spot index files`);

  // Generate assets/js/data.js
  const legendsData = {};
  const pageJaMap = new Map(pagesJa.data.map(p => [p.id, p]));
  for (const [key, id] of Object.entries(PAGE_IDS)) {
    if (key === 'contact') continue;
    const pageItem = pageJaMap.get(id);
    if (pageItem) {
      legendsData[key] = {
        id,
        value: pageItem,
      };
    }
  }
  const dataJsContent = `const fetchedData = ${JSON.stringify(legendsData, null, 2)};\nexport default fetchedData;\n`;
  fs.writeFileSync(DATA_JS_PATH, dataJsContent);
  console.log('✓ Generated assets/js/data.js');

  // Update dataset-meta.json from Excel file
  const stats = fs.statSync(EXCEL_PATH);
  const sheetsMeta = wb.worksheets
    .filter(ws => ws.name !== 'Pages (固定ページ)')
    .map(ws => ({
      name: ws.name,
      count: ws.rowCount - 1,
    }));
  const modDate = wb.modified || wb.created || stats.mtime;
  const meta = {
    generatedAt: new Date(modDate).toISOString().split('T')[0],
    fileSize: `${(stats.size / 1024).toFixed(0)} KB`,
    sheetCount: sheetsMeta.length,
    totalRows: sheetsMeta.reduce((sum, s) => sum + s.count, 0),
    sheets: sheetsMeta,
  };
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2) + '\n');
  console.log('✓ Updated public/downloads/dataset-meta.json');

  console.log('\n====================================');
  console.log('✅ Build data generation completed!');
  console.log('====================================');
}

main().catch(error => {
  console.error('❌ Error in prebuild process:', error);
  process.exit(1);
});
