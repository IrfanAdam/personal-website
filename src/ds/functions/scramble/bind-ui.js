/* ADAM/DS — scramble/bind-ui · secondary controls · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountUi — rtl/tween/sound/hover/align/tabs/stage wiring

// — Bind —
export function mountUi(ctx) {
  const offs = [];
  const on = (el, ev, fn) => {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  };
  const onRtl = () => {
    ctx.rtl = !ctx.rtl;
    ctx.rtlBtn.classList.toggle('on', ctx.rtl);
    ctx.rtlBtn.textContent = ctx.rtl ? 'right → left' : 'left → right';
    ctx.doScramble();
  };
  const onTween = () => {
    ctx.tween = !ctx.tween;
    ctx.tweenBtn.classList.toggle('on', ctx.tween);
    ctx.tweenBtn.textContent = ctx.tween ? 'tweenLength: on' : 'tweenLength: off';
    ctx.doScramble();
  };
  const onSound = () => {
    ctx.soundOn = !ctx.soundOn;
    ctx.soundBtn.classList.toggle('on', ctx.soundOn);
    ctx.soundBtn.textContent = ctx.soundOn ? 'sound: on' : 'sound: off';
  };
  const onHover = () => {
    ctx.hoverOn = !ctx.hoverOn;
    ctx.hoverBtn.classList.toggle('on', ctx.hoverOn);
    ctx.hoverBtn.textContent = ctx.hoverOn ? 'hover: on' : 'hover: off';
  };
  const onStageEnter = () => {
    if (ctx.hoverOn) ctx.doScramble();
  };
  const onAlign = (e) => {
    const b = e.target.closest('[data-scramble-align]');
    if (!b) return;
    ctx.alignBtns.forEach((x) => x.classList.toggle('on', x === b));
    ctx.preview.style.textAlign = b.dataset.scrambleAlign || 'center';
  };
  const onTabs = (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b || !ctx.tabBar) return;
    ctx.tabBar.querySelectorAll('[data-tab]').forEach((x) => x.classList.toggle('on', x === b));
    ctx.root.querySelectorAll('[data-tab-panel]').forEach((pn) => {
      pn.hidden = pn.dataset.tabPanel !== b.dataset.tab;
    });
  };
  on(ctx.rtlBtn, 'click', onRtl);
  on(ctx.tweenBtn, 'click', onTween);
  on(ctx.soundBtn, 'click', onSound);
  on(ctx.hoverBtn, 'click', onHover);
  on(ctx.alignGroup, 'click', onAlign);
  on(ctx.fontSel, 'change', () => { ctx.applyFont(); ctx.doScramble(); });
  on(ctx.stage, 'pointerenter', onStageEnter);
  on(ctx.tabBar, 'click', onTabs);
  return () => offs.forEach((fn) => { try { fn(); } catch {} });
}
