/* ADAM/DS — ds/foundations/sound/scope · scope + status markup ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: scopeHtml
// — Markup —
export function scopeHtml() {
  return [
    `<h3>Scope — what you just heard</h3>`,
    `<p class="sub">Waveform renders from the same offline buffer that plays. ` +
      `File draws decode the vendored wav/mp3. Respects ` +
      `<span class="tok">adam-sound</span> toggle + <span class="tok">prefers-reduced-motion</span>.</p>`,
    `<div class="snd-scope-wrap">`,
    `<canvas id="sndScope" class="snd-scope" width="720" height="128" aria-label="Sound waveform"></canvas>`,
    `<div class="snd-scope-bar">`,
    `<span class="fx-status" data-snd-status>idle — hit ▶ on any voice or file</span>`,
    `<span class="tok" data-snd-info>—</span>`,
    `</div>`,
    `</div>`,
    `<div class="snd-global">`,
    `<label class="snd-knob inline">master <input type="range" data-snd="master" min="0" max="100" value="70">` +
      `<output data-snd-v="master">70%</output></label>`,
    `<button class="pill" data-snd="testa">test A · live osc</button>`,
    `<button class="pill" data-snd="testb">test B · file tone</button>`,
    `<button class="pill" data-snd="resetc">reset ctx</button>`,
    `</div>`,
  ].join('');
}
