/* ADAM/DS — Foundations composer: color · type · space · shape · motion · fx · tokens.
   Single route; definitions live on vertical tabs. Demos run on var(). */
// Exports: render, mount — panes + mixer/sync/handlers stitching
import { cssVar,
  contrastRatio as ratio,
  verdictRatio as verdict,
  probeTheme,
  refreshLive } from './specimens.js';
import { makeMix } from './foundations-mix.js';
import { makeHandlers } from './foundations-handlers.js';
import { tabs } from './tabs.js';
import { label as cL, html as cH } from './foundations/pane-color.js';
import { label as tL, html as tH } from './foundations/pane-type.js';
import { label as sL, html as sH } from './foundations/pane-space.js';
import { label as hL, html as hH } from './foundations/pane-shape.js';
import { label as mL, html as mH } from './foundations/pane-motion.js';
import { label as fL, html as fH } from './foundations/pane-fx.js';
import { label as kL, html as kH } from './foundations/pane-contract.js';
import { label as oL, html as oH } from './foundations/pane-sound.js';
import { mountSoundBoard } from './foundations/sound/board.js';
export function render() {
  const panes = [{ label: cL, html: cH() },
    { label: tL, html: tH() },
    { label: sL, html: sH() },
    { label: hL, html: hH() },
    { label: mL, html: mH() },
    { label: fL, html: fH() },
    { label: oL, html: oH() },
    { label: kL, html: kH() }];
  return [
    `<p class="ds-crumb">Foundations · Tokens</p><div class="ds-hero"><h1>Material, before meaning.</h1>`,
    `<p class="lede">Eight definitions feed every token. Swatches and values read live computed <span `,
    `class="tok">var()</span> — click any card to copy.</p></div>`,
  ].join('') + tabs({ vertical: true, panes });
}
export function mount(root) {
  const sw = root.querySelector('#mixSw'), ctrls = root.querySelector('#mixCtrls'), val = root.querySelector('#mixVal');
  const aSel = ctrls && ctrls.querySelector('[data-mix="a"]'),
    bSel = ctrls && ctrls.querySelector('[data-mix="b"]'),
    tIn = ctrls && ctrls.querySelector('[data-mix="t"]'),
    tOut = ctrls && ctrls.querySelector('[data-mix-v="t"]');
  const typeSample = root.querySelector('#typeSample'), typeCtrls = root.querySelector('#typeCtrls');
  const stage = root.querySelector('#easeStage'),
    easeCtrls = root.querySelector('#easeCtrls'),
    dot = stage && stage.querySelector('.fd-dot');
  const shimmer = root.querySelector('#fxShimmer'), rise = root.querySelector('#fxRise');
  const { refreshMix } = makeMix({ sw, aSel, bSel, tIn, tOut, val });
  const fillPairs = () => {
    const rows = [...root.querySelectorAll('tr[data-bg]')]; if (!rows.length) return;
    const toks = [...new Set(rows.flatMap((r) => [r.dataset.bg, r.dataset.fg]))];
    const probe = (th) => probeTheme(th, () => Object.fromEntries(toks.map((t) => [t, cssVar(t) || '#808080'])));
    const v = { light: probe('light'), dark: probe('dark') };
    rows.forEach((r) => ['light', 'dark'].forEach((th) => {
      const cell = r.querySelector(`[data-c="${th}"]`); if (!cell) return;
      const bg = v[th][r.dataset.bg], fg = v[th][r.dataset.fg];
      const rt = ratio(bg, fg), vd = verdict(rt);
      const d = cell.querySelector('[data-demo]'), b = cell.querySelector('[data-aa]');
      if (d) { d.style.background = bg; d.style.color = fg; }
      if (b) { b.textContent = `${rt} · ${vd}`; b.dataset.v = vd; }
    }));
  };
  const onMix = () => refreshMix();
  const { onCopyVar, onType, onEase, onFx } = makeHandlers({ sw, typeSample, stage, dot, shimmer, rise });
  if (ctrls) { ctrls.addEventListener('input', onMix); ctrls.addEventListener('click', onCopyVar); }
  let syncing = false;
  const sync = () => { if (syncing) return;
    syncing = true;
    fillPairs();
    refreshMix();
    refreshLive();
    syncing = false;
  };
  sync();
  const obs = new MutationObserver(sync);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
  root.__foundObs = obs;
  if (typeCtrls) typeCtrls.addEventListener('change', onType);
  if (easeCtrls) easeCtrls.addEventListener('click', onEase), easeCtrls.addEventListener('change', onEase);
  root.addEventListener('click', onFx);
  const offSound = mountSoundBoard(root);
  return () => {
    if (ctrls) { ctrls.removeEventListener('input', onMix); ctrls.removeEventListener('click', onCopyVar); }
    if (typeCtrls) typeCtrls.removeEventListener('change', onType);
    if (easeCtrls) { easeCtrls.removeEventListener('click', onEase); easeCtrls.removeEventListener('change', onEase); }
    root.removeEventListener('click', onFx);
    try { offSound && offSound(); } catch {}
    obs.disconnect();
  };
}
