/* ADAM/DS — functions/sound · Sound lab · [plan:2026-09-23_134500-ds-coherent-consumable.md#phase-3] */
// Exports: title, render, mount — sound board as a Motion lab
import { html as soundHtml } from '../foundations/pane-sound.js';
import { mountSoundBoard } from '../foundations/sound/board.js';
export const title = 'Sound';
export function render() {
  return [
    `<p class="ds-crumb">Motion · Sound</p><div class="ds-hero"><h1>Sound — feedback you hear.</h1>`,
    `<p class="lede">Procedural WebAudio voices + vendored files — behaviour, so it lives `,
    `beside the motion labs, not in Foundations.</p></div>`,
    soundHtml(),
  ].join('');
}
export function mount(root) {
  return mountSoundBoard(root);
}
