# Bidirectional DS Pipeline — Continuation 20260909_145218_9888b1

**Tags:** Tooling

> **For Hermes:** this is the canonical anchor. Every future DS scope branches from session `@session:default/20260909_145218_9888b1`. Implement `plan → commit → changelog` in both directions.

**Goal:** Guarantee that every future plan and every future DS execution is bidirectionally linked — plan file lists intent, commit cites plan, changelog renders commits per phase with wip/unlinked triage. Zero manual bookkeeping after this point.

**Architecture:** Vite glob reads all `.hermes/plans/*.md` at build. `scripts/ds-track.mjs` parses `git log -- src/ds src/styles/tokens.css DESIGN.md` for `[plan:<file>#<anchor>]` trailers into `src/ds/changelog-manifest.json`. `src/ds/pages-changelog.js` (Miller columns) joins the two at runtime: `hits(plan.file, phaseText, isFirst)` → `badges()` per phase + global `unlinked(texts)` section. Hooks: `predev` + `build` (`node scripts/ds-track.mjs && vite build`) regenerate manifest even when git is missing.

**Tech Stack:** Vanilla JS + `import.meta.glob(...?raw, eager)`, Node fs/execSync, Git log format `%H|%h|%ad|%s`, `marked`, Vite 5.

---

## Standing rules (every future scope)

- Plan location: `.hermes/plans/YYYY-MM-DD_HHMMSS-<slug>.md` — first `#` becomes changelog label, `**Goal:**` becomes tooltip, each `## Phase N` becomes a Miller column entry.
- Commit trailer (required for DS touches): subject ends with `[plan:<file>#<anchor>]` e.g. `feat(ds): add avatar playground [plan:2026-09-09_120000-ds-maturity.md#3.3]` — `file` must exactly match the MD filename, `anchor` is substring of the target phase's markdown (if omitted, attaches to phase 1).
- DS paths that trigger tracking: `src/ds`, `src/styles/tokens.css`, `DESIGN.md`/`design.md` — any commit touching them without a trailer appears in “Unlinked DS changes”.
- Verification: `npm run ds:track` → `cat src/ds/changelog-manifest.json`, `npm test` (`lint:tokens + build`), open `/ds/#/changelog`.

---

## Phase 0 — Already shipped (this continuation)

- [x] **Tracker + link layer** ✓ done — `scripts/ds-track.mjs` (34 lines) writes `src/ds/changelog-manifest.json` with `{ continuation: "20260909_145218_9888b1", plans, commits[], wip[] }`, `src/ds/changelog-links.js` (20 lines) exports `hits/badges/unlinked`. Verify: `node scripts/ds-track.mjs` → `9 plans · 13 DS commits`.
- [x] **Glob renderer** ✓ done — `src/ds/pages-changelog.js` (75 lines) uses `import.meta.glob('../../.hermes/plans/*.md', { query:'?raw', eager:true })`, per-phase `hits()` badge count in sprint list + `badges()` in detail + `unlinked(texts)` footer. Verify: `npm run build` → 70 modules transformed.
- [x] **Build hooks** ✓ done — `package.json: build="node scripts/ds-track.mjs && vite build"`, `predev`, `ds:track`. Verify: `npm run build` auto-prints `✓ ds-track — … · cont 20260909_145218_9888b1`.
- [x] **Continuation anchor** ✓ done — `.hermes/continuation.json` + this plan file branch from `@session:default/20260909_145218_9888b1`.
- [x] **Styles** ✓ done — `src/ds/ds.css` adds `.ds-commits` + `.ds-hr` within 100-line budget (98→100 via line packing).

## Phase 1 — Future scopes use this (no code)

- [ ] **Author next plan** — create `.hermes/plans/<ts>-<slug>.md` with `## Phase N` sections; `npm run ds:track` makes it appear in Miller col 1 immediately.
- [ ] **Commit with trailer** — each DS commit message ends with `[plan:<file>#<anchor>]`; `npm run build` moves it from “Unlinked” into its phase's badge.
- [ ] **Triage** — if “Unlinked DS changes” is non-empty in `/ds/#/changelog`, the next commit must cite its plan; wip list shows uncommitted DS diffs.

## Tests / validation (every scope)

- `node scripts/ds-track.mjs && cat src/ds/changelog-manifest.json | grep -c '"plan":'` equals linked commits
- `npm test` green (lint:tokens + vite build with ds-track)
- `/ds/#/changelog` Miller detail shows `<p class="ds-commits">` when a phase has commits, otherwise no badge; global hr+unlinked only when needed

## Risks / tradeoffs

- `tokens.css` 100-line ceiling — packs one rule per line; DS-only tokens live in `ds.css` already.
- Historical commits (pre-pipeline) remain “Unlinked” until retroactively amended — expected, not a bug.
- Glob imports all MDs; plans without `## Phase` are silently skipped (intentional — only phased plans are changelog entries).

## Open questions

- None — pipeline is closed. Future scopes just follow the trailer convention.
