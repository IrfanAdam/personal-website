/* ADAM/DS foundations · Tokens pane — the contract index (was #/tokens). */
import { note, code } from '../specimens.js';
const index = [['Color', '--color-* + stone ramp → semantic → usage', 'bg, text, hairlines, accent'], ['Type', '--text-* + --font-* + leading/tracking', 'display → micro, tester live'], ['Space · Layout', '--space-* + --size-* + measures', 'rhythm, gutter, wrap 1600'], ['Shape', '--radius-* (= 0, normatively)', 'every radius'], ['Motion · Depth', '--dur-* + --ease-* + --blur-*', 'glide, rise, reveal, viewer'], ['FX', '--fx-* + viewer spring', 'grid, shimmer, rise']];
export const label = 'Tokens';
export function html() {
  return `<div class="ds-sec"><h2>Contract index</h2><p class="sub"><span class="tok">src/styles/tokens.css</span> holds every raw value. UI consumes <span class="tok">var()</span> only. Each row names the tab holding its live trace.</p><table class="ds-table"><tr><th>Foundation</th><th>Tokens</th><th>Used by</th></tr>`
  + index.map(([f, t, u]) => `<tr><td>${f}</td><td>${t}</td><td>${u}</td></tr>`).join('')
  + `</table>`
  + note('Do', 'Add a token for every new value. Odd px (3/5/7/9/11) gets an explicit slot — never round silently.')
  + note('Don’t', 'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw <span class="tok">px</span> outside <span class="tok">tokens.css</span>. Breakpoints are the sole exception.', 'dont')
  + `</div><div class="ds-sec"><h2>Audit state</h2><p class="sub">Live site today — fully adherent, enforced on every release.</p>`
  + code('PASS zero raw colors outside tokens.css — site + docs paint via var() only\nPASS border-radius: 100% var(--radius-*) across stylesheets\nPASS font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\nPASS every stylesheet under 100 lines · npm run lint:tokens gates src/styles + src/ds')
  + `</div>`;
}
