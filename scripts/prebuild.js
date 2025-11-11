const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 基本設定
const BASE_URL = "https://drupal.aws.ldas.jp/dlm/";
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');

// ダウンロードするコンテンツタイプ
const CONTENT_TYPES = [
    "spots",
    "poems",
    "sanbuns",
    "yokyokus",
    "images",
    "documents",
    "poems_translations",
    "sanbuns_translations"
];

// /api エンドポイント（poems, sanbuns, yokyokusの関連データ）
const API_ENDPOINTS = ["poems", "sanbuns", "yokyokus"];

// 固定ページID（node/init.jsから）
const PAGE_IDS = {
    '緯度経度': "2bd8d311-6024-4dfc-98c2-f9fd0c4a1477",
    '歌枕としての意味': "03d91050-7593-49b9-b24d-2e1172555b4b",
    '歌枕としての特徴': "bb6ff42f-443a-4e7f-bc25-8b6b4a168462",
    '連想': "e68cd44b-ad42-4bb4-96ca-9df04ccd42a3",
    '地誌情報': "72528a60-1435-4539-9ad1-ed375aafac7a",
    '歴史': "6f9a7010-4306-4c7e-9702-c1f5d433d374",
    'URL': "c332309b-603d-4c40-af9f-947931dd5286",
    'contact': "0a3c695c-d8ba-45c7-9f11-0ec60eabd34c",
    'about': "70719d64-1529-4fcf-960d-b03c8ed56a96",
    'legend': "c1f814ad-9822-4338-9cf1-aebc75da2351"
};

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// APIからデータを取得する関数
async function fetchData(endpoint, params = {}, baseUrl = BASE_URL) {
    try {
        const url = `${baseUrl}${endpoint}`;
        console.log(`Fetching: ${url}`);
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
        return null;
    }
}

// ページネーション付きでデータを取得する関数
async function fetchAllData(endpoint, params = {}, baseUrl = BASE_URL) {
    let offset = 0;
    const limit = 50;
    const allData = { data: [], included: [] };

    while (true) {
        const queryParams = {
            ...params,
            'page[offset]': offset,
            'page[limit]': limit
        };

        const data = await fetchData(endpoint, queryParams, baseUrl);

        if (!data || !data.data || data.data.length === 0) {
            break;
        }

        allData.data = allData.data.concat(data.data);

        if (data.included) {
            allData.included = allData.included.concat(data.included);
        }

        if (data.data.length < limit) {
            break;
        }

        offset += limit;
        console.log(`  Fetched ${offset} items...`);
    }

    return allData;
}

// データを保存する関数
function saveData(data, filePath) {
    try {
        const dirName = path.dirname(filePath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✓ Saved to ${path.relative(OUTPUT_DIR, filePath)}`);
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error.message);
    }
}

// メイン処理
async function main() {
    console.log('====================================');
    console.log('Starting data download...');
    console.log('====================================\n');

    const languages = ['ja', 'en'];

    // 各言語について処理
    for (const lang of languages) {
        console.log(`\n📥 Downloading ${lang.toUpperCase()} data...`);

        const langBaseUrl = lang === 'en' ? `${BASE_URL}en/` : BASE_URL;
        const langOutputPath = lang === 'en' ? path.join(OUTPUT_DIR, 'en') : OUTPUT_DIR;

        // 各コンテンツタイプのデータを取得
        for (const type of CONTENT_TYPES) {
            console.log(`\n  📦 Downloading ${type}...`);
            const endpoint = `jsonapi/node/${type}`;

            const data = await fetchAllData(endpoint, {}, langBaseUrl);

            if (data && data.data.length > 0) {
                // コンテンツタイプ全体のデータを保存
                const jsonapiDirPath = path.join(langOutputPath, 'jsonapi', 'node');
                const jsonapiFilePath = path.join(jsonapiDirPath, `${type}.json`);
                saveData(data, jsonapiFilePath);

                console.log(`    Total items: ${data.data.length}`);
            } else {
                console.log(`    No data found`);
            }
        }

        // 固定ページのデータを取得
        console.log(`\n  📄 Downloading fixed pages...`);
        for (const [name, id] of Object.entries(PAGE_IDS)) {
            const endpoint = `jsonapi/node/page/${id}`;
            const params = { 'fields[node--page]': 'body,title,drupal_internal__nid' };

            const data = await fetchData(endpoint, params, langBaseUrl);

            if (data) {
                const pagePath = path.join(langOutputPath, 'jsonapi', 'node', 'page', `${id}.json`);
                saveData(data, pagePath);
            }
        }

        // すべてのページをダウンロード (field_idでフィルタリングが必要なページ用)
        console.log(`\n  📄 Downloading all pages...`);
        const pagesData = await fetchAllData('jsonapi/node/page', {}, langBaseUrl);
        if (pagesData && pagesData.data.length > 0) {
            const allPagesPath = path.join(langOutputPath, 'jsonapi', 'node', 'page.json');
            saveData(pagesData, allPagesPath);
            console.log(`    Total pages: ${pagesData.data.length}`);
        }
    }

    // /api エンドポイントからデータを取得
    console.log(`\n\n📡 Downloading API endpoint data...`);
    for (const endpoint of API_ENDPOINTS) {
        console.log(`\n  🔗 Downloading api/${endpoint}...`);
        const data = await fetchData(`api/${endpoint}`, {}, BASE_URL);

        if (data) {
            const apiDir = path.join(OUTPUT_DIR, 'api');
            const apiFile = path.join(apiDir, `${endpoint}.json`);
            saveData(data, apiFile);
        }
    }

    // スポットの詳細データを取得（index/data）
    console.log(`\n\n📍 Downloading spot details (index/data)...`);

    // まずスポット一覧を取得
    const spotsData = await fetchAllData('jsonapi/node/spots', {}, BASE_URL);

    if (spotsData && spotsData.data) {
        console.log(`  Found ${spotsData.data.length} spots`);

        for (const spot of spotsData.data) {
            const spotId = spot.attributes.field_id;
            console.log(`\n  🗺️  Downloading details for spot: ${spotId}`);

            const endpoint = `jsonapi/index/data`;
            const params = { 'filter[field_id]': spotId };

            const spotDetails = await fetchAllData(endpoint, params, BASE_URL);

            if (spotDetails) {
                const spotDir = path.join(OUTPUT_DIR, 'jsonapi', 'index', 'data');
                const spotFile = path.join(spotDir, `${spotId}.json`);
                saveData(spotDetails, spotFile);
            }
        }
    }

    // assets/js/data.js を生成（node/init.jsの処理）
    console.log(`\n\n📝 Generating assets/js/data.js...`);
    const legendsData = {};

    for (const [key, id] of Object.entries(PAGE_IDS)) {
        if (key === 'contact') continue; // contactは除外

        const pagePath = path.join(OUTPUT_DIR, 'jsonapi', 'node', 'page', `${id}.json`);

        if (fs.existsSync(pagePath)) {
            try {
                const pageData = JSON.parse(fs.readFileSync(pagePath, 'utf-8'));
                legendsData[key] = {
                    id: id,
                    value: pageData.data
                };
            } catch (error) {
                console.error(`Error reading ${pagePath}:`, error.message);
            }
        }
    }

    const dataJsPath = path.join(__dirname, '../assets/js/data.js');
    const dataJsContent = `const fetchedData = ${JSON.stringify(legendsData, null, 2)};\nexport default fetchedData;`;
    fs.writeFileSync(dataJsPath, dataJsContent);
    console.log(`✓ Generated assets/js/data.js`);

    console.log('\n====================================');
    console.log('✅ Download completed!');
    console.log('====================================');
}

// スクリプト実行
main().catch(error => {
    console.error('❌ Error in main process:', error);
    process.exit(1);
});
