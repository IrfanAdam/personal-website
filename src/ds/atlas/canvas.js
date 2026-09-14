/* ADAM/DS — ds/atlas/canvas · svg nodes + edges + pan/zoom + pick
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-3] */
import { position, BOX, COLX, colLabel } from './layout.js';
// Exports: paint, bind
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const dot = (n, p, sel) => [
  `<g class="atlas-node" data-layer="${n.layer}" data-node="${n.id}"`,
  ` transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})" tabindex="0" role="button"`,
  ` aria-label="${esc(n.title)}"${sel === n.id ? ' data-sel="1"' : ''}>`,
  `<title>${esc(n.title)} · ${esc(n.path)}</title><circle r="7"></circle>`,
  `<text class="atlas-label" x="12" y="4">${esc(n.title)}</text></g>`,
].join('');
const head = (on, list) => [...on].map((layer) => {
  const c = list.filter((n) => n.layer === layer).length;
  return `<text class="atlas-col" x="${COLX[layer]}" y="18">${colLabel(layer)} · ${c}</text>`;
}).join('');
const wire = (e, pos) => {
  const a = pos.get(e.from);
  const b = pos.get(e.to);
  if (!a || !b) return '';
  const at = `x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"`;
  const tip = `<title>${e.kind}</title>`;
  return `<line class="atlas-wire" data-kind="${e.kind}" ${at}>${tip}</line>`;
};
export function paint(svg, list, mode, sel, edges) {
  const pos = position(list, mode);
  const on = [...new Set(list.map((n) => n.layer))];
  const cols = mode === 'layered' ? head(on, list) : '';
  const wires = (edges || []).map((e) => wire(e, pos)).join('');
  const dots = list.map((n) => dot(n, pos.get(n.id), sel)).join('');
  svg.innerHTML = [cols, `<g class="atlas-wires">${wires}</g>`, dots].join('');
}
const applyCam = (svg, cam) => svg.setAttribute('viewBox', `${cam.x} ${cam.y} ${cam.w} ${cam.h}`);
export function bind(svg, cam, onPick) {
  applyCam(svg, cam);
  let drag = null;
  let moved = 0;
  const down = (e) => { drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; moved = 0; };
  const move = (e) => {
    if (!drag) return;
    moved += Math.abs(e.movementX) + Math.abs(e.movementY);
    const k = cam.w / svg.clientWidth;
    cam.x = drag.cx - (e.clientX - drag.x) * k;
    cam.y = drag.cy - (e.clientY - drag.y) * k;
    applyCam(svg, cam);
  };
  const up = () => { drag = null; };
  const wheel = (e) => {
    e.preventDefault();
    const f = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    const w = Math.min(BOX.w / 0.4, Math.max(BOX.w / 2.5, cam.w * f));
    const k = w / cam.w;
    cam.x += (cam.w - w) / 2;
    cam.y += (cam.h - cam.h * k) / 2;
    cam.w = w;
    cam.h = cam.h * k;
    applyCam(svg, cam);
  };
  const click = (e) => {
    const g = e.target.closest('[data-node]');
    if (g && moved < 6) onPick(g.dataset.node);
  };
  svg.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  svg.addEventListener('wheel', wheel, { passive: false });
  svg.addEventListener('click', click);
  return () => {
    svg.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    svg.removeEventListener('wheel', wheel);
    svg.removeEventListener('click', click);
  };
}
