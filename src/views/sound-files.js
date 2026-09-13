/* ADAM/FX — Sound files · vendored from IrfanAdam/web-sounds (starting with load).
   Local first (/sounds/*), remote raw URL as fallback. One cached buffer per id. */
export const FILES = [
  { id: 'load.wav',
    url: '/sounds/load.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/load.wav',
    desc: 'load snap · 117ms stereo' },
  { id: 'loading.mp3',
    url: '/sounds/loading.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/loading.mp3',
    desc: 'loading · mp3 bed' },
  { id: 'scifi-weapon.wav',
    url: '/sounds/scifi-weapon.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/scifi%20weapon.wav',
    desc: 'scifi sweep · 886ms stereo' },
];
const cache = new Map();
async function loadBuf(ctx, f) {
  if (cache.has(f.id)) return cache.get(f.id);
  let res = null;
  for (const u of [f.url, f.remote]) {
    try { res = await fetch(u); if (res.ok) break; } catch { res = null; }
  }
  if (!res || !res.ok) throw new Error('fetch');
  const ab = await res.arrayBuffer();
  const buf = await ctx.decodeAudioData(ab.slice(0));
  cache.set(f.id, buf);
  return buf;
}
export function fileById(id) { return FILES.find((f) => f.id === id) || null; }
export async function playFile(ctx, id, gain = 0.8) {
  const f = fileById(id);
  if (!f) return 'file-missing';
  if (!ctx) return 'no-ctx';
  if (ctx.state !== 'running') return 'blocked:' + ctx.state;
  try {
    const buf = await loadBuf(ctx, f);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = Math.max(0, Math.min(1, gain));
    src.connect(g); g.connect(ctx.destination);
    src.start();
    return 'played:file-' + id;
  } catch { return 'file-decode'; }
}
