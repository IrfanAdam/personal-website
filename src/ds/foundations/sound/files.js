/* ADAM/DS — ds/foundations/sound/files · file palette markup ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-4] */
// Exports: filesHtml — single player on right, no preview column
import { FILES_META } from './data.js';

function row(f) {
  return [
    `<tr data-file="${f.id}">`,
    `<td><span class="tok">${f.id}</span></td>`,
    `<td>${f.desc}</td>`,
    `<td class="snd-file-ctrl">`,
    `<button class="pill snd-play" data-snd-file="${f.id}">▶ Play</button>`,
    `<label class="snd-knob inline">gain <input type="range" data-snd="fgain" min="0" max="100" value="80">` +
      `<output data-snd-v="fgain">80%</output></label>`,
    `</td>`,
    `</tr>`,
  ].join('');
}

export function filesHtml() {
  return [
    `<h3>File — vendored <span class="tok">/public/sounds</span></h3>`,
    `<p class="sub">Local first <span class="tok">/sounds/*</span>, remote ` +
      `<span class="tok">raw.githubusercontent.com/IrfanAdam/web-sounds</span> fallback. ` +
      `<span class="tok">playFileId</span> uses the same ` +
      `<span class="tok">&lt;audio&gt;</span> path — cached per id.</p>`,
    `<table class="ds-table snd-file-table"><tr><th>File</th><th>Desc</th><th>Play</th></tr>`,
    FILES_META.map(row).join(''),
    `</table>`,
  ].join('');
}
