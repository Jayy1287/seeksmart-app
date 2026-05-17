# SeekSmart Handoff

Last updated: 2026-05-17

## Current State

SeekSmart is a full-stack Next.js app for helping practical business teams decide where AI belongs before buying tools. The product positioning is intentionally broader than an AI tool directory: it is a decision engine for AI adoption with tool shortlists, use cases, opportunities, industries, playbooks, and a rules-based AI workflow audit.

Canonical repo:

```text
/Users/sanrajak/Desktop/SSP/seeksmart-app
```

Do not use or depend on `seeksmart-app-baseline`. The current working app is this repo only.

Current branch:

```text
main
```

Current git base:

```text
d0170b2 Add homepage rotating decision text
```

Current local changes on top of that commit:

- `src/features/home/typewriter-rotator.tsx`: homepage typewriter now says `Decision engine for AI with` and rotates through `tool shortlists`, `use cases`, `opportunities`, and `playbooks`.
- `.env.example`: includes `SHOW_TOOL_LIKE_COUNTS=false`.
- `.env`: local-only ignored file also includes `SHOW_TOOL_LIKE_COUNTS=false`.
- `HANDOFF.md`: this handoff file.

Current local preview:

```text
http://localhost:3002
```

The last production build after the typewriter update completed successfully with:

```bash
npm run build
```

## Product Position

SeekSmart helps teams make clearer AI adoption decisions. The central idea is to start with the business workflow and decision context, then recommend use cases and tools. This avoids becoming a generic tool list or a chatbot wrapper.

Primary audience:

- Small business owners and operators choosing practical AI tools.
- Founders and lean teams trying to identify their first useful AI workflow.
- Business managers comparing AI options by workflow fit, effort, risk, and time to value.
- AI tool vendors that may eventually submit or list their tools.

Core product promise:

```text
Decide where AI belongs before you buy another tool.
```

Current homepage typewriter promise:

```text
Decision engine for AI with tool shortlists / use cases / opportunities / playbooks
```

Business differentiation:

- Workflow-first instead of category-first.
- Rules-based, explainable recommendations instead of opaque AI-generated advice.
- Tool discovery connected to use cases, opportunities, industries, and playbooks.
- SEO content supports discovery but is not the main product surface.
- Public tool submission path creates a future supply-side funnel for companies.

## Functional Overview

### Public Product Surfaces

- `/`: homepage with positioning, audit preview, categories, industries, opportunities, playbooks, and recent/trending tools.
- `/tools`: searchable/filterable AI tool directory.
- `/tools/[slug]`: tool detail pages with use-case fit, alternatives, website CTA, like button, and comparison information.
- `/categories` and `/categories/[slug]`: category browsing.
- `/use-cases` and `/use-cases/[slug]`: use-case discovery and relevant tool fits.
- `/industries` and `/industries/[slug]`: industry maps backed by database content.
- `/opportunities` and `/opportunities/[slug]`: AI opportunity pages backed by database content.
- `/business-functions`: functional taxonomy view.
- `/playbooks` and `/playbooks/[slug]`: hardcoded implementation guides in `src/lib/platform-content.ts`.
- `/articles` and `/articles/[slug]`: SEO-focused editorial content hardcoded in `src/lib/articles.ts`.
- `/methodology`: explains recommendation approach.
- `/resources`: resource hub.
- `/submit`: public tool submission form.
- `/feedback`: feedback page.
- `/privacy`, `/terms`: legal pages.

### AI Audit

Routes:

- `/audit`
- `/audit/start`
- `/audit/questions`
- `/audit/results`
- `/dashboard/audits/[id]`

The audit is rules-based and does not call an AI model in-app. It uses structured inputs such as industry, business function, goals, pain points, budget, technical comfort, data sensitivity, urgency, workflow maturity, approval mode, integration needs, workflow volume, data readiness, decision owner, existing tools, and success metrics.

Main logic:

```text
src/server/recommendations/scoring.ts
src/server/recommendations/input.ts
src/server/recommendations/queries.ts
src/shared/recommendations/audit.ts
```

The current rules version is:

```text
audit-rules-v2.3
```

Audit output includes:

- Executive brief.
- Readiness score and readiness level.
- Ranked top opportunities.
- Recommended use cases.
- Tool recommendations.
- Pilot plan.
- Checklist and cautions.

Signed-in users can save audit runs. Saved runs are stored in the `audit_runs` table and shown in the dashboard.

### Authentication And User Workspace

Auth uses NextAuth v5 with Google OAuth and Prisma adapter.

Main files:

```text
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/login/page.tsx
src/app/dashboard/page.tsx
```

User-facing behavior:

- Google sign-in.
- Database-backed sessions.
- Dashboard requires login.
- Dashboard shows saved audit runs and liked tools.
- Users can like and unlike tools.
- Likes require login.
- If not signed in, liking sends users to login with a callback URL.

Admin role:

- Google accounts whose email is in `ADMIN_EMAILS` get effective admin access.
- There is also legacy password admin auth through `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.

### Tool Likes

Database model:

```text
ToolLike
```

Main files:

```text
src/features/tools/tool-like-button.tsx
src/server/tools/likes.ts
src/server/tools/like-actions.ts
src/lib/feature-flags.ts
```

Behavior:

- Like/unlike requires a signed-in user.
- The UI performs an optimistic client update so liking does not need to refresh the entire tools page.
- Dashboard lists liked tools.
- Like counts are controlled by `SHOW_TOOL_LIKE_COUNTS`.
- Default is `SHOW_TOOL_LIKE_COUNTS=false`, so users can like tools but public counts stay hidden.

Important env behavior:

```ts
process.env.SHOW_TOOL_LIKE_COUNTS === "true"
```

Only the exact string `"true"` shows counts.

### Public Tool Submission And Admin Review

Public submission:

```text
/submit
/api/v1/submissions
src/features/submissions/submit-tool-form.tsx
src/server/submissions/mutations.ts
```

Submitted tools are stored as `Submission` records with `PENDING` status. The public API validates input, normalizes URLs, blocks duplicates, checks same-origin for POST, and rate limits by IP.

Admin review:

```text
/admin
/admin/login
/admin/submissions/[id]
/admin/tools
/admin/tools/[id]
/admin/intelligence
src/features/admin/*
src/server/admin/*
```

Admin can:

- Review pending submissions.
- Approve a submission into a published `Tool`.
- Reject submissions.
- Edit tools.
- Manage intelligence taxonomy content: business functions, industries, opportunities, and use-case intelligence.

Admin actions are recorded in `admin_actions`.

## Technical Architecture

### Stack

- Next.js App Router.
- React 19.
- TypeScript.
- Tailwind CSS.
- Prisma ORM.
- PostgreSQL.
- NextAuth v5 with Prisma adapter.
- Motion for subtle reveal/number/bar interactions.
- Lucide React icons.
- Netlify deployment with `@netlify/plugin-nextjs`.

The app is a modular monolith. Frontend pages, API routes, server logic, shared types, and database schema live in one repo, but they are separated by responsibility.

### Directory Boundaries

```text
src/app/             Next.js routes, layouts, pages, API handlers
src/app/api/v1/      stable public API contract for web and future mobile clients
src/features/        product UI modules grouped by domain
src/server/          backend queries, mutations, mappers, and business rules
src/shared/          shared DTOs, API types, and recommendation types
src/lib/             cross-cutting utilities, site config, validation, articles
src/components/      reusable UI and motion components
prisma/              schema, migrations, seed script
docs/                existing architecture/API/checklist documentation
```

Dependency direction should stay:

```text
app routes -> features/server -> shared/lib
api routes -> server -> shared/lib
server -> prisma/lib
```

Avoid putting database queries directly inside UI components.

### API Contract

Public API root:

```text
/api/v1
```

Current endpoints:

- `GET /api/v1/health`
- `GET /api/v1/tools`
- `GET /api/v1/tools/[slug]`
- `GET /api/v1/categories`
- `GET /api/v1/search`
- `POST /api/v1/submissions`

Response envelope:

```json
{ "ok": true, "data": {} }
```

Errors:

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Message",
    "details": {}
  }
}
```

Shared API types:

```text
src/shared/api.ts
src/shared/domain.ts
```

## Data Architecture

Database provider:

```text
PostgreSQL
```

Prisma schema:

```text
prisma/schema.prisma
```

Important models:

- `Tool`: published or draft AI tool records.
- `Category`: tool categories.
- `UseCase`: business use cases.
- `Feature`: tool feature taxonomy.
- `ToolFeature`: many-to-many tool-feature mapping.
- `ToolUseCase`: tool fit to use case, including fit score and recommendation notes.
- `ToolAlternative`: tool-to-tool alternatives.
- `BusinessFunction`: functional taxonomy.
- `Industry`: industry map.
- `Opportunity`: business opportunity map.
- `IndustryOpportunity`: industry-to-opportunity priority mapping.
- `OpportunityUseCase`: opportunity-to-use-case priority mapping.
- `Submission`: public tool submissions.
- `User`, `Account`, `Session`, `VerificationToken`: NextAuth data.
- `ToolLike`: user-tool likes.
- `AuditRun`: saved audit results.
- `AdminUser`, `AdminAction`: admin audit trail.

Seed data:

```text
prisma/seed.ts
```

Migrations currently include:

```text
20260502081716_init
20260502083244_add_tool_discovery_fields
20260503134945_add_intelligence_taxonomy
20260508193626_add_auth_and_audit_runs
20260516080100_add_tool_likes
```

Content source split:

- Tools, categories, use cases, features, industry maps, opportunities, audit saved runs, users, sessions, likes, submissions, and admin records are database-backed.
- Articles are hardcoded TypeScript content in `src/lib/articles.ts`.
- Playbooks and some homepage/resource content are hardcoded in `src/lib/platform-content.ts`.

## Design And UX Direction

The current design direction is a warm, light, premium SaaS interface. Keep the product on the original light theme unless there is a deliberate future dark-mode pass with complete QA.

Design principles:

- Calm, practical, decision-oriented.
- Workflow-first information hierarchy.
- Professional and investor-ready, but not flashy.
- Muted warm background with dark ink, navy accent, and restrained orange signal color.
- Cards and panels should support scanning and comparison.
- Mobile should be fully usable, not an afterthought.
- Motion should stay subtle: reveals, animated numbers, small hover lift, typewriter text, and progress bars.
- Avoid noisy gradients, heavy effects, crypto/gaming aesthetics, excessive animation, or generic marketing bloat.

Core style files/components:

```text
src/app/globals.css
tailwind.config.ts
src/components/motion/*
src/components/state-surfaces.tsx
src/features/tools/tool-card.tsx
```

Brand asset:

```text
public/brand/seeksmart-logo-v3.png
```

Tool logos mostly use stored `logoUrl`; many seed records use Google favicon URLs. Next image config allows:

```text
https://www.google.com/s2/favicons
https://logotyp.us/file/*
```

## SEO And Discovery

SEO support currently includes:

- Metadata in route files.
- `src/app/sitemap.ts` with dynamic URLs for tools, categories, use cases, industries, opportunities, business functions, playbooks, and articles.
- `src/app/robots.ts` allows public pages and disallows `/api/` and `/admin/`.
- Five hardcoded SEO articles in `src/lib/articles.ts`.
- Articles are linked in the footer, not the header, to keep the primary app navigation product-focused.

Current SEO article topics:

- How to choose AI tools for business.
- Best AI tools for small business.
- AI automation ideas by department.
- General-purpose vs specialized AI tools.
- AI tool evaluation checklist.

For production discovery, connect the hosted site to Google Search Console and submit `/sitemap.xml`.

## Environment And Deployment

Local env files:

```text
.env          ignored, contains real local values
.env.example  tracked template
```

Required / expected env keys:

```text
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_APP_URL
AUTH_URL
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
ADMIN_EMAILS
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
SHOW_TOOL_LIKE_COUNTS
```

Important defaults:

```text
SHOW_TOOL_LIKE_COUNTS=false
```

Netlify:

```text
netlify.toml
```

Current build command:

```bash
npx prisma generate && npm run build
```

Current publish directory:

```text
.next
```

Current Netlify plugin:

```text
@netlify/plugin-nextjs
```

Current Netlify build environment includes:

```text
SECRETS_SCAN_ENABLED = "false"
```

Keep this disabled for now because the user requested it due to builds failing on a contact email false positive.

Commands:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
npm run build
npm run start -- -p 3002
npm run lint
npm run typecheck
npm run test:recommendations
npm run test:smoke
```

## Security Posture

Implemented protections:

- Security headers in `next.config.mjs`.
- Production CSP.
- HSTS in production headers.
- `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- Permissions Policy restricts sensitive browser capabilities.
- NextAuth database sessions.
- Admin access through Google admin emails and legacy signed admin cookie.
- Admin cookie is HTTP-only, SameSite lax, secure in production, and HMAC-signed.
- Input validation uses Zod.
- Public submission POST checks same-origin.
- JSON body size limits for API reads.
- Duplicate tool/submission checks.
- URL normalization for submitted and admin tool URLs.
- Basic in-memory rate limiting for submissions, tool list API, and likes.
- API responses use a consistent error envelope.
- Dashboard and admin routes require auth.
- `/robots.txt` disallows `/api/` and `/admin/`.

Important limitations:

- Rate limiting is in-memory; it is not durable across serverless instances or deploys. For serious traffic, move to Redis, Upstash, or provider-native rate limiting.
- CSP currently allows `'unsafe-inline'` for scripts/styles because of framework/runtime needs. Tightening requires careful Next.js compatibility testing.
- There is no email/password auth, forgot-password flow, or email provider integration yet.
- There is no queue/background job system.
- Analytics only dispatches provider-neutral events and pushes to `dataLayer` if present; no analytics vendor is wired by default.
- Audit inputs/results can be saved for signed-in users, so the product should continue discouraging users from entering secrets or sensitive regulated data.

## Business And Growth Notes

Current go-to-market wedge:

- Useful SEO pages attract people searching for AI tool selection, small-business AI tools, AI automation ideas, and evaluation checklists.
- The tool directory captures tool-intent traffic.
- The audit provides a differentiated interactive reason to stay.
- Tool submissions create a path for companies to list themselves.

Recommended business direction:

- Keep positioning around workflow decisions, not "another AI directory."
- Build trust with methodology, transparent scoring, and human-readable cautions.
- Use articles for acquisition, but keep navigation focused on product workflows.
- Add vendor listing workflow later: claim profile, enriched listing, verification, analytics, and paid placements only after organic tool traffic exists.
- Prioritize collecting real user behavior: searches, audit completions, tool detail clicks, website outbound clicks, submissions, and liked tools.

## Near-Term Product Roadmap

Highest leverage next steps:

1. Production deployment cleanup:
   - Confirm production env variables.
   - Confirm production DB migrations.
   - Confirm `NEXT_PUBLIC_APP_URL` and `AUTH_URL` match the hosted domain.
   - Submit sitemap in Google Search Console.

2. Analytics:
   - Wire the existing `seeksmart:analytics` events to a real provider.
   - Track audit starts/completions, tool searches, filter usage, likes, outbound tool clicks, submissions, and article visits.

3. Search/discovery:
   - Improve search quality beyond simple `contains`.
   - Add "best for" and "workflow" filters.
   - Add comparison pages or tool-vs-tool pages if SEO demand appears.

4. Tool vendor workflow:
   - Submission confirmation UX.
   - Vendor claim profile.
   - Admin review queue improvements.
   - Optional featured/verified listing model.

5. Trust content:
   - More practical, non-generic articles.
   - Industry-specific AI buying guides.
   - Methodology transparency and update history.

6. Account experience:
   - Manual email/password login only if needed.
   - If added, use a provider such as Resend, Postmark, SendGrid, or SMTP for verification, magic links, and password recovery.
   - Keep Google login as the low-friction default.

7. Technical hardening:
   - Durable rate limiting.
   - Error monitoring.
   - Analytics provider.
   - Database backups and restore drill.
   - Admin audit attribution.
   - Basic Playwright smoke tests for critical flows.

## Important Files

Product and layout:

```text
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/features/home/typewriter-rotator.tsx
src/lib/site.ts
```

Tools and likes:

```text
src/app/tools/page.tsx
src/app/tools/[slug]/page.tsx
src/features/tools/tool-card.tsx
src/features/tools/tool-like-button.tsx
src/features/tools/tool-logo.tsx
src/server/tools/queries.ts
src/server/tools/mappers.ts
src/server/tools/likes.ts
src/server/tools/like-actions.ts
```

Audit:

```text
src/app/audit/*
src/features/audit/audit-result-view.tsx
src/server/recommendations/scoring.ts
src/server/recommendations/input.ts
src/server/recommendations/queries.ts
src/server/audit-runs/queries.ts
src/shared/recommendations/audit.ts
```

Auth/dashboard:

```text
src/auth.ts
src/app/login/page.tsx
src/app/dashboard/page.tsx
src/app/dashboard/audits/[id]/page.tsx
```

Admin/submissions:

```text
src/app/submit/page.tsx
src/features/submissions/submit-tool-form.tsx
src/server/submissions/mutations.ts
src/app/admin/*
src/features/admin/*
src/server/admin/*
```

Database/content:

```text
prisma/schema.prisma
prisma/seed.ts
src/lib/articles.ts
src/lib/platform-content.ts
```

SEO/API/security:

```text
src/app/sitemap.ts
src/app/robots.ts
src/app/api/v1/*
src/server/http/*
next.config.mjs
netlify.toml
```

## Handoff Notes For Next Agent

- Work only in `/Users/sanrajak/Desktop/SSP/seeksmart-app`.
- Do not touch `seeksmart-app-baseline`.
- Keep the current light theme unless explicitly asked otherwise.
- Do not print `.env` values or secrets.
- `.env` is ignored; update `.env.example` for any new required variables.
- `SHOW_TOOL_LIKE_COUNTS=false` is the expected default.
- If hosting locally, port `3002` is currently used because `3001` was busy.
- Run `npm run build` before saying production preview is good.
- Prefer preserving the modular boundaries already in the repo.
- The app should remain a practical decision product, not a flashy directory or generic SaaS landing page.
