/* ADAM/DS — primitives/divider.js · Divider primitive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { component } from '../component.js';
const dividerTokens=['--color-line','--size-hairline','--space-14']; function dividerRender(){return [
  `<div style="width:100%"><p style="margin:0;color:var(--color-ink-muted)">Above</p><hr class="divider">`,
  `<p style="margin:0;color:var(--color-ink-muted)">Below</p></div>`,
].join('');} function dividerCode(){return [
  `<hr class="divider">`,
].join('');} const dividerKnobs=[];
const dividerAnat=['<span class="tok">hr.divider</span> / <span class="tok">.divider</span> — <span ',
  'class="tok">--border-hairline</span> (1px <span class="tok">--color-line</span>) margins <span ',
  'class="tok">--space-14</span>.'].join('');
const dividerBehav=[
  'Static rule; no focus. Dark: <span class="tok">--color-line</span> (10% ink) inverts via probe — same '
  ,
  'hairline.'].join('');
export function dividerSheet(){return component({title:'Divider',
        sub:['Hairline rule — <span class="tok">hr.divider</span> via <span class="tok">--border-hairline</span>. ',
          'Margins <span class="tok">--space-14</span>.'].join(''),
        anatomy:dividerAnat,
        behaviour:dividerBehav,
        knobs:dividerKnobs,
        render:dividerRender,
        code:dividerCode,
        tokens:dividerTokens});}
