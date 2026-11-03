/* ADAM/DS — ds/changelog/task-shape.js · task field shapes ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-6] */
// Exports: fieldRank, isObjective, taskTitleOf, taskTick, splitItemContent
// — Field order —
const FIELD_RANK = [
  [/^files?$/i, 1],
  [/^(changes?|contract|rules?|scope|approach)\b/i, 2],
  [/^(steps?|drill|procedure)\b/i, 3],
  [/^verif/i, 4],
];
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const fieldRank = (label) => {
  for (const [re, r] of FIELD_RANK) {
    if (re.test(String(label || '').trim())) {
      return r;
    }
  }
  return 5;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const isObjective = (label) => /^objective$/i.test(String(label || '').trim());
// — Title parsing (private cleanHead; frozen graph allows no imports) —
const cleanHead = (t) => String(t || '')
  .replace(/\{#[^}]*\}/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');
const SHA_RE = '[0-9a-f]{7,40}';
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const taskTitleOf = (title) => {
  const s = cleanHead(title).replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '')
    .replace(/[✓✗]/g, '')
    .trim()
    .replace(/\.+$/, '.');
  let m = s.match(/^Task\s+([\d-]+)\s+shipped\s+([0-9a-f]{7,40})\s*·\s*(.+)$/i);
  if (m) {
    return { num: m[1], name: m[3].trim(), shipped: m[2] };
  }
  m = s.match(/^Task\s+([\d-]+):\s*(.+)$/);
  if (m) {
    let name = m[2].trim();
    let shipped = '';
    let note = '';
    const sm = name.match(new RegExp(`\`?(${SHA_RE})\`?\\s*$`));
    if (sm) {
      shipped = sm[1];
      name = name.slice(0, sm.index).trim().replace(/\.+$/, '.');
    }
    const pm = name.match(/\(([^()]*)\)\s*$/);
    if (pm) {
      const inner = pm[1].trim().replace(/^`|`$/g, '');
      if (new RegExp(`^${SHA_RE}$`, 'i').test(inner)) {
        shipped = shipped || inner;
      } else {
        note = pm[1].trim();
      }
      name = name.slice(0, pm.index).trim().replace(/\.+$/, '.');
    }
    return { num: m[1], name, shipped, note };
  }
  m = s.match(/^Task\s+([\d-]+)\s+([0-9a-f]{7,40})\s*$/);
  if (m) {
    return { num: m[1], name: '', shipped: m[2] };
  }
  return { num: '', name: s, shipped: '' };
};
// — Status tick —
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const taskTick = (task) => {
  if (task.done) {
    return '☑';
  }
  if (task.cancelled) {
    return '☒';
  }
  return '☐';
};
// — Fallback item split —
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const splitItemContent = (content) => {
  const segs = String(content || '').split(/\*\*([^*]{1,80}?):\*\*/);
  const lead = (segs[0] || '').trim();
  const fields = [];
  for (let i = 1; i + 1 < segs.length; i += 2) {
    const label = (segs[i] || '').trim();
    const val = (segs[i + 1] || '').trim();
    if (!label && !val) {
      continue;
    }
    fields.push({ label, inline: val ? [val] : [], parts: [] });
  }
  return { lead, fields };
};
