/* ADAM/DS — changelog-parse · parse helpers · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: MONTHS, chunks, goal, norm, split, state, isDone, iterState, parseMeta, fmtDate, fmtTime, pDay, isoDay
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const chunks = (md) => md.split(/^## /m);

export const goal = (md) => (md.match(/\*\*Goal:\*\*\s*([\s\S]+?)(?:\n\s*\n|$)/) || [])[1]?.trim() || '';

export const norm = (body) => {
  if (/^- \[[ xX]\]/m.test(body)) return body;
  const parts = body.split(/^### /m);
  const head = parts.shift();
  const items = parts.map((p) => {
    const lines = p.split('\n');
    const title = lines.shift().trim();
    const m = title.match(/^Task\s+([\d-]+):\s*(.+)$/);
    const num = m ? m[1] : '';
    let name = m ? m[2] : title;
    const cancelled = /✗/i.test(title);
    const done = /✓/i.test(title);
    name = name.replace(/✓\s*done\s*—?/i,
      '').replace(/✗\s*cancelled\s*—?/i,
      '').replace(/[✓✗]/g,
      '').trim().replace(/\.*$/,
      '.');
    const detail = lines.join(' ').replace(/\s+/g, ' ').trim();
    const flag = cancelled ? '<span class="ds-cancelled">✗ cancelled</span> — ' : (done ? '✓ done — ' : '');
    return `- [${done || cancelled ? 'x' : ' '}] **${num} ${name}** ${flag}${detail}`;
  });
  return head + items.join('\n');
};

export const split = (md) => chunks(md).slice(1).map((s) => {
  const nl = s.indexOf('\n');
  return { head: s.slice(0, nl).trim(), body: norm('## ' + s) };
}).filter((s) => /^Phase /.test(s.head));

export const state = (body) => {
  const d = (body.match(/- \[x\]/gi) || []).length;
  const t = (body.match(/- \[ \]/g) || []).length;
  return d + t ? `${d}/${d + t}` : '';
};

export const isDone = (frac) => {
  const m = String(frac || '').match(/(\d+)\/(\d+)/);
  return !!m && Number(m[2]) > 0 && Number(m[1]) === Number(m[2]);
};

export const iterState = (ss) => {
  let d = 0, t = 0;
  ss.forEach((s) => {
    const m = state(s.body).match(/(\d+)\/(\d+)/);
    if (m) { d += Number(m[1]); t += Number(m[2]); }
  });
  return t ? `${d}/${t}` : '';
};

export const parseMeta = (file) => {
  let m = file.match(/^(\d{4}-\d{2}-\d{2})[_-](\d{5,6})[_-](.+)\.md$/);
  if (m) return { date: m[1], id: m[2], slug: m[3] };
  m = file.match(/^(\d{4}-\d{2}-\d{2})[_-](.+)\.md$/);
  if (m) return { date: m[1], id: '', slug: m[2] };
  return { date: '', id: '', slug: file.replace(/\.md$/, '') };
};

export const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, mo, d] = iso.split('-').map(Number);
  if (!y || !mo || !d) return iso;
  return `${String(d).padStart(2,'0')} ${MONTHS[mo - 1]} ${y}`;
};

export const fmtTime = (id) => (/^\d{6}$/.test(id) ? `${id.slice(0,2)}:${id.slice(2,4)}` : id);

export const pDay = (s) => {
  const [y, mo, d] = s.split('-').map(Number);
  return new Date(y, mo - 1, d);
};

export const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
