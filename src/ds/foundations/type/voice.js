/* ADAM/DS — ds/foundations/type/voice · voice · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { code, note } from '../../specimens.js';
export function voice(){return [
    `<h3>② Voice — Inter Tight speaks, Chivo Mono labels</h3>`,
    `<p class="sub">Hierarchy first, tester last: hero → h1 → section → card → meta.</p>`,
  ].join('')
  + code(['hero Display → h1 Title → section h2 → card card-title / small → meta meta / label / micro (mono)\nInter ',
    'Tight: voice (headlines, body, cards) · Chivo Mono: metadata (kickers, tags, specs, captions)'].join(''))
  + note('Do',
    ['Pair sizes with their leading + tracking tokens — never set a bare <span class="tok">font-size</span> ',
      'without its line-height.'].join(''));}
