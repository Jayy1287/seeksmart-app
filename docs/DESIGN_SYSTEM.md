# SeekSmart design system v3

Owner feedback that drives this: the old UI had too many cards, all of them boring, small type, no motion. Avoid "AI slop": no purple gradients, no emoji, no walls of explanatory text, no card grids for everything. Product, not brochure.

## Principles

1. **Lists over cards.** Default to hairline-divided rows (`.row-list` / `.row-item`) with big type and a hover sweep. Use a white surface (`.surface`) only when content is genuinely a panel (a form, a chart, a comparison table). Never nest cards in cards. Never more than ~6 tiles in a grid.
2. **Type does the work.** Big display headings (`.display`, `.h1`, `.h2`) in Bricolage Grotesque, tight tracking. A second, greyed clause (`.ghost-word`) is the house style for two-part headings: `Three minutes. <span class="ghost-word">Three answers.</span>`. Numbers in Geist Mono (`font-mono tabular`).
3. **One hot colour.** `signal` (#FF5C26) for dots, active states, the top-ranked item, progress fills. `accent` is the text-safe darker version for small coloured text. Everything else is ink on warm paper. No teal, no green except `success` for status.
4. **Night panels are set pieces.** `.night` (near-black, grain) for one dramatic block per page at most (hero instrument, key result, CTA). Add `data-spotlight` + `spotlight` for the pointer glow.
5. **Little copy.** One-line leads. Cut helper paragraphs. Labels over sentences.
6. **Motion everywhere, subtle.** Every page: headline via `SplitReveal`, sections via `Reveal`, lists via `Stagger`/`StaggerItem` with `inView`. Scores via `ScoreDial` or `.meter` with animated width. Hover states on every interactive row. Never branch rendering on `useReducedMotion()` (causes hydration mismatches that leave content invisible); MotionConfig handles reduced motion globally.

## Tokens (Tailwind)

Colours: `ink`, `paper`, `surface`, `muted`, `line`, `muted-text`, `signal`, `accent`, `success`, `warning`, `danger`, `night`, `night-2`. Use opacity modifiers: `text-ink/60`, `border-ink/10`, `bg-ink/[0.04]`.
Fonts: `font-display`, `font-sans` (Geist, default), `font-mono`.

## CSS primitives (src/app/globals.css)

- Layout: `.app-container`, `.section` (big vertical padding), `.section-tight`, `.page-hero` (top-of-page block padding), `.page-shell`.
- Type: `.display`, `.h1`, `.h2`, `.h3`, `.h4`, `.lead`, `.muted`, `.eyebrow` (mono uppercase with signal dot; `.eyebrow-plain` without dot), `.stat-number`, `.accent-word`, `.ghost-word`, `.prose-ss` (long-form).
- Buttons: `.btn` + `.btn-primary` (ink, signal wipe on hover) / `.btn-signal` / `.btn-ghost` / `.btn-light` (on night) / `.btn-outline-light`; sizes `.btn-lg`, `.btn-sm`. Trailing icon nudges on hover. `.icon-button`. `.link-underline` (animated underline link, put an ArrowUpRight inside).
- Chips/tags: `.chip` (filter chip; `data-active="true"`), `.tag` + `.tag-signal|success|warning|danger|dark`, `.kbd`.
- Surfaces: `.surface` (white, 24px radius, hairline), `.surface-muted`, `.tile` (+ `.tile-hover` lift), `.night`, `.night-panel`, `.spotlight` + `data-spotlight`.
- Lists: `.row-list` (wrapper with top border), `.row-item` (grid row with bottom border; when it is an `<a>` it gets a white hover sweep), `.row-arrow` (circle arrow that fills and rotates when its parent link is hovered).
- Forms: `.field` (input/select/textarea), `.field-label`, `.search-field` (wrapper with icon + pill input), `.segmented` + `.segmented-item` + `.segmented-pill` (use motion `layoutId` for the pill).
- Meters: `.meter` (+ `.meter-signal`) with a child `span`/`div` width.
- Decorative: `.grid-lines`, `.dot-grid`, `.glow-orb`, `.hairline`, `.mask-fade-x`, `.mask-fade-b`, `.pulse-dot`.
- Empty/skeleton: `EmptyState`, `SkeletonBlock`, `SkeletonLine` from `@/components/state-surfaces`.

Legacy classes (`surface-panel`, `control-field`, `primary-button`, `secondary-button`, `status-pill`, `metric-tile`, and everything in `src/styles/legacy.css`) still render but must be removed from any file you rebuild. `legacy.css` gets deleted once no page uses it.

## Components

- `@/components/motion/split-reveal` → `<SplitReveal as="h1" className="h1" lines={[["Compare tools"], [{ text: "that fit the job.", className: "ghost-word" }]]} />` (add `inView` below the fold).
- `@/components/motion/reveal` → `<Reveal delay={0.1}>`.
- `@/components/motion/stagger` → `<Stagger inView as="ul"><StaggerItem as="li">…`.
- `@/components/motion/magnetic` → wrap one primary CTA per page.
- `@/components/motion/marquee`, `@/components/motion/rotating-words`, `@/components/motion/animated-number` (`<AnimatedNumber value={n} />`).
- `@/components/ui/score-dial` → `<ScoreDial value={86} size={56} tone="ink|signal|light" />`.
- `@/features/tools/tool-logo` → `<ToolLogo logoUrl name size="sm|md|lg" />`.

## Page anatomy

```
<main>
  <section className="app-container page-hero">      eyebrow, SplitReveal h1, one-line lead, actions (and optional stats on the right)
  <section className="app-container pb-24 md:pb-32">  primary content (list/table/form)
  …optional one night set piece
</main>
```
The header is sticky and floating; the footer is a night block with its own CTA, so pages do not need a closing CTA section.

## Responsive

Must work at 390px with no horizontal scroll. Tables become stacked rows below `md`. Tap targets ≥ 40px. Test at 390 and 1440.
