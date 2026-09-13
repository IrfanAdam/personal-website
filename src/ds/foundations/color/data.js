/* ADAM/DS — ds/foundations/color/data · ramp data · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
const MIX = ['--color-ink',
  '--color-bg',
  '--color-accent',
  '--color-surface',
  '--color-surface-sunken',
  '--color-overlay',
  '--color-success',
  '--color-error',
  '--color-warning',
  '--color-info'];
const STONE = ['--stone-0',
  '--stone-25',
  '--stone-50',
  '--stone-100',
  '--stone-200',
  '--stone-300',
  '--stone-400',
  '--stone-500',
  '--stone-600',
  '--stone-700',
  '--stone-800',
  '--stone-900',
  '--stone-950'];
const PHOS = ['--accent-100','--accent-300','--accent-500','--accent-600','--accent-700','--accent-900'];
const RESIN = ['--accent2-100','--accent2-300','--accent2-500','--accent2-600','--accent2-700','--accent2-900'];
const GLASS = ['--accent3-100','--accent3-300','--accent3-500','--accent3-600','--accent3-700','--accent3-900'];
const MATS = [
['Frost Alloy',
  'neutral 0–950 · --stone-*',
  STONE,
  'Matte hull plating under frost — every can (bg, surface, ink, line). Never consume a raw step.'],
['Signal Phosphor',
  'vermilion · --accent-*',
  PHOS,
  'One red phosphor that blooms once — CTA, badge, error. Production step --accent-500.'],
['Caution Resin',
  'amber · --accent2-*',
  RESIN,
  'Warm caution cell — warning text/fill (700 light / 300 dark); --accent2-500 decorative only.'],
['Circuit Glass',
  'teal · --accent3-*',
  GLASS,
  'Frosted circuit glass — success deepest (700/300) + info mid (600/100), split by icon.']
];
const CANVAS = [
['Background','--color-bg','--color-ink','page + cards'],
['Surface','--color-surface','--color-ink','cards + doc cells'],
['Sunken','--color-surface-sunken','--color-ink','wells + sunken rows'],
['Overlay','--color-overlay','--color-ink','viewer + modal'],
['Muted','--color-bg','--color-ink-muted','meta + kickers + labels']
];
const FEED = [
['Accent fill','--color-accent','--color-on-accent','CTA + badge · large-scale'],
['Success fill','--color-success','--color-on-success','sent · ok'],
['Success ink','--color-bg','--color-success','form ok on paper'],
['Error fill','--color-error','--color-on-error','field error · failed'],
['Error ink','--color-bg','--color-error','error text on paper'],
['Warning fill','--color-warning','--color-on-warning','caution · unsaved'],
['Warning ink','--color-bg','--color-warning','caution text on paper'],
['Info fill','--color-info','--color-on-info','notice · hint'],
['Info ink','--color-bg','--color-info','notice text on paper']
];
const DECOR = [
['--color-line','hairlines + card borders · 10% ink'],
['--color-header','sticky header veil'],
['--color-panel','doc cells + hover wash'],
['--color-chip','tags + filter pills · 62% ink'],
['--color-input-bg / --color-input-line / --color-input-focus','field fill · border · focus edge'],
['--color-on-media / --color-on-media-muted','card info + tags on image'],
['--color-viewer-bg / --color-viewer-line / --color-viewer-shade / --color-viewer-tether',
  'viewer panel · frost border · dim · connector'],
['--color-shadow-media / --color-shadow-media-sm / --color-shadow-viewer / --color-shadow-viewer-soft',
  'elevation washes · stone-950 at 45/40/24/12%'],
['--color-disabled-bg / --color-disabled-ink / --color-disabled-line','disabled set · exempt, never interactive text'],
['--color-focus','keyboard ring, all themes (+ --border-focus in Shape)'],
['--color-ink-subtle','faintest meta · decorative only, never body text'],
['--signal / --signal-amber / --signal-teal','ramp → slot → semantic · --color-accent follows the slot']
];
export { MIX, MATS, CANVAS, FEED, DECOR };
