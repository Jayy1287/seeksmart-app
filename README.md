# SeekSmart App

This repo contains the SeekSmart web application.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Project Structure

```text
src/app/             Next.js routes, web pages, and API route handlers
src/app/api/v1/      versioned API contract for web and future mobile clients
src/features/        frontend/product modules grouped by domain
src/server/          backend queries, mutations, mappers, and business logic
src/shared/          shared API and domain types
src/lib/             framework utilities and cross-cutting helpers
prisma/              database schema and seed script
docs/                engineering documentation
```

The app is a modular full-stack repo. Frontend, backend, and database schema stay together for development speed, while internal boundaries keep the codebase ready for mobile and future service extraction.

## API

The public API contract starts at:

```text
/api/v1
```

See `docs/API.md`.

## External Setup Required

Install Node.js LTS before running the app.

After Node is installed:

```bash
node -v
npm -v
```

Create a free PostgreSQL database using Supabase or Neon, then copy `.env.example` to `.env` and set `DATABASE_URL`.

## Local Development

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

The app will run at `http://localhost:3000`.

## Slice 1 Status

- Project structure created
- App shell created
- Prisma schema created
- Seed script created
- Environment template created
- Modular frontend/server/shared folders created
- Versioned API routes created for future mobile clients
