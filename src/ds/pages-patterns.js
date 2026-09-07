/* ADAM/DS — Patterns · accessibility · migration. */
import { cardHTML, note, code } from './specimens.js';
export const title = 'Patterns';
export function render() {
  return `<p class="ds-crumb">Patterns · Quality · Migration</p><div class="ds-hero"><h1>Compositions that repeat.</h1>
<p class="lede">Pages are arrangements of components on the 14px rhythm. Below: the three layouts that build the whole site, plus the gates every release passes.</p></div>
<div class="ds-sec"><h2>Masonry grid</h2><p class="sub">4 cols → 2 @900px → 1 @640px. Short columns catch up on scroll (parallax) so bottoms align. Mobile uses a 380ms linger instead of hover.</p>
<div class="ds-spec"><div class="cols" style="width:100%"><div class="col">${cardHTML('Fluxx', 'fluxx · 2024', '/images/fluxx.jpg', ['Fintech'])}</div><div class="col">${cardHTML('TAS-35', 'tas-35 · 2023', '/images/tas-35.jpg', ['Industrial'])}</div></div><figure><figcaption>cols · col · card (aspect-ratio preserved, TEXT_H 0)</figcaption></figure></div></div>
<div class="ds-sec"><h2>Case 50/50 · contact hero</h2><p class="sub">Copy left / media right at <span class="tok">1fr 1fr, gap 0</span>, flush to the wrap edge. Contact reuses the same grid with its portrait; hero autowraps in two tones (ink / muted split).</p>
<div class="ds-spec block"><div class="case-grid"><div class="case-copy"><h1 style="font-size:var(--text-title)">Helix</h1><p class="kicker">Sales CRM · 2024</p><p>Copy owns the left half; media bleeds to the container edge.</p></div><div class="case-media"><img src="/images/helix.png" alt=""/></div></div></div></div>
<div class="ds-sec"><h2>Accessibility</h2><p class="sub">Measured on paper in light theme. Dark pairings invert to equivalent ratios.</p>
<table class="ds-table"><tr><th>Pair</th><th>Ratio</th><th>Verdict</th></tr>
<tr><td>Ink on paper</td><td>~15.4 : 1</td><td>AAA — headlines, body, frame</td></tr>
<tr><td>Muted on paper</td><td>~4.6 : 1</td><td>AA — meta only, never body</td></tr>
<tr><td>On-media on chip/scrim</td><td>~12 : 1</td><td>AAA over imagery + shadow</td></tr>
<tr><td>Accent on paper</td><td>~3.6 : 1</td><td>Large text / graphics only</td></tr></table>
${note('Do', 'Focus rings are <span class="tok">2px ink, offset 2px</span>. Motion dies under <span class="tok">prefers-reduced-motion</span> — reveal, parallax, linger, and glide all no-op.')}</div>
<div class="ds-sec"><h2>Migration — making the site adherent</h2><p class="sub">Completed, zero visual change throughout. Every step was a token-alias swap with identical pixels.</p>
${code('1 · tokens.css ✓ DONE — canonical space live, legacy aliases keep pixels identical\n2 · masonry.css ✓ DONE — consumes --scrim-gradient / --color-on-media, card split to card.css\n3 · base / pages / card / masonry ✓ DONE — 100% var() consumption, every file ≤ 100 lines\n4 · DESIGN.md ✓ DONE — v1.0.0 spec matches this DS\n5 · verify ✓ DONE — npm test (lint:tokens + vite build) green')}
${note('Don’t', 'No step restyles anything. Diffs must be token-alias swaps with byte-identical screenshots.', 'dont')}</div>`;
}
