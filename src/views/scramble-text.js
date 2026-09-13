/* ADAM/FX — ScrambleText · GSAP-like decoder (no GSAP, no deps). Token-driven.
   API: scrambleText(el, { text, chars, duration, revealDelay, speed, delimiter, rightToLeft, tweenLength, newClass, oldClass, onUpdate, onComplete })
   - text: string | "{original}" (default original). duration: seconds (default 1). revealDelay: seconds (0).
   - chars: "upperCase"|"lowerCase"|"upperAndLowerCase"|custom string. speed: 1 = refresh ~30ms.
   - delimiter: "" char-by-char, " " word-by-word. rightToLeft, tweenLength (true), newClass/oldClass.
   Respects prefers-reduced-motion. Returns { kill, promise }. Also: killScramble(el). */
const MAP = { upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lowerCase: 'abcdefghijklmnopqrstuvwxyz', upperAndLowerCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' };
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const charsFor = (c) => MAP[c] || (typeof c==='string' && c.length ? c : MAP.upperCase);
const rnd = (cs) => cs[Math.floor(Math.random()*cs.length)];
const reduced = () => { try{ return matchMedia('(prefers-reduced-motion: reduce)').matches }catch{ return false } };
const active = new WeakMap();
export function killScramble(el){ const a=active.get(el); if(a) a.kill(); }
export function scrambleText(el, opts){
  if(!el || !(el instanceof Element)) return { kill(){}, promise: Promise.resolve() };
  const prev = active.get(el); if(prev) prev.kill();
  let o = typeof opts==='string' ? { text: opts } : { ...(opts||{}) };
  const original = el.textContent ?? '';
  let target = o.text; if(target==null || target==='{original}') target = original; target = String(target);
  const cs = charsFor(o.chars ?? 'upperCase');
  const dur = Math.max(0.12, Number(o.duration ?? 1) || 1);
  const delay = Math.max(0, Number(o.revealDelay ?? 0) || 0);
  const speed = Math.max(0.08, Number(o.speed ?? 1) || 1);
  const delim = o.delimiter != null ? String(o.delimiter) : '';
  const rtl = !!o.rightToLeft, tweenLen = o.tweenLength !== false;
  const newClass = o.newClass||null, oldClass=o.oldClass||null, onUpdate=o.onUpdate, onComplete=o.onComplete;
  const interval = Math.max(14, 36 / speed);
  const durMs = dur*1000, delayMs = delay*1000;
  if(reduced() || durMs<=16){ el.textContent = target; try{ onComplete&&onComplete(); }catch{} return { kill(){}, promise: Promise.resolve() }; }
  let raf=0, dead=false, lastRefresh=0, lastRevealed=-1, start=performance.now();
  let resolve; const promise = new Promise((r)=> resolve=r);
  const kill = ()=> { dead=true; if(raf) cancelAnimationFrame(raf); active.delete(el); };
  active.set(el,{kill});
  const isWord = delim.length>0;
  const words = isWord ? target.split(delim) : null;
  const escDelim = esc(delim);
  // scramble stores
  let wordScrams = isWord ? words.map((w)=> Array.from({length:w.length},()=> rnd(cs))) : null;
  let charScram = !isWord ? Array.from({length: Math.max(original.length, target.length)},()=> rnd(cs)) : null;
  const ensureLen = (n)=> { if(!charScram) return; if(charScram.length<n) charScram.push(...Array.from({length:n-charScram.length},()=> rnd(cs))); if(charScram.length>n) charScram.length=n; };
  const refresh = ()=> { if(isWord) wordScrams = words.map((w)=> Array.from({length:w.length},()=> rnd(cs))); else for(let i=0;i<charScram.length;i++) charScram[i]=rnd(cs); };
  let lastOut='';
  const build = (revealed, curLen)=>{
    if(isWord){
      const tot = words.length;
      if(newClass||oldClass){
        let h=''; for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed; const w=esc(words[i]); h += rev ? (newClass? `<span class="${newClass}">${w}</span>`: w) : (oldClass? `<span class="${oldClass}">${wordScrams[i].map(esc).join('')}</span>`: wordScrams[i].map(esc).join('')); if(i<tot-1) h+=escDelim; } return { html:h, isHtml:true };
      }
      let t=''; for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed; t += rev ? words[i] : wordScrams[i].join(''); if(i<tot-1) t+=delim; } return { html:t, isHtml:false };
    }
    const tot = curLen;
    if(newClass||oldClass){
      let h=''; for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed; const ch = rev ? (i<target.length? target[i]:'') : (charScram[i]||rnd(cs)); const cls = rev? newClass: oldClass; h += cls ? `<span class="${cls}">${esc(ch)}</span>` : esc(ch); } return { html:h, isHtml:true };
    }
    let t=''; for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed; t += rev ? (i<target.length? target[i]:'') : (charScram[i]||rnd(cs)); } return { html:t, isHtml:false };
  };
  const frame = (now)=>{
    if(dead) return;
    const elapsed = now - start, prog = Math.min(1, elapsed / durMs);
    if(prog>=1){
      if(newClass||oldClass){
        if(isWord){ const h = words.map((w)=> newClass? `<span class="${newClass}">${esc(w)}</span>`: esc(w)).join(escDelim); el.innerHTML = h; }
        else { let h=''; for(let i=0;i<target.length;i++) h+= newClass? `<span class="${newClass}">${esc(target[i])}</span>`: esc(target[i]); el.innerHTML = h; if(!h) el.textContent = target; }
      } else el.textContent = target;
      try{ onUpdate&&onUpdate({progress:1,revealed:isWord?words.length:target.length}); }catch{}
      try{ onComplete&&onComplete(); }catch{}
      active.delete(el); resolve(); return;
    }
    let curLen = isWord ? words.length : (tweenLen ? Math.round(original.length + (target.length - original.length)*prog) : target.length);
    if(!isWord) { curLen = Math.max(0,curLen); ensureLen(curLen); }
    let revealed=0;
    if(elapsed >= delayMs){ const eff = Math.min(1, Math.max(0,(elapsed - delayMs)/Math.max(1,durMs - delayMs))); const tot = isWord ? words.length : curLen; revealed = Math.floor(eff * tot); }
    const needRefresh = (now - lastRefresh >= interval) || revealed !== lastRevealed;
    if(needRefresh){ refresh(); lastRefresh = now; }
    const shouldRender = needRefresh || lastRevealed!==revealed;
    if(shouldRender){
      const { html, isHtml } = build(revealed, curLen);
      if(html!==lastOut){ if(isHtml) el.innerHTML = html; else el.textContent = html; lastOut = html; }
      try{ onUpdate&&onUpdate({progress:prog,revealed,total:isWord?words.length:curLen}); }catch{}
      lastRevealed = revealed;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return { kill, promise };
}
export default scrambleText;
