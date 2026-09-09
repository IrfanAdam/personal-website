/* DS change tracker — bidirectional plan ↔ execution links.
   Commits touching DS paths cite `[plan:<file>#<anchor>]`; this writes
   src/ds/changelog-manifest.json (auto on `npm run build`), rendered by
   pages-changelog.js. Never fails (keeps old manifest if git missing).
   Continuation: 20260909_145218_9888b1 — all future scopes branch from here. */
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/ds/changelog-manifest.json');
const DS = ['src/ds', 'src/styles/tokens.css', 'DESIGN.md', 'design.md'];
const TAG = /\[plan:([^\]#\s]+)(?:#([^\]]+))?\]/;
const CONTINUATION = '20260909_145218_9888b1';
const sh = (cmd) => { try { return execSync(cmd, { cwd: root, encoding: 'utf8' }); } catch { return null; } };

const plans = readdirSync(join(root, '.hermes/plans')).filter((f) => f.endsWith('.md')).sort();
const log = sh(`git log --format='%H|%h|%ad|%s' --date=short -- ${DS.join(' ')}`);
if (!log || !log.trim()) {
  if (!existsSync(out)) writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits: [], wip: [] }, null, 1) + '\n');
  console.log('… ds-track: no DS log or git unavailable, manifest untouched');
  process.exit(0);
}
const commits = log.trim().split('\n').filter(Boolean).map((l) => {
  const [full, sha, date, ...rest] = l.split('|');
  const subject = rest.join('|');
  const m = subject.match(TAG);
  return { sha, full, date, subject: subject.replace(TAG, '').trim(), plan: m ? m[1] : null, anchor: m ? (m[2] || null) : null };
});
const st = sh(`git status --short -- ${DS.join(' ')}`) || '';
const wip = st.trim() ? st.trim().split('\n').map((l) => l.trim()).filter(Boolean) : [];
writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits, wip }, null, 1) + '\n');
console.log(`✓ ds-track — ${plans.length} plans · ${commits.length} DS commits (${commits.filter((c) => c.plan).length} linked) · ${wip.length} wip · cont ${CONTINUATION}`);
