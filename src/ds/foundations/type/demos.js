/* ADAM/DS — ds/foundations/type/demos · type demos · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function leadDemo(tok){return [
  `<div style="font-size:var(--text-body);line-height:var(`,
  tok,
  `)">Ag — three lines<br>set solid<br>to show rhythm</div>`,
].join('');}
export function leadDemoMono(tok){return [
  `<div style="font-family:var(--font-mono);font-size:var(--text-meta);line-height:var(`,
  tok,
  `)">code lines<br>set solid<br>to show rhythm</div>`,
].join('');}
export function trackDemo(tok, mono){return [
  `<div style="`,
  mono ? 'font-family:var(--font-mono);' : '',
  `font-size:var(--text-h3);font-weight:600;letter-spacing:var(`,
  tok,
  `)">SPACING</div>`,
].join('');}
