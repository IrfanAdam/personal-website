/* ADAM/DS — ds/atlas/view · paint + emphasis + readout for the atlas shell
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { paint, emphasis } from './canvas.js';
import { fit, scaleOf } from './camera.js';
import { overlayOf } from './insight.js';
// Exports: makeView
export function makeView(deps) {
  const { svg, cam, state, ins, graph, zoomEl, countEl } = deps;
  const mark = () => {
    const focus = state.hover || ins.focus;
    const deep = !!ins.focus && !state.hover;
    const view = { focus, sel: state.sel, deep, ...overlayOf(ins) };
    emphasis(svg, view, graph().edges);
  };
  const readout = () => {
    const { list, edges } = graph();
    zoomEl.textContent = `${Math.round(scaleOf(cam) * 100)}%`;
    countEl.textContent = `${list.length} nodes · ${edges.length} edges`;
  };
  const draw = () => {
    const { list, edges } = graph();
    paint(svg, list, { mode: state.mode, sel: state.sel, edges });
    mark();
    readout();
  };
  const refit = () => {
    fit(svg, graph().list, state.mode, cam);
    readout();
  };
  return { mark, draw, refit, readout };
}
