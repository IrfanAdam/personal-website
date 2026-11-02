/* ADAM/TOOL — scripts/ds-track.mjs · tracker + plan-history + version stamp */
/* [plan:2026-11-02_192021-changelog-parity.md#phase-1] · rewrites manifest/history/stamp; never fails. */
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { split, state } from '../src/ds/changelog-parse.js';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/ds/changelog-manifest.json');
const histPath = join(root, 'src/ds/plan-history.json');
const verPath = join(root, 'public/version.json');
const DS = ['src/ds', 'src/styles/tokens.css', 'src/styles/tokens-dark.css', 'src/styles/tokens-fx.css', 'DESIGN.md', 'design.md'];
const TAG = /\[plan:([^\]#\s]+)(?:#([^\]]+))?\]/;
const CONTINUATION = '20260909_145218_9888b1';
const sh = (cmd) => { try { return execSync(cmd, { cwd: root, encoding: 'utf8' }); } catch { return null; } };
const hash = (s) => {
  let h = 2166136261;
  const t = String(s).replace(/\s+/g, ' ').trim();
  for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0');
};
const parseHead = (head) => {
  const [full, sha, date, iso, ...rest] = head.split('|');
  const subject = rest.join('|');
  const m = subject.match(TAG);
  const time = (String(iso).match(/T(\d{2}:\d{2})/) || [])[1] || '';
  const plan = m ? m[1] : null;
  const anchor = m ? m[2] || null : null;
  return { sha, full, date, time, subject: m ? subject.replace(TAG, '').trim() : subject.trim(), plan, anchor };
};
const plans = readdirSync(join(root, '.hermes/plans')).filter((f) => f.endsWith('.md')).sort();
const read = (f) => { try { return readFileSync(join(root, '.hermes/plans', f), 'utf8'); } catch { return ''; } };
const phased = plans.filter((f) => /^## Phase /m.test(read(f)));
const tagged = phased.filter((f) => /^\*{1,2}Tags:/m.test(read(f).split(/^## /m)[0])).length;
const retro = (() => { try { return JSON.parse(readFileSync(join(root, '.hermes/plan-links.json'), 'utf8')).links || {}; } catch { return {}; } })();
const log = sh(`git log --format='@@%H|%h|%ad|%cI|%s' --name-only --date=short -- ${DS.join(' ')}`);
if (!log || !log.trim()) {
  if (!existsSync(out)) writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits: [], wip: [] }, null, 1) + '\n');
  console.log('… ds-track: no DS log or git unavailable, manifest untouched');
  process.exit(0);
}
const GENERATED = ['src/ds/changelog-manifest.json', 'src/ds/plan-history.json', 'src/ds/arch-schema.json'];
const commits = log.split(/^@@/m).filter(Boolean).map((block) => {
  const [head, ...files] = block.split('\n');
  const c = parseHead(head);
  c.files = files.map((f) => f.trim()).filter(Boolean);
  return c;
}).filter((c) => c.files.some((f) => !GENERATED.includes(f))).map(({ files, ...c }) => c);
const st = sh(`git status --short -- ${DS.join(' ')}`) || '';
const wip = st.trim().split('\n').map((l) => l.trim()).filter(Boolean)
  .filter((l) => !GENERATED.some((g) => l.endsWith(g)));
const prevDoc = (() => { try { return JSON.parse(readFileSync(out, 'utf8')); } catch { return null; } })();
const prev = (prevDoc && prevDoc.commits) || [];
const seen = new Set(commits.map((c) => c.sha));
prev.forEach((c) => { if (!seen.has(c.sha)) { commits.push(c); seen.add(c.sha); } });
commits.forEach((c) => { const r = retro[c.sha]; if (r) { c.plan = r.plan; c.anchor = r.anchor ?? null; } });
Object.keys(retro).forEach((short) => {
  if (commits.some((c) => c.sha === short)) return;
  const raw = (sh(`git show -s --format='%H|%h|%ad|%cI|%s' --date=short ${short}`) || '').trim().split('\n')[0];
  if (!raw) return;
  const c = parseHead(raw);
  const r = retro[c.sha] || retro[short];
  if (!r) return;
  c.plan = r.plan;
  c.anchor = r.anchor ?? null;
  commits.push(c);
});
commits.sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
const doc = { generated: new Date().toISOString(), continuation: CONTINUATION, plans, commits, wip };
const strip = (o) => JSON.stringify({ ...o, generated: null });
if (prevDoc && strip(prevDoc) === strip(doc)) doc.generated = prevDoc.generated;
writeFileSync(out, JSON.stringify(doc, null, 1) + '\n');
/* History: per-plan snapshots {sha, date, hash, sections[]} — append on unseen hash, move-to-end on seen. */
const prevHist = (() => { try { return JSON.parse(readFileSync(histPath, 'utf8')); } catch { return {}; } })();
const hist = { ...prevHist };
for (const f of plans) {
  const md = read(f);
  if (!md) continue;
  hist[f] ||= [];
  const h = hash(md);
  const sections = split(md).map((s) => ({ head: s.head.slice(0, 80), hash: hash(s.head + '\n' + s.body),
    state: state(s.body) }));
  const ix = hist[f].findIndex((e) => e.hash === h);
  if (ix === -1) {
    const line = (sh(`git log -1 --format='%H|%ad' --date=short -- ".hermes/plans/${f}"`) || '').trim();
    const parts = line ? line.split('|') : [null, new Date().toISOString().slice(0, 10)];
    hist[f].push({ sha: parts[0], date: parts[1], hash: h, sections });
  } else if (ix !== hist[f].length - 1) {
    hist[f].push(...hist[f].splice(ix, 1));
  }
}
if (JSON.stringify(hist) !== JSON.stringify(prevHist)) writeFileSync(histPath, JSON.stringify(hist, null, 1) + '\n');
/* Stamp: public/version.json carries "<head>:<count>" — skip the write when unchanged. */
const headSha = (sh('git rev-parse HEAD') || '').trim();
const count = (sh('git rev-list --count HEAD') || '').trim();
const verNext = JSON.stringify({ sha: headSha && count ? `${headSha}:${count}` : headSha || null }) + '\n';
const verPrev = (() => { try { return readFileSync(verPath, 'utf8'); } catch { return null; } })();
if (verPrev !== verNext) writeFileSync(verPath, verNext);
console.log(`✓ ds-track — ${plans.length} plans (${tagged}/${phased.length} tagged) · ${commits.length} DS commits (${commits.filter((c) => c.plan).length} linked) · ${wip.length} wip · cont ${CONTINUATION}`);
