/* ADAM/DS — Overview · Lossless Cyberpunk + editorial freeform moodboard. */
import { note, code } from './specimens.js';
import { attachGlimmerOrb } from '../views/glimmer-orb.js';
export const title = 'Overview';
export function render() {
  return `<p class="ds-crumb">ADAM/DS · v1.1.0 — LOSSLESS CYBERPUNK</p>
<style>
/* — Lossless Cyberpunk overview — editorial, freeform, token-only — */
.lc-hero{ display:grid; grid-template-columns:1.42fr 0.98fr; border:var(--border-hairline); background:var(--color-surface); position:relative; overflow:hidden; margin-top:var(--space-12); }
.lc-hero-ink{ background:var(--color-ink); color:var(--color-bg); padding:var(--space-22) var(--space-22) var(--space-28); position:relative; overflow:hidden; }
.lc-hero-paper{ background:var(--color-bg); color:var(--color-ink); padding:var(--space-18) var(--space-18) var(--space-22); position:relative; display:flex; flex-direction:column; justify-content:flex-start; gap:var(--space-30); min-height:360px; }
.lc-eyebrow{ font-family:var(--font-mono); font-size:var(--text-label); letter-spacing:var(--tracking-mono); text-transform:uppercase; opacity:0.7; }
.lc-hero-ink .lc-eyebrow{ color:var(--color-bg); }
.lc-hero h1{ font-family:var(--font-sans); font-weight:var(--weight-bold); font-size:clamp(42px,6.8vw,78px); line-height:0.86; letter-spacing:-0.05em; margin:var(--space-14) 0 var(--space-14); text-transform:uppercase; }
.lc-hero h1 span{ display:block; }
.lc-hero h1 .accent{ color:var(--color-bg); } .lc-hero h1 .dot{ color:var(--color-accent); font-style:normal; }
.lc-hero h1 .dash{ color:var(--color-accent); font-style:normal; }
.lc-hero h1 .cyberpunk{ display:inline-block; font-size:1em; color:var(--color-accent); white-space:nowrap; box-shadow:inset 0 -0.12em 0 var(--color-bg); max-width:100%; }
.lc-hero h1 .dot.neutral{ color:var(--color-bg); }
.lc-eyebrow .slash{ color:var(--color-accent); }
.lc-hero-ink .lede{ color:color-mix(in srgb, var(--color-bg) 72%, transparent); font-size:var(--text-body); line-height:var(--leading-prose); max-width:32ch; margin:0; }
.lc-hero-paper .lede{ color:var(--color-ink-muted); font-size:13px; line-height:1.6; max-width:30ch; margin:0; }
.lc-hero-cross{ position:absolute; top:0; left:50%; width:1px; height:100%; background:color-mix(in srgb, var(--color-line) 80%, transparent); }
.lc-hero-cross::before{ content:""; position:absolute; top:28px; left:50%; width:9px; height:9px; background:var(--color-accent); transform:translate(-50%,-50%); clip-path:circle(50%); border:1px solid var(--color-ink); }
.lc-hero-cross::after{ content:""; position:absolute; top:50%; left:0; width:100vw; height:1px; background:inherit; transform:translateX(-50%); }
.lc-meta-row{ display:flex; gap:var(--space-12); align-items:center; justify-content:flex-end; position:relative; z-index:2; padding:2px; }
.lc-corner-btn{ position:relative; font-family:var(--font-mono); font-size:var(--text-label); letter-spacing:var(--tracking-mono); text-transform:uppercase; border:1px solid transparent; background:var(--color-surface); color:var(--color-ink); padding:0 var(--space-16); min-height:44px; display:inline-flex; align-items:center; justify-content:center; gap:var(--space-8); box-sizing:border-box; }
.lc-corner-btn::before, .lc-corner-btn::after, .lc-corner-btn i::before, .lc-corner-btn i::after{ content:""; position:absolute; width:10px; height:10px; border-color:var(--color-accent); border-style:solid; }
.lc-corner-btn::before{ top:-1px; left:-1px; border-width:2px 0 0 2px; }
.lc-corner-btn::after{ top:-1px; right:-1px; border-width:2px 2px 0 0; }
.lc-corner-btn i::before{ bottom:-1px; left:-1px; border-width:0 0 2px 2px; }
.lc-corner-btn i::after{ bottom:-1px; right:-1px; border-width:0 2px 2px 0; }
.lc-corner-btn i{ position:absolute; inset:0; pointer-events:none; }
.lc-corner-btn.is-ink{ background:var(--color-ink); color:var(--color-bg); border-color:transparent; flex:none; }
.lc-corner-btn.is-ink::before, .lc-corner-btn.is-ink::after, .lc-corner-btn.is-ink i::before, .lc-corner-btn.is-ink i::after{ border-color:var(--color-accent); }
.lc-orb{ position:absolute; top:84px; right:2px; width:132px; height:132px; z-index:0; pointer-events:none; }
.lc-dots-h{ position:absolute; bottom:-10px; left:18px; width:120px; height:42px; background:radial-gradient(circle, var(--color-ink) 1.1px, transparent 1.2px); background-size:9px 9px; opacity:0.13; pointer-events:none; }
/* redux edition cutout — diagonal artefact, accent ground */
.lc-red-cut{ position:absolute; right:0; bottom:0; width:min(320px,58%); height:104px; background:var(--color-accent); clip-path:polygon(48px 0, 100% 0, 100% 100%, 0 100%, 0 48px); opacity:0.98; } /* cyberpunk cut: 48×48 = true 45° */
.lc-red-cut span{ position:absolute; bottom:14px; right:14px; font-family:var(--font-mono); font-size:var(--text-micro); letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-on-accent); white-space:nowrap; }
.lc-status{ display:flex; gap:var(--space-8); flex-wrap:wrap; margin-top:var(--space-14); font-family:var(--font-mono); font-size:var(--text-label); }
.lc-status i{ font-style:normal; border:var(--border-hairline); background:var(--color-surface); padding:var(--space-3) var(--space-8); }
.lc-hero-ink .lc-status i{ color:var(--color-ink); border-color:var(--color-bg); }
.lc-status i b{ color:var(--color-accent); font-weight:600; }
/* mood freeform */
.lc-mood{ display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:var(--space-12); margin:var(--space-16) 0 var(--space-8); position:relative; }
.lc-tile{ border:var(--border-hairline); background:var(--color-surface); overflow:hidden; position:relative; display:flex; flex-direction:column; }
.lc-tile .img{ position:relative; overflow:hidden; background:var(--color-panel); border-bottom:var(--border-hairline); display:block; }
.lc-tile .img img{ width:100%; height:100%; object-fit:cover; display:block; filter:saturate(0) contrast(1.05); transition:filter var(--dur-soft) var(--ease-standard), transform var(--dur-soft) var(--ease-standard); }
.lc-tile:hover .img img{ filter:saturate(1) contrast(1); transform:scale(1.015); }
.lc-tile .body{ padding:var(--space-12); flex:1; display:flex; flex-direction:column; gap:var(--space-6); }
.lc-tile .kicker{ font-family:var(--font-mono); font-size:var(--text-micro); letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-ink-muted); display:flex; align-items:center; gap:var(--space-6); }
.lc-tile .kicker b{ color:var(--color-ink); font-weight:600; }
.lc-tile .kicker::before{ content:""; width:7px; height:7px; background:var(--color-ink); display:inline-block; flex:none; } .lc-tile.is-signal .kicker::before{ background:var(--color-accent); }
.lc-tile .title{ font-family:var(--font-sans); font-weight:700; font-size:13px; line-height:1.25; letter-spacing:var(--tracking-heading); margin:0; }
.lc-tile .copy{ font-family:var(--font-mono); font-size:11px; line-height:1.5; color:var(--color-ink-muted); margin:0; }
.lc-tile .copy a{ color:var(--color-ink); text-decoration:none; border-bottom:var(--border-hairline); }
.lc-tile .copy a:hover{ background:var(--color-ink); color:var(--color-bg); }
.lc-tile .meta{ font-family:var(--font-mono); font-size:10px; letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-ink-muted); margin-top:auto; padding-top:var(--space-8); border-top:var(--border-hairline); display:flex; justify-content:space-between; }
.lc-tile.chamfer{ clip-path:polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%); }
.lc-tile.tilt{ transform:rotate(-0.6deg); }
.lc-tile.accent-left{ border-left:var(--size-frame) solid var(--color-ink); }
.lc-over-dots{ position:absolute; pointer-events:none; background:radial-gradient(circle, var(--color-ink) 1.1px, transparent 1.25px); background-size:9px 9px; opacity:0.14; }
.lc-specbar{ display:flex; gap:var(--space-8); flex-wrap:wrap; margin-top:var(--space-12); }
.lc-specbar i{ flex:1 1 90px; height:28px; border:var(--border-hairline); display:flex; align-items:center; justify-content:space-between; padding:0 var(--space-8); font-family:var(--font-mono); font-size:9px; letter-spacing:var(--tracking-mono); text-transform:uppercase; }
@media (max-width:900px) /* --break-lg */{
  .lc-hero{ grid-template-columns:1fr; }
  .lc-hero-paper{ min-height:auto; }
  .lc-hero-cross{ display:none; }
  .lc-mood{ grid-template-columns:repeat(6,minmax(0,1fr)); }
  .lc-mood .lc-tile{ grid-column:span 6 !important; transform:none !important; }
  .lc-red-cut{ width:100%; height:76px; clip-path:polygon(40px 0, 100% 0, 100% 100%, 0 100%, 0 40px); } /* 45°: 40×40 */
  .lc-orb, .lc-dots-h{ display:none; }
}
</style>

<div class="lc-hero">
  <div class="lc-hero-cross" aria-hidden="true"></div>
  <div class="lc-hero-ink">
    <div class="lc-eyebrow">00 <span class="slash">//</span> OVERVIEW — ADAM/DS</div>
    <h1><span>LOSS<em class="dash">—</em></span><span>LESS</span><span class="cyberpunk">CYBERPUNK<i class="dot neutral">.</i></span></h1>
    <p class="lede">Everything gets compressed now — feeds, files, days. Most of it loses something on the way down. This system is built the other way: keep cutting until only the meaning is left, and make sure that part arrives intact.</p>
    <div class="lc-status" style="margin-top:var(--space-16)"><i>lossless <b>vector</b></i><i>radius <b>0</b></i><i>signal <b>once</b></i><i>build <b>✓</b></i></div>
    <div class="lc-dots-h" aria-hidden="true"></div>
  </div>
  <div class="lc-hero-paper">
    <canvas class="lc-orb" data-lc-orb aria-hidden="true"></canvas>
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-12);">
      <div class="lc-eyebrow" style="color:var(--color-ink-muted)">01 // STYLE</div>
      <div class="lc-meta-row">
        <a class="lc-corner-btn" href="#/foundations" style="text-decoration:none">Explore<i></i></a>
        <a class="lc-corner-btn is-ink" href="#/foundations" aria-label="Play" style="text-decoration:none; width:44px; height:44px; padding:0; justify-content:center;">▶<i></i></a>
      </div>
    </div>
    <div>
      <p class="lede">Lossless is the edit — nothing left that can go. Cyberpunk is the mood — black ground, hard cuts, one red signal in the dark. Six refs below, one lesson each, images in <span class="tok">/images/mood</span>.</p>
      <p class="lede" style="margin-top:var(--space-10); font-family:var(--font-mono); font-size:10px; letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-ink-muted); opacity:0.9">MATERIAL — <span class="tok" style="color:var(--color-ink)">Frost Alloy</span> hull + <span class="tok" style="color:var(--color-accent)">Signal Phosphor</span> on cool void · Caution Resin + Circuit Glass — synthetic, never real matter</p>
      <div style="display:flex; gap:var(--space-8); margin-top:var(--space-14); flex-wrap:wrap; position:relative; z-index:1;">
        <span class="tok">Inter Tight 700</span><span class="tok">Chivo Mono 500</span><span class="tok">--color-accent #E8442E</span><span class="tok">--radius-0</span>
      </div>
    </div>
    <div class="lc-red-cut" data-edition="redux" aria-hidden="true"><span>REDUX ${new Date().getFullYear()}</span></div>
  </div>
</div>

<div class="ds-sec"><h2>Principles</h2><p class="sub">Five rules every specimen obeys — cut until it means more, not less.</p>
<div class="ds-grid c2">
  <div class="ds-cell" style="border-left:var(--size-frame) solid var(--color-ink)"><div class="nm">01 · Cut, don't dilute</div><div class="vl">Keep removing until one more cut would change the meaning — then stop. Smaller only counts if nothing is lost.</div></div>
  <div class="ds-cell"><div class="nm">02 · Let the void work</div><div class="vl">Paper and void do half the layout. Grayscale holds the structure; <span class="tok">--color-accent</span> speaks only when it has to.</div></div>
  <div class="ds-cell"><div class="nm">03 · No soft edges</div><div class="vl">Every corner is <span class="tok">0</span>. Every radius is <span class="tok">var(--radius-*)</span>. Cuts are clip-path, never blur.</div></div>
  <div class="ds-cell" style="border-left:var(--size-frame) solid var(--color-accent)"><div class="nm">04 · One signal at a time</div><div class="vl"><span class="tok">--color-accent</span> is not decoration. It is the one thing in the room that can't be missed — everything else stays quiet.</div></div>
</div>
<div class="ds-grid c2" style="margin-top:var(--space-12)">
  <div class="ds-cell"><div class="nm">05 · Two voices only</div><div class="vl"><span class="tok">Chivo Mono</span> for the machine — labels, kickers, timestamps. <span class="tok">Inter Tight</span> for the headline. Never swapped, never a third.</div></div>
  <div class="ds-cell" style="background:var(--color-ink); color:var(--color-bg); border-color:var(--color-ink)"><div class="nm" style="color:var(--color-bg)">Freeform, still on-grid</div><div class="vl" style="color:color-mix(in srgb, var(--color-bg) 68%, transparent)">Collage is allowed, clutter isn't. Tilt and overlap sit on a 12-col grid — hairline + dot grid keep it honest.</div></div>
</div>
${note('Do', 'Refine through tokens. <span class="tok">tokens.css</span> is the only file that holds raw values — this overview is read-only and never restyles the live site.')}
${note('Don’t', 'No new hex, no literal radius, no new font. Propose a token instead. Images are texture, not content — keep them desaturated until hover.', 'dont')}</div>

<div class="ds-sec"><h2>How to read this site</h2><p class="sub">Foundations first · Tokens are the contract · Everything else is composition.</p>
${code('tokens.css (primitives → semantic → aliases)\\n    ▲ single source — stone + accent-500\\nbase.css · pages.css · masonry.css (consume var() only)\\n    ▲ live specimens render these exact classes · no invented styles')}</div>

<div class="ds-sec" style="position:relative; overflow:visible;">
  <div style="display:flex; align-items:baseline; gap:var(--space-12); flex-wrap:wrap;">
    <h2 style="margin:0">Moodboard</h2><span class="kicker" style="color:var(--color-ink-muted)">Lossless Cyberpunk — 6 refs · editorial freeform · 12-col · fetched</span>
  </div>
  <p class="sub" style="max-width:62ch">Six refs, not project thumbs. Hover brings back the colour. Pure <span class="tok">var()</span>, zero radius, hairline only.</p>

  <div class="lc-over-dots" style="right:-10px; top:42px; width:64px; height:96px;" aria-hidden="true"></div>
  <div class="lc-over-dots" style="left:-8px; bottom:18px; width:96px; height:44px; opacity:0.1" aria-hidden="true"></div>

  <div class="lc-mood">
    <!-- 01 NEON VOID — Blade Runner signal -->
    <div class="lc-tile chamfer is-signal" style="grid-column:span 7;">
      <span class="img" style="height:248px"><img src="/images/mood/neon-void.jpg" alt="Neon street at night — one signal in the void" loading="lazy" /></span>
      <div class="body">
        <div class="kicker"><b>01</b> Neon void — signal in the black</div>
        <div class="title">One signal on cold void — accent only as alert.</div>
        <p class="copy"><a href="https://bladerunner2049.warnerbros.com" target="_blank" rel="noopener">Blade Runner 2049 — neon on black</a> — what we steal: monochrome ground, single accent-500; no gradients. Photo · Unsplash.</p>
        <div class="meta"><span>fetched · neon-void</span><span>span 7</span></div>
      </div>
    </div>

    <!-- 02 HARD GRID — Müller-Brockmann poster -->
    <div class="lc-tile" style="grid-column:span 5;">
      <span class="img" style="height:248px"><img src="/images/mood/hard-grid.jpg" alt="Musica Viva concert poster 1959 — Swiss grid geometry" loading="lazy" /></span>
      <div class="body">
        <div class="kicker"><b>02</b> Hard grid — geometry carries it</div>
        <div class="title">Absolute grid, 90° cuts only — no ornament.</div>
        <p class="copy"><a href="https://www.lars-mueller-publishers.com/josef-muller-brockmann" target="_blank" rel="noopener">Müller-Brockmann · Musica Viva 1959</a> — what we steal: hairline as the only elevation. Poster · Wikimedia Commons.</p>
        <div class="meta"><span>fetched · hard-grid</span><span>span 5</span></div>
      </div>
    </div>

    <!-- 03 ONE SIGNAL — terminal console -->
    <div class="lc-tile accent-left tilt" style="grid-column:span 4;">
      <span class="img" style="height:208px"><img src="/images/mood/one-signal.jpg" alt="Retro terminal console — mono signal" loading="lazy" /></span>
      <div class="body">
        <div class="kicker"><b>03</b> One signal — mono machine</div>
        <div class="title">Console order — mono, dense, precise.</div>
        <p class="copy"><a href="https://www.are.na" target="_blank" rel="noopener">Are.na / Cyberpunk console</a> — steal: single accent sparingly; chrome stays ink + line. Photo · Unsplash.</p>
        <div class="meta"><span>tilt -0.6°</span><span>accent left</span></div>
      </div>
    </div>

    <!-- 04 BRUTAL SHELL — Braun ET66 -->
    <div class="lc-tile chamfer" style="grid-column:span 4; border-left:var(--size-frame) solid var(--color-ink);">
      <span class="img" style="height:208px"><img src="/images/mood/brutal-shell.jpg" alt="Braun ET66 calculator by Dieter Rams" loading="lazy" /></span>
      <div class="body" style="background:var(--color-ink); color:var(--color-bg);">
        <div class="kicker" style="color:var(--color-bg)"><b style="color:var(--color-accent)">04</b> Brutal shell — less but better</div>
        <div class="title" style="color:var(--color-bg)">Radius 0 by doctrine — form is function.</div>
        <p class="copy" style="color:color-mix(in srgb, var(--color-bg) 70%, transparent)"><a href="https://www.vitsoe.com/us/about/good-design" target="_blank" rel="noopener" style="color:var(--color-bg); border-color:color-mix(in srgb, var(--color-bg) 30%, transparent)">Dieter Rams · Braun ET66, 1987</a> — steal: brutal hard-case shell, no ornament. Photo · CC BY-SA 2.0 Wikimedia.</p>
        <div class="meta" style="color:color-mix(in srgb, var(--color-bg) 60%, transparent); border-color:color-mix(in srgb, var(--color-bg) 18%, transparent)"><span>ink invert</span><span>chamfer</span></div>
      </div>
    </div>

    <!-- 05 SYSTEM DOCS — code as product -->
    <div class="lc-tile" style="grid-column:span 4;">
      <span class="img" style="height:208px"><img src="/images/mood/system-docs.jpg" alt="Dark code editor — terminal as product" loading="lazy" /></span>
      <div class="body">
        <div class="kicker"><b>05</b> System docs — terminal as product</div>
        <div class="title">Foundations → Tokens → Components → Patterns.</div>
        <p class="copy"><a href="https://linear.app" target="_blank" rel="noopener">Linear — docs as product</a> — steal: console order; mono, dense, precise. Photo · Unsplash.</p>
        <div class="meta"><span>fetched · system-docs</span><span>span 4</span></div>
      </div>
    </div>

    <!-- 06 PAPER TERRAIN — plaster relief (your moodboard ref) -->
    <div class="lc-tile tilt" style="grid-column:span 8;">
      <span class="img" style="height:228px"><img src="/images/mood/paper-terrain.jpg" alt="White architectural model — paper relief terrain" loading="lazy" /></span>
      <div class="body">
        <div class="kicker"><b>06</b> Paper terrain — lossless relief</div>
        <div class="title">Volume from paper, depth from a hard edge.</div>
        <p class="copy">From your moodboard ref — white terrain, contour paper, city relief. What we steal: monochrome volume, hard-cut base, hairline contour. Depth is an edge, never a shadow.</p>
        <div class="meta"><span>fetched · paper-terrain</span><span>span 8 · tilt</span></div>
      </div>
    </div>

    <!-- 07 TOKEN STRIP — editorial footer tile spanning full -->
    <div class="lc-tile" style="grid-column:1 / -1; flex-direction:row; align-items:stretch; min-height:96px; border-style:dashed;">
      <div style="flex:1 1 52%; padding:var(--space-12) var(--space-14); display:grid; gap:var(--space-8); align-content:center; border-right:var(--border-hairline);">
        <div class="kicker"><b>07</b> Spec — lossless tokens</div>
        <div class="lc-specbar">
          <i style="background:var(--color-accent); color:var(--color-on-accent);">#E8442E <span style="opacity:0.8">accent-500</span></i>
          <i style="background:var(--color-ink); color:var(--color-bg);">#15191f <span style="opacity:0.6">ink</span></i>
          <i style="background:var(--color-bg); color:var(--color-ink);">#eceef2 <span style="opacity:0.6">paper</span></i>
          <i style="background:var(--stone-200); color:var(--color-ink);">#e2e6ea <span style="opacity:0.6">sunken</span></i>
        </div>
        <div class="copy" style="margin-top:var(--space-4)">Type: <span class="tok">Inter Tight 700</span> + <span class="tok">Chivo Mono 500</span> · Tracking <span class="tok">-0.04em</span> display · <span class="tok">0</span> radius everywhere — editorial cut, not soft UI.</div>
      </div>
      <div style="flex:1 1 48%; padding:var(--space-12) var(--space-14); background:var(--color-panel); display:grid; place-content:center; text-align:center;">
        <div style="font-family:var(--font-mono); font-size:var(--text-micro); letter-spacing:var(--tracking-mono); text-transform:uppercase; color:var(--color-ink-muted)">The test</div>
        <div style="font-family:var(--font-sans); font-weight:var(--weight-bold); font-size:18px; letter-spacing:-0.03em; margin-top:var(--space-6);">CUT UNTIL IT MEANS MORE</div>
        <div style="font-family:var(--font-mono); font-size:10px; color:var(--color-ink-muted); margin-top:var(--space-4)">If one more cut changes the meaning, stop</div>
      </div>
    </div>
  </div>

  <p class="vl" style="font-family:var(--font-mono); font-size:var(--text-micro); color:var(--color-ink-muted); margin-top:var(--space-8)">Freeform on a 12-col grid — 7/5, then 4/4/4, one wide terrain. Images in <span class="tok">/images/mood</span> — fetched refs, not thumbs.</p>
</div>`;
}
export function mount(root){
  const c = root.querySelector('[data-lc-orb]');
  if (!c || !c.getContext) return () => {};
  const stop = attachGlimmerOrb(c, { state: 'thinking', dots: 13, level: 0.8, size: 132 });
  return () => { try { stop(); } catch (_) {} };
}
