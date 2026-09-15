/* ADAM/SHARED — views/img-helpers · responsive picture · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: pictureMarkup, srcsetFor — builds <picture> with WebP + JPEG srcsets
import variants from '../data/variants.json';

function baseOf(src) {
  const i = src.lastIndexOf('.');
  return i > 0 ? src.slice(0, i) : src;
}

export function srcsetFor(src, type) {
  const key = src.split('?')[0];
  const entry = variants[key];
  if (!entry || !entry.variants.length) return '';
  const base = baseOf(key);
  const ext = type === 'webp' ? 'webp' : 'jpg';
  return entry.variants.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
}

export function sizesFor(kind) {
  if (kind === 'hero') return '(max-width: 640px) 100vw, 50vw';
  return '(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw';
}

export function pictureMarkup(src, alt, w, h, opts = {}) {
  if (!src || src.startsWith('http')) {
    const load = opts.loading || 'lazy';
    const fp = opts.fetchPriority ? ` fetchpriority="${opts.fetchPriority}"` : '';
    const dec = opts.decoding || 'async';
    return `<img src="${src}" alt="${alt}" width="${w}" height="${h}"`
      + ` loading="${load}" decoding="${dec}"${fp} />`;
  }
  const webp = srcsetFor(src, 'webp');
  const jpeg = srcsetFor(src, 'jpeg');
  const sizes = opts.sizes || sizesFor(opts.kind || 'grid');
  const load = opts.loading || 'lazy';
  const fp = opts.fetchPriority ? ` fetchpriority="${opts.fetchPriority}"` : '';
  const dec = opts.decoding || 'async';
  const webpTag = webp
    ? `<source type="image/webp" srcset="${webp}" sizes="${sizes}" />` : '';
  const jpegTag = jpeg ? ` srcset="${jpeg}" sizes="${sizes}"` : '';
  return `<picture>${webpTag}<img src="${src}" alt="${alt}"`
    + ` width="${w}" height="${h}" loading="${load}"`
    + ` decoding="${dec}"${fp}${jpegTag} /></picture>`;
}
