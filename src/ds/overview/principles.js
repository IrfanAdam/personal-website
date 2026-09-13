/* ADAM/DS — overview/principles.js · principles markup · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { note, code } from '../specimens.js';

export function principlesHtml() {
  return [
    `<div class="ds-sec"><h2>Principles</h2>`,
    `<p class="sub">Five rules every specimen obeys — cut until it means more, not less.</p><div class="ds-grid c2">`,
    `<div class="ds-cell" style="border-left:var(--size-frame) solid var(--color-ink)">`,
    `<div class="nm">01 · Cut, don't dilute</div>`,
    `<div class="vl">Keep removing until one more cut would change the meaning — then stop. Smaller only counts if `,
    `nothing is lost.</div></div><div class="ds-cell"><div class="nm">02 · Let the void work</div>`,
    `<div class="vl">Paper and void do half the layout. Grayscale holds the structure; <span `,
    `class="tok">--color-accent</span> speaks only when it has to.</div></div><div class="ds-cell">`,
    `<div class="nm">03 · No soft edges</div>`,
    `<div class="vl">Every corner is <span class="tok">0</span>. Every radius is <span `,
    `class="tok">var(--radius-*)</span>. Cuts are clip-path, never blur.</div></div>`,
    `<div class="ds-cell" style="border-left:var(--size-frame) solid var(--color-accent)">`,
    `<div class="nm">04 · One signal at a time</div><div class="vl">`,
    `<span class="tok">--color-accent</span> is not decoration. It is the one thing in the room that can't be `,
    `missed — everything else stays quiet.</div></div></div>`,
    `<div class="ds-grid c2" style="margin-top:var(--space-12)"><div class="ds-cell">`,
    `<div class="nm">05 · Two voices only</div><div class="vl">`,
    `<span class="tok">Chivo Mono</span> for the machine — labels, kickers, timestamps. <span class="tok">Inter `,
    `Tight</span> for the headline. Never swapped, never a third.</div></div>`,
    `<div class="ds-cell" style="background:var(--color-ink); color:var(--color-bg); border-color:var(--color-ink)">`,
    `<div class="nm" style="color:var(--color-bg)">Freeform, still on-grid</div>`,
    `<div class="vl" style="color:color-mix(in srgb, var(--color-bg) 68%, transparent)">Collage is allowed, clutter `,
    `isn't. Tilt and overlap sit on a 12-col grid — hairline + dot grid keep it honest.</div></div></div>`,
    note('Do',
      ['Refine through tokens. <span class="tok">tokens.css</span> is the only file that holds raw values — this ',
      'overview is read-only and never restyles the live site.'].join('')),
    note('Don’t',
      ['No new hex, no literal radius, no new font. Propose a token instead. Images are texture, not content — ',
      'keep them desaturated until hover.'].join(''), 'dont'),
    `</div>`,
  ].join('');
}
