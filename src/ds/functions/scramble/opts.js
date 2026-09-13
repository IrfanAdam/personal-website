/* ADAM/DS — ds/scramble/opts · lab option builders · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { FILES } from '../../../views/sound-files.js';
import { getSource } from '../../../views/sound-source.js';
import { CHARS, FONT_STYLES, VOICES } from './meta.js';
export function buildOpts(){
  const charOpts = Object.keys(CHARS).map(k=> [
    `<option value="`,
    k,
    `"`,
    k==='symbols'?' selected':'',
    `>`,
    k,
    k!=='custom' ? ' · '+(CHARS[k].slice(0,12)+(CHARS[k].length>12?'…':'')) : '',
    `</option>`,
  ].join('')).join('');
  const fontOpts = Object.entries(FONT_STYLES).map(([k,v])=> `<option value="${k}">${v.label}</option>`).join('');
  const sc = getSource('scramble');
  const voiceOpts = VOICES.map(v=> [
    `<option value="`,
    v,
    `"`,
    v===(sc.voice||'random')?' selected':'',
    `>`,
    v,
    `</option>`,
  ].join('')).join('');
  const kindOpts = [
    `<option value="procedural"`,
    sc.kind==='procedural'?' selected':'',
    `>procedural</option><option value="file"`,
    sc.kind==='file'?' selected':'',
    `>file</option>`,
  ].join('');
  const fileOpts = FILES.map(f=> `<option value="${f.id}"${f.id===sc.file?' selected':''}>${f.id}</option>`).join('');
  return {charOpts, fontOpts, voiceOpts, kindOpts, fileOpts};
}
