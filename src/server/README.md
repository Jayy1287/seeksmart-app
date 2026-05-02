# Server Layer

This folder contains backend logic used by both web pages and API routes.

Keep database queries, mutations, and business rules here instead of inside UI components.

## Structure

- `tools`: tool queries, mutations, and mappers
- `categories`: category queries and mutations
- `submissions`: public submission workflow
- `http`: API response helpers

The `/api/v1` routes are designed as a stable contract for future mobile apps.

