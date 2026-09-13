/* ADAM/DS — ds/foundations/fx/tokens · graduated tokens · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace } from '../../specimens.js';
export function tokens(){return [
    `<h3>Graduated tokens — what each runs</h3>`,
    `<p class="sub">Numbers, not colors — click any card to copy the live value.</p>`,
  ].join('')
  + tokenTrace({ plain: true,
      rows: [['Cell count', '--fx-cell', '30 · reveal grid count'],
        ['Stagger wait', '--fx-wait', '0.72 · pause between cell waves'],
        ['Photo from', '--fx-photo-from', '0.93 · photo settle start'],
        ['Morph', '--fx-morph', '0.04 · split ease'],
        ['Split end', '--fx-split-end', '0.92 · split end point'],
        ['Skeleton beat', '--fx-skeleton', '120ms · placeholder pulse'],
        ['Sheen band', '--fx-sheen', '0.14 · shimmer band width'],
        ['Grid pitch', '--fx-grid-pitch', '14px · reveal grid lines'],
        ['FX color', '--dur-fx-color', '240ms · cell tint sweep'],
        ['FX span', '--dur-fx-span', '0.6s · cell sweep span'],
        ['Hero rise', '--dur-hero-rise', '860ms · hero entrance'],
        ['Glitch dur', '--dur-glitch', '2.4s · generic glitch loop'],
        ['Glitch X', '--fx-glitch-x', 'var(--space-1) · jitter'],
        ['Glitch skew', '--fx-glitch-skew', '-12deg · shear'],
        ['Glitch α', '--fx-glitch-opacity', '0.5 · flicker']] });}
