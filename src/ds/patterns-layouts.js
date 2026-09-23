/* ADAM/DS — ds/patterns-layouts · layout section markup ·
   [plan:2026-09-23_143400-ds-overview-elements-fold.md#phase-1] */
// Exports: renderLayouts — hero + masonry/viewer/case sections
import { cardHTML } from './specimens.js';

export function renderLayouts() {
  return [
    `<p class="ds-crumb">Elements · Patterns</p><div class="ds-hero"><h1>Compositions that repeat.</h1>
`,
    `<p class="lede">Pages are arrangements of components on the 14px rhythm. Below: the three layouts that build `,
    `the whole site, plus the gates every release passes.</p>`,
    `<p class="sub"><a href="#/">← Overview</a></p></div>`,
    `<div class="ds-sec"><h2>Masonry grid</h2>`,
    `<p class="sub">4 cols → 2 @900px → 1 @640px. Short columns catch up on scroll (parallax) so bottoms align. `,
    `Mobile uses a 380ms linger instead of hover.</p>
`,
    `<div class="ds-spec"><div class="cols" style="width:100%"><div class="col">`,
    cardHTML('Fluxx', 'fluxx · 2024', '/images/fluxx.jpg', ['Fintech']),
    `</div><div class="col">`,
    cardHTML('TAS-35', 'tas-35 · 2023', '/images/tas-35.jpg', ['Industrial']),
    `</div></div><figure><figcaption>cols · col · card (aspect-ratio preserved, TEXT_H 0)</figcaption></figure>`,
    `</div></div>
`,
    `<div class="ds-sec"><h2>Viewer (editorial expander)</h2>`,
    `<p class="sub">Hover-only portal preview, <span class="tok">180px</span> wide. Cursor becomes a <span `,
    `class="tok">32px</span> viewfinder; preview floats outside the card (flips right → left on collision), Y `,
    `follows with a clamped spring, two tether lines join them. Single clear hero, no overlays. Off on touch, `,
    `mobile, and reduced-motion.</p>
`,
    `<div class="ds-spec block">`,
    `<div class="viewer on" style="position:relative;inset:auto;opacity:1;animation:none">`,
    `<img src="/images/fluxx.jpg" alt=""/></div></div></div>
`,
    `<div class="ds-sec"><h2>Case 50/50 · contact hero</h2>`,
    `<p class="sub">Copy left / media right at <span class="tok">1fr 1fr, gap 0</span>, flush to the wrap edge. `,
    `Contact reuses the same grid with its portrait; hero autowraps in two tones (ink / muted split).</p>
`,
    `<div class="ds-spec block"><div class="case-grid"><div class="case-copy">`,
    `<h1 style="font-size:var(--text-title)">Helix</h1><p class="kicker">Sales CRM · 2024</p>`,
    `<p>Copy owns the left half; media bleeds to the container edge.</p></div><div class="case-media">`,
    `<img src="/images/helix.png" alt=""/></div></div></div></div>
`,
  ].join('');
}
