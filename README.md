# Arita Catalog

A production-ready, member-only product catalog for Arita pottery companies.

## Features

- **Multi-locale** — 8 languages (en, ja, ko, zh-CN, zh-TW, fr, de, id) via `next-intl`
- **Custom JWT auth** — httpOnly cookie, 30-day sessions with `jose`
- **RBAC** — Three roles: MEMBER, COMPANY, ADMIN
- **Access gating** — Detail pages require membership or April 29–May 5 market period
- **Company portal** — CRUD product management, company settings
- **Email verification** — Required before first login via Nodemailer

## Stack

| Layer       | Tech                         |
|-------------|------------------------------|
| Framework   | Next.js 16 (App Router)      |
| Language    | TypeScript 5                 |
| Styling     | Tailwind CSS 4 (CSS-first)   |
| Database    | PostgreSQL + Prisma 7        |
| Auth        | `jose` JWT + httpOnly cookie |
| i18n        | `next-intl` 4                |
| Validation  | `zod` 4                      |
| Email       | Nodemailer 8                 |

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd arita-catalog
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/arita_catalog"
JWT_SECRET="your-32-char-minimum-secret-here"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="no-reply@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Arita Catalog <no-reply@example.com>"
BASE_URL="http://localhost:3000"
TZ="Asia/Tokyo"
```

### 3. Set up database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — it redirects to `/en`.

## Seed Accounts

| Role    | Phone          | Password    | Email                  |
|---------|----------------|-------------|------------------------|
| ADMIN   | +81-0000-0001  | Admin123!   | admin@arita-catalog.jp |
| COMPANY | +81-0000-0002  | Company123! | company@pottery.jp     |
| MEMBER  | +81-0000-0003  | Member123!  | member@example.com     |

All seed accounts are pre-verified (no email verification required for seeds).

## Test Scenarios

### Gating
1. Log out and visit `/en/products/[id]`
2. Outside April 29–May 5 → shows **gate page**
3. During market period (or override date) → shows **full product detail**

### Signup flow
1. Visit `/en/auth/signup`, fill form
2. Get "check email" confirmation
3. Click verify link → redirected to success
4. Login with phone + password

### RBAC
- Login as **MEMBER** → redirected to `/en/account`
- Login as **COMPANY** → redirected to `/en/company`
- MEMBER cannot access `/en/company` → redirected to login

### i18n
- Toggle language via header dropdown
- All labels change to selected locale
- URL changes from `/en/...` to `/ja/...` etc.

## Access Control Policy

| Page                  | Public | Market Period | Member |
|-----------------------|--------|---------------|--------|
| `/products` (list)    | ✅     | ✅            | ✅     |
| `/companies` (list)   | ✅     | ✅            | ✅     |
| `/products/[id]`      | ❌     | ✅            | ✅     |
| `/companies/[slug]`   | ❌     | ✅            | ✅     |
| `/account`            | ❌     | ❌            | ✅     |
| `/company/**`         | ❌     | ❌            | COMPANY/ADMIN only |

Market period: **April 29 – May 5** (uses server local time, set `TZ=Asia/Tokyo`).

## Project Structure

```
arita-catalog/
├── prisma/
│   ├── schema.prisma          # DB schema
│   └── seed.ts                # Seed data
├── messages/                  # i18n translations (8 locales)
├── src/
│   ├── middleware.ts           # Locale + auth middleware
│   ├── i18n/
│   │   ├── routing.ts         # next-intl locale config
│   │   └── request.ts         # Server-side i18n config
│   ├── types/index.ts         # Shared TypeScript types
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   ├── auth.ts            # JWT sign/verify/session
│   │   ├── email.ts           # Nodemailer helpers
│   │   ├── access-control.ts  # isMarketPeriod, canViewDetail
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Helpers
│   ├── components/
│   │   ├── layout/            # Header, Footer, LanguageSwitcher
│   │   ├── ui/                # Button, Input, Select, GatePage
│   │   ├── auth/              # LoginForm, SignupForm
│   │   ├── products/          # ProductCard, ProductForm
│   │   └── companies/         # CompanyCard, CompanyForm
│   └── app/
│       ├── [locale]/          # All locale-prefixed routes
│       └── api/               # REST API routes
└── .env.example
```

## API Reference

| Method | Endpoint                     | Auth         | Description           |
|--------|------------------------------|--------------|-----------------------|
| POST   | `/api/auth/signup`           | Public       | Register new user     |
| POST   | `/api/auth/login`            | Public       | Login (returns cookie)|
| POST   | `/api/auth/logout`           | Public       | Clear auth cookie     |
| GET    | `/api/auth/verify?token=`    | Public       | Verify email          |
| GET    | `/api/account`               | Required     | Get profile           |
| PUT    | `/api/account`               | Required     | Update profile        |
| GET    | `/api/companies`             | Public       | List companies        |
| POST   | `/api/companies`             | COMPANY/ADMIN| Create company        |
| GET    | `/api/companies/[slug]`      | Public       | Get company detail    |
| PUT    | `/api/companies/[slug]`      | Owner/ADMIN  | Update company        |
| DELETE | `/api/companies/[slug]`      | Owner/ADMIN  | Delete company        |
| GET    | `/api/products`              | Public       | List products         |
| POST   | `/api/products`              | COMPANY/ADMIN| Create product        |
| GET    | `/api/products/[id]`         | Varies       | Get product           |
| PUT    | `/api/products/[id]`         | Owner/ADMIN  | Update product        |
| DELETE | `/api/products/[id]`         | Owner/ADMIN  | Delete product        |

## Development Notes

- **Tailwind 4**: Uses CSS-first config via `@theme` in `globals.css`. No `tailwind.config.ts` needed.
- **Prisma 7**: Run `npx prisma generate` after schema changes.
- **Email in dev**: Use [Mailtrap](https://mailtrap.io) for email testing. Signup still creates the user even if email fails.
- **Market period testing**: Modify `isMarketPeriod()` in `src/lib/access-control.ts` to return `true` for local testing.
