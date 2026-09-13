/* ADAM/FX — views/scramble/build · frame html builder · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { esc, rnd } from './helpers.js';
export function buildScramble(st, revealed, curLen){
  const {isWord, words, newClass, oldClass, rtl, wordScrams, charScram,
    escDelim, delim, target, cs} = st;
    if(isWord){
      const tot = words.length;
      if(newClass||oldClass){
        let h='';
        for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed;
          const w=esc(words[i]);
          h += rev ? (newClass? [
          `<span class="`,
          newClass,
          `">`,
          w,
          `</span>`,
        ].join(''): w) : (oldClass? [
          `<span class="`,
          oldClass,
          `">`,
          wordScrams[i].map(esc).join(''),
          `</span>`,
        ].join(''): wordScrams[i].map(esc).join('')); if(i<tot-1) h+=escDelim; } return { html:h, isHtml:true };
      }
      let t='';
      for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed;
        t += rev ? words[i] : wordScrams[i]
          .join('');
        if(i<tot-1) t+=delim;
      } return { html:t,
        isHtml:false };
    }
    const tot = curLen;
    if(newClass||oldClass){
      let h='';
      for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed;
        const ch = rev ? (i<target.length? target[i]:'') : (charScram[i]||rnd(cs));
        const cls = rev? newClass: oldClass;
        h += cls ? [
        `<span class="`,
        cls,
        `">`,
        esc(ch),
        `</span>`,
      ].join('') : esc(ch); } return { html:h, isHtml:true };
    }
    let t='';
    for(let i=0;i<tot;i++){ const rev = rtl ? i >= tot - revealed : i < revealed;
      t += rev ? (i<target.length? target[i]:'') : (charScram[i]||rnd(cs));
    } return { html:t,
      isHtml:false };
}
