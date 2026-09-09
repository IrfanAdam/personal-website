/* ADAM/DS foundations · Shape pane — zero doctrine, proof, mapping, ring. */
import { tokenTrace, note, code } from '../specimens.js';
export const label = 'Shape';
export function html() {
  const doctrine = `<p class="sub" style="max-width:62ch">Zero is not missing radius — it is the cut. Hard 90° keeps vector edges lossless at any zoom, lets <span class="tok">--border-hairline</span> carry all elevation without shadow, and reserves softness for <span class="tok">clip-path</span> chamfer where erosion is intentional. Rounded is the other paradigm; we are not it.</p>`
    + `<div class="ds-grid c2">`
    + `<div class="ds-cell"><div style="display:flex;gap:var(--space-14);align-items:center"><div style="width:var(--space-60);height:var(--space-60);background:var(--color-surface);border:var(--border-hairline);border-radius:var(--radius-none);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">0</div><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">var(--radius-none) · we — hard cut</span></div><div class="nm">We — zero</div><div class="vl"><span class="tok">border-radius: var(--radius-none)</span> → <span data-live="--radius-none">0</span></div></div>`
    + `<div class="ds-cell dont"><div style="display:flex;gap:var(--space-14);align-items:center"><div style="width:var(--space-60);height:var(--space-60);background:var(--color-surface);border:var(--border-hairline);border-radius:8px;display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">8</div><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">8px · not we — soft UI</span></div><div class="nm">Not we — rounded</div><div class="vl">Literal <span class="tok">8px</span> — never use; proof that zero is a choice, not an omission</div></div>`
    + `</div>`;
  const radii = tokenTrace({ plain: true, rows: [
    ['None', '--radius-none', 'cards · panels · default'],
    ['Small', '--radius-sm', 'chips · hairlines'],
    ['Medium', '--radius-md', 'buttons · inputs'],
    ['Large', '--radius-lg', 'sheets · modals'],
    ['Pill', '--radius-pill', 'pills (still 0) — hard cut, not capsule'],
  ] });
  const liveRadii = `<div class="ds-spec" style="flex-wrap:wrap">`
    + `<figure style="margin:0"><div style="width:var(--space-90);height:var(--space-60);background:var(--color-surface);border:var(--border-hairline);border-radius:var(--radius-none);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">radius-none</div><figcaption>card — <span class="tok">var(--radius-none)</span></figcaption></figure>`
    + `<figure style="margin:0"><span class="pill" style="border-radius:var(--radius-pill)">pill — 0</span><figcaption>pill — <span class="tok">var(--radius-pill)</span></figcaption></figure>`
    + `<figure style="margin:0"><button class="btn btn--primary" style="border-radius:var(--radius-md)">Button</button><figcaption>button — <span class="tok">var(--radius-md)</span></figcaption></figure>`
    + `<figure style="margin:0"><div class="field" style="width:160px"><input placeholder="input" style="border-radius:var(--radius-md)"/></div><figcaption>input — <span class="tok">var(--radius-md)</span></figcaption></figure>`
    + `</div>`;
  const borders = tokenTrace({ plain: true, rows: [
    ['Hairline', '--border-hairline', 'var(--size-hairline) solid var(--color-line) — structure'],
    ['Frame', '--border-frame', 'var(--size-frame) solid var(--color-ink) — focus frame'],
    ['Dashed', '--border-dashed', 'var(--size-hairline) dashed var(--color-ink-muted) — loose grouping'],
  ] });
  const liveBorders = `<div class="ds-grid c3">`
    + `<div class="ds-cell"><div style="height:var(--space-30);border:var(--border-hairline);background:var(--color-surface)"></div><div class="nm">Hairline</div><div class="vl"><span class="tok">var(--border-hairline)</span> · 1px line</div><div class="vl" data-live="--color-line">—</div></div>`
    + `<div class="ds-cell"><div style="height:var(--space-30);border:var(--border-frame);background:var(--color-surface)"></div><div class="nm">Frame</div><div class="vl"><span class="tok">var(--border-frame)</span> · <span data-live="--size-frame">3px</span> ink</div></div>`
    + `<div class="ds-cell"><div style="height:var(--space-30);border:var(--border-dashed);background:var(--color-surface)"></div><div class="nm">Dashed</div><div class="vl"><span class="tok">var(--border-dashed)</span> · grouping</div></div>`
    + `</div>`;
  const focusSpec = `<h3>Focus ring — live</h3><p class="sub">Ring is <span class="tok">var(--border-focus)</span> (<span data-live="--color-focus">ink</span> · <span data-live="--size-frame">3px</span> solid) + offset <span data-live="--focus-offset">2px</span>. Tab to the button — ring is ink on paper and paper on ink. Mirrored in Color → State.</p>`
    + tokenTrace({ plain: true, rows: [['Focus color', '--color-focus', 'var(--color-ink) — ring ink'], ['Focus border', '--border-focus', 'var(--size-frame) solid var(--color-focus)'], ['Focus offset', '--focus-offset', 'var(--space-2) — 2px air'], ['Size frame', '--size-frame', '3px · shared with border-frame']] })
    + `<div class="ds-spec block" style="display:grid;gap:var(--space-12)"><style>.fd-focus-demo:focus-visible{outline:var(--border-focus);outline-offset:var(--focus-offset)} .fd-focus-demo{font-family:var(--font-mono);font-size:var(--text-meta);background:var(--color-ink);color:var(--color-bg);border:var(--border-hairline);padding:var(--space-8) var(--space-16);cursor:pointer}</style><div style="display:flex;gap:var(--space-12);flex-wrap:wrap;align-items:center"><button class="fd-focus-demo">Tab to focus — ring 3px + 2px offset</button><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Focus via keyboard (Tab), not click — <span class="tok">:focus-visible</span></span></div><div style="display:flex;gap:var(--space-12);flex-wrap:wrap"><div data-theme="dark" style="background:var(--color-bg);padding:var(--space-12);border:var(--border-hairline)"><button class="fd-focus-demo">Dark — same ring (paper on ink)</button></div><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted);align-self:center">Both themes — <span data-live="--color-focus">ink</span> holds 0 radius, no shadow</span></div></div>`
    + code('/* focus — always var, never a literal */\n:focus-visible { outline: var(--border-focus); outline-offset: var(--focus-offset); }\n/* tokens: --color-focus → --color-ink, --border-focus → 3px solid, --focus-offset → 2px */');
  return `<div class="ds-sec"><h2>Shape — zero, normatively</h2><p class="sub">Every radius token resolves to <span class="tok">0</span>. Consume via <span class="tok">var(--radius-*)</span>; lint rejects literals. Toggle theme — values hold <span class="tok">0</span> in both.</p>`
    + doctrine + `<h3>Radius → component mapping</h3><p class="sub">All five map to the same value by doctrine — the mapping is where each is allowed to land. Specimens are real site classes sized by <span class="tok">var(--radius-*)</span>.</p>` + radii + liveRadii
    + `<h3>Border — the structure system</h3><p class="sub">Radius is zero, so borders do the structure. Three tokens, three purposes.</p>` + borders + liveBorders
    + focusSpec
    + note('Do', 'Reach for borders and hairlines for structure — never a radius literal. Chamfer via <span class="tok">clip-path</span> when you need erosion (overview moodboard), not via <span class="tok">border-radius</span>.')
    + note('Don’t', 'No <span class="tok">border-radius: 8px</span> / <span class="tok">999px</span> anywhere — zero is the geometry. The 8px card in the proof is the only literal in the DS and it exists to show what we don’t do.', 'dont')
    + `</div>`;
}
