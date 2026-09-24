/* ADAM/DS — ds/pages-library · library composer · [plan:2026-09-23_145600-ds-elements-tabs.md#phase-1] */
import { mountPlayground } from './playground.js';
import { tabs } from './tabs.js';
import { headerSheet } from './library/header.js';
import { footerSheet } from './library/footer.js';
import { heroSheet } from './library/hero.js';
import { cardSheet } from './library/card.js';
import { workSheet } from './library/work.js';
import { filtersSheet } from './library/filters.js';
import { stripSheet } from './library/strip.js';
import { specSheet } from './library/spec.js';
import { nextSheet } from './library/next.js';
import { ctaSheet } from './library/cta.js';
import { contactSheet } from './library/contact.js';
export function render(){
  const panes = [
    { label: 'Header', html: headerSheet() },
    { label: 'Footer', html: footerSheet() },
    { label: 'Hero', html: heroSheet() },
    { label: 'Card', html: cardSheet() },
    { label: 'Work', html: workSheet() },
    { label: 'Filters', html: filtersSheet() },
    { label: 'Strip', html: stripSheet() },
    { label: 'Spec', html: specSheet() },
    { label: 'Next', html: nextSheet() },
    { label: 'CTA', html: ctaSheet() },
    { label: 'Contact', html: contactSheet() },
  ];
  return [
  `<p class="ds-crumb">Elements · Library</p><div class="ds-hero"><h1>The site, piece by piece.</h1>`,
  `<p class="lede">Same classes the site ships — preview is the real render; Code holds snippet + tokens. `,
  `Knobs stay below the tabs so you can tune without leaving the view.</p></div>`,
  tabs({ vertical: true, panes }),
].join('');}
export function mount(root){return mountPlayground(root);}
