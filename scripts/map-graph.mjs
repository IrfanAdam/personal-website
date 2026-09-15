/* ADAM/TOOL — map-graph · src imports → docs/graph.mmd + arch-schema.json · [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-2] */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { modId, buildSchema } from './graph-schema.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walk(p);
  return p.endsWith('.js') ? [p] : [];
});

const id = (p) => modId(ROOT, p);
const pairs = [];
const mods = walk(SRC);

for (const f of mods) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (!m[1].startsWith('.')) continue;
    if (m[1].endsWith('.json')) continue;
    pairs.push([id(f), id(resolve(dirname(f), m[1]))]);
  }
}

mkdirSync(join(ROOT, 'docs'), { recursive: true });
const lines = [...new Set(pairs.map(([a, b]) => `${a} --> ${b}`))].sort();
writeFileSync(join(ROOT, 'docs/graph.mmd'), `graph TD\n${lines.join('\n')}\n`);
const schema = buildSchema(ROOT, mods, pairs);
/* Keep the previous stamp when only it would change — check-arch-map and the DS
   atlas read this file, and a rebuild must never dirty the tree for nothing. */
const schemaOut = join(ROOT, 'src/ds/arch-schema.json');
try {
  const before = JSON.parse(readFileSync(schemaOut, 'utf8'));
  const strip = (o) => JSON.stringify({ ...o, generated: null });
  if (strip(before) === strip(schema)) schema.generated = before.generated;
} catch {}
writeFileSync(schemaOut, `${JSON.stringify(schema, null, 2)}\n`);
console.log(`✓ graph — ${mods.length} modules · ${lines.length} edges → docs/graph.mmd + arch-schema.json`);
