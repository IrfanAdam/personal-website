/* ADAM/TOOL — map-graph · src imports → docs/graph.mmd node diagram · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walk(p);
  return p.endsWith('.js') ? [p] : [];
});

const id = (p) => relative(SRC, p).replace(/\.js$/, '').replace(/[^A-Za-z0-9]/g, '_');
const edges = new Set();
const mods = walk(SRC);

for (const f of mods) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    if (!m[1].startsWith('.')) continue;
    if (m[1].endsWith('.json')) continue;
    edges.add(`${id(f)} --> ${id(resolve(dirname(f), m[1]))}`);
  }
}

mkdirSync(join(ROOT, 'docs'), { recursive: true });
const out = `graph TD\n${[...edges].sort().join('\n')}\n`;
writeFileSync(join(ROOT, 'docs/graph.mmd'), out);
console.log(`✓ graph — ${mods.length} modules · ${edges.size} edges → docs/graph.mmd`);
