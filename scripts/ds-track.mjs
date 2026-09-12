/* DS change tracker — bidirectional plan ↔ execution links.
   Commits touching DS paths cite `[plan:<file>#<anchor>]`; this writes
   src/ds/changelog-manifest.json (auto on `npm run build`), rendered by
   pages-changelog.js. Never fails (keeps old manifest if git missing).
   Continuation: 20260909_145218_9888b1 — all future scopes branch from here. */
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
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
const read = (f) => { try { return readFileSync(join(root, '.hermes/plans', f), 'utf8'); } catch { return ''; } };
const phased = plans.filter((f) => /^## Phase /m.test(read(f)));
const tagged = phased.filter((f) => /^\*{1,2}Tags:/m.test(read(f).split(/^## /m)[0])).length;
const retro = (() => { try { return JSON.parse(readFileSync(join(root, '.hermes/plan-links.json'), 'utf8')).links || {}; } catch { return {}; } })();
const log = sh(`git log --format='%H|%h|%ad|%cI|%s' --date=short -- ${DS.join(' ')}`);
if (!log || !log.trim()) {
  if (!existsSync(out)) writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits: [], wip: [] }, null, 1) + '\n');
  console.log('… ds-track: no DS log or git unavailable, manifest untouched');
  process.exit(0);
}
const commits = log.trim().split('\n').filter(Boolean).map((l) => {
  const [full, sha, date, iso, ...rest] = l.split('|');
  const subject = rest.join('|');
  const m = subject.match(TAG);
  return { sha, full, date, time: (iso.match(/T(\d{2}:\d{2})/) || [])[1] || '', subject: subject.replace(TAG, '').trim(), plan: m ? m[1] : null, anchor: m ? (m[2] || null) : null };
});
commits.forEach((c) => { const r = retro[c.sha]; if (r) { c.plan = r.plan; c.anchor = r.anchor ?? null; } });
const st = sh(`git status --short -- ${DS.join(' ')}`) || '';
const wip = st.trim() ? st.trim().split('\n').map((l) => l.trim()).filter(Boolean).filter((l) => !l.endsWith('src/ds/changelog-manifest.json')) : []; // manifest always rewrites itself at generation; listing it as wip is noise
/* Vercel builds from a shallow clone (--depth=10), so git log there only sees
   the latest commits. Never let a truncated history overwrite the full one:
   merge fresh commits over the last committed manifest (dedupe by sha). */
let prev = [];
try { prev = JSON.parse(readFileSync(out, 'utf8')).commits || []; } catch { prev = []; }
const seen = new Set(commits.map((c) => c.sha));
prev.forEach((c) => { if (!seen.has(c.sha)) { commits.push(c); seen.add(c.sha); } });
const shallow = (sh(`git rev-parse --is-shallow-repository`) || '').trim() === 'true';
if (shallow) console.log(`… ds-track: shallow clone detected, merged ${commits.length} commits (kept full history)`);
writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits, wip }, null, 1) + '\n');
console.log(`✓ ds-track — ${plans.length} plans (${tagged}/${phased.length} tagged) · ${commits.length} DS commits (${commits.filter((c) => c.plan).length} linked) · ${wip.length} wip · cont ${CONTINUATION}`);
