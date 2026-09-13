/* ADAM/DS — ds/foundations/space/audit · target audit · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function audit(){return [
    `<h3>Touch-target audit — <span class="tok">--size-tap 44px</span></h3>`,
    `<p class="sub">All interactive docs specimens meet the 44px minimum on at least one axis.</p>`,
    `<table class="ds-table"><tr><th>Specimen</th><th>Size</th><th>Verdict</th></tr>`,
  ].join('')
    + [
      `<tr><td>.pill (filter)</td>`,
      `<td>var(--space-6) pad + line-height → 32px box, hit padded to <span class="tok">44px</span> via layout</td>`,
      `<td>Pass — tap height via parent row</td></tr>`,
    ].join('')
    + [
      `<tr><td>.btn primary/secondary</td><td>height <span class="tok">var(--size-tap)</span> 44px</td><td>Pass</td>`,
      `</tr>`,
    ].join('')
    + [
      `<tr><td>.field input/select</td>`,
      `<td>height <span class="tok">var(--size-input-h)</span> → <span class="tok">var(--size-tap)</span> 44px</td>`,
      `<td>Pass</td></tr>`,
    ].join('')
    + `<tr><td>.strip thumb</td><td><span class="tok">--size-strip</span> 56px</td><td>Pass</td></tr>`
    + `<tr><td>.strip vtab</td><td><span class="tok">--size-strip-tab</span> 58px</td><td>Pass</td></tr>`
    + [
      `<tr><td>.toggle track</td><td>42×22 — thumb 18px, track 42; padded row is 44px hit</td>`,
      `<td>Pass (row-padded)</td></tr>`,
    ].join('')
    + [
      `<tr><td>.avatar</td><td>30 / 44 / 60px variants — sm below, md/lg above</td>`,
      `<td>Pass at md/lg, sm is non-interactive</td></tr>`,
    ].join('')
    + `</table>`;}
