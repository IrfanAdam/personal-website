/* ADAM/DS — ds/atlas/actions · find/focus/path commands + pointer/key wiring
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { lookup } from './schema.js';
import { centerOn } from './camera.js';
import { bindFind } from './search.js';
import { setFind, hitAt, pickNode, clearOverlay } from './insight.js';
// Exports: makeActions
export function makeActions(ctx) {
  const { root, svg, cam, state, ins, tip, view, graph } = ctx;
  const jump = (node) => {
    if (!node) return;
    state.sel = node.id;
    centerOn(svg, cam, graph().list, state.mode, node.id);
    const r = svg.getBoundingClientRect();
    tip.pin(node, r.left + r.width / 2, r.top + r.height / 4, null);
    view.mark();
    view.readout();
  };
  const onFind = (matches, commit) => {
    setFind(ins, matches);
    view.draw();
    if (commit) jump(hitAt(matches, state.sel));
  };
  const find = bindFind(root, onFind);
  const clearSel = () => {
    state.sel = null;
    clearOverlay(ins);
    tip.unpin();
    view.draw();
  };
  const resetFind = () => {
    find.clear();
    setFind(ins, []);
    view.draw();
  };
  const resetAll = () => {
    clearSel();
    resetFind();
  };
  const apply = () => {
    clearSel();
    view.refit();
  };
  const onHover = (id, ev) => {
    state.hover = id;
    view.mark();
    if (id && ev) tip.follow(lookup(id), ev.clientX, ev.clientY);
    else if (!id) tip.hide();
  };
  const onPick = (id, ev) => {
    if (!id) {
      clearSel();
      return;
    }
    pickNode(ins, id, !!(ev && ev.shiftKey), state.sel);
    state.sel = id;
    tip.pin(lookup(id), ev.clientX, ev.clientY, ins.path);
    view.mark();
  };
  const onKey = (e) => {
    if (e.key !== 'Escape') return;
    if (ins.hits) resetFind();
    else if (state.sel || ins.focus || ins.path) clearSel();
  };
  const onTipClick = (e) => {
    if (e.target.closest('[data-close]')) resetAll();
  };
  return { find, jump, onFind, clearSel, resetFind, apply, onHover, onPick, onKey, onTipClick };
}
