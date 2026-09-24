/* ADAM/DS — ds/component · composer · [plan:2026-09-24_160000-primitives-complete.md#phase-2] */
// Exports: component, mountComponent — sheet chrome
// — Helpers · Component · Mount —

import { tabs } from './tabs.js';
import { copy } from './specimens.js';
import { knobsHTML as knobControls } from './component/knobs.js';

const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const reg = (window.__compReg = window.__compReg || {});

// — Component —
export function component(o) {
  const id = 'comp-' + Math.random().toString(36).slice(2, 6);
  reg[id] = { knobs: o.knobs, render: o.render, code: o.code };
  const init = Object.fromEntries(o.knobs.map((k) => [k.key, k.default]));
  const knobsHTML = knobControls(o.knobs, id);
  const tokHTML = o.tokens.length
    ? ['<div class="fx-btns" style="margin-top:var(--space-10)">',
      o.tokens.map((t) => `<button class="tok" data-copy="${t}">${t}</button>`).join(''),
      '</div>'].join('') : '';
  const previewHTML = [
    '<div class="ds-spec block"><div data-comp-preview="',
    id,
    '">',
    o.render(init),
    '</div></div>',
  ].join('');
  const liveNote = '<p class="sub" style="margin-top:var(--space-8)">'
    + 'Tap token to copy — live <span class="tok">var()</span>.</p>';
  const codeHTML = ['<div class="ds-code" data-comp-code="', id, '"><pre>', esc(o.code(init)),
    '</pre></div><div class="fx-btns"><button class="pill" data-comp-copy="', id, '">copy code</button></div>',
    tokHTML, tokHTML ? liveNote : ''].join('');
  const tabsHTML = tabs({
    variant: 'line',
    panes: [
      { label: 'Preview', html: previewHTML },
      { label: 'Code', html: codeHTML },
    ],
  });
  const specHTML = [
    o.anatomy ? `<p class="sub" style="margin-top:var(--space-12)"><span class="tok">What</span> ${o.anatomy}</p>` : '',
    o.behaviour ? `<p class="sub"><span class="tok">Use</span> ${o.behaviour}</p>` : '',
  ].join('');
  return ['<div class="ds-sec" data-comp-root="', id, '"><h2>', o.title, '</h2>',
    o.sub ? `<p class="sub">${o.sub}</p>` : '',
    tabsHTML,
    specHTML,
    '<div class="fx-controls" data-comp-ctrl="', id, '">', knobsHTML, '</div></div>'].join('');
}

// — Mount —
export function mountComponent(root) {
  const offs = [];
  root.querySelectorAll('[data-comp-root]').forEach((sec) => {
    const id = sec.getAttribute('data-comp-root');
    const cfg = reg[id];
    if (!cfg) return;
    const preview = sec.querySelector(`[data-comp-preview="${id}"]`);
    const codeEl = sec.querySelector(`[data-comp-code="${id}"] pre`);
    const ctrls = sec.querySelector(`[data-comp-ctrl="${id}"]`);
    if (!preview || !ctrls) return;
    const outs = {};
    ctrls.querySelectorAll('[data-v]').forEach((o) => outs[o.dataset.v] = o);
    const state = Object.fromEntries(cfg.knobs.map((k) => [k.key, k.default]));
    const refresh = () => {
      preview.innerHTML = cfg.render(state);
      if (codeEl) codeEl.textContent = cfg.code(state);
      Object.entries(outs).forEach(([k, el]) => {
        const kn = cfg.knobs.find((x) => x.key === k);
        const v = state[k];
        let out = String(v) + (kn && kn.unit || '');
        if (typeof v === 'boolean') out = v ? 'on' : 'off';
        el.textContent = out;
      });
    };
    const onInput = (e) => {
      const k = e.target.dataset.k;
      if (!k || e.target.dataset.comp !== id) return;
      const kn = cfg.knobs.find((x) => x.key === k);
      let v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (kn && kn.type === 'range') v = Number(v);
      state[k] = v;
      refresh();
    };
    const btn = sec.querySelector(`[data-comp-copy="${id}"]`);
    const onCopy = () => copy(cfg.code(state), btn);
    ctrls.addEventListener('input', onInput);
    ctrls.addEventListener('change', onInput);
    if (btn) btn.addEventListener('click', onCopy);
    offs.push(() => {
      ctrls.removeEventListener('input', onInput);
      ctrls.removeEventListener('change', onInput);
      if (btn) btn.removeEventListener('click', onCopy);
    });
  });
  return () => offs.forEach((fn) => fn());
}
