/* ADAM/DS — Foundations: color · type · spacing · shape · motion. Values mirror tokens.css. */
import { swatch, ramp, typeRow, note, code } from './specimens.js';
export const title = 'Foundations';
const SPACES = [
  ['--space-1', '1px'], ['--space-2', '2px'], ['--space-3', '3px'], ['--space-4', '4px'],
  ['--space-5', '5px'], ['--space-6', '6px'], ['--space-7', '7px'], ['--space-8', '8px'],
  ['--space-9', '9px'], ['--space-10', '10px'], ['--space-11', '11px'], ['--space-12', '12px'],
  ['--space-14', '14px · rhythm', 1], ['--space-16', '16px · gutter', 1], ['--space-18', '18px'],
  ['--space-22', '22px'], ['--space-26', '26px'], ['--space-28', '28px'], ['--space-30', '30px'],
  ['--space-42', '42px'], ['--space-46', '46px'], ['--space-60', '60px'], ['--space-70', '70px'],
  ['--space-90', '90px'],
];
const spaceScale = `<div class="ds-scale">${SPACES.map(([t, v, hot]) => `<div class="ds-scale-row"><b>${t}</b><div class="ds-bar${hot ? ' accent' : ''}" style="width:var(${t})"></div><span>${v}</span></div>`).join('')}</div>`;
export function render() {
  return `<p class="ds-crumb">Foundations</p><div class="ds-hero"><h1>Material, before meaning.</h1>
<p class="lede">Five foundations feed every token. Swatches read live computed values — click any card to copy.</p></div>
<div class="ds-sec"><h2>Color</h2><p class="sub">Stone ramp (warm neutrals) + one vermilion step. UI consumes semantic names, never the ramp.</p>
<h3>Semantic — light / dark</h3><div class="ds-grid c4">
${swatch('Background', '--color-bg')}${swatch('Surface', '--color-surface')}
${swatch('Ink', '--color-ink')}${swatch('Muted', '--color-ink-muted')}
${swatch('Line · 10% ink', '--color-line')}${swatch('Accent', '--color-accent')}
${swatch('On media', '--color-on-media')}${swatch('Chip · 62% ink', '--color-chip')}</div>
<h3>Ramps (reference only — never consume directly)</h3>${ramp(['--stone-0', '--stone-25', '--stone-50', '--stone-100', '--stone-200', '--stone-300', '--stone-400', '--stone-500', '--stone-600', '--stone-700', '--stone-800', '--stone-900', '--stone-950'])}
<div class="vl" style="font-family:var(--font-mono);font-size:var(--text-label);color:var(--color-ink-muted)">stone 0→950 · <span class="tok">--accent-500</span> is the only production vermilion</div>
${note('Do', 'Dark theme is a hand-tuned inversion (<span class="tok">prefers-color-scheme</span> + <span class="tok">[data-theme]</span> override), not a ramp swap. Toggle it top-right to proof every specimen.')}</div>
<div class="ds-sec"><h2>Typography</h2><p class="sub">Inter Tight for voice · Chivo Mono for metadata. Title parity: contact hero and case h1 share <span class="tok">--text-title</span>. Every sample below is live <span class="tok">var()</span> type.</p>
<table class="ds-table"><tr><th>Sample</th><th>Token</th><th>Spec</th></tr>
${typeRow('<b style="font-size:var(--text-display);font-weight:800;letter-spacing:var(--tracking-display);line-height:var(--leading-display)">Display</b>', '--text-display', 'clamp(28,5vw,54) · 800 · −0.04 · lh 0.9')}
${typeRow('<b style="font-size:var(--text-title);font-weight:700;letter-spacing:var(--tracking-title);line-height:var(--leading-title)">Title · h1</b>', '--text-title', 'clamp(26,4.5vw,46) · 700 · −0.03 · lh 1.1')}
${typeRow('<b style="font-size:var(--text-logo);font-weight:800">Logo</b>', '--text-logo', '22px · 800 · brand mark')}
${typeRow('<b style="font-size:var(--text-h2);font-weight:700;letter-spacing:var(--tracking-heading)">Section h2</b>', '--text-h2', '20px · 700 · −0.02')}
${typeRow('<b style="font-size:var(--text-h3);font-weight:600">Section h3</b>', '--text-h3', '16px · 600')}
${typeRow('<span style="font-size:var(--text-body);line-height:var(--leading-body)">Body 14px/1.5, prose 1.6.</span>', '--text-body', 'Inter Tight · max 60–68ch')}
${typeRow('<span style="font-size:var(--text-small);font-weight:600">Small — card titles 13.5px.</span>', '--text-small', '13.5px · 600 · −0.01 · lh 1.25')}
${typeRow('<span style="font-family:var(--font-mono);font-size:var(--text-meta)">MONO META · 12PX</span>', '--text-meta', 'Chivo Mono · work meta, kickers')}
${typeRow('<span style="font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-mono)">LABEL · 11PX · TRACK .1</span>', '--text-label', 'Chivo Mono · tags, spec dt')}
${typeRow('<span style="font-family:var(--font-mono);font-size:var(--text-micro);letter-spacing:var(--tracking-mono)">MICRO · 10.5PX</span>', '--text-micro', 'Chivo Mono · captions, crumbs')}</table>
${code('leading — display .9 · title 1.1 · snug 1.25 · body 1.5 · prose 1.6 · mono 1.3\\ntracking — display −.04 · title −.03 · heading −.02 · body −.01 · mono .1 · label .12\\nweight — regular 400 · medium 500 · semibold 600 · bold 700 · extrabold 800')}
${note('Do', 'Pair sizes with their leading + tracking tokens — never set a bare <span class="tok">font-size</span> without its line-height.')}</div>
<div class="ds-sec"><h2>Spacing &amp; layout</h2><p class="sub">Grid rhythm <span class="tok">--rhythm → --space-14</span> (cards, cols) · page gutter <span class="tok">--gutter → --space-16</span> · wrap <span class="tok">--size-wrap 1400px</span>. Bars are live widths — <span class="tok">width:var(--space-*)</span>. Breakpoints stay raw px — <span class="tok">var()</span> is invalid in media queries.</p>
${spaceScale}
${code('--rhythm: --space-14 · --gutter: --space-16 · --size-wrap: 1400px · --size-header: 64px\\n--size-strip: 56px · --measure-copy: 60ch · --measure-prose: 68ch\\ncols 4 → 2 @900px → 1 @640px · case 1fr 1fr → 1fr @800px · header bottom-fixed ≤640px')}
${note('Do', 'Odd px (3/5/7/11) have explicit slots — use the token, never round silently.')}</div>
<div class="ds-sec"><h2>Shape — zero, normatively</h2><p class="sub">Every radius token resolves to <span class="tok">0</span>. Consume via <span class="tok">var(--radius-*)</span>; lint rejects literals.</p>
${code('--radius-none/sm/md/lg/pill: 0 · rounded.*: 0px (DESIGN.md)\\nborder-radius outside tokens.css must match: var(--radius-*')}</div>
<div class="ds-sec"><h2>Motion &amp; depth</h2><p class="sub">No shadows. Depth is 1px line + frosted blur. One signature easing across header frame, zoom, and reveal.</p>
${code('--ease-signature: cubic-bezier(0.32,0.72,0,1) · glide 380ms · zoom 650ms scale(1.015)\\n--blur-header/scrim: 18px · press scale(0.94) · hover dim 0.55 (unselected only)')}</div>`;
}
