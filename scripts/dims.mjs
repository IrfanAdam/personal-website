// Regenerates content/dims.json: {slug: [w, h]} measured from public/images.
// Re-run after CMS image uploads: node scripts/dims.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function size(imgPath) {
  const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', imgPath]);
  const w = Number(/pixelWidth:\s+(\d+)/.exec(stdout)?.[1]);
  const h = Number(/pixelHeight:\s+(\d+)/.exec(stdout)?.[1]);
  return w && h ? [w, h] : null;
}

const dims = {};
const files = await readdir(join(root, 'content/projects'));
for (const f of files) {
  if (!f.endsWith('.json')) continue;
  const p = JSON.parse(await readFile(join(root, 'content/projects', f), 'utf8'));
  if (!p.slug || !p.image) continue;
  const img = join(root, 'public', p.image.replace(/^\//, ''));
  try {
    const s = await size(img);
    if (s) dims[p.slug] = s;
    else console.warn(`skip ${p.slug}: unreadable ${basename(img)}`);
  } catch {
    console.warn(`skip ${p.slug}: missing ${p.image}`);
  }
}
await writeFile(join(root, 'content/dims.json'), JSON.stringify(dims, null, 2) + '\n');
console.log(`dims.json: ${Object.keys(dims).length} entries`);
