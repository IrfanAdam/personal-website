# Architecture audit — functions, components, foundations + connectors

> Frozen truth before the Atlas canvas. Baseline: `node scripts/map-graph.mjs`
> prints **186 modules · 343 edges** (static JS `import` lines only — no
> CSS/token edges, no layer labels). Evidence collected 2026-09-14.

Connector kinds: `imports` (JS `from`), `styles` (CSS `<link>`/`@import`),
`tokens` (`var(--*)` reads).

## Functions — 7 labs

| Lab route | DS files | Views counterpart | CSS / token counterpart | Connectors |
|---|---|---|---|---|
| `#/functions/grid-reveal` | `functions/grid-reveal.js`, `grid-reveal-lab.js`, `grid-reveal-docs.js` | `views/masonry*` (lab geometry) | `--color-ink-muted --font-mono --size-ds-lab --space-8 --text-micro` | imports, tokens |
| `#/functions/shimmer` | `functions/shimmer.js` | none (case hero only) | `--dur-shimmer --shimmer-band --shimmer-gradient` | imports, tokens |
| `#/functions/rise` | `functions/rise.js` | `views/rise.js` | `--dur-hero-rise --ease-signature` | imports, tokens |
| `#/functions/viewer` | `functions/viewer.js` | none (DS-owned portal) | `styles/viewer.css` (`<link>` in `ds/index.html`) + `--fx-viewer-* --size-viewer-*` | imports, styles, tokens |
| `#/functions/glimmer-orb` | `functions/glimmer-orb.js` | `views/glimmer-orb.js`, `views/glimmer-color.js` | `--size-ds-orb --color-accent` | imports, tokens |
| `#/functions/glitch` | `functions/glitch.js` + 7 submodules: `glitch/lab-controls.js`, `meta.js`, `sound-bind.js`, `sound-panel.js`, `sound-play.js`, `source-panel.js`, `source/markup.js` | `views/glitch.js`, `views/glitch-init.js`, `views/glitch-sound.js`, `views/glitch-sound/` | `styles/glitch.css` (`<link>`) + `--dur-glitch --fx-glitch-*` | imports, styles, tokens |
| `#/functions/scramble` | `functions/scramble.js` + 11 submodules: `scramble/bind.js`, `bind-refs.js`, `bind-sound.js`, `bind-ui.js`, `code-tab.js`, `lab-sound.js`, `lab-text.js`, `meta.js`, `opts.js`, `panel.js`, `run.js`, `teardown.js` | `views/scramble/`, `views/scramble-text.js` | `--dur-scramble` + font switch | imports, tokens |

Shared lab harness (imported by grid-reveal/shimmer/rise routes): `ds/fx-lab.js`.
Specimen chrome: `ds/specimens.js` (imported by shimmer/rise/viewer/glimmer/glitch).

## Components — 11 primitives + 11 library + composer

Owning pages: `#/primitives` ← `pages-primitives.js`, `#/library` ←
`pages-library.js`, `#/components` ← `pages-components.js` + `component.js`,
`#/patterns` ← `pages-patterns.js` (+ `patterns-data/layouts/quality.js`).
Token deps via `grep -o 'var(--[a-z0-9-]*'`.

| Module | Owning page | Token deps | Importers (from `docs/graph.mmd`) |
|---|---|---|---|
| `primitives/avatar.js` | `#/primitives` | `--border-hairline --color-bg --color-ink-muted --font-mono --space-16 --text-meta` | `pages-primitives.js` |
| `primitives/badge.js` | `#/primitives` | (none — markup only) | `pages-primitives.js` |
| `primitives/btn.js` | `#/primitives` | `--border-hairline --color-bg --space-16` | `pages-primitives.js` |
| `primitives/divider.js` | `#/primitives` | `--color-ink-muted` | `pages-primitives.js` |
| `primitives/field.js` | `#/primitives` | `--border-hairline --color-bg --space-16` | `pages-primitives.js` |
| `primitives/field-code.js` | `#/primitives` | (none) | `pages-primitives.js` |
| `primitives/field-meta.js` | `#/primitives` | (none) | `pages-primitives.js` |
| `primitives/kicker.js` | `#/primitives` | (none) | `pages-primitives.js` |
| `primitives/logo.js` | `#/primitives` | `--border-hairline --color-bg --color-ink-muted --font-mono --space-16 --text-meta` | `pages-primitives.js` |
| `primitives/tag.js` | `#/primitives` | (none) | `pages-primitives.js` |
| `primitives/toggle.js` | `#/primitives` | `--border-hairline --color-bg --space-16` | `pages-primitives.js` |
| `library/card.js` | `#/library` | (none — dogfoods `styles/card*.css`) | `pages-library.js` |
| `library/contact.js` | `#/library` | `--border-hairline --color-* --color-panel --font-mono --space-* --text-meta` | `pages-library.js` |
| `library/cta.js` | `#/library` | (none) | `pages-library.js` |
| `library/filters.js` | `#/library` | (none) | `pages-library.js` |
| `library/footer.js` | `#/library` | `--border-hairline --color-bg --space-8` | `pages-library.js` |
| `library/header.js` | `#/library` | `--border-hairline --color-bg --gutter --space-4 --space-8` | `pages-library.js` |
| `library/hero.js` | `#/library` | `--border-hairline --color-* --color-panel --font-mono --space-* --text-meta` | `pages-library.js` |
| `library/next.js` | `#/library` | (none) | `pages-library.js` |
| `library/spec.js` | `#/library` | (none) | `pages-library.js` |
| `library/strip.js` | `#/library` | `--size-ds-demo-strip` | `pages-library.js` |
| `library/work.js` | `#/library` | (none — dogfoods `styles/card*.css`) | `pages-library.js` |
| `component.js` + `component/` | `#/components` | per-specimen | `pages-components.js` |
| `patterns-*` (3 modules) | `#/patterns` | `--color-ink-muted` et al (a11y probe) | `pages-patterns.js` |

## Foundations — 7 panes + 20 submodules

Composer: `#/foundations` ← `pages-foundations.js` (+ `foundations-mix.js`,
`foundations-handlers.js`). Every pane imports `specimens.js`
(except `pane-fx`, `pane-type` which are self-contained).

| Pane | Submodules | Token sections surfaced |
|---|---|---|
| `pane-color.js` | `color/data.js`, `sections.js` | `--color-*` ramp |
| `pane-type.js` | `type/scale.js`, `voice.js`, `playground.js`, `demos.js` | `--font-* --text-*` |
| `pane-space.js` | `space/scale.js`, `layout.js`, `tables.js`, `audit.js` | `--space-* --gutter` |
| `pane-shape.js` | `shape/doctrine.js`, `radius.js`, `borders.js`, `focus.js` | `--border-* --radius-*` |
| `pane-motion.js` | `motion/data.js`, `sections.js` | `--dur-* --ease-*` |
| `pane-fx.js` | `fx/tokens.js`, `demos.js`, `elev.js`, `spring.js` | `--fx-* --shimmer-*` |
| `pane-contract.js` | (none — prose contract) | token-source family rule |

Token sources (single source of truth, read by everything above):
`styles/tokens.css` + `tokens-color/type/fx/overrides.css`, all `<link>`ed
in `ds/index.html` → every `tokens` edge terminates at `styles/tokens*`.
