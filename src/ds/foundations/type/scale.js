/* ADAM/DS — ds/foundations/type/scale · scale rows · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { typeRow, specCells, code, note } from '../../specimens.js';
import { leadDemo, leadDemoMono, trackDemo } from './demos.js';
export function scale(){return [
    `<h3>① Scale — every size with its partners</h3>`,
    `<p class="sub">Pick a size and its leading + tracking come with it — never set a bare <span `,
    `class="tok">font-size</span>.</p><table class="ds-table"><tr><th>Sample</th><th>Token</th><th>Partners</th>`,
    `</tr>`,
  ].join('')
  + typeRow(['<b style="font-size:var(--text-display);font-weight:700;letter-spacing:var(--tracking-display);',
    'line-height:var(--leading-display)">Display</b>'].join(''),
    '--text-display',
    'clamp(28,5vw,54) · --leading-display 0.9 · --tracking-display −0.04 · 700')
  + typeRow(['<b style="font-size:var(--text-title);font-weight:700;letter-spacing:var(--tracking-title);',
    'line-height:var(--leading-title)">Title · h1</b>'].join(''),
    '--text-title',
    'clamp(26,4.5vw,46) · --leading-title 1.1 · --tracking-title −0.03 · 700')
  + typeRow('<b style="font-size:var(--text-logo);font-weight:700;letter-spacing:var(--tracking-display)">Logo</b>',
    '--text-logo',
    '22px · --leading-display · --tracking-display · 700 · brand mark')
  + typeRow('<b style="font-size:var(--text-h2);font-weight:700;letter-spacing:var(--tracking-heading)">Section h2</b>',
    '--text-h2',
    '20px · --leading-snug · --tracking-heading −0.02 · 700')
  + typeRow('<b style="font-size:var(--text-card-title);font-weight:600">Card title</b>',
    '--text-card-title',
    '18px · --leading-snug · --tracking-body · 600')
  + typeRow('<b style="font-size:var(--text-h3);font-weight:600">Section h3</b>',
    '--text-h3',
    '16px · --leading-snug · --tracking-heading · 600')
  + typeRow('<span style="font-size:var(--text-body);line-height:var(--leading-body)">Body 14px/1.5, prose 1.6.</span>',
    '--text-body',
    'Inter Tight · --leading-body 1.5 · --tracking-body · max 60–68ch')
  + typeRow('<span style="font-size:var(--text-small);font-weight:600">Small — card titles 13.5px.</span>',
    '--text-small',
    '13.5px · --leading-snug · --tracking-body · 600')
  + typeRow('<span style="font-family:var(--font-mono);font-size:var(--text-meta)">MONO META · 12PX</span>',
    '--text-meta',
    'Chivo Mono · --leading-mono · --tracking-mono · 500')
  + typeRow(['<span ',
    'style="font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label)">LABEL ',
    '· 11PX · TRACK .1</span>'].join(''),
    '--text-label',
    'Chivo Mono · --leading-mono · --tracking-label 0.12 · 500')
  + typeRow(['<span ',
    'style="font-family:var(--font-mono);font-size:var(--text-micro);letter-spacing:var(--tracking-mono)">MICRO · ',
    '10.5PX</span>'].join(''),
    '--text-micro',
    'Chivo Mono · --leading-mono · --tracking-mono 0.1 · 500')
  + `</table>`
  + code(['--text-display: clamp(28px, 5vw, 54px); /* floor 28 · fluid 5vw · cap 54 */\n--text-title: clamp(26px, ',
    '4.5vw, 46px); /* floor 26 · fluid 4.5vw · cap 46 */\nall other steps are fixed px — they never shrink below ',
    'their floor.'].join(''))
  + note('Do',
    ['Minimum sizes are the clamp floors: display never under 28px, title never under 26px. At 200% zoom layouts ',
      'reflow and measures hold 60–68ch — text wraps, never clips.'].join(''))
  + [
    `<h3>Leading + tracking — live specimens</h3>`,
    `<p class="sub">Unitless values get type specimens, not color swatches — zero blank cards.</p>`,
  ].join('')
  + specCells([['Leading display', '--leading-display', '0.9 · hero', leadDemo('--leading-display')],
      ['Leading title', '--leading-title', '1.1 · h1', leadDemo('--leading-title')],
      ['Leading snug', '--leading-snug', '1.25 · cards', leadDemo('--leading-snug')],
      ['Leading body', '--leading-body', '1.5 · ui', leadDemo('--leading-body')],
      ['Leading prose', '--leading-prose', '1.6 · long read', leadDemo('--leading-prose')],
      ['Leading mono', '--leading-mono', '1.3 · code', leadDemoMono('--leading-mono')],
      ['Tracking display', '--tracking-display', '-0.04em · tight', trackDemo('--tracking-display')],
      ['Tracking title', '--tracking-title', '-0.03em · h1', trackDemo('--tracking-title')],
      ['Tracking heading', '--tracking-heading', '-0.02em · sections', trackDemo('--tracking-heading')],
      ['Tracking body', '--tracking-body', '-0.01em · text', trackDemo('--tracking-body')],
      ['Tracking label', '--tracking-label', '0.12em · labels', trackDemo('--tracking-label', true)],
      ['Tracking mono', '--tracking-mono', '0.1em · mono', trackDemo('--tracking-mono', true)]]);}
