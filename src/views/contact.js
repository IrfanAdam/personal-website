import { contact, about } from '../data/site.js';
import { footer } from './shared.js';
export function Contact() {
  return `<section class="hero contact-hero"><h1>${(contact.hero || []).join('<br />')}</h1>
  <p><b>Designing Softwares.</b> ${contact.now}. ${contact.past}</p></section>
  <section class="about"><p>${about}</p><p>${contact.bio2}</p><p>${contact.wip}</p>
  <blockquote>${contact.quote}</blockquote></section>${footer()}`;
}
