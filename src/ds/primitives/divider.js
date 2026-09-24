/* ADAM/DS — primitives/divider.js · Divider primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: dividerSheet — Divider primitive sheet
// — Tokens · Render · Code · Docs —

import { component } from '../component.js';

const dividerTokens = ['--color-line', '--size-hairline', '--space-14'];

function dividerRender() {
  return `<div style="width:100%"><p style="margin:0;color:var(--color-ink-muted)">Above</p>`
    + `<hr class="divider"><p style="margin:0;color:var(--color-ink-muted)">Below</p></div>`;
}

function dividerCode() {
  return `<hr class="divider">`;
}

const dividerAnat = '<span class="tok">hr.divider</span> / <span class="tok">.divider</span> — '
  + '<span class="tok">--border-hairline</span> (1px <span class="tok">--color-line</span>) margins '
  + '<span class="tok">--space-14</span>.';
const dividerBehav = 'Static rule; no focus. Dark: <span class="tok">--color-line</span> (10% ink) '
  + 'inverts via probe — same hairline.';

export function dividerSheet() {
  return component({
    title: 'Divider',
    sub: 'Hairline rule — <span class="tok">hr.divider</span> via '
      + '<span class="tok">--border-hairline</span>. Margins <span class="tok">--space-14</span>.',
    anatomy: dividerAnat,
    behaviour: dividerBehav,
    knobs: [],
    render: dividerRender,
    code: dividerCode,
    tokens: dividerTokens,
  });
}
