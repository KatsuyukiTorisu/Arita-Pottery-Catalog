# 技術仕様書 — 有田焼カタログ

**バージョン**: 1.0.0
**作成日**: 2026-02-26
**対象読者**: 開発者・システム管理者

---

## 1. システム概要

有田焼カタログは、有田焼の窯元・販売会社の商品を掲載する会員制オンラインカタログです。
会員（MEMBER）は通年で商品詳細を閲覧でき、非会員は有田陶器市期間（4月29日〜5月5日）のみ詳細ページにアクセスできます。

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| UI ライブラリ | React | 19.2.3 |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | 4.x (CSS-first) |
| 国際化 | next-intl | 4.8.x |
| ORM | Prisma | 7.4.1 |
| データベース | PostgreSQL | 14+ |
| 認証 | jose (JWT) | 6.x |
| パスワード | bcryptjs | 3.x |
| バリデーション | zod | 4.x |
| メール | nodemailer | 8.x |
| DB アダプター | @prisma/adapter-pg | 7.4.1 |
| ランタイム | Node.js | 18+ |

---

## 3. アーキテクチャ概要

```
ブラウザ
  │
  ├── Next.js App Router (SSR / RSC)
  │     ├── src/proxy.ts          ← ロケール判定 + 認証ガード (Edge Runtime)
  │     ├── src/app/[locale]/     ← ページコンポーネント (Server Components)
  │     └── src/app/api/          ← API Routes (Node.js Runtime)
  │
  ├── src/lib/
  │     ├── jwt.ts                ← JWT 署名/検証 (Edge-safe)
  │     ├── auth.ts               ← セッション取得 (Server-only)
  │     ├── db.ts                 ← Prisma シングルトン
  │     ├── access-control.ts     ← アクセス制御ロジック
  │     ├── email.ts              ← メール送信
  │     └── validations.ts        ← Zod スキーマ
  │
  └── PostgreSQL (Prisma 経由)
```

---

## 4. ディレクトリ構成

```
arita-catalog/
├── prisma/
│   ├── schema.prisma             # データベーススキーマ
│   ├── seed.ts                   # 初期データ投入
│   └── migrations/               # マイグレーションファイル
├── prisma.config.ts              # Prisma 7 設定ファイル
├── messages/                     # 翻訳ファイル (8言語)
│   ├── en.json
│   ├── ja.json
│   ├── ko.json
│   ├── zh-CN.json
│   ├── zh-TW.json
│   ├── fr.json
│   ├── de.json
│   └── id.json
├── src/
│   ├── proxy.ts                  # Next.js 16 ミドルウェア (proxy)
│   ├── i18n/
│   │   ├── routing.ts            # ロケール定義
│   │   └── request.ts            # サーバー設定
│   ├── types/
│   │   └── index.ts              # 共通型定義
│   ├── lib/
│   │   ├── db.ts
│   │   ├── jwt.ts
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   ├── access-control.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   ├── components/
│   │   ├── ui/                   # 汎用UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── GatePage.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── CompanySidebar.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductForm.tsx
│   │   └── companies/
│   │       ├── CompanyCard.tsx
│   │       └── CompanyForm.tsx
│   └── app/
│       ├── layout.tsx            # ルートレイアウト（最小構成）
│       ├── globals.css           # Tailwind 4 テーマ定義
│       ├── [locale]/
│       │   ├── layout.tsx        # ロケールレイアウト
│       │   ├── page.tsx          # ホーム
│       │   ├── products/
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── companies/
│       │   │   ├── page.tsx
│       │   │   └── [slug]/page.tsx
│       │   ├── auth/
│       │   │   ├── login/page.tsx
│       │   │   ├── signup/page.tsx
│       │   │   └── verify/page.tsx
│       │   ├── account/page.tsx
│       │   ├── company/
│       │   │   ├── page.tsx
│       │   │   ├── products/page.tsx
│       │   │   └── settings/page.tsx
│       │   └── coming-soon/
│       │       ├── purchase/page.tsx
│       │       ├── booking/page.tsx
│       │       └── chat/page.tsx
│       └── api/
│           ├── auth/
│           │   ├── signup/route.ts
│           │   ├── login/route.ts
│           │   ├── logout/route.ts
│           │   └── verify/route.ts
│           ├── products/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── companies/
│           │   ├── route.ts
│           │   └── [slug]/route.ts
│           └── account/route.ts
├── docs/
│   ├── USER_MANUAL.md
│   ├── SPEC.md                   # 本ファイル
│   └── SETUP.md
├── scripts/
│   └── dev-db.mjs                # PGlite 開発用 DB サーバー
├── .env                          # 環境変数（Git 管理外）
├── .env.example                  # 環境変数サンプル
├── next.config.ts
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. データベース設計

### 5-1. User（ユーザー）

| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK, cuid | 内部ID |
| membershipId | String | UNIQUE | 会員番号 (ART-XXXXXXXX-XXXX) |
| name | String | NOT NULL | 氏名 |
| age | Int | NULL可 | 年齢 |
| gender | String | NULL可 | 性別 |
| address | String | NULL可 | 住所 |
| phone | String | UNIQUE, NOT NULL | 電話番号（ログインID）|
| email | String | UNIQUE, NOT NULL | メールアドレス |
| occupation | String | NULL可 | 職業 |
| passwordHash | String | NOT NULL | bcrypt ハッシュ（コスト12）|
| role | Role | NOT NULL | MEMBER / COMPANY / ADMIN |
| emailVerifiedAt | DateTime | NULL可 | メール認証完了日時 |
| createdAt | DateTime | DEFAULT now() | 作成日時 |

**インデックス**: `phone`, `email`

### 5-2. EmailVerificationToken（メール認証トークン）

| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK, cuid | - |
| userId | String | FK → User | - |
| token | String | UNIQUE | ランダム64文字HEX |
| expiresAt | DateTime | NOT NULL | 有効期限（24時間）|
| createdAt | DateTime | DEFAULT now() | - |

**インデックス**: `token`

### 5-3. Company（会社）

| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK, cuid | - |
| name | String | NOT NULL | 会社名 |
| slug | String | UNIQUE | URLスラッグ（自動生成）|
| description | String | NULL可 | 会社説明 |
| location | String | NULL可 | 所在地 |
| images | String[] | - | 画像URL配列 |
| ownerUserId | String | UNIQUE, FK → User | オーナー（1人1社）|
| createdAt | DateTime | DEFAULT now() | - |

**インデックス**: `slug`

### 5-4. Product（商品）

| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK, cuid | - |
| companyId | String | FK → Company | 所属会社 |
| name | String | NOT NULL | 商品名 |
| description | String | NULL可 | 説明 |
| images | String[] | - | 画像URL配列 |
| price | Decimal | NULL可 | 価格（円）|
| category | String | NULL可 | カテゴリ |
| tags | String[] | - | タグ配列 |
| isPublished | Boolean | DEFAULT false | 公開フラグ |
| visibilityMode | VisibilityMode | DEFAULT PUBLIC | 公開設定 |
| createdAt | DateTime | DEFAULT now() | - |

**インデックス**: `companyId`

### 5-5. ProductWhitelist（ホワイトリスト）

| フィールド | 型 | 制約 | 説明 |
|-----------|----|----|------|
| id | String | PK, cuid | - |
| productId | String | FK → Product | 商品 |
| memberUserId | String | FK → User | アクセス許可会員 |

**ユニーク制約**: `(productId, memberUserId)`

### 5-6. Enum 定義

```prisma
enum Role {
  MEMBER    // 一般会員
  COMPANY   // 会社ユーザー
  ADMIN     // 管理者
}

enum VisibilityMode {
  PUBLIC        // 全員閲覧可
  MEMBERS_ONLY  // 会員のみ
  WHITELIST     // 指定会員のみ
}
```

---

## 6. 認証・認可設計

### 6-1. JWT 仕様

| 項目 | 値 |
|------|----|
| アルゴリズム | HS256 |
| 有効期限 | 30日 |
| 保存場所 | httpOnly Cookie (`auth-token`) |
| ライブラリ | jose 6.x |

**ペイロード構造:**

```typescript
interface SessionPayload {
  sub: string;       // User.id
  role: Role;        // MEMBER / COMPANY / ADMIN
  name: string;      // 氏名
  email: string;     // メールアドレス
  iat: number;       // 発行時刻
  exp: number;       // 有効期限
}
```

### 6-2. ファイル分割（Edge Runtime 対応）

| ファイル | 用途 | Runtime |
|---------|------|---------|
| `src/lib/jwt.ts` | `signToken`, `verifyToken` | Edge / Node.js 両対応 |
| `src/lib/auth.ts` | `getSession`, `setSessionCookie`, `clearSessionCookie` | Node.js のみ（`next/headers` 使用）|
| `src/proxy.ts` | ミドルウェア（`jwt.ts` のみインポート）| Edge Runtime |

### 6-3. ロールベースアクセス制御

| ページ / エンドポイント | MEMBER | COMPANY | ADMIN |
|----------------------|--------|---------|-------|
| 商品一覧 | ○ | ○ | ○ |
| 商品詳細（市外期間）| ○ | ○ | ○ |
| 商品詳細（市外期間・未ログイン）| × | × | × |
| 会社一覧 | ○ | ○ | ○ |
| アカウント管理 | ○ | ○ | ○ |
| 会社ポータル `/company/**` | × | ○ | ○ |
| 商品 POST/PUT/DELETE | × | 自社のみ | ○ |
| 会社 PUT/DELETE | × | 自社のみ | ○ |

---

## 7. アクセス制御仕様

### 7-1. 有田陶器市期間

```typescript
// src/lib/access-control.ts
export function isMarketPeriod(now: Date = new Date()): boolean {
  const m = now.getMonth() + 1;  // 1-12
  const d = now.getDate();
  return (m === 4 && d >= 29) || (m === 5 && d <= 5);
}
```

**期間**: 毎年 4月29日〜5月5日

### 7-2. 詳細ページ閲覧ロジック

```typescript
export function canViewDetail(session: SessionPayload | null): boolean {
  return !!session || isMarketPeriod();
}
```

### 7-3. 商品可視性ロジック

| visibilityMode | 未ログイン | MEMBER | COMPANY | ADMIN |
|----------------|----------|--------|---------|-------|
| PUBLIC | 市期間のみ | ○ | ○ | ○ |
| MEMBERS_ONLY | × | ○ | ○ | ○ |
| WHITELIST | × | ホワイトリスト登録者のみ | ○ | ○ |

---

## 8. API 仕様

### 共通

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **認証**: `auth-token` Cookie（JWT）

---

### 8-1. 認証 API

#### POST `/api/auth/signup`

**リクエスト:**
```json
{
  "name": "山田太郎",
  "email": "yamada@example.com",
  "phone": "+81-090-1234-5678",
  "password": "Password123!",
  "age": 35,
  "gender": "male",
  "address": "佐賀県有田町",
  "occupation": "陶芸家"
}
```

**レスポンス (201):**
```json
{ "message": "確認メールを送信しました" }
```

**バリデーション:**
- `name`: 1〜100文字
- `email`: 有効なメール形式
- `phone`: 1〜20文字
- `password`: 8文字以上、大文字・小文字・数字を含む

---

#### POST `/api/auth/login`

**リクエスト:**
```json
{
  "phone": "+81-0000-0001",
  "password": "Admin123!"
}
```

**レスポンス (200):**
```json
{
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@arita-catalog.jp",
    "role": "ADMIN"
  }
}
```

Set-Cookie: `auth-token=<JWT>; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax`

---

#### POST `/api/auth/logout`

**レスポンス (200):**
```json
{ "message": "ログアウトしました" }
```

Cookie `auth-token` を削除します。

---

#### GET `/api/auth/verify?token=<token>`

**レスポンス (200):**
```json
{ "message": "メール認証が完了しました" }
```

---

### 8-2. 商品 API

#### GET `/api/products`

**クエリパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|----|----|
| category | string | カテゴリフィルター |
| companyId | string | 会社IDフィルター |

**レスポンス (200):**
```json
[
  {
    "id": "...",
    "name": "有田ブルードラゴン花瓶",
    "description": "...",
    "images": ["https://..."],
    "price": null,
    "category": "Vase",
    "tags": ["blue-white", "traditional"],
    "isPublished": true,
    "visibilityMode": "PUBLIC",
    "company": { "name": "山城窯", "slug": "yamashiro-pottery" }
  }
]
```

※ 非会員の場合、`price` は `null` で返却されます。

---

#### POST `/api/products`

**認証**: COMPANY / ADMIN 必須

**リクエスト:**
```json
{
  "name": "商品名",
  "description": "説明",
  "price": 38000,
  "category": "Vase",
  "tags": ["blue-white"],
  "images": ["https://..."],
  "visibilityMode": "PUBLIC",
  "isPublished": true
}
```

---

#### PUT `/api/products/[id]`

**認証**: 商品オーナー（COMPANY）/ ADMIN 必須

リクエスト・レスポンスは POST と同様。

---

#### DELETE `/api/products/[id]`

**認証**: 商品オーナー / ADMIN 必須

**レスポンス (200):**
```json
{ "message": "削除しました" }
```

---

### 8-3. 会社 API

#### GET `/api/companies`

**レスポンス (200):**
```json
[
  {
    "id": "...",
    "name": "山城窯",
    "slug": "yamashiro-pottery",
    "description": "...",
    "location": "佐賀県有田町",
    "images": ["https://..."],
    "_count": { "products": 3 }
  }
]
```

---

#### POST `/api/companies`

**認証**: COMPANY / ADMIN 必須（COMPANY は1社のみ作成可）

```json
{
  "name": "会社名",
  "description": "説明",
  "location": "所在地",
  "images": ["https://..."]
}
```

---

### 8-4. アカウント API

#### GET `/api/account`

**認証**: 必須

**レスポンス (200):**
```json
{
  "id": "...",
  "membershipId": "ART-XXXXXXXX-XXXX",
  "name": "山田太郎",
  "email": "yamada@example.com",
  "phone": "+81-090-1234-5678",
  "age": 35,
  "gender": "male",
  "address": "佐賀県有田町",
  "occupation": "陶芸家",
  "role": "MEMBER",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

#### PUT `/api/account`

更新可能フィールド: `name`, `age`, `gender`, `address`, `occupation`

---

## 9. i18n 仕様

### 対応言語

| コード | 言語 | URL プレフィックス |
|--------|------|-----------------|
| `en` | 英語（デフォルト）| `/en/` |
| `ja` | 日本語 | `/ja/` |
| `ko` | 韓国語 | `/ko/` |
| `zh-CN` | 中国語（簡体字）| `/zh-CN/` |
| `zh-TW` | 中国語（繁体字）| `/zh-TW/` |
| `fr` | フランス語 | `/fr/` |
| `de` | ドイツ語 | `/de/` |
| `id` | インドネシア語 | `/id/` |

### URL ルーティング

```
/           → /en/（自動リダイレクト）
/en/        → ホーム（英語）
/ja/        → ホーム（日本語）
/ja/products → 商品一覧（日本語）
```

---

## 10. セキュリティ仕様

| 項目 | 対策 |
|------|------|
| パスワード | bcrypt（コスト係数 12）|
| JWT | HS256、httpOnly Cookie、SameSite=Lax |
| CSRF | SameSite Cookie により軽減 |
| SQL インジェクション | Prisma ORM によるパラメータバインディング |
| XSS | React の自動エスケープ + CSP（Next.js デフォルト）|
| メール認証 | 24時間有効なランダムトークン |
| レート制限 | 本番環境では別途 WAF / Vercel Edge Config 推奨 |

---

## 11. 環境変数一覧

| 変数名 | 必須 | 説明 | 例 |
|--------|------|------|----|
| `DATABASE_URL` | ✓ | PostgreSQL 接続URL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✓ | JWT署名シークレット（32文字以上推奨）| `random-32-chars-string` |
| `SMTP_HOST` | ✓ | SMTPホスト | `smtp.gmail.com` |
| `SMTP_PORT` | ✓ | SMTPポート | `587` |
| `SMTP_USER` | ✓ | SMTPユーザー | `no-reply@example.com` |
| `SMTP_PASS` | ✓ | SMTPパスワード | - |
| `SMTP_FROM` | ✓ | 送信元表示名 | `Arita Catalog <no-reply@example.com>` |
| `BASE_URL` | ✓ | サービスのベースURL | `https://your-app.vercel.app` |
| `TZ` | ✓ | タイムゾーン | `Asia/Tokyo` |

---

*© 2026 Arita Catalog*
