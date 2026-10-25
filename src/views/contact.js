/* ADAM/PAGE — views/contact · contact page · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: Contact, mountContact — contact page + Cal CTA + rise
import { contact, about, profileImage, calUrl } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';
import { mountTitleReveal } from './title-reveal.js';

// profile image dims: 1400x1181
const PW = 1400, PH = 1181;

// — CTA —
function calCta() {
  if (!calUrl) return '';
  return `<a class="btn btn--primary" href="${calUrl}" target="_blank"`
    + ` rel="noopener noreferrer">Schedule a meeting — Cal.com ↗</a>`;
}

export function Contact() {
  const lines = contact.hero || [];
  const split = Math.ceil(lines.length / 2);
  const heroSpans = lines
    .map((t, i) => `<span class="${i < split ? 'ink' : 'muted'}">${t}</span>`)
    .join('');
  return [
    `<article class="case"><div class="case-grid">
  <div class="case-copy">
`,
    `    <section class="hero contact-hero"><h1>`,
    heroSpans,
    `</h1>
    <p><b>Designing Softwares.</b> `,
    contact.now,
    `. `,
    contact.past,
    `</p></section>
    <section class="about contact-about">
      <p>`,
    about,
    `</p><p>`,
    contact.bio2,
    `</p><p>`,
    contact.wip,
    `</p>
      <blockquote>`,
    contact.quote,
    `</blockquote>
      <div class="contact-cta">`,
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
    footer(),
  ].join('');
}

export function mountContact(root) {
  const offRise = mountHeroRise(root);
  const offTitle = mountTitleReveal(root);
  return () => { try { offRise(); } catch {} try { offTitle(); } catch {} };
}
