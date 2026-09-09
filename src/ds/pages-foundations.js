/* ADAM/DS — Foundations: color · type · space · shape · motion · fx · tokens.
   Single route; definitions live on vertical tabs. Demos run on var(). */
import { cssVar, toRGB, contrastRatio as ratio, verdictRatio as verdict } from './specimens.js';
import { tabs } from './tabs.js';
import { label as cL, html as cH } from './foundations/pane-color.js';
import { label as tL, html as tH } from './foundations/pane-type.js';
import { label as sL, html as sH } from './foundations/pane-space.js';
import { label as hL, html as hH } from './foundations/pane-shape.js';
import { label as mL, html as mH } from './foundations/pane-motion.js';
import { label as fL, html as fH } from './foundations/pane-fx.js';
import { label as kL, html as kH } from './foundations/pane-contract.js';
const PAIRS = [['Ink on paper', '--color-ink', '--color-bg'], ['Muted on paper', '--color-ink-muted', '--color-bg'], ['On-media on chip', '--color-on-media', '--color-chip'], ['Accent on paper', '--color-accent', '--color-bg']];
const contrastRows = () => PAIRS.map(([label, a, b]) => `<tr><td>${label}</td><td><span class="tok">${a}</span> on <span class="tok">${b}</span></td><td>${ratio(cssVar(a) || a, cssVar(b) || b)} : 1</td><td>${verdict(ratio(cssVar(a) || a, cssVar(b) || b))}</td></tr>`).join('');
export function render() {
  const panes = [{ label: cL, html: cH() }, { label: tL, html: tH() }, { label: sL, html: sH() }, { label: hL, html: hH() }, { label: mL, html: mH() }, { label: fL, html: fH() }, { label: kL, html: kH() }];
  return `<p class="ds-crumb">Foundations · Tokens</p><div class="ds-hero"><h1>Material, before meaning.</h1><p class="lede">Seven definitions feed every token. Swatches and values read live computed <span class="tok">var()</span> — click any card to copy.</p></div>` + tabs({ vertical: true, panes });
}
export function mount(root) {
  const sw = root.querySelector('#mixSw'), ctrls = root.querySelector('#mixCtrls'), val = root.querySelector('#mixVal'), body = root.querySelector('#contrastBody');
  const aSel = ctrls && ctrls.querySelector('[data-mix="a"]'), bSel = ctrls && ctrls.querySelector('[data-mix="b"]'), tIn = ctrls && ctrls.querySelector('[data-mix="t"]'), tOut = ctrls && ctrls.querySelector('[data-mix-v="t"]');
  const typeSample = root.querySelector('#typeSample'), typeCtrls = root.querySelector('#typeCtrls');
  const stage = root.querySelector('#easeStage'), easeCtrls = root.querySelector('#easeCtrls'), dot = stage && stage.querySelector('.fd-dot');
  const shimmer = root.querySelector('#fxShimmer'), rise = root.querySelector('#fxRise');
  const refreshMix = () => {
    if (!sw || !aSel || !bSel || !tIn) return;
    const t = Number(tIn.value) / 100; if (tOut) tOut.textContent = t.toFixed(2);
    const mc = [0, 1, 2].map((i) => toRGB(cssVar(aSel.value) || '#16130e')[i] * (1 - t) + toRGB(cssVar(bSel.value) || '#e8442e')[i] * t);
    const hex = '#' + mc.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    sw.style.background = hex; if (val) val.textContent = `${aSel.value} ↔ ${bSel.value} @ ${t.toFixed(2)} → ${hex} · var mix`;
    sw.dataset.hex = hex; sw.dataset.var = `color-mix(in srgb, var(${aSel.value}) ${Math.round((1 - t) * 100)}%, var(${bSel.value}))`;
  };
  const refreshContrast = () => { if (body) body.innerHTML = contrastRows(); };
  const onMix = () => refreshMix();
  const onCopyVar = (e) => { const b = e.target.closest('[data-mix-copy]'); if (!b || !sw) return; const k = b.dataset.mixCopy === 'hex' ? sw.dataset.hex : sw.dataset.var; if (k) navigator.clipboard.writeText(k).catch(() => {}); };
  const onType = (e) => { const s = e.target; if (!s.dataset.type || !typeSample) return; if (s.dataset.type === 'size') typeSample.style.fontSize = s.value; if (s.dataset.type === 'leading') typeSample.style.lineHeight = s.value; if (s.dataset.type === 'tracking') typeSample.style.letterSpacing = s.value; };
  const onEase = (e) => {
    if (e.target.closest('[data-ease-replay]')) { if (!stage) return; stage.classList.remove('go'); void stage.offsetWidth; stage.classList.add('go'); return; }
    const s = e.target.closest('[data-ease]'); if (!s || !dot) return;
    if (s.dataset.ease === 'd') dot.style.setProperty('--fd-d', s.value);
    if (s.dataset.ease === 'e') dot.style.setProperty('--fd-e', s.value);
  };
  const onFx = (e) => {
    if (e.target.closest('[data-shimmer-toggle]') && shimmer) shimmer.classList.toggle('off');
    if (e.target.closest('[data-rise-replay]') && rise) { rise.classList.add('rest'); void rise.offsetWidth; requestAnimationFrame(() => rise.classList.remove('rest')); }
  };
  if (ctrls) { ctrls.addEventListener('input', onMix); ctrls.addEventListener('click', onCopyVar); refreshMix(); }
  if (body) { refreshContrast(); const obs = new MutationObserver(refreshContrast); obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); root.__foundObs = obs; }
  if (typeCtrls) typeCtrls.addEventListener('change', onType);
  if (easeCtrls) easeCtrls.addEventListener('click', onEase), easeCtrls.addEventListener('change', onEase);
  root.addEventListener('click', onFx);
  return () => {
    if (ctrls) { ctrls.removeEventListener('input', onMix); ctrls.removeEventListener('click', onCopyVar); }
    if (typeCtrls) typeCtrls.removeEventListener('change', onType);
    if (easeCtrls) { easeCtrls.removeEventListener('click', onEase); easeCtrls.removeEventListener('change', onEase); }
    root.removeEventListener('click', onFx);
    if (root.__foundObs) root.__foundObs.disconnect();
  };
}
