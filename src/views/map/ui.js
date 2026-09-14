/* ADAM/PAGE — views/map/ui · bar + stage markup, per-mode chrome paint, mode select
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { KINDS, EDGE_KINDS, GROUPS, NODES, EDGES, membersOf } from './data.js';
import { getMode, setMode } from './store.js';
// Exports: barHTML, stageHTML, paintChrome, bindMode
const MODES = [['functions', 'functions'], ['ia', 'ia']];
export const barHTML = () => [
  '<div class="map-bar"><a class="map-back" id="mapBack" href="#/masonry">← back to work</a>',
  '<span class="map-title">Architecture map</span>',
  '<span class="map-meta" id="mapMeta"></span>',
  '<label class="map-mode"><span class="map-mode-label">view</span>',
  '<select class="map-select" id="mapMode" aria-label="Map mode">',
  MODES.map(([v, l]) => `<option value="${v}">${l}</option>`).join(''),
  '</select></label>',
  '<button class="map-chip" type="button" id="mapReset">reset layout</button></div>',
].join('');
export const stageHTML = () => [
  '<div class="map-stage" id="mapStage">',
  '<canvas id="mapCanvas" aria-label="Architecture map of this site"></canvas>',
  '<div class="map-tip" id="mapTip" hidden></div>',
  '<div class="map-legends" id="mapLegends"></div>',
  '<div class="map-foot"><span id="mapFlow"></span>',
  '<span>drag a group header to move it · drag a row to reorder · double-click a header to reset · ',
  'scroll to zoom · drag the canvas to pan · esc to leave</span></div>',
  '</div>',
].join('');
// — Legend chrome —
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pill = (attr, key, label, tip) => {
  const body = `<span class="map-pill" data-tip="${esc(tip)}"><i ${attr}="${key}"></i>`;
  return `${body}${esc(label)}</span>`;
};
const lanePills = () => GROUPS.map((g) => {
  const tip = `${g.sub} · ${membersOf(g).length} modules`;
  return `<span class="map-pill" data-tip="${esc(tip)}"><i style="background:var(${g.tint})"></i>` +
    `${esc(g.label)}</span>`;
}).join('');
const kindPills = () => Object.entries(KINDS)
  .map(([k, v]) => pill('data-kind', k, v.label, v.tip)).join('');
const edgePills = () => Object.entries(EDGE_KINDS)
  .map(([k, v]) => pill('data-edge', k, v.label, v.tip)).join('');
const legRow = (label, pills) => `<div class="map-leg"><span class="map-leg-label">${label}</span>` +
  `${pills}</div>`;
const FLOW = '<strong>Flow:</strong> boot → theme → route → view mount → layout → reveal → fx · sound';
export function paintChrome(root, mode) {
  const ia = mode === 'ia';
  root.querySelector('#mapMeta').textContent = `${NODES.length} modules · ${EDGES.length} relations · ` +
    `${GROUPS.length} ${ia ? 'layers' : 'groups'}`;
  const rows = [legRow('modules', kindPills()), legRow('wires', edgePills()), legRow('lanes', lanePills())];
  root.querySelector('#mapLegends').innerHTML = rows.join('');
  const chain = GROUPS.map((g) => g.label.toLowerCase()).join(' → ');
  root.querySelector('#mapFlow').innerHTML = ia ? '<strong>IA:</strong> ' + chain : FLOW;
}
export function bindMode(root, onChange) {
  const sel = root.querySelector('#mapMode');
  sel.value = getMode();
  const onPick = () => {
    if (setMode(sel.value)) onChange(sel.value);
    else sel.value = getMode();
  };
  sel.addEventListener('change', onPick);
  return () => sel.removeEventListener('change', onPick);
}
