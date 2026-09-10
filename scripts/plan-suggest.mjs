/* Smart-plan suggester — large prompts get a phased, tagged skeleton; small ones pass through.
   Usage: npm run plan:suggest -- "Redesign the viewer, add keyboard nav, document tokens" [--write <file>]
   Large = ≥40 words, ≥2 task verbs, or ≥2 tag areas. Skeleton follows the plan-doc
   format (italic summary, task table, Objective/Files/Verify blocks, {#phase-N}). */
import { infer } from '../src/ds/changelog-tags.js';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const wi = args.indexOf('--write');
const out = wi >= 0 ? args[wi + 1] : null;
const prompt = args.filter((a, i) => a !== '--write' && (wi < 0 || i !== wi + 1)).join(' ').trim();
if (!prompt) { console.error('usage: npm run plan:suggest -- "<prompt>" [--write <file>]'); process.exit(1); }
const words = prompt.split(/\s+/).filter(Boolean);
const verbs = new Set((prompt.match(/\b(add|build|create|implement|fix|update|refactor|migrate|redesign|audit|polish|wire|ship|document|split|unify)\b/gi) || []).map((v) => v.toLowerCase()));
const areas = infer(prompt);
if (words.length < 40 && verbs.size < 2 && areas.length < 3 && !(words.length >= 15 && verbs.size >= 1 && areas.length >= 2)) { console.log('○ small enough — implement directly, no plan file needed.'); process.exit(0); }
const VERB = '(?:add|build|create|implement|fix|update|refactor|migrate|redesign|audit|polish|wire|ship|document|split|unify)';
let bits = prompt.split(/\r?\n|;/).map((s) => s.trim()).filter(Boolean);
bits = bits.flatMap((s) => s.split(new RegExp(`(?:,?\\s+and\\s+|,\\s*)(?=${VERB}\\b)`, 'i'))).map((s) => s.trim()).filter(Boolean);
if (bits.length < 2) bits = (prompt.match(/[^.!?]+[.!?]/g) || [prompt]).map((s) => s.trim());
bits = bits.filter((s) => s.split(/\s+/).length >= 3).slice(0, 9);
if (!bits.length) bits = [prompt];
const groups = [];
bits.forEach((b) => {
  const tag = infer(b)[0]; const last = groups[groups.length - 1];
  if (last && last.tag === tag && last.bits.length < 3) last.bits.push(b); else groups.push({ tag, bits: [b] });
});
const union = [...new Set(groups.map((g) => g.tag))];
let t = 0;
const phases = groups.slice(0, 5).map((g, i) => {
  const from = t + 1;
  const rows = g.bits.map((b) => `| ${++t} | ${b.slice(0, 72)} | done-state verifiable |`).join('\n');
  const tasks = g.bits.map((b, j) => `### Task ${from + j}: ${b.slice(0, 72)}\n**Objective:** ${b}\n**Files:** TBD.\n**Verify:** \`npm test\` PASS.`).join('\n\n');
  return `## Phase ${i + 1} — ${g.bits[0].slice(0, 52)} {#phase-${i + 1}}\n\n*Tags: ${g.tag}*\n\n*${g.bits[0].slice(0, 90)}*\n\n| # | Task | Done when |\n|---|------|-----------|\n${rows}\n\n${tasks}`;
});
const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, (c) => (c === 'T' ? '_' : ''));
const STOP = new Set(['the', 'a', 'an', 'to', 'in', 'of', 'and', 'with', 'new', 'our', 'for', 'on', 'add']);
const slug = (words.filter((w) => !STOP.has(w.toLowerCase())).slice(0, 3).join('-') || areas[0] || 'scope').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'scope';
const md = `# <Scope> — <one-line outcome>\n\n**Goal:** ${prompt.slice(0, 220)}\n\n**Architecture:** TBD.\n\n**Tech Stack:** Vanilla JS modules, \`npm test\` gate per phase. Commits cite \`[plan:<file>#phase-N]\`.\n\n**Tags:** ${union.join(', ')}\n\n---\n\n${phases.join('\n\n')}\n`;
if (out) { writeFileSync(out, md); console.log(`✓ skeleton → ${out} · ${groups.length} phases · tags ${union.join(', ')}`); }
else { console.log(`— suggested file: .hermes/plans/${stamp}-<slug>.md (≈${slug}) · ${groups.length} phases · tags ${union.join(', ')}\n`); console.log(md); }
