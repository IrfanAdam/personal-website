/* ADAM/TOOL — scripts/optimize-videos.mjs · CMS video prep [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: none — CLI: node scripts/optimize-videos.mjs
// Faststart + -mobile.mp4 + .jpg for content/projects promoVideo uploads.
import { readdir, readFile, rename, stat, unlink } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ffmpegRun, isFresh, md5Of, moovFirst, probeSize, resolveFfmpeg } from './video-ffmpeg.mjs';

// — Section: setup —
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vdir = join(root, 'public', 'videos');
const scratch = process.env.TMPDIR || '/Users/irfan/.hermes/cache/scratch';
const names = await readdir(join(root, 'content', 'projects'));
const sources = new Set();
for (const f of names) {
  if (!f.endsWith('.json')) continue;
  let promo = '';
  try {
    const j = JSON.parse(await readFile(join(root, 'content', 'projects', f), 'utf8'));
    promo = j.promoVideo || '';
  } catch {}
  if (promo.startsWith('/videos/') && promo.endsWith('.mp4')) sources.add(promo.slice(8));
}

// — Section: ffmpeg gate —
const ff = await resolveFfmpeg();
if (!ff) {
  console.warn('⚠ optimize-videos: no ffmpeg found (system or ffmpeg-static) — skipping, deploy continues');
  process.exit(0);
}

// — Section: twin check —
try {
  const ha = await md5Of(join(vdir, 'my-movie-4.mp4'));
  const hb = await md5Of(join(vdir, 'ad-priming-.mp4'));
  if (ha === hb) console.log('  twins ok: my-movie-4.mp4 ≡ ad-priming-.mp4 (same upload bytes)');
} catch {}

// — Section: exists —
const has = async (p) => {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
};

// — Section: per-source prep —
let fixed = 0;
let made = 0;
for (const name of sources) {
  const src = join(vdir, name);
  if (!(await has(src))) {
    console.warn(`  missing source: ${name}`);
    continue;
  }
  const base = basename(name, '.mp4');
  const mobile = join(vdir, base + '-mobile.mp4');
  const poster = join(vdir, base + '.jpg');
  const fast = await moovFirst(src).catch(() => false);
  if (!fast) {
    const tmp = join(scratch, base + '-faststart.mp4');
    await ffmpegRun(ff, ['-i', src, '-c', 'copy', '-movflags', '+faststart', '-y', tmp]);
    await rename(tmp, src);
    fixed += 1;
    console.log(`  faststart ← ${name}`);
  }
  if (!(await isFresh(src, mobile))) {
    const size = await probeSize(ff, src);
    const vf = size && size.h > size.w ? 'scale=-2:720' : 'scale=1280:-2';
    const args = ['-i', src, '-vf', vf, '-c:v', 'libx264', '-crf', '28'];
    args.push('-preset', 'veryfast', '-c:a', 'aac', '-b:a', '96k');
    args.push('-movflags', '+faststart', '-y', mobile);
    await ffmpegRun(ff, args);
    made += 1;
    console.log(`  ${base}-mobile.mp4 ← ${vf}`);
  }
  if (!(await isFresh(src, poster))) {
    const args = ['-ss', '1', '-i', src, '-frames:v', '1', '-q:v', '3', '-y', poster];
    await ffmpegRun(ff, args);
    made += 1;
    console.log(`  ${base}.jpg ← ss 1`);
  }
}

// — Section: orphan prune (trailing-dash stems match '-.mp4') —
let pruned = 0;
for (const f of await readdir(vdir)) {
  let stem = '';
  if (f.endsWith('-mobile.mp4')) stem = f.slice(0, -11);
  else if (f.endsWith('.jpg')) stem = f.slice(0, -4);
  if (!stem) continue;
  if (await has(join(vdir, stem + '.mp4'))) continue;
  if (await has(join(vdir, stem + '-.mp4'))) continue;
  await unlink(join(vdir, f));
  pruned += 1;
  console.log(`  pruned orphan ${f}`);
}
console.log(`✓ optimize-videos — ${fixed} faststarted · ${made} derived · ${pruned} pruned`);
