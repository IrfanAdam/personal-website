/* ADAM/DS — ds/pages-sound · Elements Sound vertical tabs ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-2] */
// Exports: title, render, mount — vertical Elements sheet
import { note } from './specimens.js';
import { tabs } from './tabs.js';
import { panes } from './sound-panes.js';
import { mountSoundBoard } from './foundations/sound/board.js';

// — Page —
export const title = 'Sound';
export function render() {
  return [
    `<p class="ds-crumb">Elements · Sound</p><div class="ds-hero"><h1>Sound with intent.</h1>`,
    `<p class="lede">Voices are behaviour, not decoration — procedural <span class="tok">synth</span> for elasticity, vendored <span class="tok">/sounds</span> for beds. One screen per set.</p>`,
    `<p class="sub"><a href="#/">← Overview</a></p></div>`,
    `<div data-sound-foundations>`,
    tabs({ vertical: true, panes }),
    `</div>`,
    note('Do', ['Use <span class="tok">playVoice</span>/<span class="tok">playFileId</span> — offline → <span class="tok">&lt;audio&gt;</span> survives silent Safari.'].join('')),
    note('Don’t', 'No autoplay on load; always guard with <span class="tok">isMuted()</span>.', 'dont'),
  ].join('');
}
export function mount(root) {
  return mountSoundBoard(root);
}
