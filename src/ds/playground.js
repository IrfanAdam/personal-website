/* ADAM/DS — ds/playground · shell · [plan:2026-09-24_170000-code-syntax-highlight.md#phase-2] */
// Exports: playground, mountPlayground — playground shell + tabs
// — Helpers · Playground —

import { tabs } from './tabs.js';
import { knobsHTML as knobControls } from './playground/knobs.js';
import { highlight } from './code-highlight.js';

export { mountPlayground } from './playground/mount.js';

// — Helpers —
const reg = (window.__pgReg = window.__pgReg || {});

// — Playground —
export function playground({ title, sub, knobs = [], render, code, tokens = [] }) {
  const id = 'pg-' + Math.random().toString(36).slice(2, 6);
  reg[id] = { knobs, render, code };
  const knobsHTML = knobControls(knobs, id);
  const init = Object.fromEntries(knobs.map((k) => [k.key, k.default]));
  const previewHTML = [
    '<div class="ds-spec block"><div data-pg-preview="',
    id,
    '">',
    render(init),
    '</div></div>',
  ].join('');
  const codeHTML = [
    '<div class="ds-code" data-lang="html" data-pg-code="',
    id,
    '"><pre><code class="hl">',
    highlight(code(init)),
    '</code></pre></div><div class="fx-btns"><button class="pill" data-pg-copy="',
    id,
    '">copy code</button></div>',
  ].join('');
  const tokHTML = tokens.length
    ? [
      '<div class="fx-btns" style="margin-top:var(--space-10)">',
      tokens.map((t) => '<button class="tok" data-copy="' + t + '">' + t + '</button>').join(''),
      '</div>',
      '<p class="sub" style="margin-top:var(--space-8)">Tap any token to copy — '
        + 'live <span class="tok">var()</span>.</p>',
    ].join('')
    : '';
  const codeWithTokens = [codeHTML, tokHTML].join('');
  const tabsHTML = tabs({
    variant: 'line',
    panes: [
      { label: 'Preview', html: previewHTML },
      { label: 'Code', html: codeWithTokens },
    ],
  });
  return [
    '<div class="ds-sec" data-pg-root="',
    id,
    '"><h2>',
    title,
    '</h2>',
    sub ? '<p class="sub">' + sub + '</p>' : '',
    tabsHTML,
    '<div class="fx-controls" data-pg-ctrl="',
    id,
    '">',
    knobsHTML,
    '</div></div>',
  ].join('');
}
