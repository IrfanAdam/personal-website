/* ADAM/DS foundations · Color pane — ① primitives → ② semantic → ③ playground → ④ proof (Update 4 Phase 1). */
import { tokenTrace, note } from '../specimens.js';
const MIX = ['--color-ink', '--color-bg', '--color-accent', '--color-surface', '--color-surface-sunken', '--color-overlay'];
const STONE = ['--stone-0', '--stone-25', '--stone-50', '--stone-100', '--stone-200', '--stone-300', '--stone-400', '--stone-500', '--stone-600', '--stone-700', '--stone-800', '--stone-900', '--stone-950'];
const ACCENT = ['--accent-100', '--accent-300', '--accent-500', '--accent-600', '--accent-700', '--accent-900'];
const short = (t) => t.slice(2);
const rampRows = (tokens, use) => tokens.map((t) => [short(t), t, use]);
export const label = 'Color';
export function html() {
  return `<div class="ds-sec"><h2>Color</h2><p class="sub">Stone ramp + one vermilion accent. UI consumes semantic names, never the ramp. Feedback hues (success / error / warning / info) land only after hue sign-off.</p>`
  + `<h3>① Primitives — ref-only</h3><p class="sub">Every step labeled in-swatch, both themes. Reference only — consume the semantic name, not the step.</p><h3>Stone · neutral 0–950</h3>`
  + tokenTrace({ rows: rampRows(STONE, 'neutral primitive · never consume directly') })
  + `<h3>Accent · vermilion ramp</h3><p class="sub"><span class="tok">--accent-500</span> is the only production vermilion; the other steps exist for tints, shades, and future states.</p>`
  + tokenTrace({ rows: rampRows(ACCENT, 'accent step · prefer --color-accent') })
  + note('Do', 'Future hues arrive as <span class="tok">--accent2-*</span> / <span class="tok">--accent3-*</span> ramps — slots reserved, no values until hue sign-off (Task 7).')
  + `<h3>② Semantic — light / dark</h3><p class="sub">Every <span class="tok">--color-*</span> under exactly one purpose group. Toggle the theme top-right to proof both.</p><h3>Canvas</h3>`
  + tokenTrace({ rows: [['Background', '--color-bg', 'page + cards'], ['Surface', '--color-surface', 'cards + doc cells'], ['Surface sunken', '--color-surface-sunken', 'wells + sunken rows'], ['Overlay', '--color-overlay', 'viewer + modal'], ['Panel', '--color-panel', 'doc cells + hover']] })
  + `<h3>Ink</h3>`
  + tokenTrace({ rows: [['Ink', '--color-ink', 'headlines + primary buttons'], ['Muted', '--color-ink-muted', 'meta + kickers + labels'], ['Ink subtle', '--color-ink-subtle', 'faintest meta'], ['Overlay muted', '--color-overlay-muted', 'secondary on overlay']] })
  + `<h3>Division</h3>`
  + tokenTrace({ rows: [['Line · 10% ink', '--color-line', 'hairlines + card borders'], ['Header frost', '--color-header', 'sticky header']] })
  + `<h3>Action</h3>`
  + tokenTrace({ rows: [['Accent', '--color-accent', 'callouts + badge + CTA rule'], ['On accent', '--color-on-accent', 'text on accent'], ['Chip · 62% ink', '--color-chip', 'tags + filter pills'], ['Input bg', '--color-input-bg', 'field fill'], ['Input line', '--color-input-line', 'field border'], ['Input focus', '--color-input-focus', 'field focus edge']] })
  + `<h3>Media</h3>`
  + tokenTrace({ rows: [['On media', '--color-on-media', 'card info + tags on image'], ['On-media muted', '--color-on-media-muted', 'secondary on image'], ['Viewer bg', '--color-viewer-bg', 'viewer panel'], ['Viewer line', '--color-viewer-line', 'viewer frosted border'], ['Viewer shade', '--color-viewer-shade', 'viewer dim'], ['Viewer tether', '--color-viewer-tether', 'viewer connector']] })
  + `<h3>State</h3>`
  + tokenTrace({ rows: [['Disabled bg', '--color-disabled-bg', 'disabled fill'], ['Disabled ink', '--color-disabled-ink', 'disabled text'], ['Disabled line', '--color-disabled-line', 'disabled border'], ['Focus', '--color-focus', 'keyboard ring, all themes']] })
  + `<div class="ds-grid c2"><div class="ds-cell"><div style="background:var(--color-disabled-bg);color:var(--color-disabled-ink);border:var(--space-1) solid var(--color-disabled-line);padding:var(--space-8) var(--space-14);font-size:var(--text-small)">Disabled specimen — not interactive</div><div class="nm">Disabled</div><div class="vl">bg + ink + line · both themes</div></div><div class="ds-cell"><div style="outline:var(--space-2) solid var(--color-focus);outline-offset:var(--space-2);padding:var(--space-8) var(--space-14);font-size:var(--text-small)">Focus ring — Tab to any control to see it live</div><div class="nm">Focus ring</div><div class="vl"><span class="tok">--color-focus</span> + <span class="tok">--space-2</span> offset · width spec lives in Shape</div></div></div>`
  + note('Do', 'Dark theme is a hand-tuned inversion (<span class="tok">prefers-color-scheme</span> + <span class="tok">[data-theme]</span> override), not a ramp swap. Toggle it top-right to proof every specimen.')
  + `</div><div class="ds-sec"><h2>Color explorer</h2><p class="sub">Playground, demoted below the system. Mixer blends two opaque semantic tokens at <span class="tok">t</span>; proof reads live <span class="tok">var()</span> ratios.</p><h3>③ Playground — mixer, opaque tokens only</h3><div class="ds-spec block"><div id="mixSw" style="height:var(--space-60);border:var(--border-hairline);background:var(--color-ink)"></div><div class="fx-controls" id="mixCtrls"><label class="fx-row">A <select data-mix="a">${MIX.map((t) => `<option value="${t}">${t}</option>`).join('')}</select></label><label class="fx-row">B <select data-mix="b">${MIX.map((t) => `<option value="${t}"${t === '--color-accent' ? ' selected' : ''}>${t}</option>`).join('')}</select></label><label class="fx-row">t <input type="range" min="0" max="100" step="1" value="50" data-mix="t"><output data-mix-v="t">0.50</output></label><div class="fx-btns"><button class="tok" data-mix-copy="var">copy var()</button><button class="tok" data-mix-copy="hex">copy hex</button></div><div class="vl" id="mixVal" style="font-family:var(--font-mono);font-size:var(--text-micro)"></div></div></div>`
  + `<h3>④ Proof — full contrast matrix, both themes</h3><p class="sub">Every text ink × canvas, probed live in light + dark via <span class="tok">probeTheme</span> — this table already shows both, no toggle needed.</p><table class="ds-table"><tr><th>Pair</th><th>Tokens</th><th>Ratio</th><th>Verdict</th></tr><tbody id="contrastBody"></tbody></table></div>`;
}
