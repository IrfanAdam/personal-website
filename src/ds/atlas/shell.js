/* ADAM/DS — ds/atlas/shell · atlas route markup (stage, dock, legend, tip)
   [plan:2026-09-14_192124-atlas-fullscreen.md#phase-1] */
import { dockHTML, legendHTML } from './dock.js';
// Exports: shellHTML
export const shellHTML = () => [
  '<p class="ds-crumb">Start · atlas</p><div class="ds-hero"><h1>Architecture atlas.</h1>',
  '<p class="lede">Functions, components, and foundations on one canvas — live from ',
  '<span class="tok">arch-schema.json</span>. Drag to pan, wheel to zoom, hover to trail, click to focus, ',
  'shift-click a second node for the shortest import chain.</p></div>',
  '<div class="ds-sec"><div class="atlas-stage" id="atlasStage">',
  '<svg id="atlasSvg" class="atlas-canvas" role="img" aria-label="Architecture graph"></svg>',
  dockHTML(),
  legendHTML(),
  '<div class="atlas-tip" id="atlasTip" hidden></div>',
  '<button class="atlas-close" id="atlasClose" type="button" aria-label="Close fullscreen" hidden>✕</button>',
  '</div></div>',
].join('');
