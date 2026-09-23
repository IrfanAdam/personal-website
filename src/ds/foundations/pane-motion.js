/* ADAM/DS — ds/foundations/pane-motion · composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace, note, code } from '../specimens.js';
import { bars, table, stage, blurs } from './motion/sections.js';
export const label = 'Motion';
export function html() {
  return [
    `<div class="ds-sec"><h2>Motion &amp; depth</h2>`,
    `<p class="sub">Durations are prescriptions — each step owns its uses. Bars are true-scale to the longest step; `,
    `values read live.</p>`,
  ].join('')
  + `<h3>Durations — true-scale</h3>` + bars()
  + [
    `<h3>Duration → use</h3>`,
    `<p class="sub">Reach for the use, not the number. Graduated demos live in FX, `,
    `playable tuning in the <a href="#/functions">Motion labs</a>.</p>`,
  ].join('') + table()
  + [
    `<h3>Easing — signature curve</h3>`,
    `<p class="sub">One curve with a fast-out, soft-land feel runs all signature travel: header frame, image zoom, `,
    `content reveal. Standard <span class="tok">ease</span> is ambient-only. Replay the dot to feel it.</p>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Signature', '--ease-signature', 'fast-out soft-land · frame + zoom + reveal'],
        ['Standard', '--ease-standard', 'ease · ambient loops only']] }) + stage()
  + [
    `<h3>Press · hover — live</h3>`,
    `<p class="sub">Press the button (<span class="tok">var(--scale-press)</span> squash); hover the row (dims to `,
    `<span class="tok">var(--opacity-hover)</span>); images settle at <span `,
    `class="tok">var(--scale-zoom)</span>.</p><div class="fd-rowbtns"><button class="fd-press">press me</button>`,
    `</div><div class="fd-hover">hover me — unselected rows dim</div>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Press squash', '--scale-press', '0.94 · button press'],
        ['Hover dim', '--opacity-hover', '0.55 · unselected row hover'],
        ['Zoom settle', '--scale-zoom', '1.015 · image hover zoom']] })
  + [
    `<h3>Depth — line + frost, never shadow</h3>`,
    `<p class="sub">Elevation is a 1px line plus frosted blur. Shadows exist only on-media and in the viewer — `,
    `never as UI depth. Frost recipe per step: blur below + saturate alongside.</p>`,
  ].join('') + blurs()
  + tokenTrace({ plain: true,
      rows: [['Saturation header', '--sat-header', '1.6 · frosted header recipe'],
        ['Saturation scrim', '--sat-scrim', '1.35 · card scrim recipe']] })
  + [
    `<h3>Reduced motion — contract</h3>`,
    `<p class="sub">The OS setting is honored live: flip <span class="tok">prefers-reduced-motion</span> and every `,
    `demo on this page goes static. The shimmer freeze button previews the same end-state.</p>`,
  ].join('')
  + code(['collapse → instant: shimmer sweep (frozen) · rise / glide / dot travel (none) · grid reveal (instant — ',
    'guarded in main.js + fx-lab)\nsurvives: end-states apply instantly (opacity, layout) · theme toggle · ',
    'nothing is motion-only'].join(''))
  + note('Do',
    ['Durations read live <span class="tok">var(--dur-*)</span>; travel runs <span ',
      'class="tok">var(--ease-signature)</span> unless you prove otherwise.'].join(''))
  + note('Don’t',
    'No raw <span class="tok">ms</span> or cubic-bezier literals outside <span class="tok">tokens.css</span>.',
    'dont')
  + `</div>`;
}
