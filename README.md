# Personal Website — Masonry clone
Clone of https://irfanadam.framer.website/masonry — static Vite site.
## Run
`npm install` then `npm run dev -- --host 0.0.0.0` (phone: Network URL).
## Edit
Add stories in `src/data/site.js` (slug, title, categories, date, timeline, role).
Put images in `public/images/`.
## Edit content (Decap CMS)
`npm run cms:dev` starts Vite (:5173) + decap-server (:8081) together.
Open `http://localhost:5173/admin/` → edit Projects / Site Settings → Publish.
Changes land in `content/` as JSON; rebuild to see them live.
Prod `/admin` uses the GitHub backend (`irfanadam/personal-website`) — needs
a GitHub OAuth app for Vercel; local edits always work via `local_backend`.
## Deploy (Vercel)
`npm run build` → `dist/` is ready for Vercel / Netlify / Cloudflare.
Vercel: import folder, framework Vite, output `dist`.
## DS conventions (standing — don't re-ask)
- Trackability: every DS scope gets `.hermes/plans/<date>-<scope>.md` with `## Phase N` anchors; every DS commit cites `[plan:<file>#phase-N]`; verify via `npm run ds:track` + `npm test`.
- Smart planning: a large prompt (≥40 words, ≥2 task verbs, or ≥2 areas) gets a phased tagged plan FIRST — run `npm run plan:suggest -- "<prompt>"`, save the skeleton to `.hermes/plans/<ts>-<slug>.md`, then implement phase-by-phase. Small prompts implement directly.
- Tags (closed set — keep it at six): `Design System, Component, Function, Motion, Layout, Tooling`. Plan preamble carries `**Tags:** a, b`; any phase overrides with `*Tags: a*` under its `## Phase` heading; untagged phases auto-infer from keywords (fallback Design System). Changelog chips filter plans+phases (OR); `Build N` recomputes client-side on the filtered list.
- Naming: changelog card titles are LLM-curated in `src/ds/changelog-names.json` (`file → {title ≤76ch, purpose}`) — heuristics in `changelog-titles.js` are fallback only. Every new phased plan gets its names entry (via Hermes) before implementing; `npm run plan:names` fails when a phased plan lacks one.
- Retro links: pre-trailer commits map in `.hermes/plan-links.json` (`sha → {plan, anchor}`; anchor must occur verbatim in exactly one `## Phase` body, `null` = first phase) — applied by `ds-track`, no history rewrite. phaseless old plans get one `(retro)` shipped phase instead of restructuring.
- Ship rule (no untraceable push): every commit either cites its covering plan's `[plan:<file>#<anchor>]` trailer or appends a task to the running lump-sum plan (`.hermes/plans/2026-09-15_183400-lump-sum-builds.md`); already-pushed shas map through `.hermes/plan-links.json`. Push reports list pushed commits, leftover wip + its owning session, and whether the deployed bundle carries the change.
- Color architecture (3-hop, toward DS-as-configurator): material ramp (raw values, never consumed) → swap slot (one active pick of N) → `--color-*` semantic (what components consume). The future configurator writes to the middle layer only. Same shape planned for type.
## Code map
| Folder | Job | Example |
|---|---|---|
| `src/app/` | boot only, no UI strings | `main.js`, `router.js` |
| `src/pages/` | route views | `masonry.js`, `contact.js` |
| `src/shared/` | cross-page only | `headerFrame.js` |
| `src/fx/visual/` | pixels only | `glitch-attach.js` |
| `src/fx/sound/` | audio only | `voices/tone.js` |
| `src/ds/` | design-system labs + changelog | `functions/glitch/` |
| `src/styles/` | one file per page, ≤100 lines | `tokens.css` |
| `scripts/` | gates + graph | `lint-manage.mjs`, `map-graph.mjs` |
- Header contract: `/* ADAM/<AREA> — <path> · <job> · [plan:<file>#phase-N] */` + `// Exports:` map + `// — Section —` banners (AREA ∈ APP|PAGE|SHARED|FX|SOUND|DS|STYLE|TOOL).
- Diagram: `docs/graph.mmd` (`node scripts/map-graph.mjs` to regen — no orphans/cycles).
- Loop: Draft → lint-manage → lint:tokens → test → smoke (`:5199`, never `:5173`) → 30s scan → fix; max 3 rounds.
- E.g. "change glitch sound" → `src/fx/sound/voices/`.
