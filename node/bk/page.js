// const axios = require('axios');
const fs = require('fs/promises');

const data = {
    緯度経度: {
        id: "2bd8d311-6024-4dfc-98c2-f9fd0c4a1477",
    },
    歌枕としての意味: {
        id: "03d91050-7593-49b9-b24d-2e1172555b4b",
    },
    歌枕としての特徴: {
        id: "bb6ff42f-443a-4e7f-bc25-8b6b4a168462",
    },
    連想: {
        id: "e68cd44b-ad42-4bb4-96ca-9df04ccd42a3",
    },
    地誌情報: {
        id: "72528a60-1435-4539-9ad1-ed375aafac7a",
    },
    歴史: {
        id: "6f9a7010-4306-4c7e-9702-c1f5d433d374",
    },
    URL: {
        id: "c332309b-603d-4c40-af9f-947931dd5286",
    },
};

// JSONファイルを読み込み、キーごとに分割して保存する関数
async function splitJsonByKeys() {
  try {
    // ファイルパスを修正
    const jsonData = await fs.readFile('./data/page.json', 'utf8');
    const parsedData = JSON.parse(jsonData);
    
    // ディレクトリが存在することを確認
    try {
      await fs.mkdir('./data/page', { recursive: true });
    } catch (err) {
      // ディレクトリがすでに存在する場合は無視
      if (err.code !== 'EEXIST') throw err;
    }
    
    // dataオブジェクトのキーごとにファイルを作成
    for (const key in data) {
      const id = data[key].id;
      
      // forEachの代わりにfor...ofループを使用
      for (const item of parsedData.data) {
        if (item.id === id) {
          const keyData = item;
          const fileName = `./data/page/${key}.json`;
          await fs.writeFile(fileName, JSON.stringify(keyData, null, 2), 'utf8');
          console.log(`${key}のJSONファイルを作成しました: ${fileName}`);
        }
      }
    }
    console.log('すべてのJSONファイルの作成が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 関数を実行
splitJsonByKeys();