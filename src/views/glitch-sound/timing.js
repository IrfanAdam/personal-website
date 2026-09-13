/* ADAM/FX — views/glitch-sound/timing · timing · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { getNoise } from '../audio-ctx.js';
const AT = 0.88;
export function getBuf() { return getNoise(); }
export const red = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
export function durMs(el) { try { if (!el) return 2400;
    const r = getComputedStyle(el)
      .getPropertyValue('--dur-glitch')
      .trim() || '2.4s';
    if (r.endsWith('ms')) return parseFloat(r) || 2400;
    if (r.endsWith('s')) return (parseFloat(r) || 2.4) * 1000;
    return 2400;
  } catch { return 2400;
  } }
export function untilGlitch(el) { try { if (!el || !el.isConnected || !el.getAnimations) return 0;
    const anims = el
      .getAnimations();
    const g = anims
      .find((a) => String(a.animationName || '').toLowerCase().includes('glitch'));
    if (!g || g.playState === 'paused') return 0;
    let dur = null;
    try { dur = g.effect.getTiming().duration;
    } catch {} if (typeof dur === 'string') dur = parseFloat(dur);
    dur = Number(dur);
    if (!dur || !isFinite(dur)) dur = durMs(el);
    const cur = Number(g.currentTime);
    if (!isFinite(cur)) return 0;
    const at = dur * AT;
    const mod = ((cur % dur) + dur) % dur;
    let d = at - mod;
    if (d < 20) d += dur;
    return d > 0 ? d : 0;
  } catch { return 0;
  } }
