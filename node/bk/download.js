const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ダウンロードするコンテンツタイプ
const content_types = [
    "page",
    /*
    "spots",
    "poems",
    "sanbuns",
    "yokyokus",
    "images",
    "documents",
    
   "poems_translations",
   "sanbuns_translations"
   */
];

// 基本設定
const BASE_URL = "https://drupal.aws.ldas.jp/dlm/";
const OUTPUT_DIR = path.resolve(__dirname, '../data');

// 出力ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 言語設定
const languages = ['ja', 'en'];

// APIからデータを取得する関数
async function fetchData(endpoint, params = {}, baseUrl = BASE_URL) {
    try {
        const url = `${baseUrl}${endpoint}`;
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
        console.log(`Fetched ${offset} items from ${baseUrl}${endpoint}`);
    }

    return allData;
}

// スポットの詳細データを取得する関数
async function fetchSpotDetails(spotId) {
    const endpoint = `jsonapi/index/data`;
    const params = {
        'filter[field_id]': spotId
    };

    return await fetchAllData(endpoint, params);
}

// データを保存する関数
function saveData(data, filePath) {
    try {
        const dirName = path.dirname(filePath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Data saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error.message);
    }
}

// メイン処理
async function main() {
    // 各言語について処理
    for (const lang of languages) {
        console.log(`言語: ${lang}のデータをダウンロードします...`);
        
        // 言語ごとのベースURLとパスを設定
        const langBaseUrl = lang === 'en' ? `${BASE_URL}en/` : BASE_URL;
        const langOutputPath = lang === 'en' ? path.join(OUTPUT_DIR, 'en') : OUTPUT_DIR;
        
        // 各コンテンツタイプのデータを取得
        for (const type of content_types) {
            console.log(`${lang}の${type}データをダウンロードしています...`);
            const endpoint = `jsonapi/node/${type}`;
            
            // 言語ごとのURLからデータを取得
            const data = await fetchAllData(endpoint, {}, langBaseUrl);
            
            if (data) {
                // コンテンツタイプ全体のデータを保存（jsonapiパスに統一）
                const jsonapiDirPath = path.join(langOutputPath, 'jsonapi', 'node');
                const jsonapiFilePath = path.join(jsonapiDirPath, `${type}.json`);
                saveData(data, jsonapiFilePath);
                
                // 各ノードを個別のJSONファイルとして保存
                console.log(`${lang}の各${type}ノードを個別に保存しています...`);
                for (const node of data.data) {
                    const id = node.id;
                    const nodeDirPath = path.join(langOutputPath, 'jsonapi', 'node', type);
                    const nodeFilePath = path.join(nodeDirPath, `${id}.json`);
                    saveData(node, nodeFilePath);
                }
            }
        }
    }

    /*
    // スポットの詳細データを取得
    console.log('Downloading spot details...');
    const spotsData = await fetchAllData('jsonapi/node/spots');
    
    if (spotsData && spotsData.data) {
        for (const spot of spotsData.data) {
            const spotId = spot.attributes.field_id;
            console.log(`Downloading details for spot ${spotId}...`);
            
            const spotDetails = await fetchSpotDetails(spotId);
            
            if (spotDetails) {
                // スポットごとのディレクトリを作成
                const spotDir = path.join(OUTPUT_DIR, 'spots', spotId);
                if (!fs.existsSync(spotDir)) {
                    fs.mkdirSync(spotDir, { recursive: true });
                }
                
                // スポット基本情報を保存
                saveData(spot, path.join(spotDir, 'index.json'));
                
                // 関連データを種類ごとに分類して保存
                const types = ["poems", "sanbuns", "yokyokus", "images"];
                const typedValues = {};
                
                for (const type of types) {
                    typedValues[type] = {
                        data: spotDetails.data.filter(item => 
                            item.type === `node--${type.slice(0, -1)}`
                        ),
                        included: spotDetails.included
                    };
                    
                    saveData(typedValues[type], path.join(spotDir, `${type}.json`));
                }
            }
        }
    }
    */

    console.log('Download completed!');
}

// スクリプト実行
main().catch(error => {
    console.error('Error in main process:', error);
});