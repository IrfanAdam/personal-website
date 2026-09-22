/* ADAM/APP — app boot · router + strip + theme init · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
import { initChrome } from './boot-chrome.js';
import { initStripbar } from './views/stripbar.js';
import { attachStripViewer } from './views/strip-viewer.js';
import { initProceedGate } from './views/proceed-gate.js';
import { initFooterShimmer } from './views/footer-shimmer.js';
import { armTransit } from './views/transit.js';
import { initRouting } from './boot/routing.js';
import './views/init-sound.js';

const root = document.getElementById('app');
const header = document.querySelector('.top');
const stripbar = document.getElementById('stripbar');
const { vtabs, stripLinks, closeBtn } = initStripbar(stripbar);
const stripViewerOff = attachStripViewer(stripbar);

initChrome(header);
initProceedGate();
initFooterShimmer();
document.addEventListener('click', armTransit, true);

initRouting({ root, vtabs, stripLinks, closeBtn });
