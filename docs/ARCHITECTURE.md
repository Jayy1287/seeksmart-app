# SeekSmart Architecture

SeekSmart starts as a modular full-stack application.

Frontend, backend, and database schema live in one repo for speed, but code is separated by responsibility so the backend can serve future mobile apps cleanly.

## Main Boundaries

```text
src/app/             routing layer
src/app/api/v1/      mobile-ready API routes
src/features/        product UI modules
src/server/          backend logic
src/shared/          shared DTO and API types
src/lib/             framework utilities
prisma/              database schema and seed data
```

## Dependency Direction

Use this direction:

```text
app routes -> features/server -> shared/lib
api routes -> server -> shared/lib
server -> prisma/lib
```

Avoid this:

```text
features -> prisma
mobile clients -> database models
api routes -> duplicated database queries
```

## Mobile Readiness

Future iOS and Android apps should consume `/api/v1`.

That means:

- API responses use a stable envelope.
- Mobile clients receive public DTOs, not raw Prisma models.
- Backend queries and mutations live in `src/server`.
- Versioning starts now with `/api/v1`.
- Breaking changes should become `/api/v2`.

## When to Split the Backend

Keep the backend inside this repo until there is a strong reason to split it.

Split into a separate API repo only when:

- Mobile needs independent backend deployment.
- API traffic needs separate scaling.
- Background jobs or queues become substantial.
- Multiple teams need independent ownership.
- The Next.js route layer becomes limiting.

