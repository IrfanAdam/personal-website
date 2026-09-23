/* ADAM/DS — contract index data · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: index — foundation → tokens map
export const index = [
  ['Color', '--color-* + stone ramp → semantic → usage', 'bg, text, hairlines, accent'],
  ['Type', '--text-* + --font-* + leading/tracking', 'display → micro, tester live'],
  ['Space', '--space-* + --size-* + --measure-* + --break-*',
    'rhythm/gutter, wrap 1600, sm 640 / md 800 / lg 900'],
  ['Shape', '--radius-* (= 0, normatively) + --border-* + --color-focus',
    'every radius + hairline/frame/dashed + focus ring'],
  ['Motion', '--dur-* + --ease-* + --blur-*', 'glide, rise, reveal, viewer'],
  ['FX', '--fx-* + viewer spring', 'grid, shimmer, rise'],
  ['Component overrides', '--<component>-* (pilot: --viewer-*)',
    'viewer border / shadow / in'],
];
