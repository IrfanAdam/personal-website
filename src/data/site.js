/* ADAM/APP — data/site · CMS-backed project tuples + settings ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Content lives in /content/*.json so Decap CMS (/admin) can edit it.
// Tuple: [slug, title, catA, catB, date, timeline, role, tag,
//  image, deliverables, platform, w, h, mock, hero, promoVideo,
//  nextImage, nextW, nextH]
// w/h come from content/dims.json (node scripts/dims.mjs); fallback 3:4.
// mock is Framer hover variant (BEj6Kv06e); hero is detail hero (same as mock, Framer detail uses mock not grid thumb).
// hero falls back to mock → image for backwards-compat; promoVideo is optional 16:9 MP4 below hero.
// nextImage is the Framer "See whats next" preview (special per-project, not hero).
import settings from '../../content/settings.json';
import personalJson from '../../content/personal.json';
import dims from '../../content/dims.json';
import nextDims from '../../content/next-dims.json';
const files = import.meta.glob('../../content/projects/*.json', { eager: true });
const items = Object.values(files)
  .map((m) => m.default ?? m)
  .sort((a, b) => a.order - b.order);
// Whitespace-only CMS values count as empty — clearing a field hides it.
const clean = (v) => (typeof v === 'string' ? v.trim() : '');
const cleanLines = (v) => (Array.isArray(v) ? v.map(clean).filter(Boolean) : []);
const sc = settings.contact || {};
const has = (k) => Object.prototype.hasOwnProperty.call(personalJson, k);
const pick = (k) => (has(k) ? clean(personalJson[k]) : clean(sc[k] ?? ''));
const heroLines = cleanLines(personalJson.hero);
const leadText = clean(personalJson.lead);
export const socials = (settings.socials || []).map((s) => [s.name, s.url]);
export const about = has('about') ? clean(personalJson.about) : clean(settings.about);
export const calUrl = settings.calUrl || 'https://cal.com/irfan-adam-m-2lzwxz';
export const personal = {
  hero: heroLines.length ? heroLines
    : leadText ? [leadText] : ['Irfan', 'Adam', 'M'],
  lead: leadText,
  intro: pick('intro'),
  bio2: pick('bio2'),
  wip: pick('wip'),
  quote: pick('quote'),
};
// now/past are legacy settings-only fields — once personal.json owns
// intro, a cleared intro stays hidden instead of resurrecting old copy.
const legacy = !has('intro');
export const contact = {
  hero: personal.hero,
  now: legacy ? clean(sc.now) : personal.intro,
  past: legacy ? clean(sc.past) : '',
  bio2: personal.bio2,
  wip: personal.wip,
  quote: personal.quote,
  lead: personal.lead,
  intro: personal.intro,
};
export const profileImage = settings.profileImage || '/images/irfan-profile.jpg';
export const bodies = Object.fromEntries(items.map((p) => [p.slug, p.body || '']));
export const projects = items.map((p) =>
  [p.slug,
    p.title,
    p.catA || '',
    p.catB || '',
    p.date,
    p.timeline,
    p.role,
    p.tag,
    p.image,
    p.deliverables || '—',
    p.platform || '—',
    ...(dims[p.slug] || [3, 4]),
    p.mock || p.image,
    p.hero || p.mock || p.image,
    p.promoVideo || '',
    p.nextImage || p.hero || p.mock || p.image,
    ...(nextDims[p.slug] || dims[p.slug] || [3, 4])]);
export const iconFor = (slug) => `/icons/${slug === 'apparel-manufacturing-system-reimagined' ? 'apparel' : slug}.jpg`;
