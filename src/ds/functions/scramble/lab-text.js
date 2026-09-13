/* ADAM/DS — ds/scramble/lab-text · text controls · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function labText(o){return [
  `<div data-scramble-stage `,
  `style="min-height:var(--space-90);display:grid;place-items:center;padding:var(--space-16);border:var(--border-hai`,
  `rline);background:var(--color-surface);overflow:hidden">`,
  `<div data-scramble-preview `,
  `style="font-family:var(--font-sans);font-size:var(--text-display);line-height:var(--leading-display);letter-spaci`,
  `ng:var(--tracking-display);font-weight:700;width:100%;max-width:100%;overflow-wrap:break-word;text-align:left">Ir`,
  `fan Adam, crafting experiences</div></div>`,
].join('')
+ `<div class="fx-controls">`
+ [
  `<label class="fx-row">text <input type="text" value="Irfan Adam, crafting experiences" data-scramble="text" `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color`,
  `-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8);width:100%"><output data-scramble-out>`,
  `</output></label>`,
].join('')
+ [
  `<label class="fx-row">chars <select data-scramble="chars">`,
  o.charOpts,
  `</select><output data-scramble-chars-v>symbols</output></label>`,
].join('')
+ [
  `<label class="fx-row" data-scramble-custom-row style="display:none">custom <input type="text" `,
  `placeholder="!<>-_\\/[]{}—=+*^?#" data-scramble="custom" `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color`,
  `-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8);width:100%"><output></output></label>`,
].join('')
+ [
  `<label class="fx-row">duration <input type="range" min="0.3" max="3" step="0.1" value="0.9" data-scramble="dur">`,
  `<output data-scramble-dur>0.9s</output></label>`,
].join('')
+ [
  `<label class="fx-row">speed <input type="range" min="0.2" max="4" step="0.1" value="1" data-scramble="speed">`,
  `<output data-scramble-speed>1</output></label>`,
].join('')
+ [
  `<label class="fx-row">revealDelay <input type="range" min="0" max="1" step="0.05" value="0" `,
  `data-scramble="delay"><output data-scramble-delay>0s</output></label>`,
].join('')
+ [
  `<label class="fx-row">delimiter <select data-scramble="delim"><option value="" selected>chars ""</option>`,
  `<option value=" ">words " "</option></select><output></output></label>`,
].join('')
+ [
  `<div class="fx-btns"><button class="pill" data-scramble="rtl" aria-pressed="false">left → right</button>`,
  `<button class="pill on" data-scramble="tween" aria-pressed="true">tweenLength: on</button></div>`,
].join('')
+ [
  `<label class="fx-row">type style <select data-scramble="font">`,
  o.fontOpts,
  `</select><output data-scramble-font-v>Display</output></label>`,
].join('');}
