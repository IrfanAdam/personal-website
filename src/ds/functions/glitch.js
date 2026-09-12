/* ADAM/DS — Functions · Glitch lab (visual only — no audio).
   Demos run on ../../views/glitch.js + tokens --dur-glitch / --fx-glitch-*.
   Sound arrives via the glitch-sound plan; this lab stays silent. */
import { attachGlitch, glitchOnce, pauseGlitch, resumeGlitch } from '../../views/glitch.js';
import { note } from '../specimens.js';
export const title = 'Glitch';
export function render() {
  return `<p class="ds-crumb">Functions · Glitch</p><div class="ds-hero"><h1>Glitch — any container.</h1><p class="lede">Today's timeline tick turned generic: <span class="tok">.fx-glitch</span> (CSS) + <span class="tok">attachGlitch(el)</span> (JS). Tokens <span class="tok">--dur-glitch</span> · <span class="tok">--fx-glitch-x/skew/opacity</span>. Reduced-motion safe.</p></div>`
  + `<div class="ds-sec"><h2>Lab</h2><p class="sub">Trigger, duration and intensity write scoped vars on the demos only — site untouched.</p>`
  + `<div class="ds-spec block"><div class="fx-glitch" data-lab="card" style="border:var(--border-hairline);padding:var(--space-14)">card — infinite</div>`
  + `<p data-lab="text" style="font-size:var(--text-title);font-weight:700;margin:0">text — hover me</p>`
  + `<div data-lab="media" style="border:var(--border-hairline);aspect-ratio:16/6;display:grid;place-items:center">media — once</div>`
  + `<pre data-lab="code" style="margin:0"><code>attachGlitch(el, { trigger: 'hover' })</code></pre>`
  + `<div class="fx-controls"><label class="fx-row">trigger <select data-ctl="trigger"><option value="auto">infinite</option><option value="hover">hover</option><option value="once">once</option></select></label>`
  + `<label class="fx-row">duration <input type="range" min="600" max="4800" step="100" value="2400" data-ctl="dur"><output data-ctl-v>2400ms</output></label>`
  + `<label class="fx-row">intensity <input type="range" min="1" max="8" step="1" value="1" data-ctl="int"><output data-ctl-i>1px</output></label>`
  + `<div class="fx-btns"><button class="pill" data-ctl="fire">fire once</button><button class="pill" data-ctl="pause">pause / resume</button></div></div></div>`
  + `${note('Do', 'Glitch marks one thing at a time — today on the changelog, the primary CTA elsewhere. Groups stay static.')}</div>`;
}
export function mount(root) {
  const stops = [];
  const demos = [...root.querySelectorAll('[data-lab]')];
  const trig = root.querySelector('[data-ctl="trigger"]'), dur = root.querySelector('[data-ctl="dur"]'),
    int = root.querySelector('[data-ctl="int"]'), outD = root.querySelector('[data-ctl-v]'), outI = root.querySelector('[data-ctl-i]');
  const apply = () => {
    stops.splice(0).forEach((fn) => { try { fn(); } catch {} });
    demos.forEach((el) => {
      el.style.setProperty('--dur-glitch', `${dur.value}ms`);
      el.style.setProperty('--fx-glitch-x', `var(--space-${Math.min(8, int.value)})`);
      stops.push(attachGlitch(el, { trigger: trig.value }));
    });
    outD.textContent = `${dur.value}ms`; outI.textContent = `${int.value}px`;
  };
  [trig, dur, int].forEach((c) => c && c.addEventListener('input', apply));
  const fire = root.querySelector('[data-ctl="fire"]');
  if (fire) fire.addEventListener('click', () => demos.forEach((el) => glitchOnce(el)));
  let paused = false;
  const pause = root.querySelector('[data-ctl="pause"]');
  if (pause) pause.addEventListener('click', () => { paused = !paused; demos.forEach((el) => (paused ? pauseGlitch(el) : resumeGlitch(el))); });
  apply();
  return () => stops.forEach((fn) => { try { fn(); } catch {} });
}
