# Contributing to SeekSmart

Thanks for your interest. This document covers how to set up the project, what a good change looks like, and how to get it merged.

## Before you start

- Read [NOTICE.md](NOTICE.md). Code is AGPL-3.0, the catalogue dataset is CC BY-NC-SA 4.0, and the brand is reserved.
- Every commit must be signed off (`git commit -s`), which accepts the [Contributor Licence Agreement](CLA.md) and the Developer Certificate of Origin.
- For anything bigger than a small fix, open an issue first so the approach can be agreed before you spend time on it.

## Local setup

Requirements: Node 20 (see `.nvmrc`) and a PostgreSQL database. Supabase's free tier works; so does a local Postgres.

```bash
git clone https://github.com/Jayy1287/seeksmart-app.git
cd seeksmart-app
npm install
cp .env.example .env              # fill in DATABASE_URL and DIRECT_URL at minimum
npx prisma migrate deploy
npm run db:seed                   # taxonomy and the base catalogue
npx tsx prisma/seed-tools-v2.ts   # the researched catalogue (optional, takes a few minutes)
npm run dev
```

Logos and screenshots are not in the repository. Run `node scripts/fetch-logos.mjs` to download logos and `node scripts/capture-screenshots.mjs` (needs Playwright) to capture homepages. Both write into `public/`, where those two folders are gitignored.

Google sign-in needs OAuth credentials and magic-link email needs a Resend key. Browsing, the catalogue and the admin password login work without them.

## Project layout

```
src/app/        routes and API handlers (Next.js App Router)
src/features/   UI modules by domain
src/server/     queries, mutations, scoring, mappers (server only)
src/shared/     types shared by client and server
src/lib/        framework helpers
prisma/         schema, migrations, seeds, dataset
scripts/        catalogue pipeline and operational scripts
docs/           architecture, API, design system, product plan
```

Dependency direction is `app -> features/server -> shared/lib`. UI components never touch the database.

## Making a change

1. Branch from `main`.
2. Keep the change focused. One concern per pull request.
3. Run the checks before pushing:

   ```bash
   npm run lint
   npm run typecheck
   npm run test:recommendations
   npm run build
   ```

4. If you change the schema, add a Prisma migration and keep the seeds working.
5. If you change scoring rules, bump the rule version noted in `HANDOFF.md` and add a case to `src/server/recommendations/scoring.test.ts`.
6. Commit messages: imperative subject under 72 characters, a blank line, then short bullets on what changed and why. No AI attribution lines.

## Pull requests

- Fill in the template and link the issue.
- CI must pass (lint, typecheck, unit tests).
- A maintainer will review within a week. Small, well-described PRs get merged fastest.

## Adding or correcting tools in the catalogue

The catalogue is data, not code. Edit `prisma/data/tools-v2.json`, or open an issue with the correction, and run `node scripts/merge-tool-research.mjs` to validate. Every entry needs a source URL for pricing claims. By contributing catalogue content you license it under CC BY-NC-SA 4.0 with the rest of the dataset.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind.
