/* ADAM/TOOL — check-arch-map · curated public map must trace to arch-schema
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-7] */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Exports: none (CLI gate)
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const map = read('src/data/arch-map.json');
const schema = read('src/ds/arch-schema.json');
const known = new Set(schema.nodes.map((n) => n.id));
const groups = new Set(map.groups.map((g) => g.id));
const fail = [];
map.nodes.forEach((n) => {
  if (!known.has(n.id)) fail.push(`node "${n.id}" (${n.file}) is not in arch-schema.json — renamed or deleted?`);
  if (!groups.has(n.group)) fail.push(`node "${n.id}" sits in group "${n.group}" which is not declared`);
});
map.edges.forEach((e) => {
  if (!known.has(e.from)) fail.push(`edge ${e.from} → ${e.to} starts at a module arch-schema.json does not know`);
  if (!known.has(e.to)) fail.push(`edge ${e.from} → ${e.to} ends at a module arch-schema.json does not know`);
});
if (map.nodes.length > 50) fail.push(`${map.nodes.length} curated nodes — the public map budget is 50`);
if (fail.length) {
  console.error(`✗ arch-map drift — ${fail.length}:\n  ${fail.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ arch-map — ${map.nodes.length} nodes · ${map.edges.length} edges · ${map.groups.length} groups, every id traces to arch-schema.json`);
