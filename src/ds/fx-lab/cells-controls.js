/* ADAM/DS — fx-lab/cells-controls · mosaic lab knobs + buttons ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-8] */
// Exports: bindControls — outputs + knob/button wiring, returns { show, off }
import { tok } from './color.js';

// — Controls —
export function bindControls(scope, P, hooks) {
  const ctl = scope.querySelector('[data-fx-cells]');
  const outs = {};
  if (ctl) ctl.querySelectorAll('[data-v]').forEach((o) => { outs[o.dataset.v] = o; });
  const show = () => {
    if (outs.count) outs.count.textContent = P.count;
    if (outs.morph) outs.morph.textContent = P.morph.toFixed(2);
    if (outs.gut) outs.gut.textContent = (P.gut % 1 ? P.gut.toFixed(1) : P.gut) + 'px';
    if (outs.span) outs.span.textContent = P.span.toFixed(1) + 's';
    if (outs.order) outs.order.textContent = P.order;
    if (outs.image) outs.image.textContent = P.image;
    if (outs.sound) outs.sound.textContent = P.sound;
  };
  const onCtl = (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    const v = e.target.value;
    if (k === 'count') {
      P.count = +v;
      hooks.rebuild();
    } else if (k === 'morph') {
      P.morph = (+v) / 100;
      tok('--fx-morph', String(P.morph));
    } else if (k === 'gut') P.gut = +v;
    else if (k === 'span') {
      P.span = (+v) / 10;
      tok('--dur-fx-span', P.span.toFixed(1) + 's');
    } else if (k === 'order') {
      P.order = v;
      hooks.rebuild();
    } else if (k === 'sound') P.sound = v;
    else if (k === 'image') {
      P.image = v;
      hooks.loadImage(v);
      show();
      return;
    }
    show();
    hooks.draw();
  };
  const replayBtn = scope.querySelector('[data-fx-replay]');
  const shuffleBtn = scope.querySelector('[data-fx-shuffle]');
  const onReplay = () => hooks.replay();
  const onShuffle = () => {
    hooks.rebuild();
    hooks.replay();
  };
  if (ctl) {
    ctl.addEventListener('input', onCtl);
    ctl.addEventListener('change', onCtl);
  }
  if (replayBtn) replayBtn.addEventListener('click', onReplay);
  if (shuffleBtn) shuffleBtn.addEventListener('click', onShuffle);
  show();
  const off = () => {
    if (ctl) {
      ctl.removeEventListener('input', onCtl);
      ctl.removeEventListener('change', onCtl);
    }
    if (replayBtn) replayBtn.removeEventListener('click', onReplay);
    if (shuffleBtn) shuffleBtn.removeEventListener('click', onShuffle);
  };
  return { show, off };
}
