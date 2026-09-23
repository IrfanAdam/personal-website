/* ADAM/DS — ds/pages-library · library composer · [plan:2026-09-23_145600-ds-elements-tabs.md#phase-1] */
import { mountPlayground } from './playground.js';
import { note, code } from './specimens.js';
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
  `<p class="ds-crumb">Elements · Library</p><div class="ds-hero"><h1>A page from the library.</h1>`,
  `<p class="lede">Header, heroes, cards, lists, filters, spec, next, CTA, and contact — each playground renders `,
  `the production class, unmodified. A landing page can be assembled purely from these.</p>`,
  `<p class="sub"><a href="#/">← Overview</a></p></div>`,
  tabs({ vertical: true, panes }),
  note('Do',
    ['Assemble landing: <span class="tok">.top → .hero → .filters → .cols → .cta-band → footer</span>. Keep <span ',
    'class="tok">.cta-band--accent</span> once per page — more dilutes vermilion.'].join(''),'do'),
  code(['<header class="top"><div class="stripbar"><div class="strip">…</div></div></header>\\n<section ',
    'class="hero"><h1>…</h1><p>…</p></section>\\n<div class="filters"><a class="pill on">All</a></div>\\n<div ',
    'class="cols"><div class="col"><a class="card">…</a></div></div>\\n<div class="cta-band ',
    'cta-band--accent"><h2>…</h2><p>…</p><div class="cta-actions"><a class="btn btn--primary">Start</a><a ',
    'class="btn btn--ghost">View</a></div></div>\\n<footer>…</footer>'].join('')),
].join('');}
export function mount(root){return mountPlayground(root);}
