/* ADAM/DS — glitch · thin composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: title, render, mount — delegates to meta/source/sound/lab
import { TYPES } from '../../views/glitch-sound.js';
import { cardHTML, note, code } from '../specimens.js';
import { renderSourcePanel, mountSourcePanel } from './glitch/source-panel.js';
import { renderSoundPanel } from './glitch/sound-panel.js';
import { mountSoundBind } from './glitch/sound-bind.js';
import { mountSoundPlay } from './glitch/sound-play.js';
import { mountLabControls } from './glitch/lab-controls.js';

export const title = 'Glitch';

// — Markup —
export function render() {
  return [
    `<div class="ds-hero ds-hero--lab"><h1>Glitch — any container.</h1>`,
    `<p class="lede">Visual <span class="tok">.fx-glitch</span> + procedural audio palette: `,
    TYPES.join(' · '),
    `. Rendered with WebAudio, played back through audio elements. Default is <span class="tok">hum 320ms</span> `,
    `with proximity-loud gain (near = louder); other voices via <span class="tok">data-glitch-sound="chime"</span> `,
    `or <span class="tok">playSound('hum')</span>.</p></div>`,
  ].join('')
  + [
    `<div class="ds-tablist ds-tablist--line" role="tablist" data-glitch-tabs>`,
    `<button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button>`,
    `<button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`,
  ].join('')
  + `<div data-tab-panel="lab"><div class="ds-sec">`
  + [
    `<div class="ds-spec block"><div class="fx-split"><div data-lab="grid-card" style="min-width:0; flex:1 1 auto">`,
    cardHTML('Helix — sales telemetry', 'helix · 2024', '/images/helix.png', ['Sales CRM'], ''),
    `</div>`,
  ].join('')
  + renderSoundPanel()
  + `</div></div>`
  + renderSourcePanel()
  + [
    `<div class="fx-controls"><label class="fx-row">trigger <select data-ctl="trigger">`,
    `<option value="auto">infinite</option><option value="hover">hover</option><option value="once">once</option>`,
    `</select></label>`,
  ].join('')
  + [
    `<label class="fx-row">duration <input type="range" min="600" max="4800" step="100" value="2400" data-ctl="dur">`,
    `<output data-ctl-v>2400ms</output></label>`,
  ].join('')
  + [
    `<label class="fx-row">intensity <input type="range" min="1" max="8" step="1" value="1" data-ctl="int">`,
    `<output data-ctl-i>1px</output></label>`,
  ].join('')
  + [
    `<div class="fx-btns"><button class="pill" data-ctl="fire">fire once</button>`,
    `<button class="pill" data-ctl="pause">pause / resume</button></div></div></div>`,
  ].join('')
  + `</div>`
  + [
    `<div data-tab-panel="code" hidden><div class="ds-sec">`,
    code(`import { attachGlitch } from '../views/glitch.js';\nattachGlitch(el, { trigger: 'hover' });`),
    `</div></div>`,
    note('Do', 'Glitch marks one thing at a time.'),
  ].join('');
}

// — Bind —
export function mount(root) {
  const { api, offs } = mountSoundBind(root);
  const offPlay = mountSoundPlay(root, api);
  const offSrc = mountSourcePanel(root);
  const offLab = mountLabControls(root, api);
  return () => {
    try { offs.forEach((fn) => fn()); } catch {}
    try { offPlay(); } catch {}
    try { offSrc(); } catch {}
    try { offLab(); } catch {}
  };
}
