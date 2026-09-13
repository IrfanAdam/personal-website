/* ADAM/DS — ds/foundations/space/layout · schematics · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function layout(){return [
    `<h3>Layout — schematics, live values</h3>`,
    `<p class="sub">Not proportioned to wrap — each is a schematic sized by its own <span class="tok">var()</span> `,
    `with live read via <span class="tok">data-live</span>. Click any card to copy the token.</p>`,
    `<div class="ds-grid c2">`,
  ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-wrap" style="cursor:pointer">`,
      `<div style="max-width:var(--size-wrap);margin:0 `,
      `auto;border:var(--border-hairline);background:var(--color-panel);padding:var(--space-12);text-align:center;fo`,
      `nt-family:var(--font-mono);font-size:var(--text-micro)">wrap · <span data-live="--size-wrap">1600px</span> `,
      `max (centered)</div><div class="nm">Wrap</div><div class="vl">`,
      `<span class="tok">--size-wrap</span> · 1600px · page max</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-header" style="cursor:pointer">`,
      `<div `,
      `style="height:var(--size-header);background:var(--color-panel);border:var(--border-hairline);display:grid;pla`,
      `ce-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">header · <span `,
      `data-live="--size-header">64px</span> sticky</div><div class="nm">Header</div><div class="vl">`,
      `<span class="tok">--size-header</span> · 64px · sticky top</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-strip" style="cursor:pointer">`,
      `<div style="display:flex;gap:var(--space-8);align-items:center">`,
      `<div `,
      `style="width:var(--size-strip);height:var(--size-strip);background:var(--color-surface);border:var(--border-h`,
      `airline);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">56</div>`,
      `<span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">thumb · `,
      `<span data-live="--size-strip">56px</span></span></div><div class="nm">Strip thumb</div><div class="vl">`,
      `<span class="tok">--size-strip</span> · media row</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-strip-tab" style="cursor:pointer">`,
      `<div style="display:flex;gap:var(--space-8);align-items:center">`,
      `<div `,
      `style="width:var(--size-strip-tab);height:var(--size-strip-tab);background:var(--color-surface);border:var(--`,
      `border-hairline);display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro)">58`,
      `</div>`,
      `<span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">tab · `,
      `<span data-live="--size-strip-tab">58px</span></span></div><div class="nm">Strip tab</div><div class="vl">`,
      `<span class="tok">--size-strip-tab</span> · tab row</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-tap" style="cursor:pointer">`,
      `<div `,
      `style="width:var(--size-tap);height:var(--size-tap);background:var(--color-ink);color:var(--color-bg);display`,
      `:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micro);border:var(--border-hairlin`,
      `e)">44</div><div class="nm">Tap target</div><div class="vl">`,
      `<span class="tok">--size-tap</span> · 44px · min hit (audited below)</div>`,
      `<div class="vl" data-live="--size-tap">44px</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-hairline" style="cursor:pointer">`,
      `<div style="height:var(--size-hairline);background:var(--color-line);margin:var(--space-8) 0"></div>`,
      `<div class="nm">Hairline</div><div class="vl">`,
      `<span class="tok">--size-hairline</span> · <span data-live="--size-hairline">1px</span> · borders</div></div>`,
    ].join('')
    + [
      `<div class="ds-cell" data-copy="--size-frame" style="cursor:pointer">`,
      `<div style="border:var(--size-frame) solid `,
      `var(--color-ink);padding:var(--space-10);font-family:var(--font-mono);font-size:var(--text-micro);text-align:`,
      `center">frame · <span data-live="--size-frame">3px</span> solid ink</div><div class="nm">Frame</div>`,
      `<div class="vl"><span class="tok">--size-frame</span> · 3px · focus frame</div></div>`,
    ].join('')
    + `</div>`;}
