/* ADAM/PAGE — views/minimal-lab · lab landing with the map entry card
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { NODES, EDGES, GROUPS } from './map/data.js';
import { footer } from './shared.js';
// Exports: MinimalLab, mountMinimalLab
const card = (href, title, desc, meta) => [
  `<a class="lab-card" href="${href}">`,
  `<strong>${title}</strong>`,
  `<span>${desc}</span>`,
  `<em>${meta}</em>`,
  '</a>',
].join('');
export function MinimalLab() {
  return [
    '<section class="lab">',
    '<header class="lab-head"><h1>Minimal lab</h1>',
    '<p>Loose ends, side experiments and the wiring underneath. Everything here is live code, ',
    'not a screenshot.</p></header>',
    '<div class="lab-cards">',
    card('#/lab/architecture', 'Architecture map',
      'Every module that builds this site, grouped by job — shell, pages, the masonry engine, fx, ',
      'sound, foundations and the repo gates. Pan, zoom and follow the wires.',
      `${NODES.length} modules · ${EDGES.length} relations · ${GROUPS.length} groups`),
    card('#/masonry', 'The work', 'The masonry grid: 14 stories, filter, parallax and the viewer.',
      'landing'),
    card('#/contact', 'Contact', 'Say hello, or steal the copy.', 'contact'),
    '</div>',
    footer(),
    '</section>',
  ].join('');
}
