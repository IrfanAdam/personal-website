/* ADAM/DS — Patterns · accessibility · migration. Contrast matrix is live in
   BOTH themes (probed, not claimed); motion + focus matrices cite source. */
import { cardHTML, note, code, cssVar, probeTheme, contrastRatio, verdictRatio } from './specimens.js';
const PAIRS=[['Ink on paper','--color-ink','--color-bg','headlines · body · frame'],['Muted on paper','--color-ink-muted','--color-bg','meta only · never body'],['On-media on chip','--color-on-media','--color-chip','over imagery + shadow'],['Accent on paper','--color-accent','--color-bg','large text / graphics only']];
const MOTION=[['Cell-grid reveal','paints the final frame once — no RAF loop','<span class="tok">gridReveal.js</span> decode(): split=1 · eased=1 · fade=1 + finish()'],['Skeletal shimmer','keyframes off, placeholder at full opacity','<span class="tok">case.css</span> + <span class="tok">specimens.css</span> reduce blocks'],['Hero rise','no height morph — <span class="tok">.ready</span> straight to reveal','<span class="tok">rise.js</span>: box.ready + return'],['Viewer portal','never attaches — zero cursor/preview listeners','<span class="tok">viewer.js</span> early return · <span class="tok">viewer.css</span> kills transitions'],['Parallax + header hide','chase loop + hide-on-scroll never start','<span class="tok">parallax.js</span> · <span class="tok">main.js</span> reduce guards'],['Glide + transitions','tab frame, strip, cards, fields snap instantly','<span class="tok">pages.css</span> · <span class="tok">card.css</span> · <span class="tok">form.css</span> · <span class="tok">base.css</span> reduce blocks']];
function a11yRows() {
  return PAIRS.map(([label, a, b, use]) => {
    const L = probeTheme('light', () => contrastRatio(cssVar(a) || a, cssVar(b) || b));
    const D = probeTheme('dark', () => contrastRatio(cssVar(a) || a, cssVar(b) || b));
    return `<tr><td>${label}<br/><span class="tok">${a}</span> on <span class="tok">${b}</span></td><td>${L} : 1</td><td>${D} : 1</td><td>${verdictRatio(L)} / ${verdictRatio(D)}</td><td>${use}</td></tr>`;
  }).join('');
}
export const title = 'Patterns';
export function render() {
  return `<p class="ds-crumb">Patterns · Quality · Migration</p><div class="ds-hero"><h1>Compositions that repeat.</h1>
<p class="lede">Pages are arrangements of components on the 14px rhythm. Below: the three layouts that build the whole site, plus the gates every release passes.</p></div>
<div class="ds-sec"><h2>Masonry grid</h2><p class="sub">4 cols → 2 @900px → 1 @640px. Short columns catch up on scroll (parallax) so bottoms align. Mobile uses a 380ms linger instead of hover.</p>
<div class="ds-spec"><div class="cols" style="width:100%"><div class="col">${cardHTML('Fluxx', 'fluxx · 2024', '/images/fluxx.jpg', ['Fintech'])}</div><div class="col">${cardHTML('TAS-35', 'tas-35 · 2023', '/images/tas-35.jpg', ['Industrial'])}</div></div><figure><figcaption>cols · col · card (aspect-ratio preserved, TEXT_H 0)</figcaption></figure></div></div>
<div class="ds-sec"><h2>Viewer (editorial expander)</h2><p class="sub">Hover-only portal preview, <span class="tok">180px</span> wide. Cursor becomes a <span class="tok">32px</span> viewfinder; preview floats outside the card (flips right → left on collision), Y follows with a clamped spring, two tether lines join them. Single clear hero, no overlays. Off on touch, mobile, and reduced-motion.</p>
<div class="ds-spec block"><div class="viewer on" style="position:relative;inset:auto;opacity:1;animation:none"><img src="/images/fluxx.jpg" alt=""/></div></div></div>
<div class="ds-sec"><h2>Case 50/50 · contact hero</h2><p class="sub">Copy left / media right at <span class="tok">1fr 1fr, gap 0</span>, flush to the wrap edge. Contact reuses the same grid with its portrait; hero autowraps in two tones (ink / muted split).</p>
<div class="ds-spec block"><div class="case-grid"><div class="case-copy"><h1 style="font-size:var(--text-title)">Helix</h1><p class="kicker">Sales CRM · 2024</p><p>Copy owns the left half; media bleeds to the container edge.</p></div><div class="case-media"><img src="/images/helix.png" alt=""/></div></div></div></div>
<div class="ds-sec"><h2>Accessibility — computed contrast</h2><p class="sub">Every ratio is computed live from <span class="tok">var()</span> in BOTH themes via a synchronous <span class="tok">[data-theme]</span> probe (no flash, user theme restored). Gates: AA ≥ 4.5 · AAA ≥ 7. Toggle top-right to proof.</p>
<table class="ds-table"><tr><th>Pair</th><th>Light</th><th>Dark</th><th>Verdicts</th><th>Use</th></tr><tbody id="a11yBody"></tbody></table>
<h3>Motion × reduced-motion — verified in source</h3><p class="sub">Each behavior below names the guard that implements it. Lab cells also freeze (<span class="tok">fx-lab.js</span> paints one static frame).</p>
<table class="ds-table"><tr><th>Model</th><th>Reduced-motion behavior</th><th>Proven in</th></tr>
${MOTION.map(([m, b, p]) => `<tr><td>${m}</td><td>${b}</td><td>${p}</td></tr>`).join('')}</table>
<h3>Focus ring — live demo</h3><p class="sub">One rule everywhere: <span class="tok">3px</span> ink (<span class="tok">--size-frame</span>), offset <span class="tok">2px</span> (<span class="tok">--space-2</span>). Error fields swap the color to accent. Tab into this row, or press Focus:</p>
<div class="ds-spec block"><div class="field" style="max-width:var(--measure-copy)"><label for="a11yField">Email</label><input id="a11yField" type="email" value="you@studio.com"/></div>
<div class="fx-controls"><div class="fx-btns"><button class="btn btn--primary" data-focus-demo="#a11yField">Focus the field</button> <button class="pill" data-focus-demo="#a11yGhost">Focus ghost</button> <button class="btn btn--ghost" id="a11yGhost">Ghost target</button></div></div>
<figure><figcaption>real .field + .btn classes — the ring you see is the shipping rule</figcaption></figure></div>
${code('.btn / .card / .field input / .toggle:focus-visible {\\n  outline: var(--size-frame) solid var(--color-ink);  /* 3px */\\n  outline-offset: var(--space-2);                  /* 2px */\\n}\\n.field--error :focus-visible { outline-color: var(--color-accent); }')}
${note('Do', 'Rings are <span class="tok">3px ink, offset 2px</span>. Motion dies under <span class="tok">prefers-reduced-motion</span> — every model above no-ops by guard, never by promise.')}</div>
<div class="ds-sec"><h2>Migration — making the site adherent</h2><p class="sub">Completed, zero visual change throughout. Every step was a token-alias swap with identical pixels.</p>
${code('1 · tokens.css ✓ DONE — canonical space live, legacy aliases keep pixels identical\\n2 · masonry.css ✓ DONE — consumes --scrim-gradient / --color-on-media, card split to card.css\\n3 · base / pages / card / masonry ✓ DONE — 100% var() consumption, every file ≤ 100 lines\\n4 · DESIGN.md ✓ DONE — v1.1.0 spec matches this DS\\n5 · verify ✓ DONE — npm test (lint:tokens + vite build) green')}
${note('Don’t', 'No step restyles anything. Diffs must be token-alias swaps with byte-identical screenshots.', 'dont')}</div>`;
}
export function mount(root) {
  const body = root.querySelector('#a11yBody');
  const obs = new MutationObserver(() => refresh());
  /* Probing flips [data-theme] — disconnect first or the observer re-fires forever. */
  const refresh = () => { obs.disconnect(); if (body) body.innerHTML = a11yRows(); obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); };
  const mm = matchMedia('(prefers-color-scheme: dark)');
  const onSys = () => refresh();
  const onDemo = (e) => { const b = e.target.closest('[data-focus-demo]'); if (!b) return; const t = root.querySelector(b.dataset.focusDemo); if (t) t.focus({ preventScroll: true }); };
  refresh();
  if (mm.addEventListener) mm.addEventListener('change', onSys);
  root.addEventListener('click', onDemo);
  return () => { obs.disconnect(); if (mm.removeEventListener) mm.removeEventListener('change', onSys); root.removeEventListener('click', onDemo); };
}
