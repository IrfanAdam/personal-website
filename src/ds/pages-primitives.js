/* ADAM/DS — ds/pages-primitives · primitives composer · [plan:2026-09-23_145600-ds-elements-tabs.md#phase-1] */
import { mountComponent } from './component.js';
import { tabs } from './tabs.js';
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
  const panes = [
    { label: 'Button', html: btnSheet() },
    { label: 'Tag', html: tagSheet() },
    { label: 'Kicker', html: kickerSheet() },
    { label: 'Divider', html: dividerSheet() },
    { label: 'Badge', html: badgeSheet() },
    { label: 'Field', html: fieldSheet() },
    { label: 'Toggle', html: toggleSheet() },
    { label: 'Avatar', html: avatarSheet() },
    { label: 'Logo', html: logoSheet() },
  ];
  return [
    `<p class="ds-crumb">Elements · Primitives</p><div class="ds-hero"><h1>Actions, not decoration.</h1>`,
    `<p class="lede">Primitives are the smallest reusable parts — each sheet is one story: what it is, when to use it, `,
    `then Preview / Code. Tokens live in Code, knobs stay below the tabs.</p>`,
    `<p class="sub"><a href="#/">← Overview</a></p></div>`,
  tabs({ vertical: true, panes }),
].join('');}
export function mount(root){return mountComponent(root);}
