/* ADAM/DS — ds/atlas/shell · atlas route markup (stage, dock, tip, fullscreen)
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase12] */
import { dockHTML } from './dock.js';
// Exports: shellHTML
export const shellHTML = () => [
  '<p class="ds-crumb">Start · atlas</p><div class="ds-hero"><h1>Architecture atlas.</h1>',
  '<p class="lede">Functions, components, and foundations on one canvas — live from ',
  '<span class="tok">arch-schema.json</span>. Drag to pan, wheel to zoom, hover to trail, click to focus, ',
  'shift-click a second node for the shortest import chain.</p></div>',
  '<div class="ds-sec"><div class="atlas-stage" id="atlasStage">',
  '<svg id="atlasSvg" class="atlas-canvas" role="img" aria-label="Architecture graph"></svg>',
  '<button class="atlas-full-btn" id="atlasFull" type="button" data-full="1" aria-pressed="false" ',
  'aria-label="Fullscreen stage" title="Fullscreen stage">⛶ Fullscreen</button>',
  dockHTML(),
  '<div class="atlas-tip" id="atlasTip" hidden></div>',
  '<button class="atlas-close" id="atlasClose" type="button" aria-label="Close fullscreen" hidden>✕</button>',
  '</div></div>',
].join('');
