/* ADAM/TOOL — scripts/optimize-images · responsive variants · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: none — CLI: node scripts/optimize-images.mjs
// Generates 480/800/1200w JPEG + WebP alongside originals for /images & /heroes.
// Uses sharp (installed). Skips if variant newer than source. No AVIF (slower).
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirs = ['public/images', 'public/heroes', 'public/images/mood'];
const widths = [480, 800, 1200, 1600];
const qJpeg = 78;
const qWebp = 75;

async function* filesIn(dir) {
  try {
    const ls = await readdir(join(root, dir));
    for (const f of ls) {
      const p = join(root, dir, f);
      const s = await stat(p);
      if (s.isDirectory()) continue;
      const ext = extname(f).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
      if (/-480\.|-800\.|-1200\.|-1600\./.test(f)) continue;
      yield { dir, file: f, ext, full: p };
    }
  } catch {}
}

const manifest = {};
let done = 0;
for (const dir of dirs) {
  for await (const { file, full, ext } of filesIn(dir)) {
    const base = basename(file, ext);
    const key = `/${dir.replace(/^public\//, '')}/${file}`;
    const meta = await sharp(full).metadata();
    const w0 = meta.width || 0;
    if (!w0) continue;
    manifest[key] = { w: w0, variants: [] };
    for (const w of widths) {
      if (w >= w0) continue;
      manifest[key].variants.push(w);
      for (const fmt of ['jpeg', 'webp']) {
        const outName = `${base}-${w}.${fmt === 'jpeg' ? 'jpg' : 'webp'}`;
        const out = join(root, dir, outName);
        let need = true;
        try {
          const a = await stat(full);
          const b = await stat(out);
          if (b.mtimeMs > a.mtimeMs) need = false;
        } catch {}
        if (!need) continue;
        const pipe = sharp(full).resize({ width: w, withoutEnlargement: true });
        if (fmt === 'jpeg') pipe.jpeg({ quality: qJpeg, mozjpeg: true });
        else pipe.webp({ quality: qWebp, effort: 4 });
        await pipe.toFile(out);
        done += 1;
        console.log(`  ${dir}/${outName} ← ${w0}→${w}`);
      }
    }
  }
}
await writeFile(join(root, 'src/data/variants.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ optimize-images — ${done} variants · manifest ${Object.keys(manifest).length} keys`);
