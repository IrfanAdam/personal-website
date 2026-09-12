/* ADAM/DS — Functions · Glitch lab (visual demos + cyberpunk sound palette). */
import { attachGlitch, glitchOnce, pauseGlitch, resumeGlitch } from '../../views/glitch.js';
import { tick as soundTick, playSound, TYPES } from '../../views/glitch-sound.js';
import { synth as paletteSynth } from '../../views/sound-palette.js';
import { note, cardHTML } from '../specimens.js';
export const title = 'Glitch';
const TYPE_META = {
  tick: 'filtered noise · 2.1kHz snap · 100ms — tick',
  static: 'tape hiss · 950Hz band + crackle · 180ms — idle CRT',
  blip: 'sine chirp 880→1320Hz · 140ms — pleasant ack',
  chime: 'fifth 523/785Hz · 420ms glass bell — warm cyberpunk',
  hum: 'sub 62Hz detuned · 320ms bed — city drone (default)',
  data: '3 pips 1.3/1.7/2.1kHz · 280ms — data stream',
};
export function render() {
  const opts = TYPES.map((t) => `<option value="${t}"${t === 'hum' ? ' selected' : ''}>${t} — ${TYPE_META[t].split(' ·')[0]}</option>`).join('');
  const chips = TYPES.map((t) => `<button class="pill" data-snd-chip="${t}">${t}</button>`).join('');
  return `<p class="ds-crumb">Functions · Glitch</p><div class="ds-hero"><h1>Glitch — any container.</h1><p class="lede">Visual <span class="tok">.fx-glitch</span> + procedural audio palette: ${TYPES.join(' · ')}. All WebAudio, no files. Default is <span class="tok">hum 320ms</span> with proximity-loud gain (near = louder); other voices via <span class="tok">data-glitch-sound="chime"</span> or <span class="tok">playSound('hum')</span>.</p></div>`
  + `<div class="ds-sec"><h2>Lab</h2><p class="sub">Trigger / duration / intensity are visual only. Sound below is the cyberpunk palette — pick a voice, then play. Hum is synced to the glitch cycle; its level follows proximity when enabled.</p>`
  + `<div class="ds-spec block"><div class="fx-split"><div data-lab="grid-card" style="max-width:320px">${cardHTML('Helix — sales telemetry', 'helix · 2024', '/images/helix.png', ['Sales CRM'], '')}</div>`
  + `<div class="fx-panel" data-snd><h3>Sound — cyberpunk palette</h3>`
  + `<div class="fx-btns" style="flex-wrap:wrap;gap:6px">${chips}</div>`
  + `<label class="fx-row">voice <select data-snd="type">${opts}</select></label>`
  + `<p class="sub" data-snd-desc style="margin:4px 0 0;font-size:12px;color:var(--color-ink-muted)">${TYPE_META.hum}</p>`
  + `<div class="fx-btns"><button class="pill" data-snd="play">▶ play</button><button class="pill" data-snd="sync" aria-pressed="false">sample on glitch: off</button><button class="pill on" data-snd="prox" aria-pressed="true">proximity: on</button></div>`
  + `<label class="fx-row">pitch <select data-snd="pitch"><option value="0">voice default</option><option value="1200">low</option><option value="2100">tick</option><option value="3400">high</option></select></label>`
  + `<label class="fx-row">length <input type="range" min="40" max="900" step="10" value="320" data-snd="len"><output data-snd-v>320ms</output></label>`
  + `<label class="fx-row" data-snd-level-row style="display:none">level <input type="range" min="20" max="100" step="5" value="100" data-snd="level"><output data-snd-g>100%</output></label>`
  + `<p class="fx-status" data-snd-status>proximity on — hum level = distance to card</p>`
  + `<p class="sub" style="margin-top:8px">Attr API: <span class="tok">data-glitch-sound="5000-9000 hum"</span> · <span class="tok">data-glitch-sound="static,blip"</span> pools rotate per hit. Site hum is always proximity — this toggle is lab preview only.</p>`
  + `</div></div>`
  + `<div class="fx-controls"><label class="fx-row">trigger <select data-ctl="trigger"><option value="auto">infinite</option><option value="hover">hover</option><option value="once">once</option></select></label>`
  + `<label class="fx-row">duration <input type="range" min="600" max="4800" step="100" value="2400" data-ctl="dur"><output data-ctl-v>2400ms</output></label>`
  + `<label class="fx-row">intensity <input type="range" min="1" max="8" step="1" value="1" data-ctl="int"><output data-ctl-i>1px</output></label>`
  + `<div class="fx-btns"><button class="pill" data-ctl="fire">fire once</button><button class="pill" data-ctl="pause">pause / resume</button></div></div></div>`
  + `${note('Do', 'Glitch marks one thing at a time — today stays tick, other voices opt-in per element. Pleasant voices (chime/hum/blip) for CTAs, tick/static for system.')}</div>`;
}
export function mount(root) {
  const stops = [];
  const demos = [...root.querySelectorAll('[data-lab]')];
  const cardEl = root.querySelector('[data-lab="grid-card"]');
  const trig = root.querySelector('[data-ctl="trigger"]'), dur = root.querySelector('[data-ctl="dur"]'),
    int = root.querySelector('[data-ctl="int"]'), outD = root.querySelector('[data-ctl-v]'), outI = root.querySelector('[data-ctl-i]');
  const apply = () => {
    stops.splice(0).forEach((fn) => { try { fn(); } catch {} });
    demos.forEach((el) => {
      el.style.setProperty('--dur-glitch', `${dur.value}ms`);
      el.style.setProperty('--fx-glitch-x', `var(--space-${Math.min(8, int.value)})`);
      stops.push(attachGlitch(el, { trigger: trig.value }));
    });
    outD.textContent = `${dur.value}ms`; outI.textContent = `${int.value}px`;
  };
  [trig, dur, int].forEach((c) => c && c.addEventListener('input', apply));
  const fire = root.querySelector('[data-ctl="fire"]');
  if (fire) fire.addEventListener('click', () => demos.forEach((el) => glitchOnce(el)));
  const typeSel = root.querySelector('[data-snd="type"]'), pitch = root.querySelector('[data-snd="pitch"]'),
    len = root.querySelector('[data-snd="len"]'), lvl = root.querySelector('[data-snd="level"]'),
    outL = root.querySelector('[data-snd-v]'), outG = root.querySelector('[data-snd-g]'),
    desc = root.querySelector('[data-snd-desc]'), levelRow = root.querySelector('[data-snd-level-row]'),
    proxBtn = root.querySelector('[data-snd="prox"]');
  let proxOn = true, mx = -1e4, my = -1e4;
  const R = 260;
  const labProx = () => {
    if (!cardEl) return 0.6;
    if (mx < -5e3) return 0.6;
    const r = cardEl.getBoundingClientRect();
    const dx = Math.max(r.left - mx, 0, mx - r.right);
    const dy = Math.max(r.top - my, 0, my - r.bottom);
    const d = Math.hypot(dx, dy);
    if (d >= R) return 0;
    return 1 - d / R;
  };
  let labCtx = null, labBuf = null;
  const getLabCtx = () => { if (labCtx) return labCtx; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; labCtx = new AC(); return labCtx; };
  const getLabBuf = () => {
    if (labBuf) return labBuf; const c = getLabCtx(); if (!c) return null;
    const len2 = c.sampleRate; labBuf = c.createBuffer(1, len2, c.sampleRate);
    const d = labBuf.getChannelData(0); for (let i = 0; i < len2; i++) d[i] = Math.random() * 2 - 1; return labBuf;
  };
  const syncProxUI = () => {
    if (proxBtn) { proxBtn.classList.toggle('on', proxOn); proxBtn.setAttribute('aria-pressed', String(proxOn)); proxBtn.textContent = proxOn ? 'proximity: on' : 'proximity: off'; }
    if (levelRow) levelRow.style.display = proxOn ? 'none' : '';
  };
  const updSnd = () => {
    if (outL && len) outL.textContent = `${len.value}ms`;
    if (outG && lvl) outG.textContent = `${lvl.value}%`;
    if (desc && typeSel) {
      const base = TYPE_META[typeSel.value] || '';
      desc.textContent = proxOn ? base + ' · distance → level' : base;
    }
    if (typeSel && len) {
      const defaults = { tick: 100, static: 180, blip: 140, chime: 420, hum: 320, data: 280 };
      const d = defaults[typeSel.value];
      if (d && document.activeElement === typeSel) { len.value = String(d); if (outL) outL.textContent = `${d}ms`; }
    }
  };
  [len, lvl].forEach((c) => c && c.addEventListener('input', updSnd));
  if (typeSel) typeSel.addEventListener('change', updSnd);
  if (proxBtn) proxBtn.addEventListener('click', () => {
    proxOn = !proxOn; syncProxUI(); updSnd();
    if (stSnd) stSnd.textContent = proxOn ? 'proximity on — move cursor near the card to vary level' : 'static — level from slider';
  });
  const playViaLabProx = (type, opts) => {
    if (!proxOn) return playSound(type, opts);
    const c = getLabCtx(), b = getLabBuf(); if (!c || !b) return playSound(type, opts);
    if (c.state === 'suspended') c.resume().catch(() => {});
    const p = labProx(); const g = 0.08 + 0.92 * p;
    if (g <= 0.08) return 'far';
    const lvl2 = opts.gain != null ? opts.gain : 1;
    paletteSynth(c, b, type, g * 0.8 * Math.max(0, Math.min(1, lvl2)), opts);
    return 'played';
  };
  root.querySelectorAll('[data-snd-chip]').forEach((b) => b.addEventListener('click', () => {
    if (typeSel) { typeSel.value = b.dataset.sndChip; updSnd(); }
    const tp = b.dataset.sndChip;
    try {
      if (proxOn) playViaLabProx(tp, { ms: +len.value, freq: pitch ? +pitch.value : 0, gain: 1 });
      else playSound(tp, { ms: +len.value, gain: +lvl.value / 100, freq: pitch ? +pitch.value : 0 });
    } catch {}
  }));
  const playSnd = root.querySelector('[data-snd="play"]');
  const stSnd = root.querySelector('[data-snd-status]');
  const saySnd = (t) => { if (stSnd) stSnd.textContent = t; };
  if (playSnd) playSnd.addEventListener('click', async () => {
    const tp = typeSel ? typeSel.value : 'hum';
    const f = pitch ? +pitch.value : 0, m = len ? +len.value : 0;
    let s = 'blocked';
    try {
      if (proxOn) s = playViaLabProx(tp, { ms: m || undefined, freq: f || undefined, gain: 1 });
      else s = await playSound(tp, { ms: m || undefined, freq: f || undefined, gain: +lvl.value / 100 });
    } catch { s = 'blocked'; }
    if (s === 'played') saySnd(proxOn ? `${tp} · proximity ${Math.round(labProx() * 100)}% · ${m || '—'}ms` : `${tp} · ${f || '—'}Hz · ${m || '—'}ms · ${lvl.value}%`);
    else if (s === 'far') saySnd('too far — move closer to the card');
    else if (s === 'muted') saySnd('muted — enable the speaker toggle, then play');
    else if (s === 'reduced') saySnd('off — reduced motion silences audio');
    else if (s === 'floor') saySnd('too fast — wait half a second');
    else saySnd('audio blocked — click play again');
    try { demos.forEach((el) => glitchOnce(el, 420)); } catch {}
  });
  updSnd(); syncProxUI();
  let syncOn = false;
  const syncBtn = root.querySelector('[data-snd="sync"]');
  const testTick = () => {
    const tp = typeSel ? typeSel.value : 'hum';
    if (proxOn) { try { playViaLabProx(tp, { ms: +len.value, freq: pitch && +pitch.value ? +pitch.value : undefined, gain: 1 }); } catch {} }
    else { try { playSound(tp, { ms: +len.value, gain: +lvl.value / 100, freq: pitch && +pitch.value ? +pitch.value : undefined }); } catch {} }
  };
  const labAt = 0.88;
  const labDur = (el) => { try { const r = getComputedStyle(el).getPropertyValue('--dur-glitch').trim() || '2.4s'; if (r.endsWith('ms')) return parseFloat(r) || 2400; if (r.endsWith('s')) return (parseFloat(r) || 2.4) * 1000; return 2400; } catch { return 2400; } };
  const pending = new Map();
  const onCycle = (e) => {
    if (!syncOn) return;
    const el = e.currentTarget;
    const d = labDur(el) * labAt;
    if (pending.has(el)) clearTimeout(pending.get(el));
    const t = setTimeout(() => { pending.delete(el); testTick(); }, d);
    pending.set(el, t);
  };
  demos.forEach((el) => { el.addEventListener('animationiteration', onCycle); el.addEventListener('animationstart', onCycle); });
  if (syncBtn) syncBtn.addEventListener('click', () => {
    syncOn = !syncOn; syncBtn.classList.toggle('on', syncOn);
    syncBtn.setAttribute('aria-pressed', String(syncOn));
    syncBtn.textContent = syncOn ? 'sample on glitch: on' : 'sample on glitch: off';
    saySnd(syncOn ? `sync on — card glitch plays ${typeSel ? typeSel.value : 'hum'}${proxOn ? ' (proximity)' : ''}` : 'sync off');
  });
  let paused = false;
  const pause = root.querySelector('[data-ctl="pause"]');
  const onPause = () => { paused = !paused; demos.forEach((el) => (paused ? pauseGlitch(el) : resumeGlitch(el))); if (pause) pause.textContent = paused ? 'resume' : 'pause / resume'; };
  if (pause) pause.addEventListener('click', onPause);
  const onLabMove = (e) => { mx = e.clientX; my = e.clientY; };
  root.addEventListener('pointermove', onLabMove, { passive: true });
  window.addEventListener('pointermove', onLabMove, { passive: true });
  apply();
  return () => {
    pending.forEach((t) => clearTimeout(t)); pending.clear();
    stops.forEach((fn) => { try { fn(); } catch {} });
    demos.forEach((el) => { el.removeEventListener('animationiteration', onCycle); el.removeEventListener('animationstart', onCycle); });
    root.removeEventListener('pointermove', onLabMove); window.removeEventListener('pointermove', onLabMove);
    if (pause) pause.removeEventListener('click', onPause);
    [trig, dur, int].forEach((c) => c && c.removeEventListener('input', apply));
    if (labCtx && labCtx.state === 'running') labCtx.suspend().catch(() => {});
  };
}
