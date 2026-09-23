/* ADAM/DS — fx-lab/pane-visible · deferred start on unhide ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-8] */
// Exports: watchPaneVisible — run start now when visible, else on first unhide
// — Watch —
export function watchPaneVisible(el, start) {
  const pane = el.closest('[data-pane]');
  const hidden = () => !!pane && pane.hasAttribute('hidden');
  if (!pane || !hidden()) {
    start();
    return () => {};
  }
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    start();
  };
  const stop = () => {
    clearInterval(chk);
    clearTimeout(kill);
    try { mo.disconnect(); } catch {}
  };
  const mo = new MutationObserver(() => {
    if (!hidden()) {
      stop();
      fire();
    }
  });
  const chk = setInterval(() => {
    if (!hidden()) {
      stop();
      fire();
    }
  }, 500);
  const kill = setTimeout(stop, 6000);
  mo.observe(pane, { attributes: true, attributeFilter: ['hidden'] });
  return stop;
}
