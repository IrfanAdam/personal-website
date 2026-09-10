/* ADAM/DS — Foundations: color · type · space · shape · motion · fx · tokens.
   Single route; definitions live on vertical tabs. Demos run on var(). */
import { cssVar, toRGB, contrastRatio as ratio, verdictRatio as verdict, probeTheme, refreshLive } from './specimens.js';
import { tabs } from './tabs.js';
import { label as cL, html as cH } from './foundations/pane-color.js';
import { label as tL, html as tH } from './foundations/pane-type.js';
import { label as sL, html as sH } from './foundations/pane-space.js';
import { label as hL, html as hH } from './foundations/pane-shape.js';
import { label as mL, html as mH } from './foundations/pane-motion.js';
import { label as fL, html as fH } from './foundations/pane-fx.js';
import { label as kL, html as kH } from './foundations/pane-contract.js';
const INKS = ['--color-ink', '--color-ink-muted', '--color-ink-subtle', '--color-on-accent', '--color-on-media', '--color-overlay-muted'];
const CANVASES = ['--color-bg', '--color-surface', '--color-surface-sunken', '--color-overlay', '--color-accent', '--color-chip'];
const FEEDBACK = [['--color-success', '--color-bg'], ['--color-success', '--color-surface'], ['--color-on-success', '--color-success'], ['--color-error', '--color-bg'], ['--color-error', '--color-surface'], ['--color-on-error', '--color-error'], ['--color-warning', '--color-bg'], ['--color-warning', '--color-surface'], ['--color-on-warning', '--color-warning'], ['--color-info', '--color-bg'], ['--color-info', '--color-surface'], ['--color-on-info', '--color-info']];
const inkShort = (t) => t.replace('--color-', '');
/* Full AA matrix (Update 4 Task 6): every text ink × canvas, both themes.
   Token values are batched per theme inside one probeTheme flip (12 reads),
   then ratios compute pure — no per-cell style recalc. */
const contrastRows = () => ['light', 'dark'].map((theme) => {
  const v = probeTheme(theme, () => Object.fromEntries([...INKS, ...CANVASES].map((t) => [t, cssVar(t) || t])));
  return `<tr><td colspan="4"><b>${theme}</b> — live probe</td></tr>`
  + INKS.map((a) => CANVASES.map((b) => { const r = ratio(v[a], v[b]); return `<tr><td>${inkShort(a)} on ${inkShort(b)}</td><td><span class="tok">${a}</span> on <span class="tok">${b}</span></td><td>${r} : 1</td><td>${verdict(r)}</td></tr>`; }).join('')).join('');
}).join('');
/* Feedback proof (Update 4 Task 7): each role as text on paper/surface
   plus its on-color on the role fill — live probe, both themes. */
const feedbackRows = () => ['light', 'dark'].map((theme) => {
  const toks = [...new Set(FEEDBACK.flat())];
  const v = probeTheme(theme, () => Object.fromEntries(toks.map((t) => [t, cssVar(t) || t])));
  return `<tr><td colspan="4"><b>${theme}</b> — live probe</td></tr>`
  + FEEDBACK.map(([a, b]) => { const r = ratio(v[a], v[b]); return `<tr><td>${inkShort(a)} on ${inkShort(b)}</td><td><span class="tok">${a}</span> on <span class="tok">${b}</span></td><td>${r} : 1</td><td>${verdict(r)}</td></tr>`; }).join('');
}).join('');
export function render() {
  const panes = [{ label: cL, html: cH() }, { label: tL, html: tH() }, { label: sL, html: sH() }, { label: hL, html: hH() }, { label: mL, html: mH() }, { label: fL, html: fH() }, { label: kL, html: kH() }];
  return `<p class="ds-crumb">Foundations · Tokens</p><div class="ds-hero"><h1>Material, before meaning.</h1><p class="lede">Seven definitions feed every token. Swatches and values read live computed <span class="tok">var()</span> — click any card to copy.</p></div>` + tabs({ vertical: true, panes });
}
export function mount(root) {
  const sw = root.querySelector('#mixSw'), ctrls = root.querySelector('#mixCtrls'), val = root.querySelector('#mixVal'), body = root.querySelector('#contrastBody'), fb = root.querySelector('#feedbackBody');
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
  const refreshContrast = () => { if (body) body.innerHTML = contrastRows(); if (fb) fb.innerHTML = feedbackRows(); refreshLive(); };
  const signalCtrls = root.querySelector('#signalCtrls'), signalSw = root.querySelector('#signalSw'), signalVal = root.querySelector('#signalVal');
  const SIGNAL = { vermilion: 'var(--accent-500)', amber: 'var(--accent2-600)', teal: 'var(--accent3-500)' };
  const refreshSignal = () => { if (!signalVal) return; const cur = getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() || cssVar('--signal') || 'var(--accent-500)'; const hex = cssVar('--color-accent') || cssVar('--signal'); signalVal.textContent = `--signal ${cur} → --color-accent ${hex}`; if (signalSw) signalSw.style.background = 'var(--color-accent)'; if (signalCtrls) { const k = cur.includes('accent2') ? 'amber' : cur.includes('accent3') ? 'teal' : 'vermilion'; signalCtrls.querySelectorAll('[data-signal]').forEach((x) => x.classList.toggle('on', x.dataset.signal === k)); } refreshLive(); };
  const onSignal = (e) => { const b = e.target.closest('[data-signal]'); if (!b || !signalCtrls) return; const k = b.dataset.signal; const v = SIGNAL[k]; if (!v) return; document.documentElement.style.setProperty('--signal', v); signalCtrls.querySelectorAll('[data-signal]').forEach((x) => x.classList.toggle('on', x === b)); refreshSignal(); refreshContrast(); };
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
  if (signalCtrls) { signalCtrls.addEventListener('click', onSignal); refreshSignal(); }
  if (body) { refreshContrast(); const obs = new MutationObserver(refreshContrast); obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); root.__foundObs = obs; } else {
    const liveObs = new MutationObserver(refreshLive); liveObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); root.__liveObs = liveObs;
  }
  if (typeCtrls) typeCtrls.addEventListener('change', onType);
  if (easeCtrls) easeCtrls.addEventListener('click', onEase), easeCtrls.addEventListener('change', onEase);
  root.addEventListener('click', onFx);
  return () => {
    if (ctrls) { ctrls.removeEventListener('input', onMix); ctrls.removeEventListener('click', onCopyVar); }
    if (signalCtrls) signalCtrls.removeEventListener('click', onSignal);
    if (typeCtrls) typeCtrls.removeEventListener('change', onType);
    if (easeCtrls) { easeCtrls.removeEventListener('click', onEase); easeCtrls.removeEventListener('change', onEase); }
    root.removeEventListener('click', onFx);
    if (root.__foundObs) root.__foundObs.disconnect();
    if (root.__liveObs) root.__liveObs.disconnect();
  };
}
