/* ADAM/DS — ds/patterns-data · a11y + motion matrices ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-2] */
// Exports: PAIRS, MOTION, a11yRows — live contrast data for the patterns route
import { cssVar, probeTheme, contrastRatio, verdictRatio } from './specimens.js';

export const PAIRS=[['Ink on paper','--color-ink','--color-bg','headlines · body · frame'],
  ['Muted on paper','--color-ink-muted','--color-bg','meta only · never body'],
  ['On-media on chip','--color-on-media','--color-chip','over imagery + shadow'],
  ['Accent on paper','--color-accent','--color-bg','large text / graphics only']];
export const MOTION=[['Cell-grid reveal',
    'paints the final frame once — no RAF loop',
    '<span class="tok">gridReveal.js</span> decode(): split=1 · eased=1 · fade=1 + finish()'],
  ['Skeletal shimmer',
    'keyframes off, placeholder at full opacity',
    '<span class="tok">case.css</span> + <span class="tok">specimens.css</span> reduce blocks'],
  ['Hero rise',
    'no height morph — <span class="tok">.ready</span> straight to reveal',
    '<span class="tok">rise.js</span>: box.ready + return'],
  ['Viewer portal',
    'never attaches — zero cursor/preview listeners',
    '<span class="tok">viewer.js</span> early return · <span class="tok">viewer.css</span> kills transitions'],
  ['Parallax + header hide',
    'chase loop + hide-on-scroll never start',
    '<span class="tok">parallax.js</span> · <span class="tok">main.js</span> reduce guards'],
  ['Glide + transitions',
    'tab frame, strip, cards, fields snap instantly',
    ['<span class="tok">pages.css</span> · <span class="tok">card.css</span> · <span class="tok">form.css</span> ',
      '· <span class="tok">base.css</span> reduce blocks'].join('')]];
export function a11yRows() {
  return PAIRS.map(([label, a, b, use]) => {
    const L = probeTheme('light', () => contrastRatio(cssVar(a) || a, cssVar(b) || b));
    const D = probeTheme('dark', () => contrastRatio(cssVar(a) || a, cssVar(b) || b));
    return [
      `<tr><td>`,
      label,
      `<br/><span class="tok">`,
      a,
      `</span> on <span class="tok">`,
      b,
      `</span></td><td>`,
      L,
      ` : 1</td><td>`,
      D,
      ` : 1</td><td>`,
      verdictRatio(L),
      ` / `,
      verdictRatio(D),
      `</td><td>`,
      use,
      `</td></tr>`,
    ].join('');
  }).join('');
}
