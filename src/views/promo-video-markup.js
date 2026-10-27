/* ADAM/PAGE — views/promo-video-markup · 16:9 markup · [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: promoVideoMarkup(src)
import { IC_PLAY, IC_SOUND, IC_FS } from './promo-video-icons.js';
// — Sources —
const DUMMY = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
function posterFor(src) {
  if (!src || !src.trim()) return '';
  if (/^https?:\/\//i.test(src)) return '';
  return src.replace(/\.(mp4|webm|mov)(\?.*)?$/i, '.jpg');
}
function isCrossOrigin(src) {
  try {
    if (typeof location !== 'undefined' && location.origin) {
      return new URL(src, location.href).origin !== location.origin;
    }
  } catch {}
  return /^https?:\/\//i.test(src);
}
// — Markup —
export function promoVideoMarkup(src) {
  const v = src && src.trim() ? src : DUMMY;
  const poster = posterFor(v);
  const attr = poster ? ` poster="${poster}"` : '';
  const cross = isCrossOrigin(v) ? ' crossorigin="anonymous"' : '';
  const open = `<video preload="metadata" playsinline${attr}${cross}`;
  const remote = /^https?:\/\//i.test(v);
  if (remote) {
    return [
      `<section class="case-promo" aria-label="Promo video">`,
      `<div class="promo-video paused" data-promo-video>`,
      `${open} src="${v}"></video>`,
      `<button class="promo-play" type="button" aria-label="Play video" data-play>`,
      `<span class="promo-play-pill">${IC_PLAY}</span></button>`,
      `<div class="promo-bar"><button class="promo-mute" type="button"`,
      ` aria-label="Mute" data-mute>${IC_SOUND}</button>`,
      `<div class="promo-track" data-track><div class="promo-buf" data-buf></div>`,
      `<div class="promo-fill" data-fill></div></div>`,
      `<span class="promo-time" data-time>0:00 / 0:00</span>`,
      `<button class="promo-fs" type="button" aria-label="Fullscreen" data-fs>`,
      `${IC_FS}</button></div></div></section>`,
    ].join('');
  }
  const mob = v.replace(/-?\.mp4(\?.*)?$/i, '-mobile.mp4');
  return [
    `<section class="case-promo" aria-label="Promo video">`,
    `<div class="promo-video paused" data-promo-video>`,
    `${open}>`,
    `<source src="${mob}" media="(max-width: 768px)">`,
    `<source src="${v}"></video>`,
    `<button class="promo-play" type="button" aria-label="Play video" data-play>`,
    `<span class="promo-play-pill">${IC_PLAY}</span></button>`,
    `<div class="promo-bar"><button class="promo-mute" type="button"`,
    ` aria-label="Mute" data-mute>${IC_SOUND}</button>`,
    `<div class="promo-track" data-track><div class="promo-buf" data-buf></div>`,
    `<div class="promo-fill" data-fill></div></div>`,
    `<span class="promo-time" data-time>0:00 / 0:00</span>`,
    `<button class="promo-fs" type="button" aria-label="Fullscreen" data-fs>`,
    `${IC_FS}</button></div></div></section>`,
  ].join('');
}
