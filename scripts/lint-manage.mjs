/* ADAM/TOOL — lint-manage · budget + read-shape + header + sections + graph · [plan:2026-09-13_193000-refactor-manageability.md#phase-4] */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAX = 100;
const WIDTH = 120;
const CHAIN = 2;
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

const NESTED_TERNARY = /\?\s[^?]*:\s[^?]*\?\s/;
const BANNER = /^\/\/ — .+ —$/;

const longestChain = (lines) => {
  let run = 0;
  let longest = 0;
  for (const ln of lines) {
    if (/^\s*\+ `/.test(ln)) run += 1;
    else if (ln.trim() !== '') run = 0;
    if (run > longest) longest = run;
  }
  return longest;
};

for (const f of files) {
  if (f.includes('changelog-manifest.json')) continue;
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const n = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  const short = f.replace(ROOT + '/', '');
  if (n > MAX) fail.push(`${short} ${n} lines (limit ${MAX})`);
  if (!src.startsWith('/* ADAM/')) fail.push(`${short} missing ADAM header`);
  const wide = lines.findIndex((ln) => ln.length > WIDTH);
  if (wide > -1) fail.push(`${short}:${wide + 1} line >120ch — wrap it`);
  const tern = lines.findIndex((ln) => NESTED_TERNARY.test(ln));
  if (tern > -1) fail.push(`${short}:${tern + 1} nested ternary — branch it out`);
  const chain = longestChain(lines);
  if (chain > CHAIN) fail.push(`${short} — ${chain} + template continuations in a row (max ${CHAIN}); name the parts`);
  if (f.endsWith('.js')) {
    const stray = lines.findIndex((ln) => ln.includes('// —') && !BANNER.test(ln));
    if (stray > -1) fail.push(`${short}:${stray + 1} malformed section banner`);
    const sections = lines.some((ln) => BANNER.test(ln));
    if (sections && !lines.some((ln) => ln.startsWith('// Exports:'))) {
      fail.push(`${short} has sections but no // Exports map`);
    }
  }
}

const graph = spawnSync(process.execPath, [join(ROOT, 'scripts/map-graph.mjs')], { cwd: ROOT, encoding: 'utf8' });
if (graph.status !== 0) fail.push('map-graph.mjs failed — fix the import graph');
const stale = spawnSync('git', ['status', '--porcelain', '--', 'docs/graph.mmd'], { cwd: ROOT, encoding: 'utf8' });
if (stale.status !== 0) fail.push('git status failed — cannot verify docs/graph.mmd freshness');
else if (stale.stdout.trim() !== '') fail.push('docs/graph.mmd stale — commit the regenerated graph');

if (fail.length) {
  console.error(`✗ manage lint — ${fail.length}:\n  ${fail.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ manage lint — budget + read-shape + headers + sections + graph clean');
