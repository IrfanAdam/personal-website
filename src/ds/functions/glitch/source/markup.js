/* ADAM/DS — ds/glitch/source/markup · source picker markup ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-1] */
// Exports: renderSourcePanel — source picker markup
import { getSource } from '../../../../views/sound-source.js';
import { buildFileOpts, buildKindOpts, buildVoiceOpts } from '../meta.js';
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
