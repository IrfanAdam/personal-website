/* ADAM/PAGE — views/masonry/brand-tokens-extract · hero palette quantizer ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: extractPalette(img) — dominant, hue-spread 4-colour palette from a loaded image
function hex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function toHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}
export function extractPalette(img) {
  const w = 32, h = 32;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  try { ctx.drawImage(img, 0, 0, w, h); } catch { return null; }
  let data;
  try { data = ctx.getImageData(0, 0, w, h).data; } catch { return null; }
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 16) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const [, s, v] = toHsv(r, g, b);
    if (v < 0.08 || v > 0.97) continue; // near-white / near-black wash
    if (s < 0.12) continue; // greys carry no brand cue
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    const cur = buckets.get(key);
    if (cur) cur.cnt += 1;
    else buckets.set(key, { r, g, b, cnt: 1, s });
  }
  if (buckets.size < 4) return null;
  const arr = [...buckets.values()].sort((a, b) => b.s * b.cnt - a.s * a.cnt);
  const picked = [];
  const seenH = [];
  for (const b of arr) {
    const h = toHsv(b.r, b.g, b.b)[0];
    let ok = true;
    for (const sh of seenH) { if (Math.abs(sh - h) < 18) { ok = false; break; } }
    if (ok || picked.length > 2) { picked.push(b); seenH.push(h); }
    if (picked.length >= 4) break;
  }
  while (picked.length < 4 && arr[picked.length]) picked.push(arr[picked.length]);
  return picked.slice(0, 4).map(p => hex(p.r, p.g, p.b));
}
