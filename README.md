# SeekSmart App

This repo contains the SeekSmart web application.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

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

