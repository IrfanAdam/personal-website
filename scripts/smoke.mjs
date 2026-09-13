/* ADAM/TOOL — smoke · route 200 + markers on 5199 (never 5173) · [plan:2026-09-13_193000-refactor-manageability.md#phase-0] */
import { spawn } from 'node:child_process';
const PORT = 5199;
const HOST = '127.0.0.1';
const URLS = [
  [`http://${HOST}:${PORT}/`, /Irfan Adam|Portfolio/i],
  [`http://${HOST}:${PORT}/ds/`, /ADAM\/DS|Design System/i],
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fetchOk = async (url, re) => {
  const res = await fetch(url);
  if (res.status !== 200) throw new Error(`${url} status ${res.status}`);
  const txt = await res.text();
  if (!re.test(txt)) throw new Error(`${url} missing marker ${re}`);
};
const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', HOST, '--strictPort'], { stdio: 'pipe' });
let done = false;
const kill = () => { if (!done) { done = true; try { preview.kill('SIGTERM'); } catch {} } };
process.on('exit', kill); process.on('SIGINT', () => { kill(); process.exit(1); });
let ready = false;
preview.stdout.on('data', (d) => { if (String(d).includes(String(PORT))) ready = true; });
preview.stderr.on('data', (d) => { if (String(d).includes(String(PORT))) ready = true; });
for (let i = 0; i < 30 && !ready; i++) {
  await wait(300);
  try { await fetch(`http://${HOST}:${PORT}/`); ready = true; } catch {}
}
if (!ready) { kill(); console.error('✗ smoke — preview not ready on ' + PORT); process.exit(1); }
try {
  for (const [u, re] of URLS) await fetchOk(u, re);
  console.log('✓ smoke — / + /ds/ 200 with markers');
  kill(); process.exit(0);
} catch (e) {
  console.error('✗ smoke —', e.message);
  kill(); process.exit(1);
}
