# FinConnectHub

A full‑stack, type‑safe personal finance app for young professionals and students. Track transactions, set monthly budgets, plan savings goals, learn financial tips, and use handy calculators — all in a modern, responsive UI.

## Demo
- Deployed on Vercel: https://<your-vercel-domain>

## Features
- Auth and Profile
  - Email-based signup/login with JWT (httpOnly cookie + optional Bearer token)
  - Profile avatar, name, and email display
  - Secure logout that clears cookie, local token, and in-memory cache
- Transactions
  - Create, edit, delete transactions with category, amount, description, and date
  - Income and expense categories with icons and colors
  - Month-aware filtering and totals
- Budgets
  - Create monthly category budgets and track progress with warnings and over‑budget indicators
  - Summary card for total budget vs. spent with progress
- Savings Goals
  - Create, edit, track progress toward targets with optional icon and target date
- Financial Tips (Seeded Content)
  - Curated tips across budgeting, saving, investing, and debt (beginner → advanced)
- Calculators & Learn
  - Helpful tools and educational content (UI pages included)
- Great UX
  - Shadcn/ui + Tailwind styling, responsive layout, accessible primitives
  - Optimistic UX with TanStack Query caching and smart invalidation

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Wouter (routing), TanStack Query, shadcn/ui (Radix), TailwindCSS, Recharts, React Hook Form + Zod
- Backend: Node.js, Express, TypeScript, Drizzle ORM, Neon (serverless Postgres)
- Auth: JWT (httpOnly cookie in production) with shared types and Zod validators
- Build/Deploy: Vite for client, esbuild for server, Vercel (serverless), ESM modules
- DX: Drizzle Kit, tsx, strict TypeScript, modular monorepo structure

## Monorepo Structure
```
client/              # React app (Vite)
  src/
    components/      # shadcn/ui components
    hooks/
    lib/             # query client, utils
    pages/           # landing, dashboard, budget, savings, etc.
server/              # Express server (ESM)
  index.ts           # API + static serving entry
  routes.ts          # All API routes
  storage.ts         # Drizzle-powered data access
  db.ts              # Neon pool + drizzle init
  seed.ts            # Seed financial tips
  static.ts          # Production-only static file server
shared/
  schema.ts          # Drizzle schema + Zod types shared client/server
vercel.json          # Vercel build + routing config (SPA + API)
vite.config.ts       # Vite build config (client → dist/public)
package.json         # scripts
```

## Environment Variables
Create a `.env` at the repo root for local development:

```
# Database (Neon) — required
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# JWT — required for signing tokens
JWT_SECRET=replace-with-strong-random-string

# Optional (local use only)
PORT=5001
```

On Vercel, set these in Project → Settings → Environment Variables:
- DATABASE_URL (Required)
- JWT_SECRET (Required)
- Optional: FRONTEND_ORIGIN (if using a different origin for the client)

Notes:
- We run in ESM mode. Local file imports use explicit `.js` extensions on the server. Path aliases are for the client build only.
- CORS automatically whitelists `https://$VERCEL_URL` in production.

## Getting Started (Local)

1) Install dependencies
```bash
npm install
```

2) Create tables (Drizzle)
```bash
npm run db:push
```

3) Seed financial tips (optional)
```bash
NODE_ENV=development tsx server/seed.ts
```

4) Start the dev server (Express + Vite middleware)
```bash
npm run dev
```
- App/API served from http://localhost:5001 (default). In development, Vite is mounted as middleware by the Express server for instant HMR.

## Build & Run (Production-like)

1) Build client and server bundles
```bash
npm run build
```

2) Start the built server locally
```bash
npm start
```
- Client assets are served from `dist/public`
- Server bundle is `dist/index.js`

## Deployment (Vercel)
- `vercel.json` defines two builds:
  - `@vercel/node` for `server/index.ts` (API)
  - `@vercel/static-build` for the Vite client with `dist/public` output
- Routes:
  - `/api/(.*)` → serverless function
  - Static `/assets/*` with long‑cache
  - SPA fallback: `/(.*)` → `/index.html`

## API Overview
All endpoints are prefixed with `/api`. Authenticated endpoints require a JWT via either:
- httpOnly cookie set at login/signup (production), and/or
- `Authorization: Bearer <token>` header (client stores token as fallback)

### Auth
- POST `/api/auth/signup` → `{ token, user }`
- POST `/api/auth/login` → `{ token, user }`
- GET `/api/auth/me` → `User`
- PATCH `/api/auth/me` → `User`
- GET `/api/login` → Redirect to SPA login
- GET `/api/logout` → Clears cookie and suggests client clear local token

### Transactions
- GET `/api/transactions` → `Transaction[]`
- POST `/api/transactions` → `201 Transaction`
- PATCH `/api/transactions/:id` → `Transaction`
- DELETE `/api/transactions/:id` → `204`

### Budgets
- GET `/api/budgets` or `/api/budgets/:month` (YYYY-MM) → `Budget[]`
- POST `/api/budgets` → `201 Budget`
- PATCH `/api/budgets/:id` → `Budget`
- DELETE `/api/budgets/:id` → `204`

### Savings Goals
- GET `/api/savings-goals` → `SavingsGoal[]`
- POST `/api/savings-goals` → `201 SavingsGoal`
- PATCH `/api/savings-goals/:id` → `SavingsGoal`
- DELETE `/api/savings-goals/:id` → `204`

### Financial Tips
- GET `/api/financial-tips` → `FinancialTip[]`

### Schema & Validation
- All request/response types are defined in `shared/schema.ts` with Drizzle models
- Zod schemas validate incoming payloads for `insert*` operations

## Auth Model
- On login/signup, server issues a JWT and sets an httpOnly cookie (`token`) with `SameSite=None; Secure` in production
- Client also persists the token in `localStorage` as a fallback for APIs that add `Authorization` header
- `useAuth` fetches `/api/auth/me`; Router shows login/landing until user is loaded
- Logout clears the cookie and local token, and clears the React Query cache

## Useful Scripts
- `npm run dev` — Start Express (tsx) with Vite middleware
- `npm run build` — Build client + server
- `npm start` — Serve production build
- `npm run db:push` — Push schema to Postgres using Drizzle
- `npm run vercel-build` — Vercel entry (calls `build`)

## Troubleshooting
- 401 Unauthorized on `/api/auth/me`
  - Ensure JWT_SECRET is set in env (local and Vercel)
  - Make sure cookies are sent: `credentials: 'include'` in fetch (client already does)
- Duplicate email on signup
  - We upsert by `users.email`; posting the same email updates the profile
- Assets served as text/html
  - `vercel.json` includes routes with filesystem-first and SPA fallback; ensure build outputs to `dist/public`
- ESM imports fail in serverless
  - Use explicit `.js` extensions for local imports on the server
- CORS
  - API auto-allows `https://$VERCEL_URL` and `http://localhost:5173`; set `FRONTEND_ORIGIN` if needed

## Security Notes
- Never commit secrets. Use `.env` locally and Vercel env vars in production.
- JWTs are httpOnly and `SameSite=None; Secure` in production; the client token is a fallback for SPA DX.

## Roadmap Ideas
- Recurring transactions and roll‑over budgets
- Bank connections and auto‑categorization
- More calculators (loan, investment growth, FIRE, etc.)
- PWA offline support

## License
MIT © 2025 FinConnectHub
