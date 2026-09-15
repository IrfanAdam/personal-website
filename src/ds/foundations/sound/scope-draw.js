/* ADAM/DS — ds/foundations/sound/scope-draw · waveform painter ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: drawWave, drawFileWave
// — Painter —
function palette(cvs) {
  const cs = getComputedStyle(cvs);
  return {
    bg: cs.getPropertyValue('--color-panel').trim() || '#f2f4f7',
    ink: cs.getPropertyValue('--color-ink').trim() || '#15191f',
    accent: cs.getPropertyValue('--color-accent').trim() || '#e8442e',
  };
}

export function drawWave(cvs, data) {
  if (!cvs || !cvs.getContext) return;
  const ctx = cvs.getContext('2d');
  const { bg, ink, accent } = palette(cvs);
  const w = cvs.width, h = cvs.height;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const mid = h / 2;
  for (let x = 0; x < w; x++) {
    const i = Math.floor((x / w) * data.length);
    const v = data[i] || 0;
    const y = mid - v * (h * 0.42);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // center line
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(w, mid);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export async function drawFileWave(cvs, id) {
  if (!cvs) return;
  try {
    const res = await fetch('/sounds/' + id);
    if (!res.ok) throw new Error('fetch');
    const ab = await res.arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const actx = new AC();
    const buf = await actx.decodeAudioData(ab.slice(0));
    const data = buf.getChannelData(0);
    drawWave(cvs, data);
    try { await actx.close(); } catch {}
  } catch {}
}
