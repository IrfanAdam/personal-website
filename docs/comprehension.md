# Comprehension sampling — refactor-manageability Task 16

> Newcomer proxy: Hermes agent cold-read (agreed 2026-09-13), zero prior file context.
> Test per file: state the job in one sentence → point at the file to edit for one concrete
> change from that job. Hesitation, a wrong pointer, or a header that does not name the job = fail.
> 5 files drawn at random from the split set (133 files).

| # | File (as sampled) | Job stated cold | Edit pointer probed | Verdict |
|---|---|---|---|---|
| 1 | `src/ds/foundations/color/sections.js` | "sections" — job word too generic; body showed pair + decor tables | pair-table columns → this file | **fail → fixed** |
| 2 | `src/ds/pages-library.js` | composer of the Library landing from the `library/*` sheets | hero copy → `library/hero.js` | pass |
| 3 | `src/ds/playground.js` | playground shell: preview + knobs + code + tokens, registry `__pgReg` | new knob control type → `playground/knobs.js` | pass |
| 4 | `src/ds/primitives/divider.js` | Divider primitive sheet (tokens, anatomy, behaviour, code) | hairline token → `--size-hairline` in `tokens.css` | pass |
| 5 | `src/ds/overview/hero.js` | overview hero markup; `y` is the edition number | headline copy → line 4 of this file | pass |

## Fixes applied (loop round 1)

- `foundations/color/sections.js` — header job token `sections` → `pair + decor table markup`
  (comment-only; render output unchanged). Re-read cold: job now stated without opening the body.

Round 1 result: **5/5 pass**, zero open fixes. No re-split or rename was needed.
