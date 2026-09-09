/* ADAM/DS foundations · Space + Layout pane — usage-anchored, honest specimens, naming. */
import { tokenTrace, note, code } from '../specimens.js';
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
export const label = 'Space · Layout';
export function html() {
  const groups = G.map(([title, rows]) => `<h3>${title}</h3><div class="ds-scale">${rows.map(([t, v]) => `<div class="ds-scale-row" data-copy="${t}" title="Click to copy ${t}" style="cursor:pointer"><b>${t}</b><div class="ds-bar" style="width:var(${t})"></div><span>${v}</span></div>`).join('')}</div>`).join('');
  const aliases = `<div class="ds-note"><b>Prefer the alias</b><span class="tok">--rhythm → --space-14</span> for card/cols gaps · <span class="tok">--gutter → --space-16</span> for page padding. Pick raw <span class="tok">--space-N</span> only when neither alias fits — size chooses itself.</div>`;
  const layout = `<h3>Layout — schematics, live values</h3><p class="sub">Not proportioned to wrap — each is a schematic sized by its own <span class="tok">var()</span> with live read via <span class="tok">data-live</span>. Click any card to copy the token.</p><div class="ds-grid c2">`
    + `<div class="ds-cell" data-copy="--size-wrap" style="cursor:pointer"><div style="max-width:var(--size-wrap);margin:0 auto;border:var(--border-hairline);background:var(--color-panel);padding:var(--space-12);text-align:center;font-family:var(--font-mono);font-size:var(--text-micro)">wrap · <span data-live="--size-wrap">1600px</span> max (centered)</div><div class="nm">Wrap</div><div class="vl"><span class="tok">--size-wrap</span> · 1600px · page max</div></div>`
    + `<div class="ds-cell" data-copy="--size-header" style="cursor:pointer"><div style="height:var(--size-header);background:var(--color-panel);border:var(--border-hairline);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">header · <span data-live="--size-header">64px</span> sticky</div><div class="nm">Header</div><div class="vl"><span class="tok">--size-header</span> · 64px · sticky top</div></div>`
    + `<div class="ds-cell" data-copy="--size-strip" style="cursor:pointer"><div style="display:flex;gap:var(--space-8);align-items:center"><div style="width:var(--size-strip);height:var(--size-strip);background:var(--color-surface);border:var(--border-hairline);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">56</div><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">thumb · <span data-live="--size-strip">56px</span></span></div><div class="nm">Strip thumb</div><div class="vl"><span class="tok">--size-strip</span> · media row</div></div>`
    + `<div class="ds-cell" data-copy="--size-strip-tab" style="cursor:pointer"><div style="display:flex;gap:var(--space-8);align-items:center"><div style="width:var(--size-strip-tab);height:var(--size-strip-tab);background:var(--color-surface);border:var(--border-hairline);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">58</div><span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">tab · <span data-live="--size-strip-tab">58px</span></span></div><div class="nm">Strip tab</div><div class="vl"><span class="tok">--size-strip-tab</span> · tab row</div></div>`
    + `<div class="ds-cell" data-copy="--size-tap" style="cursor:pointer"><div style="width:var(--size-tap);height:var(--size-tap);background:var(--color-ink);color:var(--color-bg);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro);border:var(--border-hairline)">44</div><div class="nm">Tap target</div><div class="vl"><span class="tok">--size-tap</span> · 44px · min hit (audited below)</div><div class="vl" data-live="--size-tap">44px</div></div>`
    + `<div class="ds-cell" data-copy="--size-hairline" style="cursor:pointer"><div style="height:var(--size-hairline);background:var(--color-line);margin:var(--space-8) 0"></div><div class="nm">Hairline</div><div class="vl"><span class="tok">--size-hairline</span> · <span data-live="--size-hairline">1px</span> · borders</div></div>`
    + `<div class="ds-cell" data-copy="--size-frame" style="cursor:pointer"><div style="border:var(--size-frame) solid var(--color-ink);padding:var(--space-10);font-family:var(--font-mono);font-size:var(--text-micro);text-align:center">frame · <span data-live="--size-frame">3px</span> solid ink</div><div class="nm">Frame</div><div class="vl"><span class="tok">--size-frame</span> · 3px · focus frame</div></div>`
    + `</div>`;
  const measures = `<h3>Measure — live prose widths</h3><p class="sub">Two line-length tokens — capped paragraphs, not color swatches. Resize the viewport to feel the widths.</p>`
    + tokenTrace({ plain: true, rows: [['Copy', '--measure-copy', '60ch · narrow columns, copy blocks'], ['Prose', '--measure-prose', '68ch · long read']] })
    + `<div class="ds-spec block" style="display:grid;gap:var(--space-14)"><p style="max-width:var(--measure-copy);font-size:var(--text-body);line-height:var(--leading-prose);margin:0">Copy measure — this paragraph is capped at <span class="tok">var(--measure-copy)</span> (60ch). Narrow columns hold attention on cards and side copy.</p><p style="max-width:var(--measure-prose);font-size:var(--text-body);line-height:var(--leading-prose);margin:0">Prose measure — this paragraph is capped at <span class="tok">var(--measure-prose)</span> (68ch). Long-read case narratives get the wider allowance.</p></div>`;
  const convention = `<h3>Naming — how to pick</h3><div class="ds-code"><pre>--space-N  = raw px step (pick by size: --space-1 … --space-90 — no rounding)
--size-*   = named object (wrap, header, strip, strip-tab, hairline, frame, tap)
--measure-*= line length in ch (copy 60ch, prose 68ch)
--rhythm / --gutter = purpose aliases — prefer over raw --space-14/16 when it fits the purpose
Alias discipline: no rename without alias + deprecate flow (Phase 7). Confusing pair: strip vs strip-tab — 56px thumb is the image row, 58px tab is the list/grid toggle row; not interchangeable.</pre></div>`;
  const breaks = `<h3>Breakpoints — documented scale</h3><p class="sub">Tokens live in <span class="tok">tokens.css</span>; <span class="tok">var()</span> is invalid in <span class="tok">@media</span> so queries keep the raw px in sync by value. Click to copy the token — the comment in each query names the token.</p>`
    + tokenTrace({ plain: true, rows: [['Small', '--break-sm', '640px · 1 col + mobile cards'], ['Medium', '--break-md', '800px · case 1fr 1fr → 1fr'], ['Large', '--break-lg', '900px · masonry 4 → 2 cols + docs sidebar collapse']] });
  const recipe = code('break-sm  640px  → masonry 1 col, mobile linger, footer 1 col\nbreak-md  800px  → case-grid 1fr 1fr → 1fr, cols single rule\nbreak-lg  900px  → masonry 4 → 2 cols, DS sidebar stacks\nrhythm    --space-14 / gutter --space-16 / wrap --size-wrap 1600px\ncols 4 → 2 @900px → 1 @640px · case 1fr 1fr → 1fr @800px');
  const audit = `<h3>Touch-target audit — <span class="tok">--size-tap 44px</span></h3><p class="sub">All interactive docs specimens meet the 44px minimum on at least one axis.</p><table class="ds-table"><tr><th>Specimen</th><th>Size</th><th>Verdict</th></tr>`
    + `<tr><td>.pill (filter)</td><td>var(--space-6) pad + line-height → 32px box, hit padded to <span class="tok">44px</span> via layout</td><td>Pass — tap height via parent row</td></tr>`
    + `<tr><td>.btn primary/secondary</td><td>height <span class="tok">var(--size-tap)</span> 44px</td><td>Pass</td></tr>`
    + `<tr><td>.field input/select</td><td>height <span class="tok">var(--size-input-h)</span> → <span class="tok">var(--size-tap)</span> 44px</td><td>Pass</td></tr>`
    + `<tr><td>.strip thumb</td><td><span class="tok">--size-strip</span> 56px</td><td>Pass</td></tr>`
    + `<tr><td>.strip vtab</td><td><span class="tok">--size-strip-tab</span> 58px</td><td>Pass</td></tr>`
    + `<tr><td>.toggle track</td><td>42×22 — thumb 18px, track 42; padded row is 44px hit</td><td>Pass (row-padded)</td></tr>`
    + `<tr><td>.avatar</td><td>30 / 44 / 60px variants — sm below, md/lg above</td><td>Pass at md/lg, sm is non-interactive</td></tr>`
    + `</table>`;
  return `<div class="ds-sec"><h2>Spacing &amp; layout</h2><p class="sub">Every step grouped by purpose — not bare px bars. Click any row to copy. Bars are live <span class="tok">width:var(--space-*)</span>. Alias first where it fits.</p>`
    + groups + aliases + layout + measures + convention + breaks + recipe + audit
    + note('Do', 'Odd px (3/5/7/9/11) have explicit slots — use the token, never round silently.')
    + `</div>`;
}
