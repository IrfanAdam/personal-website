/* ADAM/PAGE — views/cal-modal · Cal connect dialog · [plan:2026-11-02_000000-lump-sum-builds.md#phase-2] */
// Exports: calModalHtml, mountCalModal — self-contained Cal dialog
import { getCalLink, preloadCal, initInline } from './cal-loader.js';

// — Markup —
export function calModalHtml() {
  return [
    `<div class="cal-modal" data-cal-modal hidden>`,
    `<div class="cal-modal__backdrop" data-cal-close></div>`,
    `<div class="cal-modal__panel" role="dialog" aria-modal="true" aria-labelledby="cal-modal-title">`,
    `<div class="cal-modal__head">`,
    `<p class="cal-modal__title" id="cal-modal-title">Schedule a meeting</p>`,
    `<button class="btn btn--secondary btn--sm cal-modal__close" type="button" data-cal-close>Close</button>`,
    `</div>`,
    `<div class="cal-modal__body">`,
    `<div class="cal-modal__loading" data-cal-loading><p>Loading scheduler…</p><span></span><span></span></div>`,
    `<div class="cal-modal__embed" data-cal-embed hidden></div>`,
    `<div class="cal-modal__error" data-cal-error hidden>`,
    `<p>Scheduler failed to load.</p>`,
    `<button class="btn btn--secondary btn--sm" type="button" data-cal-retry>Try again</button>`,
    `<a class="cal-modal__fallback" data-cal-fallback href="https://cal.com/">Open in Cal.com</a>`,
    `</div></div></div></div>`,
  ].join('');
}

// — Mount —
export function mountCalModal(root) {
  const modal = root.querySelector('[data-cal-modal]');
  const triggers = Array.from(root.querySelectorAll('[data-cal-open]'));
  if (!modal || triggers.length === 0) return () => {};
  const embed = modal.querySelector('[data-cal-embed]');
  const loading = modal.querySelector('[data-cal-loading]');
  const errorBox = modal.querySelector('[data-cal-error]');
  const retry = modal.querySelector('[data-cal-retry]');
  const fallback = modal.querySelector('[data-cal-fallback]');
  const closers = modal.querySelectorAll('[data-cal-close]');
  fallback.href = `https://cal.com/${getCalLink()}`;
  let opener = null;

  function setState(name) {
    loading.hidden = name !== 'loading';
    errorBox.hidden = name !== 'error';
    embed.hidden = name !== 'ready';
  }

  function load() {
    if (embed.dataset.calReady === 'done') return setState('ready');
    setState('loading');
    initInline(embed, getCalLink()).then(() => setState('ready'), () => setState('error'));
  }

  function open() {
    opener = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    load();
    closers[0].focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

  function onKey(e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const items = Array.from(modal.querySelectorAll('button, a[href]'));
    const visible = items.filter((el) => el.offsetParent !== null);
    if (visible.length === 0) return;
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  triggers.forEach((btn) => btn.addEventListener('click', open));
  closers.forEach((el) => el.addEventListener('click', close));
  retry.addEventListener('click', load);
  document.addEventListener('keydown', onKey);
  preloadCal();

  return () => {
    triggers.forEach((btn) => btn.removeEventListener('click', open));
    closers.forEach((el) => el.removeEventListener('click', close));
    retry.removeEventListener('click', load);
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  };
}
