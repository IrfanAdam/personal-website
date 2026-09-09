import { contact, about, profileImage } from '../data/site.js';
import { footer } from './shared.js';
import { mountHeroRise } from './rise.js';

// profile image dims: 1400x1181
const PW = 1400, PH = 1181;

export function Contact() {
  const lines = contact.hero || [];
  const split = Math.ceil(lines.length / 2);
  const heroSpans = lines.map((t, i) => `<span class="${i < split ? 'ink' : 'muted'}">${t}</span>`).join('');
  return `<article class="case"><div class="case-grid">
  <div class="case-copy">
    <section class="hero contact-hero"><h1>${heroSpans}</h1>
    <p><b>Designing Softwares.</b> ${contact.now}. ${contact.past}</p></section>
    <section class="about contact-about">
      <p>${about}</p><p>${contact.bio2}</p><p>${contact.wip}</p>
      <blockquote>${contact.quote}</blockquote>
    </section>
  </div>
  <div class="case-media hero-box" style="--hero-aspect:${PW}/${PH}" data-w="${PW}" data-h="${PH}"><canvas class="gr" aria-hidden="true"></canvas><img src="${profileImage}" alt="Irfan Adam M — It's Me" width="${PW}" height="${PH}" decoding="async" fetchpriority="high" /></div>
  </div></article>${footer()}`;
}

export function mountContact(root) {
  return mountHeroRise(root);
}
