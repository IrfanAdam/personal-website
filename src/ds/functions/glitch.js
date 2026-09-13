/* ADAM/DS — Functions · Glitch lab (visual demos + cyberpunk sound palette). */
import { attachGlitch, glitchOnce, pauseGlitch, resumeGlitch } from '../../views/glitch.js';
import { TYPES } from '../../views/glitch-sound.js';
import { isMuted, testLiveOsc, testFileTone, resetCtx } from '../../views/audio-ctx.js';
import { FILES } from '../../views/sound-files.js';
import { playVoice, playFileId } from '../../views/element-sound.js';
import { getSource, setSource, resetSources } from '../../views/sound-source.js';
import { note, cardHTML, code } from '../specimens.js';
export const title = 'Glitch';
const TYPE_META = {
  tick: 'filtered noise · 2.1kHz snap · 100ms — tick',
  static: 'tape hiss · 950Hz band + crackle · 180ms — idle CRT',
  blip: 'sine chirp 880→1320Hz · 140ms — pleasant ack',
  chime: 'fifth 523/785Hz · 420ms glass bell — warm cyberpunk',
  hum: 'sub 62Hz detuned · 320ms bed — city drone (default)',
  data: '3 pips 1.3/1.7/2.1kHz · 280ms — data stream',
  scanner: 'rising sweep 340→1180Hz + lock ping · 520ms — page load',
  zap: 'falling saw 880→110Hz · 150ms — snappy zap',
  zapscan: 'falling glass 880→110Hz + 9Hz wobble · 260ms — glass descent',
};
export function render() {
  const opts = TYPES.map((t) => `<option value="${t}"${t === 'hum' ? ' selected' : ''}>${t} — ${(TYPE_META[t] || t).split(' ·')[0]}</option>`).join('');
  const chips = TYPES.map((t) => `<button class="pill" data-snd-chip="${t}">${t}</button>`).join('');
  const fileOpts = (sel) => FILES.map((f) => `<option value="${f.id}"${f.id === sel ? ' selected' : ''}>${f.id} — ${f.desc}</option>`).join('');
  const ls = getSource('load'), gs = getSource('glitch');
  const kindOpts = (sel) => `<option value="procedural"${sel === 'procedural' ? ' selected' : ''}>procedural</option><option value="file"${sel === 'file' ? ' selected' : ''}>file</option>`;
  const voiceOpts = (sel) => TYPES.map((t) => `<option value="${t}"${t === sel ? ' selected' : ''}>${t} — ${((TYPE_META[t] || t).split(' ·')[0])}</option>`).join('');
  const srcPanel = `<div class="fx-panel" data-src><h3>Source — kind first</h3>`
  + `<p class="sub">Pick <span class="tok">procedural</span> or <span class="tok">file</span> per slot; the attached sound follows. Files vendored from web-sounds, starting with load.</p>`
  + `<label class="fx-row">load kind <select data-src="load-kind">${kindOpts(ls.kind)}</select></label>`
  + `<label class="fx-row">load voice <select data-src="load-voice">${voiceOpts(ls.voice)}</select></label>`
  + `<label class="fx-row">load file <select data-src="load-file">${fileOpts(ls.file)}</select></label>`
  + `<div class="fx-btns"><button class="pill" data-src="load-prev">▶ preview load</button></div>`
  + `<label class="fx-row">glitch kind <select data-src="glitch-kind">${kindOpts(gs.kind)}</select></label>`
  + `<label class="fx-row">glitch voice <select data-src="glitch-voice">${voiceOpts(gs.voice)}</select></label>`
  + `<label class="fx-row">glitch file <select data-src="glitch-file">${fileOpts(gs.file)}</select></label>`
  + `<div class="fx-btns"><button class="pill" data-src="glitch-prev">▶ preview glitch</button></div>`
  + `<p class="fx-status" data-src-status>load: ${ls.kind} ${ls.kind === 'file' ? ls.file : ls.voice} · glitch: ${gs.kind} ${gs.kind === 'file' ? gs.file : gs.voice}</p>`
  + `<div class="fx-btns"><button class="pill" data-src="reset-picks">reset saved picks</button></div></div>`;
  return `<p class="ds-crumb">Functions · Glitch</p><div class="ds-hero"><h1>Glitch — any container.</h1><p class="lede">Visual <span class="tok">.fx-glitch</span> + procedural audio palette: ${TYPES.join(' · ')}. Rendered with WebAudio, played back through audio elements. Default is <span class="tok">hum 320ms</span> with proximity-loud gain (near = louder); other voices via <span class="tok">data-glitch-sound="chime"</span> or <span class="tok">playSound('hum')</span>.</p></div>`
  + `<div class="ds-tablist ds-tablist--line" role="tablist" data-glitch-tabs><button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button><button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`
+ `<div data-tab-panel="lab"><div class="ds-sec"><p class="sub">Trigger / duration / intensity are visual only. Sound below is the cyberpunk palette — pick a voice, then play. Hum is synced to the glitch cycle; its level follows proximity when enabled.</p>`
  + `<div class="ds-spec block"><div class="fx-split"><div data-lab="grid-card" style="max-width:320px">${cardHTML('Helix — sales telemetry', 'helix · 2024', '/images/helix.png', ['Sales CRM'], '')}</div>`
  + `<div class="fx-panel" data-snd><h3>Sound — cyberpunk palette</h3>`
  + `<div class="fx-btns" style="flex-wrap:wrap;gap:6px">${chips}</div>`
  + `<label class="fx-row">voice <select data-snd="type">${opts}</select></label>`
  + `<p class="sub" data-snd-desc style="margin:4px 0 0;font-size:12px;color:var(--color-ink-muted)">${TYPE_META.hum}</p>`
  + `<div class="fx-btns"><button class="pill" data-snd="play">▶ play</button><button class="pill" data-snd="testa">test A · live</button><button class="pill" data-snd="testb">test B · file</button><button class="pill" data-snd="resetc">reset ctx</button><button class="pill" data-snd="sync" aria-pressed="false">sample on glitch: off</button><button class="pill on" data-snd="prox" aria-pressed="true">proximity: on</button></div>`
  + `<label class="fx-row">pitch <select data-snd="pitch"><option value="0">voice default</option><option value="1200">low</option><option value="2100">tick</option><option value="3400">high</option></select></label>`
  + `<label class="fx-row">length <input type="range" min="40" max="900" step="10" value="320" data-snd="len"><output data-snd-v>320ms</output></label>`
  + `<label class="fx-row" data-snd-level-row style="display:none">level <input type="range" min="20" max="100" step="5" value="100" data-snd="level"><output data-snd-g>100%</output></label>`
  + `<p class="fx-status" data-snd-status>proximity on — hum level = distance to card</p>`
  + `<p class="sub" style="margin-top:8px">Attr API: <span class="tok">data-glitch-sound="5000-9000 hum"</span> · <span class="tok">data-glitch-sound="static,blip"</span> pools rotate per hit. Site hum is always proximity — this toggle is lab preview only.</p>`
  + `</div></div>`
  + srcPanel
  + `<div class="fx-controls"><label class="fx-row">trigger <select data-ctl="trigger"><option value="auto">infinite</option><option value="hover">hover</option><option value="once">once</option></select></label>`
  + `<label class="fx-row">duration <input type="range" min="600" max="4800" step="100" value="2400" data-ctl="dur"><output data-ctl-v>2400ms</output></label>`
  + `<label class="fx-row">intensity <input type="range" min="1" max="8" step="1" value="1" data-ctl="int"><output data-ctl-i>1px</output></label>`
  + `<div class="fx-btns"><button class="pill" data-ctl="fire">fire once</button><button class="pill" data-ctl="pause">pause / resume</button></div></div></div>`
  + `<div data-tab-panel="code" hidden><div class="ds-sec"><h2>Code</h2><p class="sub">Visual + sound drop-ins — same engine the lab uses.</p>`
  + `${code(`import { attachGlitch, glitchOnce } from '../views/glitch.js';\nattachGlitch(el, { trigger: 'hover' }); // infinite | hover | once\nglitchOnce(el, 420);              // fire once, 420ms`)}`
  + `${code(`import { playSound } from '../views/glitch-sound.js';\nplaySound('hum'); // tick · static · blip · chime · hum · data · load\n// per-element pool, rotates per hit:\nel.dataset.glitchSound = 'static,blip';`)}`
  + `</div></div></div>`
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
  const syncProxUI = () => {
    if (proxBtn) { proxBtn.classList.toggle('on', proxOn); proxBtn.setAttribute('aria-pressed', String(proxOn)); proxBtn.textContent = proxOn ? 'proximity: on' : 'proximity: off'; }
    if (levelRow) levelRow.style.display = proxOn ? 'none' : '';
  };
  const updSnd = () => {
    if (outL && len) outL.textContent = `${len.value}ms`;
    if (outG && lvl) outG.textContent = `${lvl.value}%`;
    if (desc && typeSel && getSource('glitch').kind !== 'file') {
      const base = TYPE_META[typeSel.value] || '';
      desc.textContent = proxOn ? base + ' · distance → level' : base;
    }
    if (typeSel && len) {
      const defaults = { tick: 100, static: 180, blip: 140, chime: 420, hum: 320, data: 280, scanner: 520, zap: 150, zapscan: 260 };
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
  const playViaLabProx = async (type, opts) => {
    if (isMuted()) return 'muted';
    if (!proxOn) return hearVoice(type, opts);
    const p = labProx(); const g = 0.08 + 0.92 * p;
    if (g <= 0.08) return 'far';
    const lvl2 = opts.gain != null ? opts.gain : 1;
    return hearVoice(type, { ...opts, gain: g * 0.8 * Math.max(0, Math.min(1, lvl2)) });
  };
  const hearVoice = (type, opts) => {
    const o = opts || {};
    return playVoice(type, { ms: o.ms, freq: o.freq, gain: o.gain != null ? o.gain : 0.6 });
  };
  root.querySelectorAll('[data-snd-chip]').forEach((b) => b.addEventListener('click', () => {
    if (typeSel) { typeSel.value = b.dataset.sndChip; updSnd(); }
    const tp = b.dataset.sndChip;
    try {
      if (proxOn) playViaLabProx(tp, { ms: +len.value, freq: pitch ? +pitch.value : 0, gain: 1 });
      else hearVoice(tp, { ms: +len.value, gain: +lvl.value / 100, freq: pitch ? +pitch.value : 0 });
    } catch {}
  }));
  const playSnd = root.querySelector('[data-snd="play"]');
  const stSnd = root.querySelector('[data-snd-status]');
  const saySnd = (t) => { if (stSnd) stSnd.textContent = t; };
  if (playSnd) playSnd.addEventListener('click', async () => {
    const gs0 = getSource('glitch');
    if (gs0.kind === 'file') {
      let r = 'blocked';
      try {
        if (isMuted()) r = 'muted';
        else r = await playFileId(gs0.file, proxOn ? 0.08 + 0.72 * labProx() : (+lvl.value / 100 || 0.8));
      } catch { r = 'blocked'; }
      if (String(r).startsWith('played')) saySnd(`file ${gs0.file} · ${r}`);
      else if (r === 'muted') saySnd('muted — enable the speaker toggle, then play');
      else saySnd('audio blocked — click play again');
      try { demos.forEach((el) => glitchOnce(el, 420)); } catch {}
      return;
    }
    const tp = typeSel ? typeSel.value : 'hum';
    const f = pitch ? +pitch.value : 0, m = len ? +len.value : 0;
    let s = 'blocked';
    try {
      if (proxOn) s = await playViaLabProx(tp, { ms: m || undefined, freq: f || undefined, gain: 1 });
      else s = await hearVoice(tp, { ms: m || undefined, freq: f || undefined, gain: +lvl.value / 100 });
    } catch { s = 'blocked'; }
    if (String(s).startsWith('played')) saySnd(`${tp} · ${proxOn ? 'proximity ' + Math.round(labProx() * 100) + '%' : f + 'Hz · ' + lvl.value + '%'} · ${m || '—'}ms · ${s}`);
    else if (s === 'far') saySnd('too far — move closer to the card');
    else if (s === 'muted') saySnd('muted — enable the speaker toggle, then play');
    else if (s === 'reduced') saySnd('off — reduced motion silences audio');
    else if (s === 'floor') saySnd('too fast — wait half a second');
    else saySnd('audio blocked — click play again');
    try { demos.forEach((el) => glitchOnce(el, 420)); } catch {}
  });
  updSnd(); syncProxUI();
  /* Source picker — kind first, attached sound follows. Persists per slot. */
  const srcStatus = root.querySelector('[data-src-status]');
  const srcSel = (n) => root.querySelector(`[data-src="${n}"]`);
  const sLK = srcSel('load-kind'), sLV = srcSel('load-voice'), sLF = srcSel('load-file');
  const sGK = srcSel('glitch-kind'), sGV = srcSel('glitch-voice'), sGF = srcSel('glitch-file');
  const saySrc = () => {
    const l = getSource('load'), g = getSource('glitch');
    if (srcStatus) srcStatus.textContent = `load: ${l.kind} ${l.kind === 'file' ? l.file : l.voice} · glitch: ${g.kind} ${g.kind === 'file' ? g.file : g.voice}`;
    // controls follow kind: voice/pitch/length/chips are procedural-only;
    // level + proximity gain still shape file playback.
    const proc = g.kind !== 'file';
    if (sLV) sLV.disabled = l.kind === 'file';
    if (sLF) sLF.disabled = l.kind !== 'file';
    if (sGV) sGV.disabled = !proc;
    if (sGF) sGF.disabled = proc;
    if (typeSel) typeSel.disabled = !proc;
    if (pitch) pitch.disabled = !proc;
    if (len) len.disabled = !proc;
    root.querySelectorAll('[data-snd-chip]').forEach((b) => { b.disabled = !proc; });
    if (desc) {
      if (proc) { const base = TYPE_META[typeSel ? typeSel.value : 'hum'] || ''; desc.textContent = proxOn ? base + ' · distance → level' : base; }
      else { const f = FILES.find((x) => x.id === g.file); desc.textContent = ((f && f.desc) || g.file) + (proxOn ? ' · distance → level' : ' · level from slider'); }
    }
  };
  const srcOffs = [];
  const bindSrc = (el, slot, key, parse) => {
    if (!el) return;
    const h = () => { setSource(slot, { [key]: parse ? parse(el.value) : el.value }); saySrc(); };
    el.addEventListener('change', h);
    srcOffs.push(() => el.removeEventListener('change', h));
  };
  bindSrc(sLK, 'load', 'kind'); bindSrc(sLV, 'load', 'voice'); bindSrc(sLF, 'load', 'file');
  bindSrc(sGK, 'glitch', 'kind'); bindSrc(sGV, 'glitch', 'voice'); bindSrc(sGF, 'glitch', 'file');
  const previewFile = async (id, label) => {
    const r = await playFileId(id, 0.8);
    if (srcStatus) srcStatus.textContent = `${label}: ${r} — ${r === 'muted' ? 'enable the speaker toggle, then play' : String(r).startsWith('played') ? 'hear it?' : 'click preview again'}`;
  };
  const previewVoice = async (voice, label) => {
    const r = await playVoice(voice, { ms: 320, gain: 0.6 });
    if (srcStatus) srcStatus.textContent = `${label}: ${r} — ${r === 'muted' ? 'enable the speaker toggle, then play' : String(r).startsWith('played') ? 'hear it?' : 'click preview again'}`;
  };
  const lpB = srcSel('load-prev'), gpB = srcSel('glitch-prev');
  const onLP = () => { const s = getSource('load'); if (s.kind === 'file') previewFile(s.file, 'load'); else previewVoice(s.voice, 'load'); };
  const onGP = () => { const s = getSource('glitch'); if (s.kind === 'file') previewFile(s.file, 'glitch'); else previewVoice(s.voice, 'glitch'); };
  if (lpB) { lpB.addEventListener('click', onLP); srcOffs.push(() => lpB.removeEventListener('click', onLP)); }
  if (gpB) { gpB.addEventListener('click', onGP); srcOffs.push(() => gpB.removeEventListener('click', onGP)); }
  const rsB = srcSel('reset-picks');
  const onRS = () => {
    try { resetSources(); } catch {}
    const l = getSource('load'), g = getSource('glitch');
    if (sLK) sLK.value = l.kind; if (sLV) sLV.value = l.voice; if (sLF) sLF.value = l.file;
    if (sGK) sGK.value = g.kind; if (sGV) sGV.value = g.voice; if (sGF) sGF.value = g.file;
    saySrc();
    if (srcStatus) srcStatus.textContent += ' — saved picks cleared, defaults live';
  };
  if (rsB) { rsB.addEventListener('click', onRS); srcOffs.push(() => rsB.removeEventListener('click', onRS)); }
  saySrc();
  const tA = root.querySelector('[data-snd="testa"]'), tB = root.querySelector('[data-snd="testb"]');
  if (tA) tA.addEventListener('click', async () => { saySnd('A: ' + await testLiveOsc() + ' — hear a plain beep?'); });
  if (tB) tB.addEventListener('click', async () => { saySnd('B: ' + await testFileTone() + ' — hear a chime?'); });
  const tR = root.querySelector('[data-snd="resetc"]');
  if (tR) tR.addEventListener('click', async () => { saySnd(await resetCtx() + ' — now hit test A'); });
  const tabBar = root.querySelector('[data-glitch-tabs]');
  const onTabs = (e) => { const b = e.target.closest('[data-tab]'); if (!b || !tabBar) return;
    tabBar.querySelectorAll('[data-tab]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', String(x === b)); });
    root.querySelectorAll('[data-tab-panel]').forEach((pn) => { pn.hidden = pn.dataset.tabPanel !== b.dataset.tab; }); };
  if (tabBar) tabBar.addEventListener('click', onTabs);
  let syncOn = false;
  const syncBtn = root.querySelector('[data-snd="sync"]');
  const testTick = () => {
    const tp = typeSel ? typeSel.value : 'hum';
    if (proxOn) { try { playViaLabProx(tp, { ms: +len.value, freq: pitch && +pitch.value ? +pitch.value : undefined, gain: 1 }); } catch {} }
    else { try { hearVoice(tp, { ms: +len.value, gain: +lvl.value / 100, freq: pitch && +pitch.value ? +pitch.value : undefined }); } catch {} }
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
    srcOffs.forEach((fn) => { try { fn(); } catch {} });
    stops.forEach((fn) => { try { fn(); } catch {} });
    demos.forEach((el) => { el.removeEventListener('animationiteration', onCycle); el.removeEventListener('animationstart', onCycle); });
    root.removeEventListener('pointermove', onLabMove); window.removeEventListener('pointermove', onLabMove);
    if (pause) pause.removeEventListener('click', onPause);
    if (tabBar) tabBar.removeEventListener('click', onTabs);
    [trig, dur, int].forEach((c) => c && c.removeEventListener('input', apply));
    /* shared ctx stays alive for other voices — no suspend on unmount */
  };
}
