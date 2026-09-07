/* ADAM/DS token gate — fails on raw values outside tokens.css.
   Rules: no #hex/rgb()/hsl() paint, no literal border-radius, no literal
   font-family, no raw px (breakpoints + OS safe-area excepted), and every
   stylesheet ≤ 100 lines (AGENTS.md §1/§2). Covers src/styles + src/ds. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const styleDirs = [join(root, 'src/styles'), join(root, 'src/ds')];
const MAX_LINES = 100;
const EXEMPT = new Set(['tokens.css']);

const fail = [];
const cssFiles = [];
for (const dir of styleDirs) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
    if (EXEMPT.has(f)) continue;
    cssFiles.push(join(dir, f));
  }
}
for (const path of cssFiles) {
  const name = path.split('/').slice(-2).join('/');
  const src = readFileSync(path, 'utf8');
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    const at = `${name}:${i + 1}`;
    if (/#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?)\(/.test(ln)) fail.push(`${at} raw color — ${ln.trim()}`);
    if (/border-radius\s*:\s*(?!var\()\S/.test(ln)) fail.push(`${at} literal radius — ${ln.trim()}`);
    if (/font-family\s*:\s*(?!var\()\S/.test(ln)) fail.push(`${at} literal font-family — ${ln.trim()}`);
    const px = ln.match(/[0-9]+px/g);
    if (px && !/@media|@supports|env\(|safe-area/.test(ln)) fail.push(`${at} raw px — ${ln.trim()}`);
  });
  const n = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  if (n > MAX_LINES) fail.push(`${name} ${n} lines (limit ${MAX_LINES})`);
}
/* JS paint check — no hard-coded paint inside style=/background: consumption.
   Prose, routes (#/), and token-name strings are not paint. */
const jsDirs = [join(root, 'src'), join(root, 'src/ds')];
const jsFiles = [];
for (const dir of jsDirs) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.js'))) jsFiles.push(join(dir, f));
}
for (const path of jsFiles) {
  const name = path.split('/').slice(-2).join('/');
  readFileSync(path, 'utf8').split('\n').forEach((ln, i) => {
    if (/style="[^"]*(#[0-9a-fA-F]{3,8}\b|rgba?\()/.test(ln)) fail.push(`${name}:${i + 1} JS inline-style paint — ${ln.trim()}`);
    if (/background:\s*(#[0-9a-fA-F]|rgba?\()/.test(ln) && !/background:\s*var\(/.test(ln)) fail.push(`${name}:${i + 1} JS paint literal — ${ln.trim()}`);
  });
}
if (fail.length) {
  console.error(`✗ token lint — ${fail.length} violation(s):\n  ${fail.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ token lint — ${cssFiles.length} stylesheets + ${jsFiles.length} JS modules clean (var() only, ≤${MAX_LINES} lines each)`);
