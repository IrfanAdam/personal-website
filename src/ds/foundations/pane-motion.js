/* ADAM/DS foundations · Motion + Depth pane — durations as bars, easing live. */
import { tokenTrace, note, code } from '../specimens.js';
const DURS = [['Fast', '--dur-fast', '7%', 0], ['Base', '--dur-base', '9%', 0], ['Med', '--dur-med', '10%', 0], ['Soft', '--dur-soft', '11%', 0], ['Slow', '--dur-slow', '13%', 0], ['Reveal', '--dur-reveal', '14%', 0], ['Glide', '--dur-glide', '17%', 0], ['Blur', '--dur-blur', '20%', 0], ['Zoom', '--dur-zoom', '30%', 0], ['Hero rise', '--dur-hero-rise', '39%', 0], ['Shimmer', '--dur-shimmer', '100%', 1]];
const BLURS = [['Header frost', '--blur-header'], ['Card scrim', '--blur-scrim'], ['Placeholder', '--blur-placeholder']];
export const label = 'Motion · Depth';
export function html() {
  const bars = `<div class="fd-durs">${DURS.map(([n, t, w, hot]) => `<div class="fd-dur" data-copy="${t}" title="Click to copy ${t}" style="cursor:pointer"><b>${n}</b><div class="fd-track"><div class="fd-fill${hot ? ' accent' : ''}" style="width:${w}"></div></div><output data-live="${t}">${t}</output></div>`).join('')}</div>`;
  const stage = `<div class="fd-stage" id="easeStage"><div class="fd-dot"></div></div><div class="fx-controls" id="easeCtrls"><label class="fx-row">dur <select data-ease="d"><option value="var(--dur-fast)">fast</option><option value="var(--dur-glide)" selected>glide 380ms</option><option value="var(--dur-zoom)">zoom 650ms</option><option value="var(--dur-hero-rise)">hero rise</option></select></label><label class="fx-row">ease <select data-ease="e"><option value="var(--ease-signature)" selected>signature</option><option value="var(--ease-standard)">standard</option></select></label><div class="fd-rowbtns"><button class="tok" data-ease-replay>replay glide</button></div></div>`;
  const blurs = `<div class="fd-blurrow">${BLURS.map(([n, t]) => `<div class="fd-blur" data-copy="${t}" title="Click to copy ${t}" style="cursor:pointer"><i style="backdrop-filter:blur(var(${t}));-webkit-backdrop-filter:blur(var(${t}))">${n} · <span data-live="${t}">${t}</span></i></div>`).join('')}</div>`;
  return `<div class="ds-sec"><h2>Motion &amp; depth</h2><p class="sub">No shadows. Depth is 1px line + frosted blur. One signature easing across header frame, zoom, and reveal. Bars scale with duration; values read live.</p>`
  + bars
  + tokenTrace({ rows: [['Signature', '--ease-signature', 'cubic(0.32,0.72,0,1) · frame+zoom+reveal'], ['Standard', '--ease-standard', 'ease · ambient']] })
  + `<h3>Easing — live replay</h3><p class="sub">Dot glides the stage on the selected duration + easing. Replay to feel the signature curve.</p>` + stage
  + `<h3>Blur · depth</h3><p class="sub">Frosted pills over the reveal grid — each reads its live <span class="tok">var(--blur-*)</span>.</p>` + blurs
  + tokenTrace({ rows: [['Saturation header', '--sat-header', '1.6 · frosted header'], ['Saturation scrim', '--sat-scrim', '1.35 · card scrim']] })
  + code('press var(--scale-press) 0.94 · zoom var(--scale-zoom) 1.015 · hover var(--opacity-hover) 0.55 (unselected only)')
  + note('Do', 'Durations read live <span class="tok">var(--dur-*)</span>; easing is always <span class="tok">var(--ease-signature)</span> unless you prove otherwise.')
  + note('Don’t', 'No raw <span class="tok">ms</span> or cubic-bezier literals outside <span class="tok">tokens.css</span>.', 'dont')
  + `</div>`;
}
