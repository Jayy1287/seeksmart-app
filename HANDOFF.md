# SeekSmart Handoff

Last updated: 2026-10-10

## Current State

SeekSmart is a full-stack Next.js app for helping practical business teams decide where AI belongs before buying tools. The product positioning is intentionally broader than an AI tool directory: it is a decision engine for AI adoption with tool shortlists, use cases, opportunities, industries, playbooks, and a rules-based AI workflow audit.

Canonical repo (macOS checkout):

```text
/Users/sanrajak/Desktop/SSP/seeksmart-app
```

Windows checkout used for the October 2026 review:

```text
C:\Users\sanja\Downloads\ss\seeksmart-app
```

Do not use or depend on `seeksmart-app-baseline`. The current working app is this repo only.

Current branch:

```text
main
```

Current implementation checkpoint:

```text
2026-10-10 Revamp phase 0: technical SEO, ISR, fonts, OG images, 404 (branch revamp/phase-0-technical-seo)
```

Revamp review, findings, and the phased plan: `docs/REVAMP_PLAN.md`.

Expected local changes after committing this handoff:

```text
None.
```

Current local preview status:

```text
No local server is currently running.
```

Use this when a local preview is needed:

```bash
npm run dev
```

Last verified local URL:

```text
http://localhost:3000
```

The most recent documented verification pass used:

```bash
npm run lint
npm run typecheck
npm run test:recommendations
npm run build
SMOKE_BASE_URL=http://localhost:3000 npm run test:smoke
```

The last documented smoke test returned healthy responses for `/`, `/tools`, `/use-cases`, `/industries`, `/opportunities`, `/audit`, `/feedback`, `/privacy`, `/terms`, and `/api/v1/health`.

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

- `/`: homepage with positioning, a static brief preview, categories, industries, opportunities, playbooks, and recent/trending tools. Served with ISR (10 minutes).
- Rendering model: every public content page is static with hourly ISR (`revalidate = 3600` plus `generateStaticParams`), except `/tools` (search params), the audit results page, login, dashboard, and admin. PostHog initialises on idle (`instrumentation-client.ts`).
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

- `/audit`: landing page (indexable, FAQ structured data, industry quick starts).
- `/audit/questions`: 11-step client wizard (`src/features/audit/audit-wizard.tsx`). No login. Accepts `?industry=` and `?function=` presets. Draft answers are kept in `sessionStorage`.
- `/audit/r/[id]`: permanent results page for a stored run. Free: readiness score, first workflow, top 3 opportunities. Email unlocks the pilot plan, opportunity detail, tool shortlists, readiness detail, checklist, and print/share.
- `/audit/results`: compatibility route for the old GET form; scores once, stores a run, redirects to `/audit/r/[id]`.
- `/audit/start` and `/dashboard/audits/[id]`: permanent redirects.

Flow:

1. The wizard calls the server action `submitAuditAction` (`src/server/audit-runs/actions.ts`), which validates with Zod, maps wizard answers to the engine input (`src/shared/recommendations/wizard.ts`), scores with `scoreAudit`, stores an `AuditRun`, remembers the run id in the `seeksmart_audit_runs` cookie, and redirects.
2. Anonymous runs expire after 30 days (`expires_at`). Unlocking with an email (`unlockAuditAction`) sets `email`, `unlocked_at`, clears the expiry, and stores the email in the `seeksmart_audit_email` cookie so later runs in the same browser unlock automatically.
3. Signed-in users get runs stored against their account (upsert on `userId + ruleVersion + inputHash`). On sign-in, runs created in the same browser or unlocked with the same email are claimed (`claimAuditRun`, `claimAuditRunsByEmail` in `src/auth.ts`).

The rules version is `audit-rules-v3.0` (`src/server/recommendations/scoring.ts`). Changes from v2.3: keyword specificity bonus, payback bonus, penalty for opportunities mapped only to other industries, deterministic tiebreaks, a distinct closing reason per opportunity, strictly decreasing displayed scores in the top 3, and placeholder tool copy ("mapped based on current curated use-case data", "Teams that want to pilot this use case") is never shown as a reason.

Featured industries for the questionnaire: `ecommerce`, `retail-and-hospitality`, `local-services` (see `featuredIndustries` in `src/shared/recommendations/wizard.ts`).

Analytics events: `audit_questions_viewed`, `audit_step_completed`, `audit_questions_submitted`, `audit_completed` (server), `audit_results_viewed` (with `unlocked`), `audit_unlock_viewed`, `audit_unlocked` (server).

### Authentication And User Workspace

Auth uses NextAuth v5 with Prisma adapter, Google OAuth, and optional passwordless email sign-in through Resend.

Main files:

```text
src/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/login/page.tsx
src/app/login/check-email/page.tsx
src/app/dashboard/page.tsx
src/server/auth/email.ts
```

User-facing behavior:

- Passwordless email sign-in with Auth.js verification tokens when `RESEND_API_KEY` is configured.
- Google sign-in.
- Database-backed sessions.
- Dashboard requires login.
- Dashboard shows saved audit runs (linking to `/audit/r/[id]`) and liked tools.
- Users can like and unlike tools.
- Likes require login.
- If not signed in, liking sends users to login with a callback URL.
- Login callback URLs are sanitized to local app routes only.
- Email sign-in requests are normalized and soft rate-limited by email hash and IP before mail is sent.

Admin role:

- Google accounts whose email is in `ADMIN_EMAILS` get effective admin access.
- There is also legacy password admin auth through `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.

### Tool Likes

Like state is resolved on the client. Tool, use-case, and category pages are statically rendered with hourly ISR; `ToolLikeProvider` (`src/features/tools/tool-like-context.tsx`, mounted in the root layout) collects the tool ids on the page and, only when the viewer is signed in, fetches them in one request from `GET /api/v1/tools/likes?ids=...`. The dashboard still passes server-known state through `initialState`.

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

### Analytics

Analytics is now wired to PostHog while preserving the provider-neutral
`seeksmart:analytics` browser event and `window.dataLayer` push.

Main files:

```text
instrumentation-client.ts
src/features/analytics/site-analytics.tsx
src/features/analytics/posthog-client.ts
src/features/analytics/tracked-link.tsx
src/features/audit/audit-analytics.tsx
src/features/tools/tool-like-button.tsx
src/components/command-palette.tsx
src/components/command-palette-dialog.tsx
src/lib/posthog-server.ts
src/auth.ts
src/app/api/v1/submissions/route.ts
```

Behavior:

- Client PostHog initialization happens in `instrumentation-client.ts`.
- Browser PostHog traffic should be proxied through `/ingest/*` in `next.config.mjs`.
- PostHog env vars are optional; missing keys should not break local dev, sign-in, or submissions.
- `posthog-js` automatic pageview, pageleave, and autocapture are disabled so dashboards stay event-driven and intentional.
- PostHog exception capture is enabled.
- Server-side capture uses `src/lib/posthog-server.ts` and fails open if PostHog is unavailable.
- Sign-in analytics identifies users by internal user id and role only; it does not send email or name.
- Public submission analytics does not use submitter email as a distinct id.

Current tracked events:

```text
page_view
audit_start_viewed
audit_questions_viewed
audit_questions_submitted
audit_results_viewed
tool_website_clicked
tool_liked
tool_unliked
submission_completed
submission_failed
tool_submission_created
user_signed_in
command_palette_opened
command_result_selected
```

Useful event properties:

- `page_view`: `path`
- `audit_results_viewed`: `budgetRange`, `companySize`, `dataSensitivity`, `topOpportunity`
- `tool_website_clicked`: `toolSlug`, `source`
- `tool_liked` / `tool_unliked`: `tool_id`, `tool_slug`, `tool_name`
- `submission_failed`: `reason`
- `tool_submission_created`: `submission_id`, `tool_name`, `category`, `pricing_type`
- `user_signed_in`: `is_new_user`, `provider`
- `command_palette_opened`: `trigger`
- `command_result_selected`: `href`, `label`, `result_type`

PostHog events not yet added but recommended next:

```text
tool_search_used
tool_filter_changed
global_search_used
search_result_clicked
audit_saved
login_started
submission_started
```

### Public Tool Submission And Admin Review

Public submission:

```text
/submit
/api/v1/submissions
src/features/submissions/submit-tool-form.tsx
src/server/submissions/mutations.ts
```

Submission behavior:

- `/submit` now requires a signed-in user and redirects anonymous visitors to `/login?callbackUrl=/submit`.
- The submission form no longer asks for an email address; the signed-in account supplies the submitter identity.
- Each signed-in user can create at most one submission because `Submission` now has a unique optional `userId` relation.
- The public API still validates input, normalizes URLs, blocks duplicates, checks same-origin for POST, and rate limits by IP.

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
- PostHog for product analytics.
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

- Metadata in route files, with generated 1200x630 Open Graph images per route type (`src/lib/og.tsx` plus `opengraph-image.tsx` files).
- Thin-page policy: only `isFeatured` tool pages are indexable and listed in the sitemap (55 of 90 at the time of writing). Non-featured tool pages are `noindex, follow` until their write-ups are enriched. Flip `isFeatured` in the admin to index a tool.
- Industry guides: `src/lib/industry-guides.ts` holds hand-written depth (answer-first summary, five workflows with measures, skip list, data rules, FAQ with FAQPage JSON-LD) for `ecommerce`, `retail-and-hospitality`, and `local-services`, rendered by `src/features/industries/industry-guide.tsx` on `/industries/[slug]`.
- JSON-LD via `src/lib/structured-data.tsx`: Organization and WebSite site-wide, SoftwareApplication and BreadcrumbList on tool pages, BreadcrumbList on use-case, industry, and opportunity pages, Article on articles.
- Self-hosted Plus Jakarta Sans through `next/font` (`--font-sans`).
- Custom `src/app/not-found.tsx`.
- Login-gated pages (`/audit/start`, `/audit/questions`, `/audit/results`, `/submit`, `/dashboard`) are `noindex` and excluded from the sitemap.
- `src/app/sitemap.ts` with real `lastmod` dates from the database (`src/server/seo/queries.ts`), revalidated hourly.
- `src/app/robots.ts` disallows `/api/`, `/admin/`, `/dashboard/`, `/login`, audit results/questions, `/submit`, and search/pagination parameters.
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
.env.local    ignored, contains optional local overrides
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
RESEND_API_KEY
AUTH_EMAIL_FROM
AUTH_EMAIL_REPLY_TO
ADMIN_EMAILS
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
SHOW_TOOL_LIKE_COUNTS
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
NEXT_PUBLIC_POSTHOG_UI_HOST
```

Important defaults:

```text
SHOW_TOOL_LIKE_COUNTS=false
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://eu.posthog.com
```

`POSTHOG_KEY` and `POSTHOG_HOST` can be used as server-side overrides, but the current template uses `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` for both browser and server capture.

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
NODE_VERSION = "20.20.0"
SECRETS_SCAN_ENABLED = "false"
```

Keep this disabled for now because the user requested it due to builds failing on a contact email false positive.

Netlify also contains forced redirects from:

```text
seeksmartapp.netlify.app/* -> https://seeksmart.in/:splat
```

Commands:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test:recommendations
npm run test:smoke
```

## Local Development Without Supabase

Used for the October 2026 review on Windows when no Supabase credentials were available.

1. PostgreSQL 15 is installed at `C:\Program Files\PostgreSQL\15`. Create an isolated cluster so no existing password is needed:

```bash
"/c/Program Files/PostgreSQL/15/bin/initdb.exe" -D <scratch>/pgdata -U postgres -A trust -E UTF8 --locale=C
"/c/Program Files/PostgreSQL/15/bin/pg_ctl.exe" -D <scratch>/pgdata -o "-p 5433 -c listen_addresses=127.0.0.1" -l <scratch>/pg.log start
"/c/Program Files/PostgreSQL/15/bin/psql.exe" -h 127.0.0.1 -p 5433 -U postgres -c "CREATE DATABASE seeksmart;"
```

2. `.env` (ignored) sets both `DATABASE_URL` and `DIRECT_URL` to `postgresql://postgres@127.0.0.1:5433/seeksmart`, a random `AUTH_SECRET`, placeholder Google OAuth values, and `ADMIN_EMAILS`.
3. `npx prisma generate && npx prisma migrate deploy && npm run db:seed` then `npm run build && npm run start` (or `npm run dev`).
4. Google login does not work with placeholder OAuth values. To test signed-in pages, insert a `users` row and a `sessions` row with a random `session_token`, then send cookie `authjs.session-token=<token>`.
5. Node 25 works. `tsx` scripts cannot use top-level await here (CJS output); wrap in an async `main()`.

Known caveat: the Lottie hero and PostHog are still in the client bundle; see `docs/REVAMP_PLAN.md` section 4.6.

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
- The root layout no longer reads the session; header account state comes from `next-auth/react` `useSession` via `src/components/session-provider.tsx`, so content pages can be cached (ISR).
- `/robots.txt` disallows `/api/` and `/admin/`.

Important limitations:

- Rate limiting is in-memory; it is not durable across serverless instances or deploys. For serious traffic, move to Redis, Upstash, or provider-native rate limiting.
- CSP currently allows `'unsafe-inline'` for scripts/styles because of framework/runtime needs. Tightening requires careful Next.js compatibility testing.
- There is no email/password auth, forgot-password flow, or email provider integration yet.
- There is no queue/background job system.
- PostHog is wired, but the first-load shared client JS increased by roughly 61 kB because of the SDK. Keep an eye on performance if adding more client-side analytics features.
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
   - Confirm PostHog env values in Netlify.
   - Verify Netlify redirect from `seeksmartapp.netlify.app` to `seeksmart.in`.
   - Submit sitemap in Google Search Console.

2. Analytics:
   - PostHog is now wired for page views, audit funnel, outbound tool clicks, likes, submissions, sign-ins, and command palette usage.
   - Next add search/filter events: `tool_search_used`, `tool_filter_changed`, `global_search_used`, and `search_result_clicked`.
   - Add `submission_started`, `login_started`, and `audit_saved`.
   - Create or review PostHog dashboards for acquisition, audit funnel, tool intent, and submissions.

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
   - Passwordless email auth is now supported through Resend-backed magic links.
   - Keep Google login as the low-friction default alongside email.
   - Add account settings, delete-account flow, and resend-friendly auth observability before expanding auth providers further.

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

Analytics:

```text
instrumentation-client.ts
src/features/analytics/site-analytics.tsx
src/features/analytics/posthog-client.ts
src/features/analytics/tracked-link.tsx
src/features/audit/audit-analytics.tsx
src/lib/posthog-server.ts
```

## Handoff Notes For Next Agent

- Work only in `/Users/sanrajak/Desktop/SSP/seeksmart-app`.
- Do not touch `seeksmart-app-baseline`.
- Keep the current light theme unless explicitly asked otherwise.
- Do not print `.env` values or secrets.
- `.env` is ignored; update `.env.example` for any new required variables.
- `.env.local` is ignored and may contain local PostHog overrides.
- `SHOW_TOOL_LIKE_COUNTS=false` is the expected default.
- If hosting locally, use port `3000`; no local server is currently running.
- Run `npm run build` before saying production preview is good.
- PostHog is intentionally event-driven; do not enable automatic pageview/autocapture without updating the event strategy.
- `.claude/` and `posthog-setup-report.md` are ignored local wizard artifacts and are not required by the app.
- Prefer preserving the modular boundaries already in the repo.
- The app should remain a practical decision product, not a flashy directory or generic SaaS landing page.
