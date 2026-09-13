/* ADAM/DS — src/ds/functions/glitch/source-panel.js · source picker markup + binding ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: renderSourcePanel, mountSourcePanel
import { getSource, setSource, resetSources } from '../../../views/sound-source.js';
import { playFileId, playVoice } from '../../../views/element-sound.js';
import { buildFileOpts, buildKindOpts, buildVoiceOpts } from './meta.js';

// — Markup —
export function renderSourcePanel() {
  const ls = getSource('load');
  const gs = getSource('glitch');
  const status = [
    `load: `,
    ls.kind,
    ` `,
    ls.kind === 'file' ? ls.file : ls.voice,
    ` · glitch: `,
    gs.kind,
    ` `,
    gs.kind === 'file' ? gs.file : gs.voice,
  ].join('');
  let html = `<div class="fx-panel" data-src><h3>Source — kind first</h3>`;
  html += [
    `<p class="sub">Pick <span class="tok">procedural</span> or <span class="tok">file</span> per slot; the `,
    `attached sound follows. Files vendored from web-sounds, starting with load.</p>`,
  ].join('');
  html += `<label class="fx-row">load kind <select data-src="load-kind">${buildKindOpts(ls.kind)}</select></label>`;
  html += `<label class="fx-row">load voice <select data-src="load-voice">${buildVoiceOpts(ls.voice)}</select></label>`;
  html += `<label class="fx-row">load file <select data-src="load-file">${buildFileOpts(ls.file)}</select></label>`;
  html += `<div class="fx-btns"><button class="pill" data-src="load-prev">▶ preview load</button></div>`;
  html += `<label class="fx-row">glitch kind <select data-src="glitch-kind">${buildKindOpts(gs.kind)}</select></label>`;
  html += [
    `<label class="fx-row">glitch voice <select data-src="glitch-voice">`,
    buildVoiceOpts(gs.voice),
    `</select></label>`,
  ].join('');
  html += `<label class="fx-row">glitch file <select data-src="glitch-file">${buildFileOpts(gs.file)}</select></label>`;
  html += `<div class="fx-btns"><button class="pill" data-src="glitch-prev">▶ preview glitch</button></div>`;
  html += `<p class="fx-status" data-src-status>${status}</p>`;
  html += `<div class="fx-btns"><button class="pill" data-src="reset-picks">reset saved picks</button></div></div>`;
  return html;
}

// — Bind —
export function mountSourcePanel(root) {
  const srcStatus = root.querySelector('[data-src-status]');
  const sel = (n) => root.querySelector(`[data-src="${n}"]`);
  const offs = [];
  function on(el, ev, fn) {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  }
  function saySrc() {
    const l = getSource('load');
    const g = getSource('glitch');
    if (srcStatus) srcStatus.textContent = [
      `load: `,
      l.kind,
      ` `,
      l.kind === 'file' ? l.file : l.voice,
      ` · glitch: `,
      g.kind,
      ` `,
      g.kind === 'file' ? g.file : g.voice,
    ].join('');
    const pairs = [['load-voice', l.kind === 'file'],
      ['load-file', l.kind !== 'file'],
      ['glitch-voice', g.kind === 'file'],
      ['glitch-file', g.kind !== 'file']];
    pairs.forEach(([id, dis]) => {
      const el = sel(id);
      if (el) el.disabled = dis;
    });
  }
  function bind(el, slot, key) {
    if (!el) return;
    const h = () => {
      const patch = {};
      patch[key] = el.value;
      setSource(slot, patch);
      saySrc();
    };
    on(el, 'change', h);
  }
  bind(sel('load-kind'), 'load', 'kind');
  bind(sel('load-voice'), 'load', 'voice');
  bind(sel('load-file'), 'load', 'file');
  bind(sel('glitch-kind'), 'glitch', 'kind');
  bind(sel('glitch-voice'), 'glitch', 'voice');
  bind(sel('glitch-file'), 'glitch', 'file');
  async function preview(slot, label) {
    const s = getSource(slot);
    let r = '';
    if (s.kind === 'file') r = await playFileId(s.file, 0.8);
    else r = await playVoice(s.voice, { ms: 320, gain: 0.6 });
    if (!srcStatus) return;
    const ok = String(r).startsWith('played');
    const hint = ok ? 'hear it?' : 'click preview again';
    const note = r === 'muted' ? 'enable the speaker toggle, then play' : hint;
    srcStatus.textContent = `${label}: ${r} — ${note}`;
  }
  on(sel('load-prev'), 'click', () => preview('load', 'load'));
  on(sel('glitch-prev'), 'click', () => preview('glitch', 'glitch'));
  const onRS = () => {
    try {
      resetSources();
    } catch {}
    const l = getSource('load');
    const g = getSource('glitch');
    const vals = [['load-kind', l.kind],
      ['load-voice', l.voice],
      ['load-file', l.file],
      ['glitch-kind', g.kind],
      ['glitch-voice', g.voice],
      ['glitch-file', g.file]];
    vals.forEach(([id, v]) => {
      const el = sel(id);
      if (el) el.value = v;
    });
    saySrc();
    if (srcStatus) srcStatus.textContent += ' — saved picks cleared, defaults live';
  };
  on(sel('reset-picks'), 'click', onRS);
  saySrc();
  return () => {
    offs.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  };
}
