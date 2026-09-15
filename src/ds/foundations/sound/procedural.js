/* ADAM/DS — ds/foundations/sound/procedural · procedural grid markup ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: proceduralHtml
// — Markup —
import { VOICES } from './data.js';

function card(v) {
  const hasFreq = v.id === 'tick' || v.id === 'blip';
  const freqInput = `<input type="range" data-snd="freq" min="200" max="3400" ` +
    `step="20" value="${v.freq}">`;
  const freqRow = hasFreq
    ? `<label class="snd-knob">freq ${freqInput}` +
      `<output data-snd-v="freq">${v.freq}Hz</output></label>`
    : `<label class="snd-knob off">freq <span class="tok">fixed</span><output>—</output></label>`;
  return [
    `<div class="ds-cell snd-voice" data-voice="${v.id}">`,
    `<div class="snd-head"><span class="nm">${v.id}</span><span class="tok">${v.desc}</span></div>`,
    `<p class="snd-desc">${v.desc} · ${v.ms}ms default</p>`,
    `<button class="pill snd-play" data-snd-play="${v.id}">▶ Play</button>`,
    `<label class="snd-knob">gain <input type="range" data-snd="gain" min="0" max="100" ` +
      `step="5" value="60"><output data-snd-v="gain">60%</output></label>`,
    `<label class="snd-knob">ms <input type="range" data-snd="ms" min="40" max="900" ` +
      `step="10" value="${v.ms}"><output data-snd-v="ms">${v.ms}ms</output></label>`,
    freqRow,
    `</div>`,
  ].join('');
}

export function proceduralHtml() {
  return [
    `<h3>Procedural — 9 voices</h3>`,
    `<p class="sub">Offline synth → WAV → &lt;audio&gt;. Same ` +
      `<span class="tok">synth()</span> the site uses, so knobs ` +
      `translate to production. Plays via <span class="tok">element-sound</span> — no live ` +
      `<span class="tok">AudioContext</span> needed, survives silent Safari.</p>`,
    `<div class="snd-grid">`,
    VOICES.map(card).join(''),
    `</div>`,
  ].join('');
}
