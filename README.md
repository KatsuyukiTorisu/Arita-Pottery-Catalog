# 有田焼カタログ / Arita Pottery Catalog

有田焼の窯元・販売会社の商品を掲載する会員制オンラインカタログです。
会員は通年で商品詳細を閲覧でき、非会員は有田陶器市期間（4月29日〜5月5日）のみ詳細ページにアクセスできます。

> A member-only online catalog for Arita pottery companies. Members have year-round access; non-members can only view details during the Arita Pottery Market (April 29–May 5).

---

## クイックスタート

```bash
npm install
cp .env.example .env        # .env を編集して DATABASE_URL 等を設定
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

ブラウザで **http://localhost:3000** を開いてください。

---

## デモアカウント

| ロール | 電話番号 | パスワード | メール |
|--------|---------|-----------|-------|
| 管理者 | +81-0000-0001 | Admin123! | admin@arita-catalog.jp |
| 会社 | +81-0000-0002 | Company123! | company@pottery.jp |
| 会員 | +81-0000-0003 | Member123! | member@example.com |

---

## 機能一覧

- **会員制アクセス制御** — 詳細ページは会員のみ（または有田陶器市期間中）閲覧可
- **8言語対応** — 日本語・英語・韓国語・中国語（簡体・繁体）・フランス語・ドイツ語・インドネシア語
- **会社ポータル** — 商品の登録・編集・削除、公開設定（PUBLIC / 会員限定 / ホワイトリスト）
- **メール認証** — 会員登録後にメール確認が必要
- **JWT 認証** — httpOnly Cookie による安全なセッション管理（30日）

---

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | 4.x |
| 国際化 | next-intl | 4.8.x |
| データベース | PostgreSQL + Prisma | 7.4.x |
| 認証 | jose (JWT) | 6.x |
| バリデーション | Zod | 4.x |
| メール | Nodemailer | 8.x |

---

## アクセス制御

| ページ | 未ログイン | 市期間中 | 会員 | 会社/管理者 |
|--------|----------|---------|------|-----------|
| 商品一覧 | ✅ | ✅ | ✅ | ✅ |
| 商品詳細 | ❌ | ✅ | ✅ | ✅ |
| 会社一覧 | ✅ | ✅ | ✅ | ✅ |
| 会社詳細 | ❌ | ✅ | ✅ | ✅ |
| アカウント | ❌ | ❌ | ✅ | ✅ |
| 会社ポータル | ❌ | ❌ | ❌ | ✅ |

有田陶器市期間: **4月29日〜5月5日**（`TZ=Asia/Tokyo` 推奨）

---

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [docs/USER_MANUAL.md](docs/USER_MANUAL.md) | 取り扱い説明書（エンドユーザー向け）|
| [docs/SPEC.md](docs/SPEC.md) | 技術仕様書（開発者向け）|
| [docs/SETUP.md](docs/SETUP.md) | セットアップガイド |

---

## API エンドポイント

| Method | エンドポイント | 認証 | 説明 |
|--------|-------------|------|------|
| POST | `/api/auth/signup` | 不要 | 会員登録 |
| POST | `/api/auth/login` | 不要 | ログイン |
| POST | `/api/auth/logout` | 不要 | ログアウト |
| GET | `/api/auth/verify?token=` | 不要 | メール認証 |
| GET | `/api/account` | 必要 | プロフィール取得 |
| PUT | `/api/account` | 必要 | プロフィール更新 |
| GET | `/api/companies` | 不要 | 会社一覧 |
| POST | `/api/companies` | COMPANY/ADMIN | 会社作成 |
| GET | `/api/companies/[slug]` | 不要 | 会社詳細 |
| PUT | `/api/companies/[slug]` | オーナー/ADMIN | 会社更新 |
| DELETE | `/api/companies/[slug]` | オーナー/ADMIN | 会社削除 |
| GET | `/api/products` | 不要 | 商品一覧 |
| POST | `/api/products` | COMPANY/ADMIN | 商品作成 |
| GET | `/api/products/[id]` | 条件あり | 商品詳細 |
| PUT | `/api/products/[id]` | オーナー/ADMIN | 商品更新 |
| DELETE | `/api/products/[id]` | オーナー/ADMIN | 商品削除 |

---

© 2026 Arita Catalog. All rights reserved.
