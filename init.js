const axios = require('axios');
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

async function fetchData() {
    for (const key in data) {
        const id = data[key].id;
        const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/page/${id}?fields[node--page]=body,title,drupal_internal__nid`;
        try {
            const response = await axios.get(url);
            data[key].value = response.data.data; // Using response.data directly since axios parses JSON automatically
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Write data to a file named data.js
    try {
        await fs.writeFile('data.js', `const fetchedData = ${JSON.stringify(data, null, 2)};\nexport default fetchedData;`);
        console.log('Data has been saved to data.js');
    } catch (error) {
        console.error('Failed to save data to file:', error);
    }


}

fetchData();
