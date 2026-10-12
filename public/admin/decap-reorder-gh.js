/* ADAM/TOOL — public/admin/decap-reorder-gh.js · GitHub reorder load+save, one commit */
/* Exports: DrGH.load, DrGH.save — [plan:2026-09-06_183401-portfolio-decap-completion.md#phase-1] */
(() => {
  const REPO = 'IrfanAdam/personal-website';
  const BRANCH = 'main';
  const DIR = 'content/projects';
  const API = 'https://api.github.com';
  const token = () => {
    for (const k of ['decap-cms-user', 'netlify-cms-user']) {
      try { const u = JSON.parse(localStorage.getItem(k) || 'null'); if (u?.token) return u.token; } catch {}
    }
    return '';
  };
  const head = (t) => ({ Accept: 'application/vnd.github+json', Authorization: `Bearer ${t}`, 'X-GitHub-Api-Version': '2022-11-28' });
  const dec = (b64) => { const bin = atob(String(b64 || '').replace(/\n/g, '')); return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))); };
  const fail = async (r, step) => {
    let m = ''; try { const j = await r.json(); m = j.message ? ` — ${j.message}` : ''; } catch {}
    if (r.status === 401) throw new Error(`Session expired · ${step}${m} — log out and back in`);
    if (r.status === 409) throw new Error(`Conflict · ${step}${m} — refresh and retry`);
    throw new Error(`GitHub ${r.status}${m} · ${step}`);
  };
  let pre = null;
  async function preflight(t) {
    if (pre) return pre;
    const u = await fetch(`${API}/user`, { headers: head(t), cache: 'no-store' });
    if (!u.ok) throw new Error(`GitHub ${u.status} · checking login — log out and back in`);
    const login = (await u.json()).login || '?';
    const rr = await fetch(`${API}/repos/${REPO}`, { headers: head(t), cache: 'no-store' });
    if (!rr.ok) throw new Error(`GitHub ${rr.status} · repo unreachable as ${login}`);
    if (!((await rr.json()).permissions || {}).push) throw new Error(`No write access as ${login} — log out and back in`);
    pre = { login }; return pre;
  }
  async function load() {
    const t = token(); if (!t) throw new Error('Log into the CMS to enable reorder');
    const dl = await fetch(`${API}/repos/${REPO}/contents/${DIR}?ref=${BRANCH}&t=${Date.now()}`, { headers: head(t), cache: 'no-store' });
    if (!dl.ok) await fail(dl, 'loading list');
    const files = (await dl.json()).filter((f) => f.name.endsWith('.json'));
    const raws = {};
    const gets = files.map(async (f) => {
      const r = await fetch(`${API}/repos/${REPO}/contents/${DIR}/${f.name}?ref=${BRANCH}&t=${Date.now()}`, { headers: head(t), cache: 'no-store' });
      if (!r.ok) await fail(r, 'reading files');
      const j = await r.json(); const text = dec(j.content); const p = JSON.parse(text);
      raws[p.slug] = { text }; return { slug: p.slug, title: p.title, order: p.order, image: p.image, tag: p.tag };
    });
    const items = await Promise.all(gets); items.sort((a, b) => a.order - b.order);
    return { items, raws };
  }
  async function save(order, raws, onStep) {
    const t = token(); if (!t) throw new Error('Log into the CMS to enable reorder');
    const me = await preflight(t);
    const build = () => {
      const out = [];
      order.forEach((slug, i) => {
        const n = i + 1; const raw = raws[slug]; if (!raw) return;
        try { if (JSON.parse(raw.text).order === n) return; } catch {}
        out.push({ path: `${DIR}/${slug}.json`, mode: '100644', type: 'blob', content: raw.text.replace(/("order"\s*:\s*)\d+/, `$1${n}`) });
      });
      return out;
    };
    const tree = build(); if (!tree.length) return { noop: true, login: me.login };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let lastErr = null;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
      try {
        if (onStep) onStep(attempt > 1 ? `Retrying… (${attempt}/4)` : 'Committing…');
        const refR = await fetch(`${API}/repos/${REPO}/git/ref/heads/${BRANCH}?t=${Date.now()}`, { headers: head(t), cache: 'no-store' });
        if (!refR.ok) await fail(refR, 'reading branch');
        const base = (await refR.json()).object.sha;
        const cR = await fetch(`${API}/repos/${REPO}/git/commits/${base}?t=${Date.now()}`, { headers: head(t), cache: 'no-store' });
        if (!cR.ok) await fail(cR, 'reading base commit');
        const baseTree = (await cR.json()).tree.sha;
        const treeR = await fetch(`${API}/repos/${REPO}/git/trees`, { method: 'POST', headers: head(t), body: JSON.stringify({ base_tree: baseTree, tree }) });
        if (!treeR.ok) await fail(treeR, 'creating tree');
        const treeSha = (await treeR.json()).sha;
        const commitR = await fetch(`${API}/repos/${REPO}/git/commits`, { method: 'POST', headers: head(t), body: JSON.stringify({ message: 'chore(cms): reorder projects via admin', tree: treeSha, parents: [base] }) });
        if (!commitR.ok) await fail(commitR, 'committing');
        const commitSha = (await commitR.json()).sha;
        const refW = await fetch(`${API}/repos/${REPO}/git/refs/heads/${BRANCH}`, { method: 'PATCH', headers: head(t), body: JSON.stringify({ sha: commitSha }) });
        if (!refW.ok) await fail(refW, 'updating branch');
        for (let k = 0; k < 6; k += 1) {
          await sleep(550);
          try {
            const chk = await fetch(`${API}/repos/${REPO}/git/ref/heads/${BRANCH}?t=${Date.now()}`, { headers: head(t), cache: 'no-store' });
            if (chk.ok && (await chk.json()).object.sha === commitSha) break;
          } catch {}
        }
        return { commit: commitSha.slice(0, 7), login: me.login };
      } catch (e) { lastErr = e; if (attempt < 4) await sleep(800 * attempt); }
    }
    throw lastErr;
  }
  window.DrGH = { load, save };
})();
