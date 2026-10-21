# デプロイ手順

## GitHub Pages（メイン公開先）

このリポジトリは GitHub Actions で **GitHub Pages** に自動公開されます。

- 公開 URL: <https://digital-literary-map-of-japan.github.io/>
- ワークフロー: `.github/workflows/pages-deploy.yml`
- トリガー: `main` ブランチへの push（手動実行は `workflow_dispatch` から）
- データマスタ: `public/downloads/dlm-dataset.xlsx`（`npm run prebuild` で Excel から `public/data/` 等を生成）

### ビルド時の環境変数（ワークフロー内で設定）

| 変数 | 値 |
|---|---|
| `ORIGIN` | `https://digital-literary-map-of-japan.github.io` |
| `BASE_URL` | `/` |

このリポジトリは Organization Pages (`<org>.github.io`) なのでルート配下で公開されます。

### Pages の有効化（初回のみ）

GitHub リポジトリ Settings → Pages → **Source: GitHub Actions** に設定してください。

---

## さくらレンタルサーバー（バックアップ／別系統）

NIJL 本番サイト `https://literarymaps.nijl.ac.jp/` 向けのデプロイ手順です。

### 前提条件

- Node.js がインストールされていること
- `sshpass` がインストールされていること（`brew install sshpass`）
- 1Password CLI (`op`) がインストール・認証されていること（`brew install 1password-cli`）
- 1Password の `Personal` vault に、さくらサーバーの接続情報 item があること
  （フィールド: `host` / `user` / `password` / `www_path`）

### `.env.local` の中身

機密値はファイルに平文で書かず、`op://` 参照を置きます（実値の解決は `op run` が行う）。

```bash
SAKURA_HOST=op://Personal/<item-name>/host
SAKURA_USER=op://Personal/<item-name>/user
SAKURA_PASSWORD=op://Personal/<item-name>/password
SAKURA_WWW_PATH=op://Personal/<item-name>/www_path
```

### 手順

```bash
# 1. 依存パッケージ
npm install

# 2. Excel マスタ（public/downloads/dlm-dataset.xlsx）からローカルデータ生成
npm run prebuild

# 3. 静的ファイル生成（.env.production を使用）
npm run generate

# 4. アップロード（op run が op:// を実値に展開して環境変数として注入）
npm run deploy:sakura
```

`--delete` オプションでサーバー上の不要ファイルも同期削除されます。

---

## 機密情報の取り扱い

- このリポジトリに機密情報（パスワード / API キー / 秘密鍵）を **絶対にコミットしない**。
- `.env.local` は `.gitignore` 済み。値は `op://` 参照で、平文は 1Password にのみ存在させる。
- `.env.example` を参照テンプレートとして残し、実値は書かない。
- 万一コミットしてしまった場合は、即座に該当シークレットを **失効・ローテーション** すること（履歴からの削除では取り戻せない前提）。

## 環境設定ファイル

| ファイル | 用途 |
|---------|------|
| `.env.production` | `npm run generate` 時の環境変数（さくら向け `ORIGIN` 等） |
| `.env.local` | ローカル開発／さくらデプロイ用（`op://` 参照のみ、git 管理対象外） |
| `.env.example` | 必要な env vars のテンプレート |
