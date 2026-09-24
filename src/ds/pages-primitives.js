/* ADAM/DS — ds/pages-primitives · primitives composer · [plan:2026-09-24_160000-primitives-complete.md#phase-2] */
// Exports: render, mount — 9 vertical primitive sheets
// — Imports · Render · Mount —

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

// — Render —
export function render() {
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
    '<p class="ds-crumb">Elements · Primitives</p>',
    '<div class="ds-hero"><h1>Actions, not decoration.</h1>',
    '<p class="lede">Each sheet is one primitive — what it is, how it looks, ',
    'and which tokens it uses. Preview is live; Code holds snippet + tokens. ',
    'Knobs stay below so you can tune without leaving the view.</p></div>',
    tabs({ vertical: true, panes }),
  ].join('');
}

// — Mount —
export function mount(root) {
  return mountComponent(root);
}
