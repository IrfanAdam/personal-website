/* ADAM/DS — ds/changelog/render-section.js · section assembly ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-8] */
// Exports: renderSection(raw, opts)
import { esc, fmtInline, cleanHead } from './fmt-text.js';
import { stripGateThread, stripInlineAnchors, DROP_LINE } from './sec-raw.js';
import { scanLines } from './sec-scan.js';
import { headStatus } from './sec-status.js';
import { finalizeSection } from './sec-final.js';
// — Section assembly —
// [plan:2026-11-02_192021-changelog-parity.md#phase-8]
export const renderSection = (raw, opts) => {
  const { suffix = '', frac = '' } = opts || {};
  const src = stripInlineAnchors(esc(stripGateThread(raw).replace(/<!--[\s\S]*?-->/g, '')));
  const lines = src.split('\n');
  let hi = -1;
  let htag = '';
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (DROP_LINE(ln)) continue;
    if (/^#{1,4}\s+/.test(ln)) {
      hi = i;
      htag = 'h3';
      if (ln.startsWith('## ')) htag = 'h2';
      else if (ln.startsWith('### ')) htag = 'h3-task';
      break;
    }
    break;
  }
  let head = '';
  let start = 0;
  let htextRaw = '';
  let seed = null;
  const makeHead = (htext) => {
    const hclean = cleanHead(htext).replace(/\s*([✓✗])\s*(done|cancelled)(\s*\([^)]*\))?\s*$/i, '').trim();
    return `<${htag}>${fmtInline(hclean)}</${htag}>` + headStatus(htext, suffix, frac);
  };
  if (hi >= 0) {
    htextRaw = lines[hi].replace(/^#{1,4}\s+/, '');
    if (htag === 'h2' || htag === 'h3') head = makeHead(htextRaw);
    else seed = { title: htextRaw, done: /✓/i.test(htextRaw), cancelled: /✗/.test(htextRaw) };
    start = hi + 1;
  }
  const { tasks, blocks } = scanLines(lines, start, seed);
  return finalizeSection({ head, htextRaw, htag, tasks, blocks, suffix, frac });
};
