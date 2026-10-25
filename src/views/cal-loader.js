/* ADAM/PAGE — views/cal-loader · Cal inline loader · [plan:2026-10-19_000000-lump-sum-builds.md#phase-2] */
// Exports: getCalLink, initInline — Cal 15min inline loader (lazy)
import { calUrl } from '../data/site.js';

// — Config —
const CAL_EMBED = 'https://app.cal.com/embed/embed.js';
const CAL_ORIGIN = 'https://app.cal.com';
const CAL_NS = '15min';

// — Helpers —
export function getCalLink(url = calUrl) {
  const slug = url.replace(/^https:\/\/cal\.com\//, '').replace(/\/$/, '');
  if (slug.endsWith('/15min')) return slug;
  return `${slug}/15min`;
}

function ensureCal() {
  if (typeof window === 'undefined') return;
  if (window.Cal && window.Cal.loaded) return;
  (function (C, A, L) {
    const p = function (a, ar) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, CAL_EMBED, 'init');
}

let inited = false;

// — Init —
export function initInline(calLink) {
  if (inited) return;
  ensureCal();
  window.Cal('init', CAL_NS, { origin: CAL_ORIGIN });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  window.Cal.ns[CAL_NS]('inline', {
    elementOrSelector: '#my-cal-inline-15min',
    config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
    calLink,
  });
  window.Cal.ns[CAL_NS]('ui', {
    hideEventTypeDetails: false,
    layout: 'month_view',
  });
  inited = true;
}
