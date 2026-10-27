/* ADAM/PAGE — views/promo-video-mount · player mount · [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: mountPromoVideo(root)
import { IC_PLAY, IC_PAUSE, IC_SOUND, IC_MUTE } from './promo-video-icons.js';
import { fmt, nudgeFrame } from './promo-video-format.js';
import { bindScrub } from './promo-video-scrub.js';
import { ensurePoster } from './promo-video-poster.js';
// — Mount —
export function mountPromoVideo(root) {
  const box = root.querySelector('[data-promo-video]');
  if (!box) return () => {};
  const v = box.querySelector('video');
  const playBtn = box.querySelector('[data-play]');
  const pill = playBtn ? playBtn.querySelector('.promo-play-pill') : null;
  const muteBtn = box.querySelector('[data-mute]');
  const fsBtn = box.querySelector('[data-fs]');
  const track = box.querySelector('[data-track]');
  const fill = box.querySelector('[data-fill]');
  const buf = box.querySelector('[data-buf]');
  const timeEl = box.querySelector('[data-time]');
  if (!v) return () => {};
  const setState = () => {
    const playing = !v.paused && !v.ended;
    box.classList.toggle('playing', playing);
    box.classList.toggle('paused', !playing);
    if (pill) pill.innerHTML = playing ? IC_PAUSE : IC_PLAY;
    playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play');
  };
  const togglePlay = () => { if (v.paused) v.play().catch(() => {}); else v.pause(); };
  const toggleMute = () => {
    v.muted = !v.muted;
    muteBtn.innerHTML = v.muted ? IC_MUTE : IC_SOUND;
    muteBtn.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute');
  };
  const syncTime = () => {
    const cur = v.currentTime || 0;
    const dur = v.duration || 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    if (fill) fill.style.width = `${pct.toFixed(2)}%`;
    const bl = v.buffered;
    if (buf && dur && bl.length) {
      try { buf.style.width = `${((bl.end(bl.length - 1) / dur) * 100).toFixed(2)}%`; } catch {}
    }
    if (timeEl) timeEl.textContent = `${fmt(cur)} / ${fmt(dur)}`;
  };
  const seekFrac = (f) => {
    const dur = v.duration || 0;
    if (dur) v.currentTime = f * dur;
  };
  const boostPreload = () => { if (v.preload !== 'auto') v.preload = 'auto'; };
  const onWait = () => box.classList.add('loading');
  const onReady = () => box.classList.remove('loading');
  const onFs = () => {
    if (typeof v.webkitEnterFullscreen === 'function') {
      try { v.webkitEnterFullscreen(); } catch {}
      return;
    }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else (box.requestFullscreen || box.webkitRequestFullscreen || (() => {})).call(box);
  };
  const onMeta = () => { boostPreload(); syncTime(); if (!v.poster && v.currentTime < 0.05) nudgeFrame(v); };
  const onSeeked = () => { ensurePoster(v); syncTime(); };
  const binds = [
    [playBtn, 'click', togglePlay], [v, 'click', togglePlay],
    [muteBtn, 'click', toggleMute], [fsBtn, 'click', onFs],
    [v, 'play', setState], [v, 'pause', setState], [v, 'ended', setState],
    [v, 'timeupdate', syncTime], [v, 'progress', syncTime],
    [v, 'waiting', onWait], [v, 'playing', onReady], [v, 'canplay', onReady],
    [v, 'loadedmetadata', onMeta], [v, 'seeked', onSeeked], [v, 'canplay', () => ensurePoster(v)],
  ];
  binds.forEach(([el, ev, fn]) => { try { el.addEventListener(ev, fn); } catch {} });
  const unscrub = bindScrub(track, seekFrac);
  boostPreload();
  const onKey = (e) => {
    if (e.code === 'Space' && document.activeElement === v) { e.preventDefault(); togglePlay(); }
    if (e.key === 'k' || e.key === 'K') togglePlay();
    if (e.key === 'm' || e.key === 'M') toggleMute();
    if (e.key === 'f' || e.key === 'F') onFs();
  };
  box.addEventListener('keydown', onKey);
  box.tabIndex = 0;
  muteBtn.innerHTML = v.muted ? IC_MUTE : IC_SOUND;
  syncTime(); setState();
  return () => {
    binds.forEach(([el, ev, fn]) => { try { el.removeEventListener(ev, fn); } catch {} });
    try { unscrub(); } catch {}
    try { box.removeEventListener('keydown', onKey); } catch {}
    try { v.pause(); } catch {}
  };
}
