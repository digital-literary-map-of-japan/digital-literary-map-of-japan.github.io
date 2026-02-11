# デプロイ手順

本番環境（さくらレンタルサーバー）へのデプロイ手順です。

## 前提条件

- Node.js がインストールされていること
- `sshpass` がインストールされていること（`brew install sshpass` 等）
- `.env.local` にさくらサーバーの接続情報が設定されていること

### `.env.local` に必要な環境変数

```
SAKURA_HOST=<ホスト名>
SAKURA_USER=<ユーザー名>
SAKURA_PASSWORD=<パスワード>
SAKURA_WWW_PATH=<アップロード先パス>
```

## 手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 静的ファイルの生成

```bash
npm run generate
```

`.env.production` の設定を使用して、`.output/public/` に静的ファイルが生成されます。

### 3. サーバーへのアップロード

```bash
source .env.local
sshpass -p "$SAKURA_PASSWORD" rsync -avz --delete .output/public/ $SAKURA_USER@$SAKURA_HOST:$SAKURA_WWW_PATH/
```

`--delete` オプションにより、サーバー上の不要なファイルも削除され、ローカルのビルド結果と完全に同期されます。

## 環境設定ファイル

| ファイル | 用途 |
|---------|------|
| `.env.production` | ビルド時の環境変数（`ORIGIN`, `BASE_URL` 等） |
| `.env.local` | サーバー接続情報（git管理対象外） |
