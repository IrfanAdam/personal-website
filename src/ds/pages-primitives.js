/* ADAM/DS — ds/pages-primitives · primitives composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { mountComponent } from './component.js';
import { note, code } from './specimens.js';
import { btnSheet } from './primitives/btn.js';
import { tagSheet } from './primitives/tag.js';
import { kickerSheet } from './primitives/kicker.js';
import { dividerSheet } from './primitives/divider.js';
import { badgeSheet } from './primitives/badge.js';
import { fieldSheet } from './primitives/field.js';
import { toggleSheet } from './primitives/toggle.js';
import { avatarSheet } from './primitives/avatar.js';
import { logoSheet } from './primitives/logo.js';
export function render(){
  return [
    `<p class="ds-crumb">Elements · Primitives</p><div class="ds-hero"><h1>Actions, not decoration.</h1>`,
    `<p class="lede">Primitives are the smallest reusable parts — each in one uniform sheet: What → When to use → `,
    `Preview / Code / Tokens → knobs. Pill keeps filter/tab role.</p>`,
    `<p class="sub"><a href="#/components">← Elements map</a></p></div>`,
  btnSheet(),
  tagSheet(),
  kickerSheet(),
  dividerSheet(),
  badgeSheet(),
  fieldSheet(),
  toggleSheet(),
  avatarSheet(),
  logoSheet(),
  note('Do',
      ['Use <span class="tok">.btn--primary</span> once per view; <span class="tok">.badge</span> only for large ',
        'labels — mute elsewhere. Tags stay in <span class="tok">.tags</span> for linger. Field error is <span ',
        'class="tok">.field--error</span>. Toggle is checkbox — no JS. Avatar square (<span ',
        'class="tok">--radius-none</span>) by doctrine.'].join(''),
      'do'),
  code(['<span class="tags"><i>Sales CRM</i></span>\n<p class="kicker">Sales CRM · 2024</p>\n<hr ',
      'class="divider">\n<span class="badge">New</span>\n<div class="field"><label>Email</label><input><span ',
      'class="field-hint"></span></div>\n<label class="toggle"><input type="checkbox"> ',
      'Notifications</label>\n<span class="avatar">IA</span>'].join('')),
].join('');}
export function mount(root){return mountComponent(root);}
