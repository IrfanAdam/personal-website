/* ADAM/DS — ds/foundations/shape/doctrine · doctrine · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function doctrine(){return [
    `<p class="sub" style="max-width:62ch">Zero is not missing radius — it is the cut. Hard 90° keeps vector edges `,
    `lossless at any zoom, lets <span class="tok">--border-hairline</span> carry all elevation without shadow, and `,
    `reserves softness for <span class="tok">clip-path</span> chamfer where erosion is intentional. Rounded is the `,
    `other paradigm; we are not it.</p>`,
  ].join('')
    + `<div class="ds-grid c2">`
    + [
      `<div class="ds-cell"><div style="display:flex;gap:var(--space-14);align-items:center">`,
      `<div `,
      `style="width:var(--space-60);height:var(--space-60);background:var(--color-surface);border:var(--border-hairl`,
      `ine);border-radius:var(--radius-none);display:grid;place-items:center;font-family:var(--font-mono);font-size:`,
      `var(--text-micro)">0</div>`,
      `<span `,
      `style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">var(--radius-no`,
      `ne) · we — hard cut</span></div><div class="nm">We — zero</div><div class="vl">`,
      `<span class="tok">border-radius: var(--radius-none)</span> → <span data-live="--radius-none">0</span></div>`,
      `</div>`,
    ].join('')
    + [
      `<div class="ds-cell dont"><div style="display:flex;gap:var(--space-14);align-items:center">`,
      `<div `,
      `style="width:var(--space-60);height:var(--space-60);background:var(--color-surface);border:var(--border-hairl`,
      `ine);border-radius:8px;display:grid;place-items:center;font-family:var(--font-mono);font-size:var(--text-micr`,
      `o)">8</div>`,
      `<span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">8px · `,
      `not we — soft UI</span></div><div class="nm">Not we — rounded</div>`,
      `<div class="vl">Literal <span class="tok">8px</span> — never use; proof that zero is a choice, not an `,
      `omission</div></div>`,
    ].join('')
    + `</div>`;}
