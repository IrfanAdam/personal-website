/* ADAM/DS — ds/scramble/code-tab · usage + tokens tab · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { code } from '../../specimens.js';
export function codeTab(){return [
  `<div data-tab-panel="code" hidden><div class="ds-sec"><h2>Usage</h2>`,
  `<p class="sub">Drop-in like GSAP, no plugin. Site helper + DS lab share the same engine.</p>`,
].join('')
+ [
  code([
    `import { scrambleText } from '../views/scramble-text.js';\n// string shorthand\nscrambleText(el, "NEW `,
    `TEXT");\n// full\nscrambleText(el, {\n  text: "THIS IS NEW TEXT",\n  chars: "upperCase",      // or `,
    `"lowerCase" | "upperAndLowerCase" | "!<>-_\\/[]{}—=+*^?#"\n  duration: 0.9,           // seconds (→ `,
    `--dur-scramble)\n  revealDelay: 0.2,        // seconds pure scramble before reveal\n  speed: 1,                `,
    `// 0.2 slow … 3 frantic\n  delimiter: "",           // "" chars or " " words\n  rightToLeft: false,\n  `,
    `tweenLength: true,\n  newClass: "is-decoded",  // optional reveal tint\n  oldClass: "is-scrambling"\n});\n// `,
    `also respects prefers-reduced-motion — jumps to final`,
  ].join('')),
].join('')
+ [
  code([
    `// GSAP parity if you already use gsap:\n// gsap.to(el, { duration: 0.9, scrambleText: { text: "HELLO", chars: `,
    `"XO", speed: 0.3 } })\n// is equivalent to:\n// scrambleText(el, { text: "HELLO", chars: "XO", duration: 0.9, `,
    `speed: 0.3 })`,
  ].join('')),
].join('')
+ `</div>`
+ [
  `<div class="ds-sec"><h2>Tokens</h2>`,
  `<p class="sub">Graduation target — lab writes a preview, site reads the token.</p><table class="ds-table"><tr>`,
  `<th>Lab</th><th>Token</th></tr><tr><td>duration 0.9s</td><td><span class="tok">--dur-scramble</span></td></tr>`,
  `<tr><td>chars default</td><td><span class="tok">--fx-scramble-chars</span> (upperCase)</td></tr></table>`,
  code([
    `el.style.setProperty('--dur-scramble', dur+'s') // lab preview\n// site: animation reads var(--dur-scramble) → `,
    `scrambleText(el,{duration: parseFloat(getComputedStyle(el).getPropertyValue('--dur-scramble'))})`,
  ].join('')),
].join('')
+ `</div></div>`;;}
