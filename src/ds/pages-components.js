/* ADAM/DS — Components: redirect index. Static demos migrated into uniform sheets + library.
   This page stays as an index for one release (like #/tokens → #/foundations). */
import { note, code } from './specimens.js';
const rows=[
  ['Primitives · Button, Tag, Kicker, Divider, Badge, Field, Toggle, Avatar, Logo','#/primitives','uniform template — Usage → Anatomy → Behaviour → Preview/Code/Tokens → knobs'],
  ['Library · Header, Footer, Hero, Card, Work row, Filters, Strip, Spec, Next, CTA, Contact','#/library','landing composition — playgrounds dogfood real .top/.card/.case-grid etc.'],
  ['Patterns · Masonry, Viewer, Case 50/50, A11y, Migration','#/patterns','compositions + gates (contrast live, motion, focus)'],
  ['Functions · Grid reveal, Shimmer, Rise, Viewer params','#/functions','labs + token backlog — tune here, graduate via --fx-*'],
];
export const title='Components';
export function render(){
  return `<p class="ds-crumb">Components · index</p><div class="ds-hero"><h1>One Components section.</h1><p class="lede">Static demos are now uniform sheets. Every primitive lives on <a href="#/primitives">Primitives</a> (Usage → Anatomy → Behaviour → Preview/Code/Tokens); landing pieces live on <a href="#/library">Library</a>. This index stays for one release.</p></div><div class="ds-sec"><h2>Where things live</h2><p class="sub">Old <span class="tok">#/components</span> specimens migrated — no pixels changed, just templated.</p><table class="ds-table"><tr><th>Section</th><th>What it holds</th></tr>${rows.map(([label,href,desc])=>`<tr><td><a href="${href}">${label}</a></td><td>${desc}</td></tr>`).join('')}</table>${note('Do','Build from <span class="tok">#/primitives</span> + <span class="tok">#/library</span> — this page is just a map. Behaviour + Tokens tabs live on each sheet.','do')}</div><div class="ds-sec"><h2>Migrated</h2><p class="sub">Pill → <a href="#/library">Filters</a> + <span class="tok">.pill.on</span> in Library; Card → <a href="#/library">Card</a> playground (tags/hover/in-view); Strip thumb/vtab → <a href="#/library">Strip tabs</a>; Viewer portal → <a href="#/functions">Functions · Viewer</a> + <a href="#/patterns">Patterns · Viewer</a>. Pill’s filter/tab role unchanged.</p>${code('pill:   .pill / .pill.on  →  filters playground (Library)\ncard:   .card ready + .tags/.scrim/.card-info  →  card playground (Library)\nstrip:  .strip a 56×56 + .vtab  →  strip tabs playground (Library)\nviewer: .viewer / .viewer-cursor / .viewer-lines  →  Functions labs + Patterns specimen')}</div>`;
}
