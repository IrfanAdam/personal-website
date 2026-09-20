/* ADAM/PAGE — views/promo-video · minimal 16:9 player for case promo · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
const DUMMY = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
function fmt(s) {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
export function promoVideoMarkup(src, poster) {
  const v = (src && src.trim()) ? src : DUMMY;
  const p = poster ? ` poster=\"${poster}\"` : '';
  return `<section class=\"case-promo\" aria-label=\"Promo video\"><div class=\"promo-video paused\" data-promo-video><video preload=\"metadata\" playsinline${p} src=\"${v}\"></video><button class=\"promo-play\" type=\"button\" aria-label=\"Play video\" data-play></button><div class=\"promo-bar\"><button class=\"promo-mute\" type=\"button\" aria-label=\"Mute\" data-mute>♪</button><div class=\"promo-track\" data-track><div class=\"promo-fill\" data-fill></div></div><span class=\"promo-time\" data-time>0:00 / 0:00</span><button class=\"promo-fs\" type=\"button\" aria-label=\"Fullscreen\" data-fs>⛶</button></div></div></section>`;
}
export function mountPromoVideo(root) {
  const box = root.querySelector('[data-promo-video]');
  if (!box) return () => {};
  const video = box.querySelector('video');
  const playBtn = box.querySelector('[data-play]');
  const muteBtn = box.querySelector('[data-mute]');
  const fsBtn = box.querySelector('[data-fs]');
  const track = box.querySelector('[data-track]');
  const fill = box.querySelector('[data-fill]');
  const timeEl = box.querySelector('[data-time]');
  if (!video) return () => {};
  const setState = () => {
    const playing = !video.paused && !video.ended;
    box.classList.toggle('playing', playing);
    box.classList.toggle('paused', !playing);
    playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  };
  const togglePlay = () => { if (video.paused) video.play().catch(() => {}); else video.pause(); };
  const toggleMute = () => { video.muted = !video.muted; muteBtn.textContent = video.muted ? '×' : '♪'; muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute'); };
  const syncTime = () => {
    const cur = video.currentTime || 0, dur = video.duration || 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    if (fill) fill.style.width = `${pct.toFixed(2)}%`;
    if (timeEl) timeEl.textContent = `${fmt(cur)} / ${fmt(dur)}`;
  };
  const onTrack = (e) => {
    const r = track.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
    const dur = video.duration || 0;
    if (dur) video.currentTime = (x / r.width) * dur;
  };
  const onFs = () => {
    const el = box;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el);
  };
  let scrub = false;
  const onDown = (e) => { scrub = true; onTrack(e); };
  const onMove = (e) => { if (scrub) onTrack(e); };
  const onUp = () => { scrub = false; };
  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  muteBtn.addEventListener('click', toggleMute);
  fsBtn.addEventListener('click', onFs);
  video.addEventListener('play', setState);
  video.addEventListener('pause', setState);
  video.addEventListener('ended', setState);
  video.addEventListener('timeupdate', syncTime);
  video.addEventListener('loadedmetadata', syncTime);
  track.addEventListener('click', onTrack);
  track.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  const onKey = (e) => {
    if (e.code === 'Space' && document.activeElement === video) { e.preventDefault(); togglePlay(); }
    if (e.key === 'm' || e.key === 'M') toggleMute();
  };
  box.addEventListener('keydown', onKey);
  box.tabIndex = 0;
  muteBtn.textContent = video.muted ? '×' : '♪';
  syncTime(); setState();
  return () => {
    try { playBtn.removeEventListener('click', togglePlay); } catch {}
    try { video.removeEventListener('click', togglePlay); } catch {}
    try { muteBtn.removeEventListener('click', toggleMute); } catch {}
    try { fsBtn.removeEventListener('click', onFs); } catch {}
    try { video.removeEventListener('play', setState); } catch {}
    try { video.removeEventListener('pause', setState); } catch {}
    try { video.removeEventListener('ended', setState); } catch {}
    try { video.removeEventListener('timeupdate', syncTime); } catch {}
    try { video.removeEventListener('loadedmetadata', syncTime); } catch {}
    try { track.removeEventListener('click', onTrack); } catch {}
    try { track.removeEventListener('mousedown', onDown); } catch {}
    try { window.removeEventListener('mousemove', onMove); } catch {}
    try { window.removeEventListener('mouseup', onUp); } catch {}
    try { box.removeEventListener('keydown', onKey); } catch {}
    try { video.pause(); } catch {}
  };
}
