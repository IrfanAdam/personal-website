/* ADAM/FX — Sound files · vendored from IrfanAdam/web-sounds ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: FILES, fileById, playFile — local first, remote fallback
export const FILES = [
  { id: 'authorize.mp3',
    url: '/sounds/authorize.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/authorize.mp3',
    desc: 'authorize · 444ms plucky pop' },
  { id: 'button_pop.mp3',
    url: '/sounds/button_pop.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/button_pop.mp3',
    desc: 'button pop · 418ms soft thock' },
  { id: 'click.mp3',
    url: '/sounds/click.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/click.mp3',
    desc: 'click · 78ms micro tick' },
  { id: 'hover.wav',
    url: '/sounds/hover.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/hover.wav',
    desc: 'hover · 410ms brushed pad' },
  { id: 'load.wav',
    url: '/sounds/load.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/load.wav',
    desc: 'load snap · 117ms stereo' },
  { id: 'loading.mp3',
    url: '/sounds/loading.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/loading.mp3',
    desc: 'loading · 504ms mp3 bed' },
  { id: 'pop.mp3',
    url: '/sounds/pop.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/pop.mp3',
    desc: 'pop · 183ms bubble' },
  { id: 'pull.mp3',
    url: '/sounds/pull.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/pull.mp3',
    desc: 'pull · 552ms rubber stretch' },
  { id: 'window-open.mp3',
    url: '/sounds/window-open.mp3',
    remote: '/sounds/window-open.mp3',
    desc: 'window open · 2.09s modern UI' },
  { id: 'reel.mp3',
    url: '/sounds/reel.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/reel.mp3',
    desc: 'reel · 287ms tape tick' },
  { id: 'schloop.mp3',
    url: '/sounds/schloop.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/schloop.mp3',
    desc: 'schloop · 418ms liquid drop' },
  { id: 'schlop.mp3',
    url: '/sounds/schlop.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/schlop.mp3',
    desc: 'schlop · 470ms woody plop' },
  { id: 'scifi-weapon.wav',
    url: '/sounds/scifi-weapon.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/scifi%20weapon.wav',
    desc: 'scifi sweep · 886ms stereo' },
  { id: 'ui-click-43196.mp3',
    url: '/sounds/ui-click-43196.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/ui-click-43196.mp3',
    desc: 'ui click · 552ms crisp' },
  { id: 'weapon_scifi_laser.wav',
    url: '/sounds/weapon_scifi_laser.wav',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/weapon_scifi_laser.wav',
    desc: 'laser · 1296ms sci-fi zap' },
  { id: 'zing.mp3',
    url: '/sounds/zing.mp3',
    remote: 'https://raw.githubusercontent.com/IrfanAdam/web-sounds/main/zing.mp3',
    desc: 'zing · 287ms bright ping' },
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
