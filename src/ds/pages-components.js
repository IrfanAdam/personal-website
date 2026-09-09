/* ADAM/DS — Components. Every demo below IS the site class, unmodified. */
import { cardHTML, pillHTML, workRowHTML, specItemHTML, note, code } from './specimens.js';
export const title = 'Components';
export function render() {
  return `<p class="ds-crumb">Components</p><div class="ds-hero"><h1>Existing parts, refined.</h1>
<p class="lede">Specimens render the production classes inside neutral framing. Hover, focus, and press states are live — try them.</p></div>
<div class="ds-sec"><h2>Pill</h2><p class="sub">Filter / link chip. Transparent + hairline → fills ink on hover and <span class="tok">.on</span>.</p>
<div class="ds-spec">${pillHTML('Filter')}${pillHTML('Active', true)}<figure><figcaption>pill · pill.on (--space-6 --space-10 · 600)</figcaption></figure></div>
${code('<a class="pill" href="#">Filter</a>  ·  <a class="pill on" href="#">Active</a>')}</div>
<div class="ds-sec"><h2>Strip thumb · vtab · tab frame</h2><p class="sub">Header tabs share one gliding ink frame (<span class="tok">--size-frame</span>). Hover dims unselected to 0.55; press scales 0.94.</p>
<div class="ds-spec"><figure><div class="strip" style="position:relative;max-width:var(--size-ds-demo-strip)">
<a href="javascript:void(0)" class="on"><img src="/icons/helix.jpg" alt=""/></a><a href="javascript:void(0)"><img src="/icons/fluxx.jpg" alt=""/></a>
<button class="vtab" title="List">≡</button><button class="vtab on" title="Grid">▦</button></div><figcaption>56×56 thumbs · 56×58 vtab · frame glides 380ms signature easing</figcaption></figure></div></div>
<div class="ds-sec"><h2>Card + progressive scrim</h2><p class="sub">Image-only card. Tags rest by default; hover swaps to blur scrim + title. Zoom is a whisper — <span class="tok">scale(1.015)</span>.</p>
<div class="ds-spec">${cardHTML('Helix — sales telemetry', 'helix · 2024', '/images/helix.png', ['Sales CRM'])}${cardHTML('Helix — sales telemetry', 'helix · 2024', '/images/helix.png', ['Sales CRM'], 'force-hover')}<figure><figcaption>left: rest state · right: hover state (pinned via .force-hover — identical to :hover in card.css)</figcaption></figure></div>
${note('Do', 'Keep <span class="tok">.tags</span> in DOM (they seed the mobile linger state); hide via opacity, never removal.')}</div>
<div class="ds-sec"><h2>Viewer portal</h2><p class="sub">Fixed-position expander: <span class="tok">.viewer-cursor</span> viewfinder, <span class="tok">.viewer</span> portal, <span class="tok">.viewer-lines</span> twin tethers. Editorial hairline + paper (tamed from neon/grid/scan); zero radius throughout.</p>
<div class="ds-spec"><div class="viewer-cursor on" style="position:relative;inset:auto;opacity:1"></div><figure><figcaption>cursor · viewer · lines (hover-only, desktop)</figcaption></figure></div>
${note('Do', 'Keep the viewer <span class="tok">aria-hidden</span> + pointer-events none — cards keep native link semantics and keyboard focus never summons the portal.')}</div>
<div class="ds-sec"><h2>Work row · spec · next · footer</h2><p class="sub">List view, case metadata, pagination, and the site footer — same classes, same rhythm.</p>
<div class="ds-spec block"><div class="works">${workRowHTML('Velocity — launch analytics', 'SaaS · velocity · 2024')}</div><dl class="spec">${specItemHTML('Deliverables', 'Design system, web')}${specItemHTML('Role', 'Design engineer')}</dl>
<a class="next" href="javascript:void(0)"><small>Next story</small><b>Velocity →</b></a><footer><nav><a href="javascript:void(0)">Read.cv</a><a href="javascript:void(0)">LinkedIn</a></nav><div>© 2025 copy to your hearts content</div></footer></div></div>`;
}
