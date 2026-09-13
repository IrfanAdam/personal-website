/* ADAM/DS — overview/style-b · mood, tiles, responsive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export const styleB = [
  `.lc-red-cut{ position:absolute; right:0; bottom:0; width:min(320px,58%); height:104px; `,
  `background:var(--color-accent); clip-path:polygon(48px 0, 100% 0, 100% 100%, 0 100%, 0 48px); opacity:0.98; }
`,
  `.lc-red-cut span{ position:absolute; bottom:14px; right:14px; font-family:var(--font-mono); `,
  `font-size:var(--text-micro); letter-spacing:var(--tracking-mono); text-transform:uppercase; `,
  `color:var(--color-on-accent); white-space:nowrap; }
`,
  `.lc-status{ display:flex; gap:var(--space-8); flex-wrap:wrap; margin-top:var(--space-14); `,
  `font-family:var(--font-mono); font-size:var(--text-label); }
`,
  `.lc-status i{ font-style:normal; border:var(--border-hairline); background:var(--color-surface); `,
  `padding:var(--space-3) var(--space-8); }
`,
  `.lc-hero-ink .lc-status i{ color:var(--color-ink); border-color:var(--color-bg); }
`,
  `.lc-status i b{ color:var(--color-accent); font-weight:600; }
`,
  `.lc-mood{ display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:var(--space-12); `,
  `margin:var(--space-16) 0 var(--space-8); position:relative; }
`,
  `.lc-tile{ border:var(--border-hairline); background:var(--color-surface); overflow:hidden; position:relative; `,
  `display:flex; flex-direction:column; }
`,
  `.lc-tile .img{ position:relative; overflow:hidden; background:var(--color-panel); `,
  `border-bottom:var(--border-hairline); display:block; }
`,
  `.lc-tile .img img{ width:100%; height:100%; object-fit:cover; display:block; filter:saturate(0) contrast(1.05); `,
  `transition:filter var(--dur-soft) var(--ease-standard), transform var(--dur-soft) var(--ease-standard); }
`,
  `.lc-tile:hover .img img{ filter:saturate(1) contrast(1); transform:scale(1.015); }
`,
  `.lc-tile .body{ padding:var(--space-12); flex:1; display:flex; flex-direction:column; gap:var(--space-6); }
`,
  `.lc-tile .kicker{ font-family:var(--font-mono); font-size:var(--text-micro); `,
  `letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-ink-muted); display:flex; `,
  `align-items:center; gap:var(--space-6); }
.lc-tile .kicker b{ color:var(--color-ink); font-weight:600; }
`,
  `.lc-tile .kicker::before{ content:""; width:7px; height:7px; background:var(--color-ink); display:inline-block; `,
  `flex:none; } .lc-tile.is-signal .kicker::before{ background:var(--color-accent); }
`,
  `.lc-tile .title{ font-family:var(--font-sans); font-weight:700; font-size:13px; line-height:1.25; `,
  `letter-spacing:var(--tracking-heading); margin:0; }
`,
  `.lc-tile .copy{ font-family:var(--font-mono); font-size:11px; line-height:1.5; color:var(--color-ink-muted); `,
  `margin:0; }
`,
  `.lc-tile .copy a{ color:var(--color-ink); text-decoration:none; border-bottom:var(--border-hairline); }
`,
  `.lc-tile .copy a:hover{ background:var(--color-ink); color:var(--color-bg); }
`,
  `.lc-tile .meta{ font-family:var(--font-mono); font-size:10px; letter-spacing:var(--tracking-mono); `,
  `text-transform:uppercase; color:var(--color-ink-muted); margin-top:auto; padding-top:var(--space-8); `,
  `border-top:var(--border-hairline); display:flex; justify-content:space-between; }
`,
  `.lc-tile.chamfer{ clip-path:polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%); }
`,
  `.lc-tile.tilt{ transform:rotate(-0.6deg); }
`,
  `.lc-tile.accent-left{ border-left:var(--size-frame) solid var(--color-ink); }
`,
  `.lc-over-dots{ position:absolute; pointer-events:none; background:radial-gradient(circle, var(--color-ink) `,
  `1.1px, transparent 1.25px); background-size:9px 9px; opacity:0.14; }
`,
  `.lc-specbar{ display:flex; gap:var(--space-8); flex-wrap:wrap; margin-top:var(--space-12); }
`,
  `.lc-specbar i{ flex:1 1 90px; height:28px; border:var(--border-hairline); display:flex; align-items:center; `,
  `justify-content:space-between; padding:0 var(--space-8); font-family:var(--font-mono); font-size:9px; `,
  `letter-spacing:var(--tracking-mono); text-transform:uppercase; }
`,
  `@media (max-width:900px){ .lc-hero{ grid-template-columns:1fr; } .lc-hero-paper{ min-height:auto; } `,
  `.lc-hero-cross{ display:none; } .lc-mood{ grid-template-columns:repeat(6,minmax(0,1fr)); } .lc-mood .lc-tile{ `,
  `grid-column:span 6 !important; transform:none !important; } .lc-red-cut{ width:100%; height:76px; `,
  `clip-path:polygon(40px 0, 100% 0, 100% 100%, 0 100%, 0 40px); } .lc-orb, .lc-dots-h{ display:none; } }
</style>`,
];
