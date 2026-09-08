// Binary-split cell tree for the mosaic reveal (vanilla port of rareui
// GridReveal): the biggest cell splits first, keeping cells square; once
// the image decodes, detail-heavy regions steal earlier split slots so
// busy areas sharpen first.
export const MORPH = 0.055;
const LAST_SPLIT = 0.92, OPENING = 999;
export const clamp01 = (n) => (n > 0 ? (n < 1 ? n : 1) : 0);
export const mix = (a, b, t) => a + (b - a) * t;
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const hash = (x, y, z) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
};
const make = (x, y, w, h, parent) => ({
  x, y, w, h, r: 0, g: 0, b: 0,
  tone: hash(x + 3.1, y + 1.7, w * 31.7), detail: 0, splitAt: 0, parent, kids: null,
});
export function buildTree(aspect, count) {
  const root = make(0, 0, 1, 1, null);
  const leaves = [root], branches = [];
  while (leaves.length < count) {
    let pick = 0, widest = -1;
    for (let i = 0; i < leaves.length; i++) {
      const c = leaves[i];
      const area = c.w * aspect * c.h * (1 + 0.12 * hash(c.x, c.y, 7.3));
      if (area > widest) { widest = area; pick = i; }
    }
    const p = leaves.splice(pick, 1)[0];
    const wide = p.w * aspect >= p.h, half = (wide ? p.w : p.h) / 2;
    const a = wide ? make(p.x, p.y, half, p.h, p) : make(p.x, p.y, p.w, half, p);
    const b = wide ? make(p.x + half, p.y, half, p.h, p) : make(p.x, p.y + half, p.w, half, p);
    p.kids = [a, b]; branches.push(p); leaves.push(a, b);
  }
  const opening = OPENING - 1, rest = Math.max(1, branches.length - opening);
  branches.forEach((c, i) => {
    c.splitAt = i < opening ? -MORPH : (LAST_SPLIT * (i - opening + 1)) / rest;
  });
  return { root, branches };
}
// Average colour per cell + luminance spread (= detail) from a downsampled frame.
export function measureTree(root, px, size) {
  const gather = (c) => {
    let n = 0, r = 0, g = 0, b = 0, l = 0, l2 = 0;
    if (c.kids) {
      for (const k of c.kids) {
        const s = gather(k);
        n += s.n; r += s.r; g += s.g; b += s.b; l += s.l; l2 += s.l2;
      }
    } else {
      const x0 = Math.round(c.x * size), y0 = Math.round(c.y * size);
      const x1 = Math.max(x0 + 1, Math.round((c.x + c.w) * size));
      const y1 = Math.max(y0 + 1, Math.round((c.y + c.h) * size));
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const i = (y * size + x) * 4;
        const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        n++; r += px[i]; g += px[i + 1]; b += px[i + 2]; l += lum; l2 += lum * lum;
      }
    }
    const d = n || 1;
    c.r = r / d; c.g = g / d; c.b = b / d;
    c.detail = Math.max(0, l2 / d - (l / d) * (l / d));
    return { n, r, g, b, l, l2 };
  };
  gather(root);
}
// Reuse the same time slots so only the order changes, pacing stays identical.
export function orderByDetail(branches, at) {
  const pending = branches.filter((c) => c.splitAt > at);
  if (pending.length < 2) return;
  const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
  const queue = pending.filter((c) => !c.parent || c.parent.splitAt <= at);
  let next = 0;
  while (queue.length && next < slots.length) {
    let pick = 0;
    for (let i = 1; i < queue.length; i++) if (queue[i].detail > queue[pick].detail) pick = i;
    const c = queue.splice(pick, 1)[0];
    c.splitAt = slots[next++];
    for (const k of c.kids ?? []) if (k.kids) queue.push(k);
  }
}
