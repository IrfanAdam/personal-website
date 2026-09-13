/* ADAM/DS — ds/foundations/space/scale · scale rows · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
const G = [
  ['Micro · hairlines + insets', [
    ['--space-1', '1px · hairline stroke · divider, card border'],
    ['--space-2', '2px · tether + focus offset · viewer tether, focus offset'],
    ['--space-3', '3px · micro inset · tag pill tight gap'],
    ['--space-4', '4px · pill + tab padding · filters, controls'],
  ]],
  ['Gaps · component gaps + card padding', [
    ['--space-5', '5px · compact gap · header rule gap'],
    ['--space-6', '6px · inline pad · nav, label gap'],
    ['--space-7', '7px · cell gap s · tables'],
    ['--space-8', '8px · default gap · headers, controls'],
    ['--space-9', '9px · card meta gap'],
    ['--space-10', '10px · grid gap · masonry/case gaps'],
    ['--space-11', '11px · spec gap · rare odd step'],
    ['--space-12', '12px · cell padding · docs cells, spec framing'],
    ['--space-14', '14px · rhythm · card/col gap (alias --rhythm)'],
    ['--space-16', '16px · gutter · page padding (alias --gutter)'],
    ['--space-18', '18px · docs side pad · overview tiling'],
  ]],
  ['Sections · stacks + page rhythm', [
    ['--space-22', '22px · section stack · hero to grid'],
    ['--space-26', '26px · card hero inset'],
    ['--space-28', '28px · case copy pad + mood hero bottom'],
    ['--space-30', '30px · main pad max · ds clamp gutter'],
    ['--space-42', '42px · section margin · docs top'],
    ['--space-46', '46px · footer margin top'],
    ['--space-60', '60px · placeholder height · card img'],
    ['--space-70', '70px · scrim height · card depth'],
    ['--space-90', '90px · large stack · ds main bottom'],
  ]],
];
export function groups(){return G.map(([title, rows]) => [
    `<h3>`,
    title,
    `</h3><div class="ds-scale">`,
    rows.map(([t, v]) => [
      `<div class="ds-scale-row" data-copy="`,
      t,
      `" title="Click to copy `,
      t,
      `" style="cursor:pointer"><b>`,
      t,
      `</b><div class="ds-bar" style="width:var(`,
      t,
      `)"></div><span>`,
      v,
      `</span></div>`,
    ].join('')).join(''),
    `</div>`,
  ].join('')).join('');}
export function aliases(){return [
    `<div class="ds-note"><b>Prefer the alias</b>`,
    `<span class="tok">--rhythm → --space-14</span> for card/cols gaps · <span class="tok">--gutter → `,
    `--space-16</span> for page padding. Pick raw <span class="tok">--space-N</span> only when neither alias fits — `,
    `size chooses itself.</div>`,
  ].join('');}
