/* ADAM/TOOL — public/admin/decap-reorder-gh.js · GitHub reorder load+save, one commit */
/* Exports: DrGH.load, DrGH.save — [plan:2026-09-06_183401-portfolio-decap-completion.md#phase-1] */
(() => {
  const REPO = 'IrfanAdam/personal-website';
  const BRANCH = 'main';
  const DIR = 'content/projects';
  const API = 'https://api.github.com';
  const MAX = 8;
  const token = () => {
    for (const k of ['decap-cms-user', 'netlify-cms-user']) {
      try {
        const u = JSON.parse(localStorage.getItem(k) || 'null');
        if (u && u.token) return u.token;
      } catch {}
    }
    return '';
  };
  const head = (t) => ({
    Accept: 'application/vnd.github+json',
    Authorization: 'Bearer ' + t,
    'X-GitHub-Api-Version': '2022-11-28',
  });
  const dec = (b64) => {
    const bin = atob(String(b64 || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };
  const fail = async (r, step) => {
    let m = '';
    try { const j = await r.json(); if (j.message) m = ' — ' + j.message; } catch {}
    if (r.status === 401) throw new Error('Session expired · ' + step + m + ' — log out and back in');
    const e = new Error('GitHub ' + r.status + m + ' · ' + step);
    e.retryable = (r.status === 422 || r.status === 409 || r.status >= 500);
    e.status = r.status;
    throw e;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let pre = null;
  async function preflight(t) {
    if (pre) return pre;
    const u = await fetch(API + '/user', { headers: head(t), cache: 'no-store' });
    if (!u.ok) throw new Error('GitHub ' + u.status + ' · checking login — log out and back in');
    const login = (await u.json()).login || '?';
    const rr = await fetch(API + '/repos/' + REPO, { headers: head(t), cache: 'no-store' });
    if (!rr.ok) throw new Error('GitHub ' + rr.status + ' · repo unreachable as ' + login);
    const perms = (await rr.json()).permissions || {};
    if (!perms.push) throw new Error('No write access as ' + login + ' — log out and back in');
    pre = { login };
    return pre;
  }
  async function load() {
    const t = token();
    if (!t) throw new Error('Log into the CMS to enable reorder');
    const bust = 't=' + Date.now();
    const dl = await fetch(API + '/repos/' + REPO + '/contents/' + DIR + '?ref=' + BRANCH + '&' + bust, { headers: head(t), cache: 'no-store' });
    if (!dl.ok) await fail(dl, 'loading list');
    const files = (await dl.json()).filter((f) => f.name.endsWith('.json'));
    const raws = {};
    const gets = files.map(async (f) => {
      const u = API + '/repos/' + REPO + '/contents/' + DIR + '/' + f.name + '?ref=' + BRANCH + '&' + bust + '-' + f.name;
      const r = await fetch(u, { headers: head(t), cache: 'no-store' });
      if (!r.ok) await fail(r, 'reading files');
      const j = await r.json();
      const text = dec(j.content);
      const p = JSON.parse(text);
      raws[p.slug] = { text };
      return { slug: p.slug, title: p.title, order: p.order, image: p.image, tag: p.tag };
    });
    const items = await Promise.all(gets);
    items.sort((a, b) => a.order - b.order);
    return { items, raws };
  }
  async function save(order, raws, onStep) {
    const t = token();
    if (!t) throw new Error('Log into the CMS to enable reorder');
    const me = await preflight(t);
    const delays = [0, 1200, 2500, 5000, 8000, 12000, 15000, 15000];
    let lastErr = null;
    for (let attempt = 1; attempt <= MAX; attempt += 1) {
      try {
        if (onStep) onStep(attempt > 1 ? 'Syncing… (try ' + attempt + '/' + MAX + ')' : 'Saving…');
        if (attempt > 1) await sleep(delays[Math.min(attempt - 1, delays.length - 1)]);
        const bust = 't=' + Date.now() + '-' + attempt;
        const refR = await fetch(API + '/repos/' + REPO + '/git/ref/heads/' + BRANCH + '?' + bust, { headers: head(t), cache: 'no-store' });
        if (!refR.ok) await fail(refR, 'reading branch');
        const base = (await refR.json()).object.sha;
        const cR = await fetch(API + '/repos/' + REPO + '/git/commits/' + base + '?' + bust, { headers: head(t), cache: 'no-store' });
        if (!cR.ok) await fail(cR, 'reading base commit');
        const baseTree = (await cR.json()).tree.sha;
        const tree = [];
        order.forEach((slug, i) => {
          const n = i + 1;
          const raw = raws[slug];
          if (!raw) return;
          let cur = -1;
          try { cur = JSON.parse(raw.text).order; } catch {}
          if (cur === n) return;
          tree.push({ path: DIR + '/' + slug + '.json', mode: '100644', type: 'blob', content: raw.text.replace(/("order"\s*:\s*)\d+/, '$1' + n) });
        });
        if (!tree.length) return { noop: true, login: me.login };
        const treeR = await fetch(API + '/repos/' + REPO + '/git/trees', { method: 'POST', headers: head(t), body: JSON.stringify({ base_tree: baseTree, tree }) });
        if (!treeR.ok) await fail(treeR, 'creating tree');
        const treeSha = (await treeR.json()).sha;
        const commitR = await fetch(API + '/repos/' + REPO + '/git/commits', { method: 'POST', headers: head(t), body: JSON.stringify({ message: 'chore(cms): reorder projects via admin', tree: treeSha, parents: [base] }) });
        if (!commitR.ok) await fail(commitR, 'committing');
        const commitSha = (await commitR.json()).sha;
        const refW = await fetch(API + '/repos/' + REPO + '/git/refs/heads/' + BRANCH, { method: 'PATCH', headers: head(t), body: JSON.stringify({ sha: commitSha }) });
        if (!refW.ok) await fail(refW, 'updating branch');
        for (let k = 0; k < 8; k += 1) {
          await sleep(600);
          try {
            const chk = await fetch(API + '/repos/' + REPO + '/git/ref/heads/' + BRANCH + '?poll=' + Date.now() + '-' + k, { headers: head(t), cache: 'no-store' });
            if (chk.ok && (await chk.json()).object.sha === commitSha) break;
          } catch {}
        }
        return { commit: commitSha.slice(0, 7), login: me.login };
      } catch (e) {
        lastErr = e;
        if (/Session expired|No write access|checking login|repo unreachable/.test(e.message)) throw e;
        if (e.retryable === false) throw e;
      }
    }
    throw lastErr;
  }
  window.DrGH = { load, save };
})();
