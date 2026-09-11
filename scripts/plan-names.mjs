/* SOP gate: every phased plan needs an LLM-curated entry in changelog-names.json.
   Usage: npm run plan:names — exits 1 listing phased plans without {title, purpose}. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, '.hermes/plans');
const names = JSON.parse(readFileSync(join(root, 'src/ds/changelog-names.json'), 'utf8'));
const missing = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const md = readFileSync(join(dir, f), 'utf8');
  if (!/^## Phase /m.test(md)) continue;
  const n = names[f];
  if (!n || !n.title || !n.purpose) missing.push(f);
}
if (missing.length) { console.error(`✗ ${missing.length} phased plan(s) lack names entries:\n- ${missing.join('\n- ')}\nAdd {title ≤76ch, purpose} to src/ds/changelog-names.json first.`); process.exit(1); }
console.log(`✓ plan:names — ${Object.keys(names).length} curated names cover all phased plans.`);
