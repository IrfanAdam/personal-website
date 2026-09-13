/* ADAM/TOOL — lint-manage · ≤100 lines + readability + headers · [plan:2026-09-13_193000-refactor-manageability.md#phase-0] */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX = 100;
const fail = [];
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walk(p);
  return (p.endsWith('.js') || p.endsWith('.css')) ? [p] : [];
});
const roots = [join(ROOT, 'src'), join(ROOT, 'scripts')];
const files = roots.flatMap((r) => {
  try { return walk(r); } catch { return []; }
});
for (const f of files) {
  if (f.includes('changelog-manifest.json')) continue;
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const n = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  const short = f.replace(ROOT + '/', '');
  if (n > MAX) fail.push(`${short} ${n} lines (limit ${MAX})`);
  if (!src.startsWith('/* ADAM/')) fail.push(`${short} missing ADAM header`);
  const idx = lines.findIndex((ln) => ln.length > 120);
  if (idx > -1) fail.push(`${short}:${idx + 1} line >120ch — wrap it`);
}
if (fail.length) {
  console.error(`✗ manage lint — ${fail.length}:\n  ${fail.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ manage lint — lines + headers + width clean');
