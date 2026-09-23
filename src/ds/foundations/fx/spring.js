/* ADAM/DS — ds/foundations/fx/spring · viewer spring + glitch link ·
   [plan:2026-09-23_151320-ds-fx-cards.md#phase-1] */
import { tokenTrace, note } from '../../specimens.js';
export function spring(){return [
    `<h3>Viewer spring — live tokens</h3>`,
    `<p class="sub">Intent + spring the viewer route reads: threshold is intent travel, idle is dismiss wait, `,
    `debounce settles the pointer, k / fr are spring stiffness / friction. Full lab at <a `,
    `href="#/functions/viewer">Viewer</a>.</p>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Threshold', '--fx-viewer-threshold', '12px · intent travel'],
        ['Idle', '--fx-viewer-idle', '850ms · dismiss wait'],
        ['Debounce', '--fx-viewer-debounce', '70ms · pointer settle'],
        ['Stiffness k', '--fx-viewer-k', '0.1 · spring stiffness'],
        ['Friction fr', '--fx-viewer-fr', '0.54 · spring friction']] })
  + tokenTrace({ plain: true,
      rows: [['Viewer border', '--viewer-border', 'frosted frame the viewer opens in'],
        ['Viewer shadow', '--shadow-viewer', 'lift off the page behind the frame'],
        ['Viewer in', '--dur-viewer-in', '300ms · open travel'],
        ['Viewer line', '--dur-viewer-line', '780ms · tether draw']] })
  + [
    `<h3>Glitch — generic container</h3>`,
    `<p class="sub">The Distort tab above explains the visible shift, shear, and flicker. `,
    `Use <span class="tok">.fx-glitch</span> or <span class="tok">attachGlitch(el)</span> `,
    `to apply it; the full lab lives at <a href="#/functions/glitch">Glitch</a>.</p>`,
  ].join('')
  + note('Do', 'Graduate knobs through tokens — lab-local count / gutter / order stay out of the contract.');}
