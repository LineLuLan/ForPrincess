# ForPrincess 💝

A tiny private wishlist app built for two — a **"hộp ước mơ"** where she
gathers her wishes and he secretly turns them into surprises.

- Pastel UI, vi-VN copy, soft micro-interactions, confetti.
- Two roles, enforced by Postgres RLS:
  - **Princess** — adds wishes, only sees the ones not secretly being prepared.
  - **Knight** — sees everything, can mark items as secretly buying or already gifted.
- Free-tier-friendly: Vercel Hobby + Supabase Free + GitHub Actions cron.

> Built from `ForPrincess-Blueprint-v2.md` — see that file for the long-form vision.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Supabase (Postgres + Auth + Storage) via `@supabase/ssr`
- Framer Motion (hover + layout animations)
- canvas-confetti (gifted-transition celebration)
- React Hook Form + Zod
- browser-image-compression (client-side image resize before upload)

## Local development

### 1. Install

```bash
npm install
```

### 2. Configure Supabase

Follow [`supabase/README.md`](supabase/README.md) (≈ 10 minutes):

1. Create a Supabase project (Singapore region).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Create the `wish-images` Storage bucket (public, 2 MB limit).
4. Disable Sign-up; create the two users by hand; insert their `profiles`
   rows.

### 3. Env vars

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # server-only, optional
SUPABASE_PROJECT_ID=...              # for `npm run db:types`
```

### 4. Run

```bash
npm run dev
```

App is at <http://localhost:3000>. Without Supabase env vars, the home page
falls back to mock data with a friendly warning banner so you can iterate
on the UI offline.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Next.js dev server with Turbopack |
| `npm run build` | Production build (TS + ESLint + static analysis) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:types` | Regenerate `src/types/db.ts` from the live Supabase schema (needs `SUPABASE_PROJECT_ID`) |

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Vercel → **New Project** → import this repo.
3. Add the same env vars from `.env.example` under **Settings → Environment Variables**.
4. Deploy. Note the prod URL (e.g. `https://for-princess.vercel.app`).

## Keep-alive (zero-cost paranoid mode)

Supabase Free pauses a project after 7 days of inactivity. Two redundant pings:

### Layer 1 — GitHub Actions cron (every 3 days)

Lives at [`.github/workflows/keepalive.yml`](.github/workflows/keepalive.yml).

After deploy, set the heartbeat URL once:

- GitHub → **Settings → Secrets and variables → Actions → Variables → New repository variable**
- Name: `HEARTBEAT_URL`
- Value: `https://<your-domain>/api/heartbeat`

The workflow can also be run on demand from the Actions tab.

### Layer 2 — UptimeRobot (every 5 minutes, plus alerts)

1. Sign up at <https://uptimerobot.com> (free, no card).
2. **+ New Monitor** → HTTP(s).
3. URL: `https://<your-domain>/api/heartbeat`.
4. Interval: 5 minutes.
5. Add your email under **Alert Contacts** so you get pinged if the site
   actually goes down.

## Project map

```
src/
  app/
    api/heartbeat/      Keep-alive endpoint (used by cron + UptimeRobot)
    actions/            'use server' actions: auth.ts, wish.ts
    login/              /login page + LoginForm client island
    memories/           /memories — gifted archive ("tủ kỷ niệm")
    layout.tsx          Quicksand font, theme, Navbar, NavbarUser, footer
    page.tsx            Home — role-aware, mocks fallback
    globals.css         Tailwind v4 + pastel @theme tokens
  components/
    Navbar, NavbarUser, WishCard (motion), AddWishForm,
    AddWishConnected, KnightActions, EmptyState, RoleGate,
    ConfettiOnNewGifts
  lib/
    supabase/{browser,server,admin}.ts
    auth.ts             getViewer / getCurrentRole (cached)
    wish-queries.ts     fetchVisibleWishes, fetchGiftedWishes (mock fallback)
    wish-schema.ts      Zod input schema
    image-upload.ts     compressAndUpload to wish-images bucket
    confetti.ts         celebrate() helper
    format.ts           vi-VN price + date formatting
    mock-data.ts
  types/
    db.ts               Database types (regen via `npm run db:types`)
    wish.ts             WishItem, role, priority enums
  middleware.ts         Supabase SSR cookie sync + auth redirect
supabase/
  schema.sql            DDL + RLS policies
  README.md             6-step setup walkthrough
.github/workflows/
  keepalive.yml         3-day heartbeat cron
```

## Costs

| Item | Cost |
|---|---|
| Hosting (Vercel Hobby) | 0đ |
| Database + Auth + Storage (Supabase Free) | 0đ |
| Domain (`*.vercel.app`) | 0đ |
| Cron (GitHub Actions, 2000 min/mo free) | 0đ |
| **Total** | **0đ / month** |

Built with ♥ — chỉ dành cho hai chúng mình.
