/* ADAM/PAGE — views/cal-modal · Cal inline modal · [plan:2026-10-19_000000-lump-sum-builds.md#phase-2] */
// Exports: calModalHtml, mountCalModal — modal markup + lifecycle
import { getCalLink, initInline } from './cal-loader.js';

// — Markup —
export function calModalHtml() {
  return [
    `<div class="cal-modal" data-cal-modal hidden aria-hidden="true">`,
    `<div class="cal-modal__backdrop" data-cal-close></div>`,
    `<div class="cal-modal__panel" role="dialog" aria-modal="true"`,
    ` aria-label="Schedule a meeting">`,
    `<div class="cal-modal__head">`,
    `<p class="cal-modal__title">Schedule a meeting</p>`,
    `<button class="cal-modal__close" type="button" data-cal-close`,
    ` aria-label="Close">×</button>`,
    `</div>`,
    `<div class="cal-modal__body">`,
    `<div id="my-cal-inline-15min"`,
    ` style="width:100%;height:100%;overflow:scroll"></div>`,
    `</div></div></div>`,
  ].join('');
}

// — Mount —
export function mountCalModal(root) {
  const calLink = getCalLink();
  const modal = root.querySelector('[data-cal-modal]');
  const openBtn = root.querySelector('[data-cal-open]');
  if (!modal || !openBtn) return () => {};
  const closeEls = modal.querySelectorAll('[data-cal-close]');
  let opener = null;

  function open() {
    opener = document.activeElement;
    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    initInline(calLink);
    const closeBtn = modal.querySelector('[data-cal-close]');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  }

  openBtn.addEventListener('click', open);
  closeEls.forEach((el) => el.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', onKey);

  return () => {
    openBtn.removeEventListener('click', open);
    closeEls.forEach((el) => el.removeEventListener('click', close));
    document.removeEventListener('keydown', onKey);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };
}
