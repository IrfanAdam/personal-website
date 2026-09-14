/* ADAM/TOOL — graph-schema · layers/routes/styles/tokens → schema
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-2] */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname, basename } from 'node:path';
// Exports: modId, layerFor, routeLinks, buildSchema
export const modId = (root, abs) => {
  const src = join(root, 'src');
  const rel = abs.startsWith(`${src}/`) ? relative(src, abs) : relative(root, abs);
  return rel.replace(/\.(m)?js$/, '').replace(/\.css$/, '').replace(/[^A-Za-z0-9]/g, '_');
};
const base = (p) => basename(p).replace(/\.(m)?js$/, '').replace(/\.css$/, '');
export function layerFor(rootRel) {
  if (rootRel.endsWith('.css')) return 'style';
  if (/^src\/ds\/functions\//.test(rootRel) || rootRel === 'src/ds/pages-functions.js') return 'function';
  if (/^src\/ds\/foundations\//.test(rootRel) || rootRel === 'src/ds/pages-foundations.js') return 'foundation';
  if (/^src\/views\//.test(rootRel) || /^src\/(main|theme|boot-chrome)\.js$/.test(rootRel)) return 'view';
  if (/^scripts\//.test(rootRel)) return 'tool';
  return 'component';
}
export function routeLinks(root) {
  const src = readFileSync(join(root, 'src/ds/routes.js'), 'utf8');
  const imps = [...src.matchAll(/^import .* from '\.\/([^']+)'/gm)].map((m) => m[1]);
  const hashes = [...src.matchAll(/hash:\s*'([^']+)'/g)].map((m) => m[1]);
  const labels = [...src.matchAll(/label:\s*'([^']+)'/g)].map((m) => m[1]);
  const out = new Map();
  const n = Math.min(imps.length, hashes.length, labels.length);
  for (let i = 0; i < n; i += 1) {
    const abs = resolve(join(root, 'src/ds'), imps[i]);
    out.set(relative(root, abs), { route: hashes[i], title: labels[i] });
  }
  return out;
}
const walkExt = (d, exts) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walkExt(p, exts);
  return exts.some((e) => p.endsWith(e)) ? [p] : [];
});
const pretty = (b) => b.replace(/[-_]/g, ' ');
export function buildSchema(root, jsMods, importEdges) {
  const links = routeLinks(root);
  const cssFiles = walkExt(join(root, 'src'), ['.css']);
  const toolFiles = walkExt(join(root, 'scripts'), ['.mjs', '.js']);
  const cssByBase = new Map(cssFiles.map((f) => [base(f), f]));
  const files = [...jsMods, ...cssFiles, ...toolFiles];
  const nodes = files.map((f) => {
    const rel = relative(root, f);
    const link = links.get(rel);
    return { id: modId(root, f), path: rel, layer: layerFor(rel), route: link ? link.route : null,
      title: link ? link.title : pretty(base(f)) };
  });
  const edges = [...new Map(importEdges.map(([f, t]) => [`${f}>${t}>imports`,
    { from: f, to: t, kind: 'imports' }])).values()];
  const TOKENS = modId(root, join(root, 'src/styles/tokens.css'));
  const seen = new Set(edges.map((e) => `${e.from}>${e.to}>${e.kind}`));
  const add = (from, to, kind) => {
    const k = `${from}>${to}>${kind}`;
    if (from !== to && !seen.has(k)) { seen.add(k); edges.push({ from, to, kind }); }
  };
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const rel = relative(root, f);
    const from = modId(root, f);
    if (/var\(--[a-z0-9-]+/.test(text)) add(from, TOKENS, 'tokens');
    if (f.endsWith('.js') && cssByBase.has(base(f))) add(from, modId(root, cssByBase.get(base(f))), 'styles');
  }
  edges.sort((a, b) => (`${a.from}${a.to}${a.kind}` < `${b.from}${b.to}${b.kind}` ? -1 : 1));
  nodes.sort((a, b) => (a.id < b.id ? -1 : 1));
  return { generated: new Date().toISOString(), nodes, edges };
}
