/* ADAM/DS — Overview + principles. */
import { note, code } from './specimens.js';
export const title = 'Overview';
export function render() {
  return `<p class="ds-crumb">ADAM/DS · v1.0.0</p><div class="ds-hero"><h1>Sharp editorial minimalism.</h1>
<p class="lede">Warm paper, deep ink, hard 90° cuts. This system documents the existing portfolio styles — no new styles invented. Read-only: nothing here changes the live site.</p>
<div class="ds-status"><i>tokens <b>1 source</b></i><i>radius <b>0 everywhere</b></i><i>build <b>✓</b></i><i>site <b>untouched</b></i></div></div>
<div class="ds-sec"><h2>Principles</h2><p class="sub">Five rules every specimen on this site obeys.</p>
<div class="ds-grid c2"><div class="ds-cell"><div class="nm">01 · Paper, not white</div><div class="vl">Surfaces are warm stone (<span class="tok">--stone-100</span>), text is warm ink. Frosted glass header only — no shadows, no cards floating.</div></div>
<div class="ds-cell"><div class="nm">02 · Zero is the geometry</div><div class="vl">Every radius token is <span class="tok">0</span> and every radius consumes <span class="tok">var(--radius-*)</span>. The hard cut is the brand.</div></div>
<div class="ds-cell"><div class="nm">03 · One accent, rarely</div><div class="vl"><span class="tok">--color-accent</span> never does chrome — only editorial callouts. Chrome is ink, line, and muted.</div></div>
<div class="ds-cell"><div class="nm">04 · Mono is metadata</div><div class="vl">Chivo Mono carries every label, kicker, and timestamp. Inter Tight carries every headline and sentence. Never swapped.</div></div></div>
${note('Do', 'Refine existing styles through tokens. <span class="tok">tokens.css</span> is the only file that holds raw values.')}
${note('Don’t', 'No new hex, no literal radius, no new font. Propose a token instead.', 'dont')}</div>
<div class="ds-sec"><h2>How to read this site</h2><p class="sub">Foundations are the raw material · Tokens is the contract · Components dogfood real site classes · Patterns compose pages · Quality gates releases.</p>
${code('tokens.css (primitives → semantic → aliases)\n    ▲ single source\nbase.css · pages.css · masonry.css (consume var() only)\n    ▲ live specimens below render these exact classes')}</div>`;
}
