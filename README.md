# SeekSmart

**Find the right AI workflow first, then the tool.** SeekSmart is an open-source directory of 276 researched AI tools and a rules-based AI readiness audit for small businesses: online stores, local shops and restaurants, and small service firms. Live at [seeksmart.in](https://seeksmart.in).

[![CI](https://github.com/Jayy1287/seeksmart-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Jayy1287/seeksmart-app/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/code-AGPL--3.0-blue.svg)](LICENSE)
[![Dataset: CC BY-NC-SA 4.0](https://img.shields.io/badge/dataset-CC%20BY--NC--SA%204.0-lightgrey.svg)](prisma/data/LICENSE)

## What it does

- **Tool directory.** 276 AI tools across 22 categories, each with a researched write-up, checked pricing, who it is for and who it is not for, integrations, use-case fit scores, and alternatives. Filter by category, pricing and use case.
- **AI audit.** An 11-step wizard that asks about the business, its systems and its pain points, then ranks AI opportunities with a deterministic rules engine (no LLM in the loop) and produces a pilot plan with recommended tools. Results get a permanent URL.
- **Guides.** Use-case pages, industry guides for the three focus verticals, opportunity write-ups, playbooks and a published methodology.
- **Accounts.** Google and magic-link sign-in to save audits and like tools. An admin workspace reviews submissions and edits the catalogue.

Everything renders server-side with long CDN caching, so the site is fast and cheap to run on a free Netlify and Supabase tier.

## Stack

Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS, Prisma 5 on PostgreSQL, Auth.js v5, Motion, PostHog (optional). Deployed on Netlify with Supabase Postgres.

## Quick start

Requirements: Node 20 (`.nvmrc`) and a PostgreSQL database. A free Supabase project or a local Postgres both work.

```bash
git clone https://github.com/Jayy1287/seeksmart-app.git
cd seeksmart-app
npm install
cp .env.example .env               # set DATABASE_URL and DIRECT_URL at minimum
npx prisma migrate deploy
npm run db:seed                    # taxonomy, use cases, opportunities, base catalogue
npx tsx prisma/seed-tools-v2.ts    # researched catalogue (a few minutes against a remote DB)
npm run dev                        # http://localhost:3000
```

Optional extras:

```bash
node scripts/fetch-logos.mjs           # download tool logos into public/logos
node scripts/capture-screenshots.mjs   # homepage screenshots into public/screenshots (needs Playwright)
node scripts/sync-tool-media.mjs --all # point the database at the local files
```

Logos and screenshots are third-party material and are **not in the repository**. See [NOTICE.md](NOTICE.md).

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Pooled runtime connection and direct connection for migrations |
| `BUILD_DATABASE_URL` | Optional small-pool connection used only during `next build` |
| `SKIP_BUILD_PRERENDER` | `1` renders database-backed pages on first request instead of at build time |
| `AUTH_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Auth.js and Google sign-in |
| `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `AUTH_EMAIL_REPLY_TO` | Magic-link email |
| `ADMIN_EMAILS`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | Admin workspace access |
| `NEXT_PUBLIC_TOOL_MEDIA_BASE_URL` | Object-store root for logos and screenshots in production |
| `NEXT_PUBLIC_POSTHOG_*` | Optional analytics |
| `SHOW_TOOL_LIKE_COUNTS` | Show public like counts |

`.env.example` documents every variable with a placeholder.

## Project layout

```
src/app/        routes, pages and API handlers (App Router)
src/features/   UI modules by domain (home, tools, audit, admin, ...)
src/server/     queries, mutations, scoring engine, mappers (server only)
src/shared/     types shared by client and server
src/lib/        framework helpers (prisma, site config, media, structured data)
prisma/         schema, migrations, seeds and the catalogue dataset
scripts/        catalogue pipeline, media sync, smoke test
docs/           architecture, API contract, design system, product plan
```

Dependency direction is `app -> features/server -> shared/lib`. UI components never touch the database. `HANDOFF.md` is the long-form engineering handbook: audit engine, scoring versions, caching and cost controls, deployment, and operational runbooks.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `npm run build` / `npm start` | Next.js |
| `npm run lint` / `npm run typecheck` | ESLint, `next typegen` + `tsc` |
| `npm run test:recommendations` | Unit tests for the audit scoring engine |
| `npm run test:smoke` | Fetches the main routes of a running instance (`SMOKE_BASE_URL`) |
| `npm run db:seed` | Base seed |
| `npx prisma studio` | Browse the database |

## Deploying

The reference deployment is Netlify with the Next.js runtime and a Supabase database. Set the environment variables above, turn off deploy previews and branch deploys to save build minutes, and point `NEXT_PUBLIC_TOOL_MEDIA_BASE_URL` at a public bucket filled with `scripts/upload-tool-media.mjs`. Content pages carry `Netlify-CDN-Cache-Control` headers so repeat requests are served from the edge, and a daily request to `/api/v1/health?db=1` keeps a free-tier database from pausing. Details and the cost-control checklist are in `HANDOFF.md`.

## API

A small versioned JSON API lives under `/api/v1` (tools, categories, search, health). See `docs/API.md`.

## Contributing

Issues and pull requests are welcome, from typo fixes to catalogue corrections to new audit rules. Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup and conventions, and sign off your commits (`git commit -s`) to accept the [CLA](CLA.md). The project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Security issues go to the address in [SECURITY.md](SECURITY.md), not to the issue tracker.

## Licence

- **Code:** [GNU AGPL-3.0-only](LICENSE). Run it, change it, self-host it; if you offer a modified version as a service, share the source. Commercial licences on other terms are available from the maintainer.
- **Catalogue dataset** (`prisma/data/`, seed content): [CC BY-NC-SA 4.0](prisma/data/LICENSE).
- **SeekSmart name and logo:** all rights reserved.
- **Third-party logos and screenshots:** property of their owners, not distributed here.

Full details in [NOTICE.md](NOTICE.md).
