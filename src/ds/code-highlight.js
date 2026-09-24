/* ADAM/DS — ds/code-highlight.js · mono highlight · [plan:2026-09-24_170000-code-syntax-highlight.md#phase-1] */
// Exports: highlight, codeBlock — IDE-like syntax
// — Escape · Highlight · Block —

// — Escape —
const esc = (s) => {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// — Highlight —
export function highlight(src) {
  const stash = [];
  const put = (cls, txt) => {
    const id = '__HL' + String(stash.length) + '__';
    stash.push('<span class="' + cls + '">' + txt + '</span>');
    return id;
  };
  let h = esc(src);
  h = h.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, (m) => put('hl-str', m));
  h = h.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (m) => put('hl-comm', m));
  h = h.replace(/--[\w-]+/g, (m) => put('hl-var', m));
  h = h.replace(/&lt;\/?[\w-]+[^&]*?&gt;/g, (m) => put('hl-tag', m));
  const kw = [
    'import|export|default|from|const|let|var|function|return',
    'if|else|for|while|class|extends|async|await|new|try|catch',
    'throw|switch|case|break|continue|typeof|instanceof|super|this',
    'true|false|null|undefined',
  ].join('|');
  h = h.replace(new RegExp('\\b(' + kw + ')\\b', 'g'), (m) => put('hl-kw', m));
  h = h.replace(/\b\d+(?:\.\d+)?(?:px|ch|vw|vh|%|ms|s)?\b/g, (m) => put('hl-num', m));
  let idx = 0;
  while (idx < stash.length) {
    const cur = stash[idx];
    const next = cur.replace(/__HL(\d+)__/g, (a, n) => stash[Number(n)] || a);
    stash[idx] = next;
    idx += 1;
  }
  h = h.replace(/__HL(\d+)__/g, (a, n) => stash[Number(n)] || a);
  return h;
}

// — Block —
export function codeBlock(src, lang) {
  const l = lang || 'html';
  const body = highlight(src);
  return '<div class="ds-code" data-lang="' + l + '"><pre><code class="hl">' + body + '</code></pre></div>';
}
