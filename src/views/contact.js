import { contact, about, profileImage } from '../data/site.js';
import { footer } from './shared.js';
import { attachGridReveal } from './masonry/gridReveal.js';

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
  const box = root.querySelector('.hero-box');
  const img = box?.querySelector('img');
  if (!box || !img) return () => {};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    box.classList.add('ready');
    return () => {};
  }
  const isMobile = matchMedia('(max-width: 640px)').matches;
  if (isMobile) {
    const w = PW, h = PH;
    const asp = h / w;
    const cw = box.getBoundingClientRect().width || window.innerWidth - 24;
    const finalH = Math.round(cw * asp);
    let placeholderH = Math.round(Math.min(420, Math.max(300, cw * 0.82)));
    if (finalH - placeholderH < 28) placeholderH = Math.max(220, finalH - 80);
    placeholderH = Math.min(placeholderH, finalH - 24);
    if (placeholderH < 180) placeholderH = Math.min(220, finalH - 24);
    box.style.aspectRatio = 'auto';
    box.style.height = placeholderH + 'px';
    box.classList.add('loading');
    box.getBoundingClientRect();
    box.style.transition = 'height 860ms cubic-bezier(0.32,0.72,0,1)';
    box.style.willChange = 'height';
    let done = false;
    let tFallback = 0;
    let offReveal = () => {};
    const finishHeight = () => {
      if (done) return;
      done = true;
      box.removeEventListener('transitionend', onEnd);
      clearTimeout(tFallback);
      box.style.height = '';
      box.style.aspectRatio = 'var(--hero-aspect)';
      box.style.transition = '';
      box.style.willChange = '';
      box.classList.remove('loading');
      offReveal = attachGridReveal(box, img, 80, true);
    };
    const onEnd = (e) => { if (e.propertyName !== 'height') return; finishHeight(); };
    box.addEventListener('transitionend', onEnd);
    tFallback = setTimeout(finishHeight, 980);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!done) box.style.height = finalH + 'px';
    }));
    return () => {
      done = true;
      clearTimeout(tFallback);
      box.removeEventListener('transitionend', onEnd);
      box.classList.remove('loading');
      box.style.height = '';
      box.style.aspectRatio = '';
      box.style.transition = '';
      box.style.willChange = '';
      offReveal();
    };
  }
  const offReveal = attachGridReveal(box, img, 80, true);
  return () => offReveal();
}
