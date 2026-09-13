/* ADAM/FX — views/glitch-sound/parse · kind parsing · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { TYPES } from '../sound-palette.js';
export function pickKind(raw, fallback) { if (!raw) return fallback;
  const v = String(raw)
    .toLowerCase();
  const found = v
    .split(/[\s,|]+/)
    .map((s) => s.trim())
    .filter((s) => TYPES.includes(s));
  if (found.length === 0) return fallback;
  if (found.length === 1) return found[0];
  return found[Math.floor(Math.random() * found.length)];
}
export function parseAttr(v, cur) { const s = String(v || '').trim().toLowerCase();
  let lo = cur.lo, hi = cur.hi, kind = cur.kind;
  const m = s
    .match(/(\d+)\s*-\s*(\d+)/);
  if (m) { lo = Math.max(500, +m[1]);
    hi = Math
      .max(lo + 500, +m[2]);
  } const toks = s
    .split(/[\s,|]+/)
    .filter((t) => TYPES.includes(t));
  if (toks.length === 1) kind = toks[0];
  else if (toks.length > 1) kind = toks
    .join(',');
  return { lo, hi, kind };
}
