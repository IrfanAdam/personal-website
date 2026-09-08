// Content lives in /content/*.json so Decap CMS (/admin) can edit it.
// Tuple: [slug, title, catA, catB, date, timeline, role, tag, image, deliverables, platform, w, h, mock, hero]
// w/h come from content/dims.json (node scripts/dims.mjs); fallback 3:4.
// mock is Framer hover variant (BEj6Kv06e); hero is detail hero (same as mock, Framer detail uses mock not grid thumb).
// hero falls back to mock → image for backwards-compat.
import settings from '../../content/settings.json';
import dims from '../../content/dims.json';
const files = import.meta.glob('../../content/projects/*.json', { eager: true });
const items = Object.values(files)
  .map((m) => m.default ?? m)
  .sort((a, b) => a.order - b.order);
export const socials = (settings.socials || []).map((s) => [s.name, s.url]);
export const about = settings.about || '';
export const contact = settings.contact || { hero: [], now: '', past: '', bio2: '', wip: '', quote: '' };
export const profileImage = settings.profileImage || '/images/irfan-profile.jpg';
export const bodies = Object.fromEntries(items.map((p) => [p.slug, p.body || '']));
export const projects = items.map((p) =>
  [p.slug, p.title, p.catA || '', p.catB || '', p.date, p.timeline, p.role, p.tag, p.image, p.deliverables || '—', p.platform || '—', ...(dims[p.slug] || [3, 4]), p.mock || p.image, p.hero || p.mock || p.image]);
export const iconFor = (slug) => `/icons/${slug === 'apparel-manufacturing-system-reimagined' ? 'apparel' : slug}.jpg`;
