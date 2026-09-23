/* ADAM/DS — ds/foundations/fx/cards · effect tables behind tabs ·
   [plan:2026-09-23_151320-ds-fx-cards.md#phase-2] */
// Exports: fxCards — tabbed FX tables with plain-language outcomes
import { cssVar } from '../../specimens.js';
import { tabs } from '../../tabs.js';

// — Data —
const GROUPS = [
  {
    title: 'Reveal a photo',
    tab: 'Reveal',
    intro: 'A photo starts as a tiled placeholder, then the real image takes over.',
    rows: [
      ['Tile count', '--fx-cell', 'Sets how finely the image breaks apart.', 'More = smaller tiles.'],
      ['Wave delay', '--fx-wait', 'Sets the pause between groups of tiles.', 'More = slower reveal.'],
      ['Photo handoff', '--fx-photo-from',
        'Sets when the real photo replaces the tile wash.', 'Higher = later handoff.'],
      ['Tile morph', '--fx-morph', 'Sets how much each tile bends while it splits.', 'More = more movement.'],
      ['Reveal finish', '--fx-split-end',
        'Sets when the tile geometry is considered finished.', 'Higher = longer tile phase.'],
      ['Tint settle', '--dur-fx-color',
        'Sets how quickly a tile changes from tint to photo.', 'Longer = softer settle.'],
      ['Sweep span', '--dur-fx-span',
        'Sets how long the reveal travels across the image.', 'Longer = slower sweep.'],
    ],
  },
  {
    title: 'Hold and sweep a loading state',
    tab: 'Loading',
    intro: 'A quiet grid and sheen keep an empty state alive while content loads.',
    rows: [
      ['Placeholder hold', '--fx-skeleton',
        'Sets how long the placeholder waits before reveal starts.', 'Longer = more breathing room.'],
      ['Sheen width', '--fx-sheen', 'Sets the width of the moving loading highlight.', 'Wider = broader sweep.'],
      ['Grid spacing', '--fx-grid-pitch',
        'Sets the spacing of the faint grid behind the state.', 'Larger = more open grid.'],
    ],
  },
  {
    title: 'Bring in a hero',
    tab: 'Hero',
    intro: 'The placeholder grows to its final hero height before the image settles.',
    rows: [
      ['Hero entrance', '--dur-hero-rise',
        'Sets how long a case-study or contact-page hero takes to appear.', 'Longer = slower arrival.'],
    ],
  },
  {
    title: 'Distort a block',
    tab: 'Glitch',
    intro: 'A short, stepped shift makes a timeline tick feel intentional.',
    rows: [
      ['Loop speed', '--dur-glitch', 'Sets how often the block glitches again.', 'Shorter = more frequent ticks.'],
      ['Side shift', '--fx-glitch-x', 'Sets how far the glitch jumps left or right.', 'Larger = wider jitter.'],
      ['Shear', '--fx-glitch-skew', 'Sets the diagonal cut in the distortion.', 'More angle = harder cut.'],
      ['Flicker', '--fx-glitch-opacity',
        'Sets how much the block fades during the glitch.', 'Lower = harsher flicker.'],
    ],
  },
];

// — Markup —
const row = ([name, token, what, cue]) => [
  `<tr data-copy-token="${token}" title="Copy ${token}">`,
  `<td class="fx-name">${name}</td>`,
  `<td><span class="tok">${token}</span></td>`,
  `<td><p class="fx-what">${what}</p><p class="fx-cue">${cue}</p></td>`,
  `<td class="fx-live" data-live="${token}">${cssVar(token)}</td>`,
  `</tr>`,
].join('');
const table = ({ title, intro, rows }) => [
  `<h4 class="fx-pane-title">${title}</h4>`,
  `<p class="fx-group-intro">${intro}</p>`,
  `<div class="fx-scroll"><table class="fx-table"><thead><tr>`,
  `<th>Effect</th><th>Token</th><th>What changes</th><th>Live</th>`,
  `</tr></thead><tbody>${rows.map(row).join('')}</tbody></table></div>`,
].join('');
const panes = GROUPS.map((g) => ({
  label: `${g.tab} · ${g.rows.length}`,
  html: table(g),
}));

// — Section —
export function fxCards() {
  return [
    `<section class="fx-tokens"><h3>What each effect changes</h3>`,
    `<p class="sub">Pick an effect. Each row says what moves in plain words; `,
    `the token and live value are the detail — click a row to copy it.</p>`,
    tabs({ panes }),
    `</section>`,
  ].join('');
}
