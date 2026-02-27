# セットアップガイド — 有田焼カタログ

**バージョン**: 1.0.0
**対象**: 開発者・インフラ担当者

---

## 1. 必要な環境

| ソフトウェア | バージョン | 確認コマンド |
|------------|-----------|------------|
| Node.js | 18.0 以上 | `node -v` |
| npm | 9.0 以上 | `npm -v` |
| PostgreSQL | 14.0 以上 | `psql --version` |
| Git | 任意 | `git --version` |

---

## 2. セットアップ手順

### ステップ 1: リポジトリの準備

```bash
# クローン（Git 管理の場合）
git clone https://github.com/your-org/arita-catalog.git
cd arita-catalog

# または、既存のディレクトリに移動
cd arita-catalog
```

### ステップ 2: 依存パッケージのインストール

```bash
npm install
```

> `postinstall` スクリプトにより、`prisma generate` が自動実行されます。

### ステップ 3: 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集して以下を設定します:

```env
# PostgreSQL 接続URL
# 形式: postgresql://ユーザー名:パスワード@ホスト:ポート/データベース名
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/arita_catalog"

# JWT シークレット（本番環境では必ず変更すること）
JWT_SECRET="本番用の長いランダム文字列を32文字以上で設定"

# SMTP メール設定
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="no-reply@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Arita Catalog <no-reply@example.com>"

# アプリケーションの URL（本番では実際のドメインに変更）
BASE_URL="http://localhost:3000"

# タイムゾーン
TZ="Asia/Tokyo"
```

### ステップ 4: データベースのセットアップ

```bash
# マイグレーション実行（テーブル作成）
npx prisma migrate dev --name init

# 初期データ投入（テスト用アカウント・サンプル商品）
npx prisma db seed
```

**シードデータで作成されるアカウント:**

| ロール | 電話番号 | パスワード | メール |
|--------|---------|-----------|-------|
| 管理者 | +81-0000-0001 | Admin123! | admin@arita-catalog.jp |
| 会社 | +81-0000-0002 | Company123! | company@pottery.jp |
| 会員 | +81-0000-0003 | Member123! | member@example.com |

### ステップ 5: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。自動的に `/en/`（英語）にリダイレクトされます。

---

## 3. 動作確認チェックリスト

セットアップ完了後、以下を順番に確認してください:

- [ ] `http://localhost:3000` にアクセスするとホームページが表示される
- [ ] `/ja/` に切り替えると日本語表示になる
- [ ] 商品一覧 `/en/products` で商品カードが3件表示される
- [ ] 会社一覧 `/en/companies` で「Yamashiro Pottery」が表示される
- [ ] `/en/auth/login` で電話番号 `+81-0000-0001` / `Admin123!` でログインできる
- [ ] ログイン後、ヘッダーにユーザー名が表示される
- [ ] COMPANY アカウントでログインすると `/en/company` ダッシュボードにアクセスできる
- [ ] 未ログイン状態で商品詳細ページを開くと「ゲートページ」が表示される（有田陶器市期間外の場合）
- [ ] MEMBER アカウントでログインすると商品詳細が閲覧できる

---

## 4. 本番環境へのデプロイ

### 4-1. Vercel へのデプロイ

**前提**: クラウドデータベース（Supabase / Neon / Vercel Postgres 等）が必要です。ローカルの PostgreSQL には Vercel から接続できません。

```bash
# Vercel CLI のインストール（初回のみ）
npm i -g vercel

# デプロイ
vercel
```

**Vercel ダッシュボードで設定する環境変数:**

| 変数名 | 値 |
|--------|---|
| `DATABASE_URL` | クラウドDB の接続URL |
| `JWT_SECRET` | 本番用シークレット（32文字以上）|
| `SMTP_HOST` | 本番用 SMTP ホスト |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | 送信元メールアドレス |
| `SMTP_PASS` | SMTP パスワード |
| `SMTP_FROM` | 表示名 |
| `BASE_URL` | `https://your-app.vercel.app` |
| `TZ` | `Asia/Tokyo` |

**本番マイグレーション:**

```bash
# 本番 DATABASE_URL を指定してマイグレーション
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 4-2. セルフホスティング（VPS 等）

```bash
# ビルド
npm run build

# 起動
npm start
```

PM2 等のプロセスマネージャーを使用することを推奨します:

```bash
npm install -g pm2
pm2 start npm --name "arita-catalog" -- start
pm2 save
pm2 startup
```

---

## 5. データベース管理

### Prisma Studio（GUI でのデータ確認）

```bash
npx prisma studio
```

`http://localhost:5555` でブラウザから直接データを確認・編集できます。

### マイグレーション

```bash
# 開発環境: スキーマ変更後
npx prisma migrate dev --name "変更内容の説明"

# 本番環境: マイグレーションの適用のみ
npx prisma migrate deploy

# 現在のスキーマを DB に同期（マイグレーション不要な場合）
npx prisma db push
```

---

## 6. トラブルシューティング

### DB に接続できない

```
Error: P1001: Can't reach database server
```

**確認事項:**
1. PostgreSQL が起動しているか確認: `pg_ctl status`
2. `.env` の `DATABASE_URL` が正しいか確認（ユーザー名・パスワード・ポート番号）
3. PostgreSQL のポート番号を確認（デフォルト: 5432、インストール環境によっては 5433 や 5434）

### Prisma Client が古い

```
Error: @prisma/client did not initialize yet
```

```bash
npx prisma generate
```

### ポート 3000 が使用中

```
Error: Port 3000 is in use
```

Next.js は自動的に次のポート（3001, 3002...）を使用します。ターミナルに表示された URL を確認してください。

### TypeScript エラー

```bash
npx tsc --noEmit
```

### シードに失敗する

```bash
# データをリセットしてやり直す
npx prisma migrate reset
npx prisma db seed
```

> ⚠️ `migrate reset` はすべてのデータを削除します。本番環境では実行しないでください。

---

## 7. 開発用コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npx tsc --noEmit` | TypeScript 型チェック |
| `npx prisma migrate dev` | マイグレーション実行 |
| `npx prisma db seed` | 初期データ投入 |
| `npx prisma studio` | DB 管理 GUI 起動 |
| `npx prisma migrate reset` | DB リセット（開発用）|
| `npx prisma generate` | Prisma クライアント再生成 |

---

*© 2026 Arita Catalog*
