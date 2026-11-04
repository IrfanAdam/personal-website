/* ADAM/PAGE — views/cal-loader · Cal embed loader · [plan:2026-11-02_000000-lump-sum-builds.md#phase-2] */
// Exports: getCalLink, preloadCal, initInline — per-mount Cal 15min loader
import { calUrl } from '../data/site.js';

// — Config —
const CAL_EMBED = 'https://app.cal.com/embed/embed.js';
const CAL_ORIGIN = 'https://app.cal.com';
const CAL_NS = '15min';
const READY_TIMEOUT = 12000;

// — Link —
export function getCalLink(url = calUrl) {
  const slug = url.replace(/^https:\/\/cal\.com\//, '').replace(/\/$/, '');
  if (slug.endsWith('/15min')) return slug;
  return `${slug}/15min`;
}

// — Script —
let scriptPromise = null;

function stubCal(resolve, reject) {
  window.Cal = window.Cal || function schedule() {
    const cal = window.Cal;
    const args = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const el = document.createElement('script');
      el.src = CAL_EMBED;
      el.onload = () => resolve();
      el.onerror = () => {
        window.Cal.loaded = false;
        scriptPromise = null;
        reject(new Error('cal embed failed'));
      };
      document.head.appendChild(el);
      cal.loaded = true;
    }
    if (args[0] === 'init') {
      const api = function queue() {
        queue.q.push(arguments);
      };
      api.q = api.q || [];
      if (typeof args[1] === 'string') {
        cal.ns[args[1]] = cal.ns[args[1]] || api;
        cal.ns[args[1]].q.push(args);
        cal.q.push(['initNamespace', args[1]]);
      } else cal.q.push(args);
      return;
    }
    cal.q.push(args);
  };
}

function ensureScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.Cal && window.Cal.loaded) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    stubCal(resolve, reject);
    window.Cal('init', CAL_NS, { origin: CAL_ORIGIN });
  });
  return scriptPromise;
}

// — Preload —
export function preloadCal() {
  if (typeof window === 'undefined') return;
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 800));
  idle(() => {
    ensureScript().catch(() => {});
  });
}

// — Inline —
export function initInline(el, calLink) {
  if (!el) return Promise.reject(new Error('no mount'));
  if (el.dataset.calReady === 'done') return Promise.resolve();
  return ensureScript().then(() => new Promise((resolve, reject) => {
    window.Cal('init', CAL_NS, { origin: CAL_ORIGIN });
    window.Cal.ns[CAL_NS]('inline', {
      elementOrSelector: el,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: true },
      calLink,
    });
    window.Cal.ns[CAL_NS]('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    const started = Date.now();
    const timer = setInterval(() => {
      if (el.querySelector('iframe')) {
        clearInterval(timer);
        el.dataset.calReady = 'done';
        resolve();
      } else if (Date.now() - started > READY_TIMEOUT) {
        clearInterval(timer);
        reject(new Error('cal timed out'));
      }
    }, 120);
  }));
}
