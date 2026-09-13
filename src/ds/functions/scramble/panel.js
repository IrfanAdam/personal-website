/* ADAM/DS — scramble/panel · lab markup · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: render — lab + code tabs
import { FILES } from '../../../views/sound-files.js';
import { getSource } from '../../../views/sound-source.js';
import { note, code } from '../../specimens.js';
import { CHARS, FONT_STYLES, VOICES } from './meta.js';

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
