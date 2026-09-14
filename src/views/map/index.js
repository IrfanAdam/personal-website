/* ADAM/PAGE — views/map/index · fullscreen architecture map view + mount
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { GROUPS, NODES, EDGES, KINDS, EDGE_KINDS, layoutGroup } from './data.js';
import { createMap } from './canvas.js';
import { bindPointer } from './pointer.js';
import { clearRoutes } from './route.js';
import { resetTokens } from './paint.js';
// Exports: MapView, mountMap
const pill = (attr, key, label) => `<span class="map-pill"><i ${attr}="${key}"></i>${label}</span>`;
const legends = () => [
  '<div class="map-legends">',
  '<div class="map-leg"><span class="map-leg-label">modules</span>',
  Object.entries(KINDS).map(([k, v]) => pill('data-kind', k, v.label)).join(''),
  '</div>',
  '<div class="map-leg"><span class="map-leg-label">wires</span>',
  Object.entries(EDGE_KINDS).map(([k, v]) => pill('data-edge', k, v.label)).join(''),
  '</div></div>',
].join('');
export function MapView() {
  return [
    '<div class="map-view">',
    '<div class="map-bar"><a class="map-back" id="mapBack" href="#/masonry">← back to work</a>',
    '<span class="map-title">Architecture map</span>',
    `<span class="map-meta">${NODES.length} modules · ${EDGES.length} relations · `,
    `${GROUPS.length} groups</span>`,
    '<button class="map-chip" type="button" id="mapReset">reset layout</button></div>',
    '<div class="map-stage" id="mapStage">',
    '<canvas id="mapCanvas" aria-label="Architecture map of this site"></canvas>',
    '<div class="map-tip" id="mapTip" hidden></div>',
    legends(),
    '<div class="map-foot"><span><strong>Flow:</strong> boot → route → view → layout → reveal → fx · sound</span>',
    '<span>drag a group header to move it · drag a row to reorder · double-click a header to reset · ',
    'scroll to zoom · drag the canvas to pan · esc to leave</span></div>',
    '</div></div>',
  ].join('');
}
export function mountMap(root) {
  const canvas = root.querySelector('#mapCanvas');
  const tipEl = root.querySelector('#mapTip');
  const reset = root.querySelector('#mapReset');
  const back = root.querySelector('#mapBack');
  resetTokens();
  clearRoutes();
  const map = createMap(canvas, tipEl);
  const unbindPointer = bindPointer(canvas, map);
  const onReset = () => {
    GROUPS.forEach((g) => {
      g.x = g.base.x;
      g.y = g.base.y;
      layoutGroup(g);
    });
    clearRoutes();
    map.fit();
    map.draw();
  };
  const onResize = () => map.resize();
  const onKey = (e) => {
    if (e.key === 'Escape') location.hash = '#/masonry';
  };
  document.body.classList.add('map-open');
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
  reset.addEventListener('click', onReset);
  map.resize();
  back.focus();
  return () => {
    unbindPointer();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    reset.removeEventListener('click', onReset);
    document.body.classList.remove('map-open');
  };
}
