/* ADAM/DS — Functions · Scramble lab — decoder text with font switcher + synced random sound. */
import { scrambleText } from '../../views/scramble-text.js';
import { playVoice, playFileId } from '../../views/element-sound.js';
import { playSlot } from '../../views/slot-sound.js';
import { FILES } from '../../views/sound-files.js';
import { getSource, setSource } from '../../views/sound-source.js';
import { note, code } from '../specimens.js';
export const title = 'Scramble';
const CHARS = {
  upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  upperAndLowerCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
 XO: 'XO',
  symbols: '!<>-_\\/[]{}—=+*^?#',
  custom: ''
};
const FONT_STYLES = {
  display: { label: 'Display · --text-display', size: 'var(--text-display)', leading: 'var(--leading-display)', tracking: 'var(--tracking-display)', weight: '700', family: 'var(--font-sans)' },
  title: { label: 'Title · --text-title', size: 'var(--text-title)', leading: 'var(--leading-title)', tracking: 'var(--tracking-title)', weight: '700', family: 'var(--font-sans)' },
  logo: { label: 'Logo · --text-logo', size: 'var(--text-logo)', leading: 'var(--leading-display)', tracking: 'var(--tracking-display)', weight: '700', family: 'var(--font-sans)' },
  h2: { label: 'Section h2 · --text-h2', size: 'var(--text-h2)', leading: 'var(--leading-snug)', tracking: 'var(--tracking-heading)', weight: '700', family: 'var(--font-sans)' },
  card: { label: 'Card title · --text-card-title', size: 'var(--text-card-title)', leading: 'var(--leading-snug)', tracking: 'var(--tracking-body)', weight: '600', family: 'var(--font-sans)' },
  h3: { label: 'Section h3 · --text-h3', size: 'var(--text-h3)', leading: 'var(--leading-snug)', tracking: 'var(--tracking-heading)', weight: '600', family: 'var(--font-sans)' },
  body: { label: 'Body · --text-body', size: 'var(--text-body)', leading: 'var(--leading-body)', tracking: 'var(--tracking-body)', weight: '400', family: 'var(--font-sans)' },
  small: { label: 'Small · --text-small', size: 'var(--text-small)', leading: 'var(--leading-snug)', tracking: 'var(--tracking-body)', weight: '600', family: 'var(--font-sans)' },
  meta: { label: 'Mono Meta · --text-meta', size: 'var(--text-meta)', leading: 'var(--leading-mono)', tracking: 'var(--tracking-mono)', weight: '500', family: 'var(--font-mono)' },
  label: { label: 'Label · --text-label', size: 'var(--text-label)', leading: 'var(--leading-mono)', tracking: 'var(--tracking-label)', weight: '500', family: 'var(--font-mono)' },
  micro: { label: 'Micro · --text-micro', size: 'var(--text-micro)', leading: 'var(--leading-mono)', tracking: 'var(--tracking-mono)', weight: '500', family: 'var(--font-mono)' },
};
const VOICES = ['random','tick','static','blip','chime','hum','data','scanner','zap','zapscan'];
export function render(){
  const charOpts = Object.keys(CHARS).map(k=> `<option value="${k}"${k==='symbols'?' selected':''}>${k}${k!=='custom' ? ' · '+(CHARS[k].slice(0,12)+(CHARS[k].length>12?'…':'')) : ''}</option>`).join('');
  const fontOpts = Object.entries(FONT_STYLES).map(([k,v])=> `<option value="${k}">${v.label}</option>`).join('');
  const sc = getSource('scramble');
  const voiceOpts = VOICES.map(v=> `<option value="${v}"${v===(sc.voice||'random')?' selected':''}>${v}</option>`).join('');
  const kindOpts = `<option value="procedural"${sc.kind==='procedural'?' selected':''}>procedural</option><option value="file"${sc.kind==='file'?' selected':''}>file</option>`;
  const fileOpts = FILES.map(f=> `<option value="${f.id}"${f.id===sc.file?' selected':''}>${f.id}</option>`).join('');
  return `<p class="ds-crumb">Functions · Scramble</p><div class="ds-hero"><h1>Scramble — decoding text.</h1><p class="lede">GSAP <span class="tok">ScrambleTextPlugin</span>-like decoder: randomized chars refreshing at <span class="tok">speed</span>, revealing left→right over <span class="tok">--dur-scramble</span>. Change font + fire sound — all <span class="tok">var()</span> type, sound renders offline and plays through audio elements.</p></div>`
+ `<div class="ds-tablist ds-tablist--line" role="tablist" data-scramble-tabs><button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button><button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`
+ `<div data-tab-panel="lab"><div class="ds-sec"><p class="sub">Type a sentence, pick chars + font + alignment. Sound is a random decoded blip synced to the reveal — plus the page-load scanner (~520ms sweep) that fires once per session on page load. Pick <span class="tok">scanner</span> as voice to hear it with scramble.</p>`
+ `<div class="ds-spec block" data-scramble-lab>`
+ `<div data-scramble-stage style="min-height:var(--space-90);display:grid;place-items:center;padding:var(--space-16);border:var(--border-hairline);background:var(--color-surface);overflow:hidden"><div data-scramble-preview style="font-family:var(--font-sans);font-size:var(--text-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display);font-weight:700;width:100%;max-width:100%;overflow-wrap:break-word;text-align:left">Irfan Adam, crafting experiences</div></div>`
+ `<div class="fx-controls">`
+ `<label class="fx-row">text <input type="text" value="Irfan Adam, crafting experiences" data-scramble="text" style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8);width:100%"><output data-scramble-out></output></label>`
+ `<label class="fx-row">chars <select data-scramble="chars">${charOpts}</select><output data-scramble-chars-v>symbols</output></label>`
+ `<label class="fx-row" data-scramble-custom-row style="display:none">custom <input type="text" placeholder="!<>-_\\/[]{}—=+*^?#" data-scramble="custom" style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8);width:100%"><output></output></label>`
+ `<label class="fx-row">duration <input type="range" min="0.3" max="3" step="0.1" value="0.9" data-scramble="dur"><output data-scramble-dur>0.9s</output></label>`
+ `<label class="fx-row">speed <input type="range" min="0.2" max="4" step="0.1" value="1" data-scramble="speed"><output data-scramble-speed>1</output></label>`
+ `<label class="fx-row">revealDelay <input type="range" min="0" max="1" step="0.05" value="0" data-scramble="delay"><output data-scramble-delay>0s</output></label>`
+ `<label class="fx-row">delimiter <select data-scramble="delim"><option value="" selected>chars ""</option><option value=" ">words " "</option></select><output></output></label>`
+ `<div class="fx-btns"><button class="pill" data-scramble="rtl" aria-pressed="false">left → right</button><button class="pill on" data-scramble="tween" aria-pressed="true">tweenLength: on</button></div>`
+ `<label class="fx-row">type style <select data-scramble="font">${fontOpts}</select><output data-scramble-font-v>Display</output></label>`
+ `<div class="fx-btns" data-scramble-align-group><button class="pill on" data-scramble-align="left">left</button><button class="pill" data-scramble-align="center">center</button><button class="pill" data-scramble-align="right">right</button></div>`
+ `<div class="fx-btns"><button class="pill on" data-scramble="sound" aria-pressed="true">sound: on</button><select data-scramble="kind" title="source kind" style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">${kindOpts}</select><select data-scramble="voice" style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">${voiceOpts}</select><select data-scramble="file" title="sound file" style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">${fileOpts}</select><button class="pill" data-scramble="play-load">▶ load</button><button class="pill" data-scramble="replay">↻ scramble</button><button class="pill" data-scramble="hover">hover: off</button></div>`
+ `<p class="fx-status" data-scramble-status>ready — type or hit scramble</p>`
+ `</div></div>`
+ `${note('Do','Tune chars + speed + revealDelay here, then graduate via <span class="tok">--dur-scramble</span> / <span class="tok">--fx-scramble-*</span>. Type styles are all <span class="tok">var(--text-*)</span> — no literals.')}`
+ `</div></div>`
+ `<div data-tab-panel="code" hidden><div class="ds-sec"><h2>Usage</h2><p class="sub">Drop-in like GSAP, no plugin. Site helper + DS lab share the same engine.</p>`
+ `${code(`import { scrambleText } from '../views/scramble-text.js';\n// string shorthand\nscrambleText(el, "NEW TEXT");\n// full\nscrambleText(el, {\n  text: "THIS IS NEW TEXT",\n  chars: "upperCase",      // or "lowerCase" | "upperAndLowerCase" | "!<>-_\\/[]{}—=+*^?#"\n  duration: 0.9,           // seconds (→ --dur-scramble)\n  revealDelay: 0.2,        // seconds pure scramble before reveal\n  speed: 1,                // 0.2 slow … 3 frantic\n  delimiter: "",           // "" chars or " " words\n  rightToLeft: false,\n  tweenLength: true,\n  newClass: "is-decoded",  // optional reveal tint\n  oldClass: "is-scrambling"\n});\n// also respects prefers-reduced-motion — jumps to final`)}`
+ `${code(`// GSAP parity if you already use gsap:\n// gsap.to(el, { duration: 0.9, scrambleText: { text: "HELLO", chars: "XO", speed: 0.3 } })\n// is equivalent to:\n// scrambleText(el, { text: "HELLO", chars: "XO", duration: 0.9, speed: 0.3 })`)}`
+ `</div>`
+ `<div class="ds-sec"><h2>Tokens</h2><p class="sub">Graduation target — lab writes a preview, site reads the token.</p><table class="ds-table"><tr><th>Lab</th><th>Token</th></tr><tr><td>duration 0.9s</td><td><span class="tok">--dur-scramble</span></td></tr><tr><td>chars default</td><td><span class="tok">--fx-scramble-chars</span> (upperCase)</td></tr></table>${code(`el.style.setProperty('--dur-scramble', dur+'s') // lab preview\n// site: animation reads var(--dur-scramble) → scrambleText(el,{duration: parseFloat(getComputedStyle(el).getPropertyValue('--dur-scramble'))})`)}`
+ `</div></div>`;
}
export function mount(root){
  const lab = root.querySelector('[data-scramble-lab]'); if(!lab) return ()=>{};
  const preview = lab.querySelector('[data-scramble-preview]');
  const inp = lab.querySelector('[data-scramble="text"]');
  const charsSel = lab.querySelector('[data-scramble="chars"]');
  const customRow = lab.querySelector('[data-scramble-custom-row]');
  const customInp = lab.querySelector('[data-scramble="custom"]');
  const dur = lab.querySelector('[data-scramble="dur"]'), outDur = lab.querySelector('[data-scramble-dur]');
  const speed = lab.querySelector('[data-scramble="speed"]'), outSpeed = lab.querySelector('[data-scramble-speed]');
  const delay = lab.querySelector('[data-scramble="delay"]'), outDelay = lab.querySelector('[data-scramble-delay]');
  const delim = lab.querySelector('[data-scramble="delim"]');
  const rtlBtn = lab.querySelector('[data-scramble="rtl"]');
  const tweenBtn = lab.querySelector('[data-scramble="tween"]');
  const fontSel = lab.querySelector('[data-scramble="font"]');
  const soundBtn = lab.querySelector('[data-scramble="sound"]');
  const voiceSel = lab.querySelector('[data-scramble="voice"]');
  const kindSel = lab.querySelector('[data-scramble="kind"]');
  const fileSel = lab.querySelector('[data-scramble="file"]');
  const replayBtn = lab.querySelector('[data-scramble="replay"]');
  const hoverBtn = lab.querySelector('[data-scramble="hover"]');
  const playLoadBtn = lab.querySelector('[data-scramble="play-load"]');
  const outChars = lab.querySelector('[data-scramble-chars-v]');
  const outFont = lab.querySelector('[data-scramble-font-v]');
  const status = lab.querySelector('[data-scramble-status]');
  const stage = lab.querySelector('[data-scramble-stage]');
  const alignBtns = lab.querySelectorAll('[data-scramble-align]');
  let rtl=false, tween=true, soundOn=true, hoverOn=false, align='left';
  let lastText = inp ? inp.value : preview.textContent;
  const muted = ()=> { try{ if(localStorage.getItem('adam-sound')==='off') return true; if(matchMedia('(prefers-reduced-motion: reduce)').matches) return true; }catch{} return false; };
  const playScramble = async (ms) => {
    if(!soundOn || muted()) return;
    const slot = getSource('scramble');
    if(slot.kind==='file'){ try{ await playFileId(slot.file, 0.42); }catch{} return; }
    const v = voiceSel ? voiceSel.value : (slot.voice || 'random');
    const dur = Math.max(80, Math.min(900, ms));
    try{ await playVoice(v, { ms: dur, gain: 0.42 }); }catch{}
    // second micro tick for texture (30% chance, overlapping element)
    if(Math.random()<0.34){ try{ playVoice('tick', { ms: 70, gain: 0.22 }); }catch{} }
  };
  const applyFont = () => {
    const k = fontSel ? fontSel.value : 'display';
    const f = FONT_STYLES[k] || FONT_STYLES.display;
    preview.style.fontFamily = f.family;
    preview.style.fontSize = f.size;
    preview.style.lineHeight = f.leading;
    preview.style.letterSpacing = f.tracking;
    preview.style.fontWeight = f.weight;
    if(outFont) outFont.textContent = k;
  };
  const syncOutputs = () => {
    if(outDur && dur) outDur.textContent = (+dur.value).toFixed(1)+'s';
    if(outSpeed && speed) outSpeed.textContent = (+speed.value).toFixed(1);
    if(outDelay && delay) outDelay.textContent = (+delay.value).toFixed(2)+'s';
    if(outChars && charsSel) outChars.textContent = charsSel.value;
  };
  const curChars = () => {
    const v = charsSel ? charsSel.value : 'upperCase';
    if(v==='custom') return (customInp && customInp.value.trim()) ? customInp.value : '!<>-_\\/[]{}—=+*^?#';
    return CHARS[v] ?? v;
  };
  const doScramble = () => {
    const text = inp ? inp.value : lastText;
    lastText = text;
    const key = charsSel ? charsSel.value : 'upperCase';
    const cs = curChars();
    const d = dur ? +dur.value : 0.9;
    const sp = speed ? +speed.value : 1;
    const dl = delay ? +delay.value : 0;
    const dm = delim ? delim.value : '';
    const label = `scramble · ${key}${key==='custom' ? ':'+cs.slice(0,10):''} · ${d.toFixed(1)}s · ${dm ? 'words' : 'chars'}${rtl?' · rtl':''}`;
    if(status) status.textContent = label + (soundOn && !muted() ? ' · ♪ '+ (()=>{ const s=getSource('scramble'); return s.kind==='file' ? 'file '+s.file : (voiceSel?voiceSel.value:'random'); })() : '');
    // sound synced
    playScramble(d*1000);
    // animate
    try{
      document.documentElement.style.setProperty('--dur-scramble', d.toFixed(1)+'s');
      scrambleText(preview, { text, chars: cs, duration: d, speed: sp, revealDelay: dl, delimiter: dm, rightToLeft: rtl, tweenLength: tween,
      });
    }catch{}
  };
  let tmr=null;
  const onText = () => { clearTimeout(tmr); tmr=setTimeout(doScramble, 180); };
  const onChars = () => { if(customRow) customRow.style.display = (charsSel.value==='custom')?'':'none'; syncOutputs(); doScramble(); };
  const onDur = () => { syncOutputs(); };
  const onSpeed = () => { syncOutputs(); };
  const onDelay = () => { syncOutputs(); };
  const onRtl = () => { rtl=!rtl; rtlBtn.classList.toggle('on', rtl); rtlBtn.setAttribute('aria-pressed', String(rtl)); rtlBtn.textContent = rtl ? 'right → left' : 'left → right'; doScramble(); };
  const onTween = () => { tween=!tween; tweenBtn.classList.toggle('on', tween); tweenBtn.setAttribute('aria-pressed', String(tween)); tweenBtn.textContent = tween ? 'tweenLength: on' : 'tweenLength: off'; doScramble(); };
  const onSound = () => { soundOn=!soundOn; soundBtn.classList.toggle('on', soundOn); soundBtn.setAttribute('aria-pressed', String(soundOn)); soundBtn.textContent = soundOn ? 'sound: on' : 'sound: off'; if(soundOn){ try{ getCtx()?.resume(); }catch{} } if(status) status.textContent = soundOn ? 'sound on — random decode voice' : 'sound off'; };
  const onReplay = () => doScramble();
  const onHover = () => { hoverOn=!hoverOn; hoverBtn.classList.toggle('on', hoverOn); hoverBtn.setAttribute('aria-pressed', String(hoverOn)); hoverBtn.textContent = hoverOn ? 'hover: on' : 'hover: off'; };
  const onStageEnter = () => { if(hoverOn) doScramble(); };
  const onVoice = () => { try{ setSource('scramble', { voice: voiceSel.value }); }catch{} if(soundOn) playScramble(240); };
  const onKind = () => { try{ setSource('scramble', { kind: kindSel.value }); syncSrcCtl(); const s=getSource('scramble'); if(status) status.textContent='scramble src: '+s.kind+' '+(s.kind==='file'?s.file:(s.voice||'random')); }catch{} if(soundOn && kindSel.value==='file') playScramble(240); };
  const onFile = () => { try{ setSource('scramble', { file: fileSel.value }); if(status) status.textContent='scramble src: file '+fileSel.value; }catch{} if(soundOn) playScramble(240); };
  // controls follow kind: voice is procedural-only, file select is file-only
  const syncSrcCtl = () => { const s=getSource('scramble'); const isFile=s.kind==='file'; if(voiceSel) voiceSel.disabled=isFile; if(fileSel) fileSel.disabled=!isFile; };
  const onAlign = (e) => { const b=e.target.closest('[data-scramble-align]'); if(!b) return; align=b.dataset.scrambleAlign||'center'; alignBtns.forEach(x=> x.classList.toggle('on', x===b)); preview.style.textAlign=align; };
  const onPlayLoad = async () => { if(!soundOn || muted()){ if(status) status.textContent='muted — enable sound first'; return; } try{ const r=await playSlot('load', 0.5); if(status) status.textContent='load · '+r; }catch{} };
  if(inp) inp.addEventListener('input', onText);
  if(charsSel) charsSel.addEventListener('change', onChars);
  if(customInp) customInp.addEventListener('input', ()=> { syncOutputs(); doScramble(); });
  [dur,speed,delay].forEach(c=> c && c.addEventListener('input', c===dur?onDur:c===speed?onSpeed:onDelay));
  [dur,speed,delay].forEach(c=> c && c.addEventListener('change', doScramble));
  if(delim) delim.addEventListener('change', doScramble);
  if(rtlBtn) rtlBtn.addEventListener('click', onRtl);
  if(tweenBtn) tweenBtn.addEventListener('click', onTween);
  if(soundBtn) soundBtn.addEventListener('click', onSound);
  if(voiceSel) voiceSel.addEventListener('change', onVoice);
  if(kindSel) kindSel.addEventListener('change', onKind);
  if(fileSel) fileSel.addEventListener('change', onFile);
  if(replayBtn) replayBtn.addEventListener('click', onReplay);
  if(hoverBtn) hoverBtn.addEventListener('click', onHover);
  if(playLoadBtn) playLoadBtn.addEventListener('click', onPlayLoad);
  const alignGroup = lab.querySelector('[data-scramble-align-group]');
  if(alignGroup) alignGroup.addEventListener('click', onAlign);
  const tabBar = root.querySelector('[data-scramble-tabs]');
  const onTabs = (e) => { const b=e.target.closest('[data-tab]'); if(!b||!tabBar) return;
    tabBar.querySelectorAll('[data-tab]').forEach(x=> { x.classList.toggle('on', x===b); x.setAttribute('aria-selected', String(x===b)); });
    root.querySelectorAll('[data-tab-panel]').forEach(pn=> { pn.hidden = pn.dataset.tabPanel!==b.dataset.tab; }); };
  if(fontSel) fontSel.addEventListener('change', ()=> { applyFont(); doScramble(); });
  if(stage) stage.addEventListener('pointerenter', onStageEnter);
  if(tabBar) tabBar.addEventListener('click', onTabs);
  // init
  applyFont(); syncOutputs(); syncSrcCtl(); if(customRow) customRow.style.display='none';
  // first run
  setTimeout(doScramble, 260);
  return ()=>{
    clearTimeout(tmr);
    if(inp) inp.removeEventListener('input', onText);
    if(charsSel) charsSel.removeEventListener('change', onChars);
    if(customInp) customInp.removeEventListener('input', doScramble);
    [dur,speed,delay].forEach(c=> c && c.removeEventListener('input', c===dur?onDur:c===speed?onSpeed:onDelay));
    [dur,speed,delay].forEach(c=> c && c.removeEventListener('change', doScramble));
    if(delim) delim.removeEventListener('change', doScramble);
    if(rtlBtn) rtlBtn.removeEventListener('click', onRtl);
    if(tweenBtn) tweenBtn.removeEventListener('click', onTween);
    if(soundBtn) soundBtn.removeEventListener('click', onSound);
    if(voiceSel) voiceSel.removeEventListener('change', onVoice);
    if(kindSel) kindSel.removeEventListener('change', onKind);
    if(fileSel) fileSel.removeEventListener('change', onFile);
    if(replayBtn) replayBtn.removeEventListener('click', onReplay);
    if(hoverBtn) hoverBtn.removeEventListener('click', onHover);
    if(playLoadBtn) playLoadBtn.removeEventListener('click', onPlayLoad);
    if(alignGroup) alignGroup.removeEventListener('click', onAlign);
    if(fontSel) fontSel.removeEventListener('change', applyFont);
    if(stage) stage.removeEventListener('pointerenter', onStageEnter);
    if(tabBar) tabBar.removeEventListener('click', onTabs);
    /* shared ctx stays alive — no suspend on unmount */
  };
}
