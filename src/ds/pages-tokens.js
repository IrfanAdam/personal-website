/* ADAM/DS — Tokens: the contract index. Canonical values live in tokens.css;
   per-foundation traces (ramp → semantic → usage) live on #/foundations.
   This page stays as the index for one release. */
import { note, code } from './specimens.js';
const index = [
  ['Color', '#/foundations', '--color-* + stone ramp → semantic → usage', 'bg, text, hairlines, accent'],
  ['Type', '#/foundations', '--text-* + --font-* + leading/tracking', 'display → micro, tester live'],
  ['Space · Layout', '#/foundations', '--space-* + --size-* + measures', 'rhythm, gutter, wrap 1400'],
  ['Shape', '#/foundations', '--radius-* (= 0, normatively)', 'every radius'],
  ['Motion · Depth', '#/foundations', '--dur-* + --ease-* + --fx-*', 'glide, rise, reveal, viewer'],
];
export const title = 'Tokens';
export function render() {
  return `<p class="ds-crumb">Contract · merging into Foundations</p><div class="ds-hero"><h1>One source of truth.</h1>
<p class="lede"><span class="tok">src/styles/tokens.css</span> holds every raw value. UI consumes <span class="tok">var()</span> only. Per-foundation traces now live on <a href="#/foundations">Foundations</a> — this page stays as the contract index for one release.</p></div>
<div class="ds-sec"><h2>Contract index</h2><p class="sub">Each row links into its foundation trace (ramp → semantic → usage, live values, click-to-copy).</p>
<table class="ds-table"><tr><th>Foundation</th><th>Tokens</th><th>Used by</th></tr>
${index.map(([f, h, t, u]) => `<tr><td><a href="${h}">${f}</a></td><td>${t}</td><td>${u}</td></tr>`).join('')}</table>
${note('Do', 'Add a token for every new value. Odd px (3/5/7) gets an explicit slot — never round silently.')}
${note('Don’t', 'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw <span class="tok">px</span> outside <span class="tok">tokens.css</span>. Breakpoints are the sole exception.', 'dont')}</div>
<div class="ds-sec"><h2>Audit state</h2><p class="sub">Live site today — fully adherent, enforced on every release.</p>
${code('✓ ZERO raw colors outside tokens.css — site + docs paint via var() only (swatches read live values)\n✓ border-radius: 100% var(--radius-*) across base / pages / card / masonry\n✓ font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\n✓ every stylesheet ≤ 100 lines (base 93 · card 96 · case 79 · form 31 · masonry 35 · pages 37 · tokens 65 · viewer 55 · ds 59)\n✓ npm run lint:tokens gates src/styles + src/ds — wired into npm test')}</div>`;
}
