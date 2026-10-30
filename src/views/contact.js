/* ADAM/PAGE — views/contact · contact page · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: Contact, mountContact — contact page + Cal modal + rise
import { contact, about, profileImage, calUrl } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';
import { mountTitleReveal } from './title-reveal.js';
import { calModalHtml, mountCalModal } from './cal-modal.js';

// profile image dims: 1400x1181
const PW = 1400, PH = 1181;

// — CTA —
function calCta() {
  if (!calUrl) return '';
  return `<button class="btn btn--primary" type="button" data-cal-open>`
    + `Schedule a meeting — Cal.com ↗</button>`;
}

export function Contact() {
  const lines = contact.hero.length ? contact.hero : ['Irfan', 'Adam', 'M'];
  const split = Math.ceil(lines.length / 2);
  const heroSpans = lines
    .map((t, i) => `<span class="${i < split ? 'ink' : 'muted'}">${t}</span>`)
    .join('');
  const lead = (contact.lead || '').trim();
  const intro = (contact.intro
    || [contact.now, contact.past].filter((t) => t && t.trim()).join('. ')).trim();
  const para = lead || intro
    ? `<p>${lead ? `<b>${lead}</b> ` : ''}${intro}</p>`
    : '';
  const aboutParas = [about, contact.bio2, contact.wip]
    .filter((t) => t && t.trim())
    .map((t) => `<p>${t}</p>`)
    .join('');
  const quoteBlock = contact.quote && contact.quote.trim()
    ? `<blockquote>${contact.quote}</blockquote>`
    : '';
  return [
    `<article class="case"><div class="case-grid">
  <div class="case-copy">
`,
    `    <section class="hero contact-hero"><h1>`,
    heroSpans,
    `</h1>
`,
    para,
    `</section>
    <section class="about contact-about">
`,
    aboutParas,
    quoteBlock,
    `      <div class="contact-cta">`,
    calCta(),
    `</div>
    </section>
  </div>
  <div class="case-media"><div class="hero-box" style="--hero-aspect:`,
    PW,
    `/`,
    PH,
    `" data-w="`,
    PW,
    `" data-h="`,
    PH,
    `"><canvas class="gr" aria-hidden="true"></canvas><img src="`,
    profileImage,
    `" alt="Irfan Adam M — It's Me" width="`,
    PW,
    `" height="`,
    PH,
    `" decoding="async" fetchpriority="high" /></div></div>
  </div></article>`,
    calModalHtml(),
    footer(),
  ].join('');
}

export function mountContact(root) {
  const offRise = mountHeroRise(root);
  const offTitle = mountTitleReveal(root);
  const offCal = mountCalModal(root);
  return () => {
    try { offRise(); } catch {}
    try { offTitle(); } catch {}
    try { offCal(); } catch {}
  };
}
