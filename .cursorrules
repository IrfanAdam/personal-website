# Project Rules & Guardrails

> Canonical rules live in `.cursorrules`. This file mirrors them for agents that read `AGENTS.md`.

## 1. Line Limit — Max 100 lines per file
Refactor via component extraction, logic separation, modularization, and separate type files.

## 2. Token System — No Raw Colors Outside `tokens.css`
All colors via `var(--token)` from `src/styles/tokens.css`. No `#hex`/`rgb()`/`hsl()` literals elsewhere.

## 3. Enforcement
Audit line count and token usage on every PR.

## 4. Task Completion Reporting — Concise Output
After completing any task:
- Do NOT provide a long summary, repeat requirements, or explain every file unless asked.
- Give ONLY a concise report, prefer <150 tokens.
- Mention only: (1) what changed (1–3 bullets), (2) issues/limitations/failed tests, (3) what remains.
- If everything succeeded, "Done" + key changes is sufficient.

## 5. Changelog & Plan Traceability — Bidirectional SOP (auto, never ask)
Anchored at `20260909_145218_9888b1` (`continuation` in `.hermes/continuation.json`). Pipeline: `.hermes/plans/*.md` → `scripts/ds-track.mjs` → `src/ds/changelog-manifest.json` → `src/ds/pages-changelog.js` (`import.meta.glob` + `src/ds/changelog-links.js` + `src/ds/changelog-tags.js`) → `/ds/#/changelog` Miller columns. Continuation + pipeline never re-anchored; `build` runs `node scripts/ds-track.mjs && vite build`, `predev` runs `ds-track || true`.

**Plan file (every DS scope, no exceptions):**
- Path: `.hermes/plans/YYYY-MM-DD_HHMMSS-<slug>.md` (or `YYYY-MM-DD_<slug>.md` for legacy retro).
- Header: `**Goal:**`, `**Architecture:**`, `**Tech Stack:**`, `**Tags:** a, b` (closed set: `Design System, Component, Function, Motion, Layout, Tooling`; explicit beats inference).
- Phases: `## Phase N — <title> {#phase-N}` with `*Tags: X*` under heading; untagged phases auto-infer (fallback `Design System`).
- Tasks: `### Task N: …` marked `✓ done` or `✗ cancelled` (with `> **Cancelled by user override** — reason` blockquote); each phase closed with `*Shipped in <sha> · Tasks a–b · phase-N.*`. Never leave unchecked tasks, never re-propose cancelled.
- Names: every phased plan MUST have `src/ds/changelog-names.json` entry `{title ≤76ch, purpose}` before any implementation — `npm run plan:names` fails otherwise. Titles via `changelog-titles.js`; raw file identity rendered in drawer above footer.

**Commits:**
- Any commit touching DS paths (`src/ds`, `src/styles/tokens.css`, `DESIGN.md`, `design.md`) MUST carry exactly one trailer `[plan:<file>#<anchor>]` where `<file>` is the plan filename and `<anchor>` is a verbatim case-sensitive substring of exactly one `## Phase` body (`#phase-N` recommended, `null` = first phase). Verified by `ds-track`.
- Pre-trailer history mapped in `.hermes/plan-links.json` (`sha → {plan, anchor, note}`) — no history rewrite; `anchor` must match one phase body.
- Commit message subject is what the changelog badge shows; `plan-links.json` note is not rendered.

**Verification (run automatically after every phase, without user prompt):**
- `npm run plan:names` → 0 missing names
- `npm run ds:track` → tagged count matches phased count, 0 wip (except new plan before first commit is 1 wip, expected), `cont 20260909_145218_9888b1`
- `npm test` (`lint:tokens` + `build`) green
- Visual: `/ds/#/changelog` Miller columns + drawer badges resolve per phase; `Iter N` recomputes on filtered list client-side.

**Hygiene:** never rewrite history for retro links, never leave a phased plan untagged or unnamed, never skip `ds-track` before commit, never ship a phase with unchecked tasks. This section is law — agents enforce it without being asked.
