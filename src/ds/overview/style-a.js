/* ADAM/DS — overview/style-a · overview css vars, hero · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export const styleA = [
  `<style>
/* — Lossless Cyberpunk overview — editorial, freeform, token-only — */
`,
  `.lc-hero{ display:grid; grid-template-columns:1.42fr 0.98fr; border:var(--border-hairline); `,
  `background:var(--color-surface); position:relative; overflow:hidden; margin-top:var(--space-12); }
`,
  `.lc-hero-ink{ background:var(--color-ink); color:var(--color-bg); padding:var(--space-22) var(--space-22) `,
  `var(--space-28); position:relative; overflow:hidden; }
`,
  `.lc-hero-paper{ background:var(--color-bg); color:var(--color-ink); padding:var(--space-18) var(--space-18) `,
  `var(--space-22); position:relative; display:flex; flex-direction:column; justify-content:flex-start; `,
  `gap:var(--space-30); min-height:360px; }
`,
  `.lc-eyebrow{ font-family:var(--font-mono); font-size:var(--text-label); letter-spacing:var(--tracking-mono); `,
  `text-transform:uppercase; opacity:0.7; }
.lc-hero-ink .lc-eyebrow{ color:var(--color-bg); }
`,
  `.lc-hero h1{ font-family:var(--font-sans); font-weight:var(--weight-bold); font-size:clamp(42px,6.8vw,78px); `,
  `line-height:0.86; letter-spacing:-0.05em; margin:var(--space-14) 0 var(--space-14); text-transform:uppercase; }
`,
  `.lc-hero h1 span{ display:block; }
`,
  `.lc-hero h1 .accent{ color:var(--color-bg); } .lc-hero h1 .dot{ color:var(--color-accent); font-style:normal; }
`,
  `.lc-hero h1 .dash{ color:var(--color-accent); font-style:normal; }
`,
  `.lc-hero h1 .cyberpunk{ display:inline-block; font-size:1em; color:var(--color-accent); white-space:nowrap; `,
  `box-shadow:inset 0 -0.12em 0 var(--color-bg); max-width:100%; }
`,
  `.lc-hero h1 .dot.neutral{ color:var(--color-bg); }
.lc-eyebrow .slash{ color:var(--color-accent); }
`,
  `.lc-hero-ink .lede{ color:color-mix(in srgb, var(--color-bg) 72%, transparent); font-size:var(--text-body); `,
  `line-height:var(--leading-prose); max-width:32ch; margin:0; }
`,
  `.lc-hero-paper .lede{ color:var(--color-ink-muted); font-size:13px; line-height:1.6; max-width:30ch; margin:0; }
`,
  `.lc-hero-cross{ position:absolute; top:0; left:50%; width:1px; height:100%; background:color-mix(in srgb, `,
  `var(--color-line) 80%, transparent); }
`,
  `.lc-hero-cross::before{ content:""; position:absolute; top:28px; left:50%; width:9px; height:9px; `,
  `background:var(--color-accent); transform:translate(-50%,-50%); clip-path:circle(50%); border:1px solid `,
  `var(--color-ink); }
`,
  `.lc-hero-cross::after{ content:""; position:absolute; top:50%; left:0; width:100vw; height:1px; `,
  `background:inherit; transform:translateX(-50%); }
`,
  `.lc-meta-row{ display:flex; gap:var(--space-12); align-items:center; justify-content:flex-end; `,
  `position:relative; z-index:2; padding:2px; }
`,
  `.lc-corner-btn{ position:relative; font-family:var(--font-mono); font-size:var(--text-label); `,
  `letter-spacing:var(--tracking-mono); text-transform:uppercase; border:1px solid transparent; `,
  `background:var(--color-surface); color:var(--color-ink); padding:0 var(--space-16); min-height:44px; `,
  `display:inline-flex; align-items:center; justify-content:center; gap:var(--space-8); box-sizing:border-box; }
`,
  `.lc-corner-btn::before, .lc-corner-btn::after, .lc-corner-btn i::before, .lc-corner-btn i::after{ content:""; `,
  `position:absolute; width:10px; height:10px; border-color:var(--color-accent); border-style:solid; }
`,
  `.lc-corner-btn::before{ top:-1px; left:-1px; border-width:2px 0 0 2px; }
`,
  `.lc-corner-btn::after{ top:-1px; right:-1px; border-width:2px 2px 0 0; }
`,
  `.lc-corner-btn i::before{ bottom:-1px; left:-1px; border-width:0 0 2px 2px; }
`,
  `.lc-corner-btn i::after{ bottom:-1px; right:-1px; border-width:0 2px 2px 0; }
`,
  `.lc-corner-btn i{ position:absolute; inset:0; pointer-events:none; }
`,
  `.lc-corner-btn.is-ink{ background:var(--color-ink); color:var(--color-bg); border-color:transparent; flex:none; `,
  `}
`,
  `.lc-corner-btn.is-ink::before, .lc-corner-btn.is-ink::after, .lc-corner-btn.is-ink i::before, `,
  `.lc-corner-btn.is-ink i::after{ border-color:var(--color-accent); }
`,
  `.lc-orb{ position:absolute; top:84px; right:2px; width:132px; height:132px; z-index:0; pointer-events:none; }
`,
  `.lc-dots-h{ position:absolute; bottom:-10px; left:18px; width:120px; height:42px; `,
  `background:radial-gradient(circle, var(--color-ink) 1.1px, transparent 1.2px); background-size:9px 9px; `,
  `opacity:0.13; pointer-events:none; }
`,
];
