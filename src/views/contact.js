import { contact, about, profileImage } from '../data/site.js';
import { footer } from './shared.js';
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
  <div class="case-media"><img src="${profileImage}" alt="Irfan Adam M — It's Me" loading="lazy" decoding="async" /></div>
  </div></article>${footer()}`;
}
