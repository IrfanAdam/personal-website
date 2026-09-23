/* ADAM/DS — tokens playground render · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: playgroundHtml — rows + controls + persist
import { TOKS, hexOf, load } from './playground-data.js';
export function playgroundHtml() {
  const cur = load();
  Object.entries(cur).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  const rows = TOKS.map((t) => {
    if (t.type === 'color') {
      const live = getComputedStyle(document.documentElement).getPropertyValue(t.k).trim() || '#000000';
      const hex = hexOf(live);
      return [
        `<label class="fx-row" style="gap:var(--space-8)">${t.label} `,
        `<span class="tok">${t.k}</span> `,
        `<input type="color" data-token="${t.k}" value="${hex}" `,
        `style="width:var(--space-30);height:var(--space-22);`,
        `padding:0;border:var(--border-hairline)">`,
        `</label>`,
      ].join('');
    }
    const live = getComputedStyle(document.documentElement).getPropertyValue(t.k).trim();
    const num = parseFloat(live) || Number(t.min);
    return [
      `<label class="fx-row" style="gap:var(--space-8)">${t.label} `,
      `<span class="tok">${t.k}</span> `,
      `<input type="range" data-token="${t.k}" min="${t.min}" max="${t.max}" `,
      `step="${t.step}" value="${num}" style="flex:1"> `,
      `<output data-out="${t.k}" style="font-family:var(--font-mono);`,
      `font-size:var(--text-micro);min-width:42px">${live}</output></label>`,
    ].join('');
  }).join('');
  return [
    `<div class="ds-sec"><h2>Playground — tweak live</h2>`,
    `<p class="sub">Drag or pick any token — every specimen (ramps, pairs, `,
    `Library cards) reflows live. Stored in <span class="tok">localStorage</span> `,
    `until reset. Export copies <span class="tok">tokens.css</span> lines.</p>`,
    `<div class="ds-spec block" data-playground>${rows}`,
    `<div class="fx-btns" style="margin-top:var(--space-12);display:flex;`,
    `gap:var(--space-8)"><button class="tok" data-pg="export">copy export</button>`,
    `<button class="tok" data-pg="reset">reset</button></div>`,
    `<div data-pg-msg style="font-family:var(--font-mono);`,
    `font-size:var(--text-micro);color:var(--color-ink-muted);`,
    `margin-top:var(--space-8)"></div></div></div>`,
  ].join('');
}
