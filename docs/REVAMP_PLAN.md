# SeekSmart Revamp Plan

Last updated: 2026-10-10
Status: Phases 0, 1, and 3 shipped, plus the first slice of Phase 2 (industry guides for the three focus verticals and the thin-page noindex policy), all on branch `revamp/phase-0-technical-seo` (2026-10-10). Remaining Phase 2 work is writing: enriched tool write-ups so more tools can be re-indexed, and alternatives/vs pages.

This document records what the October 2026 review found, what was changed, and the recommended direction. It is written for Matteo and for whoever picks up the code next.

## 1. What the product is today

SeekSmart is a Next.js 15 modular monolith (App Router, React 19, Prisma 5, PostgreSQL, NextAuth v5, PostHog, Motion, Tailwind) deployed on Netlify. It has four surfaces:

| Surface | Content source | Volume | Verdict |
|---|---|---|---|
| AI audit (`/audit/*`) | Rules engine `src/server/recommendations/scoring.ts` v2.3 | 18 inputs, 52 opportunities scored | The only defensible asset. Logic is sound but under-differentiated (see 3.2). |
| Tool directory (`/tools`) | Database, seeded from `prisma/seed.ts` | 90 tools, 22 categories, 252 tool-to-use-case fits | Commoditized. Templated copy is an SEO liability. |
| Intelligence content (use cases, industries, opportunities, business functions) | Database | 59 / 21 / 52 / 10 | Good taxonomy, thin pages, "wall of cards" UI. |
| Editorial (playbooks, articles, methodology) | Hardcoded TypeScript | 8 / 5 / 1 | The articles are the best-written content on the site and the only pages with proper structured data. |

Account features: Google sign-in (plus optional Resend magic link), saved audit runs, tool likes, a dashboard, a vendor "submit tool" form, and a password-protected admin workspace for reviewing submissions and editing the taxonomy.

Code quality is good: clean boundaries (`app -> features/server -> shared/lib`), Zod validation, consistent API envelope, security headers, rate limiting, lint and typecheck clean, scoring tests pass, production build passes. The engineering is not the problem. The product shape and the content depth are.

## 2. What the review measured

Environment: local production build, isolated PostgreSQL 15, seeded database, Playwright screenshots at 1440 and 390 px, Lighthouse 12 mobile emulation. Lighthouse numbers on a laptop are noisy; treat them as direction, not truth.

### 2.1 Performance (before Phase 0)

| Page | Perf | LCP | TBT | Notes |
|---|---|---|---|---|
| `/` | 47 | 5.6 s | 1,320 ms | 164 kB shared JS (Motion + PostHog) plus Lottie on the hero |
| `/tools/chatgpt` | 58 | 4.5 s | 780 ms | 90 favicon logos preloaded eagerly |
| `/use-cases` | 69 | 3.8 s | 750 ms | 59 animated cards on one page |

Every page was `force-dynamic` and the root layout called `auth()`, so nothing was cacheable (`Cache-Control: no-store` everywhere, one Netlify function invocation per page view).

After Phase 0 the home page measured perf 62 / TBT 480 ms, and home plus listing pages are served from cache (`s-maxage=600` / `3600`). Detail pages for industries and opportunities are now pre-rendered. Tool pages and use-case pages are still dynamic because they read the session for like-state (see Phase 1).

### 2.2 SEO (before Phase 0)

- Fonts: Plus Jakarta Sans declared in CSS but never loaded. Visitors got Segoe UI / system fonts. Fixed.
- Structured data: only articles had JSON-LD. Fixed for tools, use cases, industries, opportunities, plus Organization and WebSite site-wide.
- Open Graph image: the 500x500 logo PNG on every page. Replaced with generated 1200x630 images per route type.
- Sitemap: 243 URLs all stamped with the request time as `lastmod`, including login-gated pages. Fixed.
- 404: Next.js default unstyled page. Fixed.
- Templated content: 252 of 252 tool-to-use-case rows carry the placeholder note "mapped ... based on current curated use-case data"; 148 of 252 have the same "best for" sentence; average long description is 216 characters; 89 of 90 logos are Google favicons; 0 of 90 tools have pricing data. This is the "variable-swap" pattern Google's scaled-content policy targets. Not fixed by code; needs content work (Phase 2).

### 2.3 Audit engine quality

Ran the scorer across all 210 industry x function combinations with default answers:

| Metric | Result |
|---|---|
| Top-1 and top-2 opportunity have identical scores | 43 of 210 (20%) |
| Top-1 and top-2 have identical "why this ranked" reasons | 68 of 210 (32%) |
| All three shortlisted tools share the same reason text | 66 of 210 (31%) |
| Top-1 score hits the 94 cap | 17 of 210 |
| Distinct opportunities that ever rank first | 33 of 52 |

The example run (ecommerce, customer support, "slow response") ranked "Reduce support response time" and "Turn repeated questions into a knowledge base" both at 94 with identical sub-scores and identical reasons, and shortlisted DeepL (a translation tool) for support response time because the keyword matcher hit "response". The engine is explainable, which is the right design, but the keyword matching over opportunity text is too coarse and the tool-fit data underneath it is placeholder.

### 2.4 Funnel and UX

- The audit requires Google login before question 1. Research on quiz funnels is consistent: a gate before the first question is the worst-performing configuration; results-first with an email gate on the full report yields higher-quality leads.
- The questionnaire is one long page with 4 sections, 7 selects, 37 checkboxes, 2 text inputs and a textarea. It reads like an internal form, not a product. All answers are submitted as GET parameters, so the results URL carries the full input, including free text.
- Use cases (59 cards), opportunities (52 cards) and industries (21 cards) are single pages of identical cards. On mobile the use-cases page is 32,000 px tall.
- Visual system is consistent and calm (warm paper, teal accent, orange signal) but has too many surfaces (panels, bands, tiles, pills, meters) competing on one screen, and almost every page opens with a large hero plus a stat tile, which reads as filler on a decision tool.
- The hero typewriter line reads "Decision engine for AI with ..." and is empty between rotations.
- Mobile menu, command palette, filters, pagination, empty states, dashboard and admin all work. No console errors, no horizontal overflow on any page at 390 px.

## 3. Market reality (summary of research, Oct 2026)

Full citations are in the review conversation; the headlines:

- Generic AI directories are a saturated backlink market. The leader (There's An AI For That) has 12,000+ tools and makes its money from a 2.5M-subscriber newsletter and $437 listings. Review-site organic traffic (G2, Capterra) is down roughly 85-90% over two years as AI answers absorb "list of tools" queries. A 90-tool directory has no moat.
- "AI readiness assessment / AI audit" for SMBs is a live consulting product. Fixed-scope SMB assessments sell for $1,500-$5,000 and the deliverable (ranked opportunities, pilot plan, tool shortlist) is exactly what SeekSmart's audit already produces for free. Free scorecard to paid review to implementation is the funnel that works.
- Affiliate commissions on AI SaaS are good (25-45% first year), but affiliate-heavy directories are the weakest model in the current traffic climate. Paid listings only work at scale.
- What gets cited by ChatGPT, Perplexity and AI Overviews: opinionated third-party listicles with criteria and verdicts, comparison tables, fresh dates. Neutral card grids and directory profiles are rarely cited.
- Google's 2024-2026 spam policies explicitly target database-fed template pages. The test is simple: delete the variable (tool name) from the page; if the page still reads the same, it is at risk.

## 4. Recommended direction

Stop positioning SeekSmart as a directory with an audit attached. Position it as the audit, with a curated evidence base behind it.

### 4.1 Product principles

1. Answer first, account second. The audit runs without login. Top opportunities and readiness score are shown immediately. Email unlocks the full brief, the PDF and saved runs. Google login stays as a convenience, not a gate.
2. Verdicts, not catalogs. Every content page states a position: "best for", "not for", "start here instead". Pages that cannot carry a verdict are consolidated or noindexed.
3. Vertical before horizontal. Pick two or three industries where the questionnaire can ask genuinely specific questions (the seed already leans towards professional services, ecommerce, insurance, legal). Generic "SMB AI readiness" is given away free by Zapier and AWS.
4. The directory is supporting data. Keep it, shrink it, enrich it. 40 tools with real write-ups beat 90 with favicons.

### 4.2 Monetization path (in order)

1. Email list from the audit (free). This is the asset everything else sells to.
2. "Validated audit" ($199-$499): the same brief reviewed by a human on a 30-minute call. Low build cost, proves willingness to pay.
3. Matched implementation partners: pay-per-qualified-lead or revenue share with consultants and agencies who run pilots. The audit output is already a qualified brief.
4. Fixed-price pilot or retainer for the few who want it done for them.
5. Vendor "verified listing" only after there is traffic to sell. Do not build vendor features now.

### 4.3 Audit redesign

Flow:

1. `/audit` becomes the landing page and the first question. No separate start page.
2. One question per screen, with a progress bar, keyboard navigation and a "why we ask" line. Roughly 9 core questions plus 3 optional. Cut: pilot timeline (free text), existing tools (free text), decision owner and approval mode (merge into one "who signs off" question), workflow maturity and data readiness (merge into one "how documented is the current process" question with 3 levels).
3. Industry drives a branch: 2-3 industry-specific pain points and systems replace the generic 14-item checklist.
4. Results page shows the readiness score, top 3 opportunities and the first-workflow headline immediately. Email gate (not login) unlocks pilot plan, tool shortlist, guardrails and a shareable or PDF version. Signed-in users skip the gate.
5. Store the input as a POST-created run with an id (`/audit/r/[id]`), not as 1,900 characters of GET parameters. Anonymous runs expire after 30 days unless claimed by an email.

Scoring fixes (keep the rules-based, explainable engine):

- Replace substring keyword matching with weighted tags on each opportunity (goals, pain points, systems) stored in the database, editable from the admin workspace.
- Add a tiebreaker that uses opportunity priority within the industry and distinct reason sets; never show two opportunities with identical reasons.
- Raise the score ceiling and widen the spread; 94 should be rare.
- Tool shortlist: require a real `bestFor` and `limitations` per fit before a tool can appear; fall back to "no verified shortlist yet, here is how to evaluate" rather than placeholder text.
- Readiness assessment: keep, it is the strongest part. Show it as the first number on the results page.

### 4.4 Content model

- Tool pages: 300-600 words of original copy, dated pricing summary, real logo, 6-10 typed attributes (free tier, API, SSO, data residency, integrations), pros and cons, best for / not for, 4-7 alternatives. Title pattern "[Tool] review, pricing and alternatives (2026)". Until a tool page meets this bar, noindex it.
- New page types that get cited: "[Tool] alternatives" and "[Tool] vs [Tool]" for the 10-20 most searched tools in the database; "Best AI tools for [industry] [task]" roundups with a methodology note and a comparison table.
- Use-case and industry pages: answer-first paragraph (40-60 words under each H2), a comparison table, a visible "Updated" date, and the audit as the primary call to action.
- Articles: keep the format, add 2 per month, link them from the relevant tool and use-case pages.

### 4.5 UI direction

Keep the visual language (it is distinctive and calm) but simplify the system:

- One hero pattern (eyebrow, headline, one paragraph, one primary action). Remove stat tiles from heroes.
- Two surfaces only: a flat section and one card style. Retire `hero-panel`, `data-panel`, `surface-strong`, `metric-tile` variants.
- Listing pages get grouping and filters at the top (by function, effort, risk), a compact row layout instead of 59 tall cards, and a sticky "Run the audit for your team" rail.
- Motion: keep the reveal and number animations; drop stagger on lists longer than 12 items (this is what hurts TBT on `/use-cases`).
- Replace the stock Lottie illustration with a static product visual: a cropped, real results page. Stock illustration signals "template site".
- Typewriter line: either make the rotating noun always present or replace it with a static sub-headline.

### 4.6 Technical follow-ups

- Move tool like-state to a client fetch so `/tools`, `/tools/[slug]`, `/use-cases/[slug]` and `/categories/[slug]` can use ISR (currently dynamic only because of `auth()` for the like button).
- Add `generateStaticParams` to tool and use-case pages once they are ISR.
- Durable rate limiting (Upstash or Netlify Blobs) before the audit is ungated.
- Lazy-load PostHog with `next/script` strategy `lazyOnload`; it is in the shared bundle today.
- Store tool logos locally (upload on admin approve) instead of hotlinking Google favicons.
- Remove the empty `generateStaticParams` pattern and `force-dynamic` from pages that do not read the session.
- Submit the sitemap to Google Search Console and Bing Webmaster Tools; add IndexNow.
- Playwright smoke test for home, tools, one tool, audit run, 404 at two viewports (the scripts used for this review are a good starting point).

## 5. Phases

| Phase | Scope | Effort | Depends on |
|---|---|---|---|
| 0 (done) | Fonts, JSON-LD, OG images, 404, sitemap, robots, noindex, ISR for auth-free pages, Lottie deferral | 1 day | nothing |
| 1 (done) | Audit redesign: ungated, one-question-per-screen wizard, POST runs with permanent ids, results-first with email unlock, scoring v3.0 tiebreaks and specificity, print/share. Tag-based matching (replacing substring keywords) is still open. | shipped 2026-10-10 | Decision A |
| 2 (started) | Done: non-featured tool pages are noindex and out of the sitemap; industry guides for ecommerce, retail/hospitality, local services; industry branches in the audit. Open: enrich tool write-ups (then flip `isFeatured`), 10-20 alternatives/vs pages, answer-first rewrites of use-case pages | 2-4 weeks, mostly writing | Decision C |
| 3 (done) | Hero shows a static brief preview, typewriter removed, use-cases listing is grouped rows, like-state moved to a client fetch so tool, use-case, and category pages are static with ISR, PostHog deferred to idle. Still open (cosmetic): one hero pattern everywhere, opportunities and industries listings as rows | shipped 2026-10-10 | Phase 1 |
| 4 | Monetization: validated-audit checkout, partner matching, newsletter | after Phase 1 traffic data | Decision D |

## 6. Decisions needed from Matteo

- A. Ungate the audit: decided yes (2026-10-10). Shipped.
- B. Keep the rules engine or add an LLM step for narrative only? Open. Recommendation unchanged: rules for ranking; an LLM only for prose, clearly labelled.
- C. Industries: decided ecommerce, local retailers, and smaller service businesses (2026-10-10). The wizard features "Online store", "Shop, restaurant, or venue", and "Local service business" first, with industry-specific pain point and system ordering. Deeper content for these three is Phase 2.
- D. Monetization: decided none for now (2026-10-10). Phase 4 is parked; the email list from the audit is still collected so the option stays open.
- E. Keep the vendor submission form? Open. Recommendation: keep the route, remove it from navigation until there is traffic to sell.

## 7. How to run locally

See `HANDOFF.md` ("Local development without Supabase") for the isolated Postgres recipe used in this review.
