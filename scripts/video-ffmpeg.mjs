/* ADAM/TOOL — scripts/video-ffmpeg.mjs · ffmpeg bits [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: resolveFfmpeg, ffmpegRun, probeSize, moovFirst, isFresh, md5Of
// Resolver prefers system ffmpeg, falls back to ffmpeg-static.
import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

// — Section: runner —
const exec = promisify(execFile);
export async function ffmpegRun(ff, args) {
  await exec(ff, args);
}

// — Section: resolver —
export async function resolveFfmpeg() {
  try {
    await exec('ffmpeg', ['-version']);
    return 'ffmpeg';
  } catch {}
  try {
    const req = createRequire(import.meta.url);
    const bin = req('ffmpeg-static');
    if (bin && existsSync(bin)) return bin;
  } catch {}
  return null;
}

// — Section: size probe —
export async function probeSize(ff, file) {
  let out = '';
  try {
    await exec(ff, ['-i', file]);
  } catch (e) {
    out = String(e.stderr || e.stdout || '');
  }
  const m = out.match(/Video:[^\n]*?(\d{2,5})x(\d{2,5})/);
  if (!m) return null;
  return { w: Number(m[1]), h: Number(m[2]) };
}

// — Section: moov check —
export function moovFirst(file) {
  return new Promise((resolve) => {
    let base = 0;
    let tail = Buffer.alloc(0);
    let moov = -1;
    let mdat = -1;
    const s = createReadStream(file, { highWaterMark: 65536 });
    const done = () => {
      s.destroy();
      resolve(moov >= 0 && mdat >= 0 && moov < mdat);
    };
    s.on('data', (c) => {
      const buf = Buffer.concat([tail, c]);
      const start = base - tail.length;
      if (moov < 0 && buf.indexOf('moov') >= 0) moov = start + buf.indexOf('moov');
      if (mdat < 0 && buf.indexOf('mdat') >= 0) mdat = start + buf.indexOf('mdat');
      if (moov >= 0 && mdat >= 0) done();
      else {
        tail = buf.subarray(buf.length - 3);
        base += c.length;
      }
    });
    s.on('end', done);
    s.on('error', () => resolve(false));
  });
}

// — Section: freshness —
export async function isFresh(src, out) {
  try {
    const a = await stat(src);
    const b = await stat(out);
    return b.mtimeMs > a.mtimeMs;
  } catch {
    return false;
  }
}

// — Section: md5 —
export function md5Of(file) {
  return new Promise((resolve, reject) => {
    const h = createHash('md5');
    const s = createReadStream(file);
    s.on('data', (c) => h.update(c));
    s.on('end', () => resolve(h.digest('hex')));
    s.on('error', reject);
  });
}
