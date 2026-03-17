/**
 * Google Search Console Indexing API スクリプト
 *
 * 使い方:
 * 1. Google Cloud Console で Indexing API を有効化
 * 2. サービスアカウントを作成し、JSONキーをダウンロード
 * 3. Search Console でサービスアカウントのメールアドレスをオーナーとして追加
 * 4. 実行:
 *    node scripts/gsc-indexing.js --key=path/to/service-account.json [--dry-run]
 *
 * オプション:
 *   --key=<path>    サービスアカウントのJSONキーファイルパス
 *   --dry-run       実際にリクエストを送信せず、対象URLを表示
 *   --limit=<n>     送信するURL数の上限（デフォルト: 200）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://literarymaps.nijl.ac.jp";

// コマンドライン引数の解析
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const keyFile = getArg("key");
const dryRun = hasFlag("dry-run");
const limit = parseInt(getArg("limit") || "200", 10);

// スポットデータからURLリストを生成
function getSpotUrls() {
  const spotsPath = path.resolve(
    __dirname,
    "../public/data/jsonapi/node/spots.json"
  );
  if (!fs.existsSync(spotsPath)) {
    console.error("spots.json が見つかりません。先に npm run prebuild を実行してください。");
    process.exit(1);
  }

  const spotsData = JSON.parse(fs.readFileSync(spotsPath, "utf-8"));
  const urls = [];

  for (const item of spotsData.data) {
    const id = item.attributes.field_id;
    urls.push(`${SITE_URL}/spots/${id}/`);
    urls.push(`${SITE_URL}/en/spots/${id}/`);
  }

  return urls;
}

// 静的ページのURLリスト
function getStaticUrls() {
  return [
    `${SITE_URL}/`,
    `${SITE_URL}/en/`,
    `${SITE_URL}/spots/`,
    `${SITE_URL}/en/spots/`,
    `${SITE_URL}/resources/`,
    `${SITE_URL}/en/resources/`,
    `${SITE_URL}/contact/`,
    `${SITE_URL}/en/contact/`,
    `${SITE_URL}/dataset/`,
    `${SITE_URL}/en/dataset/`,
    `${SITE_URL}/news/`,
    `${SITE_URL}/en/news/`,
  ];
}

// Google Auth トークンの取得
async function getAccessToken(keyFilePath) {
  const key = JSON.parse(fs.readFileSync(keyFilePath, "utf-8"));

  // JWT の作成
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");

  const now = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const { createSign } = await import("crypto");
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${claims}`);
  const signature = sign.sign(key.private_key, "base64url");

  const jwt = `${header}.${claims}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  if (!data.access_token) {
    console.error("認証失敗:", data);
    process.exit(1);
  }

  return data.access_token;
}

// URL のインデックス更新をリクエスト
async function requestIndexing(accessToken, url) {
  const response = await fetch(
    "https://indexing.googleapis.com/v3/urlNotifications:publish",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        type: "URL_UPDATED",
      }),
    }
  );

  const data = await response.json();
  return { url, status: response.status, data };
}

// バッチ処理
async function batchRequest(accessToken, urls) {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const result = await requestIndexing(accessToken, url);
      if (result.status === 200) {
        success++;
      } else {
        failed++;
        console.error(`  FAIL [${result.status}]: ${url}`, result.data);
      }

      // 進捗表示
      if ((i + 1) % 50 === 0) {
        console.log(`  進捗: ${i + 1}/${urls.length} (成功: ${success}, 失敗: ${failed})`);
      }

      // レート制限対策
      if ((i + 1) % 100 === 0) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (err) {
      failed++;
      console.error(`  ERROR: ${url}`, err.message);
    }
  }

  return { success, failed };
}

// メイン処理
async function main() {
  console.log("=== Google Indexing API スクリプト ===\n");

  const allUrls = [...getStaticUrls(), ...getSpotUrls()];
  const targetUrls = allUrls.slice(0, limit);

  console.log(`合計URL数: ${allUrls.length}`);
  console.log(`送信対象: ${targetUrls.length} (上限: ${limit})\n`);

  if (dryRun) {
    console.log("=== ドライラン: 以下のURLが送信されます ===\n");
    targetUrls.forEach((url) => console.log(`  ${url}`));
    console.log(`\n合計: ${targetUrls.length} URL`);
    return;
  }

  if (!keyFile) {
    console.error(
      "サービスアカウントのキーファイルを指定してください: --key=path/to/key.json"
    );
    console.log("ドライランで確認する場合: --dry-run");
    process.exit(1);
  }

  console.log("認証中...");
  const accessToken = await getAccessToken(keyFile);
  console.log("認証成功\n");

  console.log("インデックス更新リクエスト送信中...\n");
  const result = await batchRequest(accessToken, targetUrls);

  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${result.success}`);
  console.log(`失敗: ${result.failed}`);
}

main().catch(console.error);
