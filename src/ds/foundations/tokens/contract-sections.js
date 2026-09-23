/* ADAM/DS — contract sections · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: tierHtml, versionHtml, a11yHtml, auditHtml
import { note, code } from '../../specimens.js';
export const tierHtml = () => [
  `<div class="ds-sec"><h2>Component tier — scoped overrides</h2>`,
  `<p class="sub">Third tier after primitives → semantic: `,
  `<span class="tok">--&lt;component&gt;-*</span> owns one `,
  `component's geometry + frost + travel so shared semantics never sprawl for one-off needs.</p>`,
].join('') + code([
  'worked example — viewer owns its frame, no semantic added:\n',
  '--viewer-border: 2px solid frost line · the frame it opens in\n',
  '--shadow-viewer: lifted off the page behind the frame\n',
  '--dur-viewer-in 300ms · open travel · --dur-viewer-line 780ms · tether draw',
].join('')) + note('Do', [
  'New one-component need → new ',
  '<span class="tok">--&lt;component&gt;-*</span> token. ',
  'Forbid new semantic sprawl where a component token fits.',
].join('')) + note('Don’t', [
  'No component token consumed by two components — shared need graduates to semantic, ',
  'never duplicates per component.',
].join(''), 'dont');
export const versionHtml = () => [
  `</div><div class="ds-sec"><h2>Versioning + deprecation</h2>`,
  `<p class="sub">Renames flow alias → sunset, never flag-day. Announced in the changelog.</p>`,
].join('') + code([
  'rename: add new token + keep old as alias → mark deprecated in-pane → ',
  'remove after one release\n',
  'bump: patch = value tweak · minor = additive token · ',
  'major = removal / rename sunset\n',
  'announce: every change lands in /ds/#/changelog with its plan link',
].join(''));
export const a11yHtml = () => [
  `</div><div class="ds-sec"><h2>A11y contract — release gate</h2>`,
  `<p class="sub">Gate: <span class="tok">npm run test</span> green + theme-toggle `,
  `walkthrough + keyboard walkthrough. Nothing ships with an open item and no owner.</p>`,
  `<table class="ds-table"><tr><th>Check</th><th>State</th><th>Proof</th></tr>`,
].join('') + [
  `<tr><td>Contrast AA per pair × both themes</td><td>PASS</td><td>Color matrix (Phase 1)</td></tr>`,
  `<tr><td>Visible focus ring, both themes</td><td>PASS</td><td>State group + Shape ring (Tasks 4/19)</td></tr>`,
  `<tr><td>Reduced motion honored</td><td>PASS</td><td>Motion contract (Phase 5) + site guards</td></tr>`,
  `<tr><td>44px targets</td><td>PASS</td><td>Touch audit (Task 16)</td></tr>`,
  `<tr><td>Theme parity light / dark</td><td>PASS</td><td>probeTheme matrices, toggle walkthrough</td></tr>`,
  `<tr><td>Keyboard walkthrough</td><td>GATE</td>`,
  `<td>Run on release: tab every demo control + ring visible</td></tr>`,
].join('') + [
  `<tr><td>Feedback roles (success / error / warning / info)</td><td>PASS</td>`,
  `<td>Feedback group + live probe table (Task 7)</td></tr>`,
].join('') + `</table>`;
export const auditHtml = () => [
  `</div><div class="ds-sec"><h2>Audit state</h2>`,
  `<p class="sub">Live site today — fully adherent, enforced on every release.</p>`,
].join('') + code([
  'PASS zero raw colors outside tokens.css — site + docs paint via var() only\n',
  'PASS border-radius: 100% var(--radius-*) across stylesheets\n',
  'PASS font-family: 100% var(--font-sans) / var(--font-mono) — no literal stacks\n',
  'PASS every stylesheet under 100 lines · npm run lint:tokens gates src/styles + src/ds\n',
  'PASS breakpoints tokenized --break-sm 640 / --break-md 800 / --break-lg 900 — ',
  '@media rows carry /* --break-* */',
].join('')) + `</div>`;
