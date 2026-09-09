/* ADAM/DS foundations · Tokens pane — the contract index (was #/tokens).
   Update 4 Phase 7: third tier (component overrides) + policy + a11y gate. */
import { note, code } from '../specimens.js';
const index = [['Color', '--color-* + stone ramp → semantic → usage', 'bg, text, hairlines, accent'], ['Type', '--text-* + --font-* + leading/tracking', 'display → micro, tester live'], ['Space · Layout', '--space-* + --size-* + --measure-* + --break-*', 'rhythm/gutter, wrap 1600, sm 640 / md 800 / lg 900'], ['Shape', '--radius-* (= 0, normatively) + --border-* + --color-focus', 'every radius + hairline/frame/dashed + focus ring'], ['Motion · Depth', '--dur-* + --ease-* + --blur-*', 'glide, rise, reveal, viewer'], ['FX', '--fx-* + viewer spring', 'grid, shimmer, rise'], ['Component overrides', '--<component>-* (pilot: --viewer-*)', 'viewer border / shadow / in']];
export const label = 'Tokens';
export function html() {
  return `<div class="ds-sec"><h2>Contract index</h2><p class="sub"><span class="tok">src/styles/tokens.css</span> holds every raw value. UI consumes <span class="tok">var()</span> only. Each row names the tab holding its live trace.</p><table class="ds-table"><tr><th>Foundation</th><th>Tokens</th><th>Used by</th></tr>`
  + index.map(([f, t, u]) => `<tr><td>${f}</td><td>${t}</td><td>${u}</td></tr>`).join('')
  + `</table>`
  + note('Do', 'Add a token for every new value. Odd px (3/5/7/9/11) gets an explicit slot — never round silently. Convention: <span class="tok">--space-N</span> = raw step · <span class="tok">--size-*</span> = named object · <span class="tok">--measure-*</span> = ch · <span class="tok">--rhythm/--gutter</span> = purpose aliases (prefer) · <span class="tok">--break-*</span> = viewport (640/800/900 — see Space · Layout).')
  + note('Don’t', 'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw <span class="tok">px</span> outside <span class="tok">tokens.css</span>. Breakpoints live as <span class="tok">--break-sm/md/lg</span> (640/800/900) — <span class="tok">var()</span> is invalid in <span class="tok">@media</span> so queries keep the raw px in sync by value, commented with the token (<span class="tok">/* --break-* */</span>).', 'dont')
  + `</div><div class="ds-sec"><h2>Component tier — scoped overrides</h2><p class="sub">Third tier after primitives → semantic: <span class="tok">--&lt;component&gt;-*</span> owns one component's geometry + frost + travel so shared semantics never sprawl for one-off needs.</p>`
  + code('worked example — viewer owns its frame, no semantic added:\n--viewer-border: 2px solid frost line · the frame it opens in\n--shadow-viewer: lifted off the page behind the frame\n--dur-viewer-in 300ms · open travel · --dur-viewer-line 780ms · tether draw')
  + note('Do', 'New one-component need → new <span class="tok">--&lt;component&gt;-*</span> token. Forbid new semantic sprawl where a component token fits.')
  + note('Don’t', 'No component token consumed by two components — shared need graduates to semantic, never duplicates per component.', 'dont')
  + `</div><div class="ds-sec"><h2>Versioning + deprecation</h2><p class="sub">Renames flow alias → sunset, never flag-day. Announced in the changelog.</p>`
  + code('rename: add new token + keep old as alias → mark deprecated in-pane → remove after one release\nbump: patch = value tweak · minor = additive token · major = removal / rename sunset\nannounce: every change lands in /ds/#/changelog with its plan link')
  + `</div><div class="ds-sec"><h2>A11y contract — release gate</h2><p class="sub">Gate: <span class="tok">npm run test</span> green + theme-toggle walkthrough + keyboard walkthrough. Nothing ships with an open item and no owner.</p><table class="ds-table"><tr><th>Check</th><th>State</th><th>Proof</th></tr>`
  + `<tr><td>Contrast AA per pair × both themes</td><td>PASS</td><td>Color matrix (Phase 1)</td></tr>`
  + `<tr><td>Visible focus ring, both themes</td><td>PASS</td><td>State group + Shape ring (Tasks 4/19)</td></tr>`
  + `<tr><td>Reduced motion honored</td><td>PASS</td><td>Motion contract (Phase 5) + site guards</td></tr>`
  + `<tr><td>44px targets</td><td>PASS</td><td>Touch audit (Task 16)</td></tr>`
  + `<tr><td>Theme parity light / dark</td><td>PASS</td><td>probeTheme matrices, toggle walkthrough</td></tr>`
  + `<tr><td>Keyboard walkthrough</td><td>GATE</td><td>Run on release: tab every demo control + ring visible</td></tr>`
  + `<tr><td>Feedback roles (success / error / warning / info)</td><td>OPEN · owner: designer</td><td>Blocked on hue sign-off (Task 7)</td></tr>`
  + `</table>`
  + `</div><div class="ds-sec"><h2>Audit state</h2><p class="sub">Live site today — fully adherent, enforced on every release.</p>`
  + code('PASS zero raw colors outside tokens.css — site + docs paint via var() only\nPASS border-radius: 100% var(--radius-*) across stylesheets\nPASS font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\nPASS every stylesheet under 100 lines · npm run lint:tokens gates src/styles + src/ds\nPASS breakpoints tokenized --break-sm 640 / --break-md 800 / --break-lg 900 — @media rows carry /* --break-* */')
  + `</div>`;
}
