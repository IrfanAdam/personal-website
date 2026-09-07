/* ADAM/DS — Tokens: the contract. Mirrors tokens.css §-by-§. */
import { note, code } from './specimens.js';
const rows = [
  ['--color-bg / --color-surface', 'paper / card surface', 'bg, cards'],
  ['--color-ink / --color-ink-muted', 'headlines / meta', 'text, labels'],
  ['--color-line / --color-panel', 'hairlines / frosted fills', 'borders, header'],
  ['--color-accent / --color-on-accent', 'vermilion 500 / text on accent', 'callouts only'],
  ['--color-chip / --color-on-media', 'overlay chip / on-image text', 'tags, card-info'],
  ['--scrim-gradient / --scrim-mask', 'progressive blur tint + fade mask', 'card scrim'],
  ['--text-display / --text-title', 'hero / page titles', 'h1 parity'],
  ['--font-sans / --font-mono', 'Inter Tight / Chivo Mono', 'voice / metadata'],
  ['--space-14 / --space-16', 'grid rhythm / page gutter', 'cols, wrap'],
  ['--size-wrap / --size-strip', '1400px / 56px thumbs', 'layout'],
  ['--border-hairline / --border-frame', '1px line / 3px ink frame', 'cards / tab frame'],
  ['--radius-none … --radius-pill', 'all 0 — the doctrine', 'every radius'],
  ['--dur-glide / --ease-signature', '380ms / (0.32,0.72,0,1)', 'frame, zoom'],
  ['--blur-header / --sat-header', '18px / 1.6', 'sticky header'],
  ['--z-header / --z-frame', '20 / 2', 'overlay order'],
  ['--bg / --ink / --muted …', 'legacy aliases → semantic', 'bridge until adoption'],
];
export const title = 'Tokens';
export function render() {
  return `<p class="ds-crumb">Contract</p><div class="ds-hero"><h1>One source of truth.</h1>
<p class="lede"><span class="tok">src/styles/tokens.css</span> holds every raw value. UI consumes <span class="tok">var()</span> only. Legacy names (<span class="tok">--bg</span>, <span class="tok">--ink</span>…) alias to semantic tokens so the live site is pixel-identical today.</p></div>
<div class="ds-sec"><h2>Token map</h2><p class="sub">Click any row token to copy. Layers: primitives (stone/accent) → semantic → component → legacy aliases.</p>
<table class="ds-table"><tr><th>Token</th><th>Value / role</th><th>Used by</th></tr>
${rows.map(([t, v, u]) => `<tr><td><span class="tok" data-copy="${t}" style="cursor:pointer" title="Click to copy">${t}</span></td><td>${v}</td><td>${u}</td></tr>`).join('')}</table>
${note('Do', 'Add a token for every new value. Odd px (3/5/7) gets an explicit slot — never round silently.')}
${note('Don’t', 'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw <span class="tok">px</span> outside <span class="tok">tokens.css</span>. Breakpoints are the sole exception.', 'dont')}</div>
<div class="ds-sec"><h2>Audit state</h2><p class="sub">Live site today — fully adherent, enforced on every release.</p>
${code('✓ ZERO raw colors outside tokens.css — site + docs paint via var() only (swatches read live values)\n✓ border-radius: 100% var(--radius-*) across base / pages / card / masonry\n✓ font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\n✓ every file ≤ 100 lines (masonry 25 · card 99 · pages 71 · base 74 · tokens 96 · ds chrome 53)\n✓ npm run lint:tokens gates src/styles + src/ds — wired into npm test')}</div>`;
}
