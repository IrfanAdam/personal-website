/* ADAM/DS foundations · Tokens pane — the contract index (was #/tokens). */
import { note, code } from '../specimens.js';
const index = [['Color', '--color-* + stone ramp → semantic → usage', 'bg, text, hairlines, accent'], ['Type', '--text-* + --font-* + leading/tracking', 'display → micro, tester live'], ['Space · Layout', '--space-* + --size-* + --measure-* + --break-*', 'rhythm/gutter, wrap 1600, sm 640 / md 800 / lg 900'], ['Shape', '--radius-* (= 0, normatively) + --border-* + --color-focus', 'every radius + hairline/frame/dashed + focus ring'], ['Motion · Depth', '--dur-* + --ease-* + --blur-*', 'glide, rise, reveal, viewer'], ['FX', '--fx-* + viewer spring', 'grid, shimmer, rise']];
export const label = 'Tokens';
export function html() {
  return `<div class="ds-sec"><h2>Contract index</h2><p class="sub"><span class="tok">src/styles/tokens.css</span> holds every raw value. UI consumes <span class="tok">var()</span> only. Each row names the tab holding its live trace.</p><table class="ds-table"><tr><th>Foundation</th><th>Tokens</th><th>Used by</th></tr>`
  + index.map(([f, t, u]) => `<tr><td>${f}</td><td>${t}</td><td>${u}</td></tr>`).join('')
  + `</table>`
  + note('Do', 'Add a token for every new value. Odd px (3/5/7/9/11) gets an explicit slot — never round silently. Convention: <span class="tok">--space-N</span> = raw step · <span class="tok">--size-*</span> = named object · <span class="tok">--measure-*</span> = ch · <span class="tok">--rhythm/--gutter</span> = purpose aliases (prefer) · <span class="tok">--break-*</span> = viewport (640/800/900 — see Space · Layout).')
  + note('Don’t', 'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw <span class="tok">px</span> outside <span class="tok">tokens.css</span>. Breakpoints live as <span class="tok">--break-sm/md/lg</span> (640/800/900) — <span class="tok">var()</span> is invalid in <span class="tok">@media</span> so queries keep the raw px in sync by value, commented with the token (<span class="tok">/* --break-* */</span>).', 'dont')
  + `</div><div class="ds-sec"><h2>Audit state</h2><p class="sub">Live site today — fully adherent, enforced on every release.</p>`
  + code('PASS zero raw colors outside tokens.css — site + docs paint via var() only\nPASS border-radius: 100% var(--radius-*) across stylesheets\nPASS font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\nPASS every stylesheet under 100 lines · npm run lint:tokens gates src/styles + src/ds\nPASS breakpoints tokenized --break-sm 640 / --break-md 800 / --break-lg 900 — @media rows carry /* --break-* */')
  + `</div>`;
}
