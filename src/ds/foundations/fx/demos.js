/* ADAM/DS — ds/foundations/fx/demos · live demos · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function demos(){return [
    `<h3>Grid pitch — live</h3>`,
    `<p class="sub">The reveal grid at <span class="tok" data-live="--fx-grid-pitch">--fx-grid-pitch</span>, `,
    `painted by <span class="tok">--reveal-grid</span>. Full lab lives at <a `,
    `href="#/functions/grid-reveal">GridReveal</a>.</p><div class="fd-grid-demo"></div>`,
  ].join('')
  + [
    `<h3>Shimmer — live</h3>`,
    `<p class="sub">Skeleton sweep on <span class="tok">var(--dur-shimmer)</span> · band <span `,
    `class="tok">var(--shimmer-band)</span> over <span class="tok">var(--shimmer-gradient)</span> · width <span `,
    `class="tok">var(--fx-sheen)</span>. Toggle to freeze the band mid-flight.</p>`,
    `<div class="fx-shimmer" id="fxShimmer"><i></i></div><div class="fd-rowbtns">`,
    `<button class="tok" data-shimmer-toggle>freeze / resume</button></div>`,
  ].join('')
  + [
    `<h3>Rise — live</h3>`,
    `<p class="sub">Placeholder block settles on <span class="tok">var(--dur-glide)</span> with <span `,
    `class="tok">var(--ease-signature)</span>. Replay the settle.</p><div class="fx-rise rest" id="fxRise"></div>`,
    `<div class="fd-rowbtns"><button class="tok" data-rise-replay>replay rise</button></div>`,
  ].join('')
  + [
    `<h3>Press · hover — live</h3>`,
    `<p class="sub">Press the button (<span class="tok">var(--scale-press)</span> squash); hover the row (dims to `,
    `<span class="tok">var(--opacity-hover)</span>). Definitions live in Motion.</p><div class="fd-rowbtns">`,
    `<button class="fd-press">press me</button></div>`,
    `<div class="fd-hover">hover me — unselected rows dim to 0.55</div>`,
  ].join('');}
