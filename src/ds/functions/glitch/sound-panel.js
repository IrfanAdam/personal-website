/* ADAM/DS — glitch/sound-panel · palette markup · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: renderSoundPanel — markup only, bind lives in sound-bind
import { TYPE_META, buildChips, buildTypeOpts } from './meta.js';

// — Markup —
export function renderSoundPanel() {
  const chips = buildChips();
  const opts = buildTypeOpts();
  let html = `<div class="fx-panel" data-snd><h3>Sound — cyberpunk palette</h3>`;
  html += `<div class="fx-btns" style="flex-wrap:wrap;gap:6px">${chips}</div>`;
  html += `<label class="fx-row">voice <select data-snd="type">${opts}</select></label>`;
  html += `<p class="sub" data-snd-desc style="margin:4px 0 0;font-size:12px;color:var(--color-ink-muted)">${TYPE_META.hum}</p>`;
  html += `<div class="fx-btns"><button class="pill" data-snd="play">▶ play</button>`;
  html += `<button class="pill" data-snd="testa">test A · live</button>`;
  html += `<button class="pill" data-snd="testb">test B · file</button>`;
  html += `<button class="pill" data-snd="resetc">reset ctx</button>`;
  html += `<button class="pill" data-snd="sync" aria-pressed="false">sample on glitch: off</button>`;
  html += `<button class="pill on" data-snd="prox" aria-pressed="true">proximity: on</button></div>`;
  html += `<label class="fx-row">pitch <select data-snd="pitch"><option value="0">voice default</option><option value="1200">low</option><option value="2100">tick</option><option value="3400">high</option></select></label>`;
  html += `<label class="fx-row">length <input type="range" min="40" max="900" step="10" value="320" data-snd="len"><output data-snd-v>320ms</output></label>`;
  html += `<label class="fx-row" data-snd-level-row style="display:none">level <input type="range" min="20" max="100" step="5" value="100" data-snd="level"><output data-snd-g>100%</output></label>`;
  html += `<p class="fx-status" data-snd-status>proximity on — hum level = distance to card</p>`;
  html += `<p class="sub" style="margin-top:8px">Attr API: <span class="tok">data-glitch-sound="5000-9000 hum"</span> · <span class="tok">data-glitch-sound="static,blip"</span> pools rotate per hit. Site hum is always proximity — this toggle is lab preview only.</p></div>`;
  return html;
}
