/* ADAM/TOOL — public/admin/decap-reorder-gh · GitHub reorder load+save, one commit */
// Exports: DrGH.load, DrGH.save
(() => {
  const REPO = 'IrfanAdam/personal-website';
  const BRANCH = 'main';
  const DIR = 'content/projects';
  const API = 'https://api.github.com';

  const token = () => {
    const keys = ['decap-cms-user', 'netlify-cms-user'];
    for (const k of keys) {
      try {
        const u = JSON.parse(localStorage.getItem(k) || 'null');
        if (u && u.token) return u.token;
      } catch {}
    }
    return '';
  };

  const head = (t) => ({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${t}`,
    'X-GitHub-Api-Version': '2022-11-28',
  });

  const dec = (b64) => {
    const bin = atob(String(b64 || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const fail = async (r) => {
    if (r.status === 401) throw new Error('Session expired — log out and back into the CMS');
    if (r.status === 409) throw new Error('Conflict — refresh the page and retry');
    throw new Error(`GitHub ${r.status}`);
  };

  async function load() {
    const t = token();
    if (!t) throw new Error('Log into the CMS to enable reorder');
    const dl = await fetch(`${API}/repos/${REPO}/contents/${DIR}?ref=${BRANCH}`, { headers: head(t) });
    if (!dl.ok) await fail(dl);
    const files = (await dl.json()).filter((f) => f.name.endsWith('.json'));
    const raws = {};
    const gets = files.map(async (f) => {
      const u = `${API}/repos/${REPO}/contents/${DIR}/${f.name}?ref=${BRANCH}`;
      const r = await fetch(u, { headers: head(t) });
      if (!r.ok) await fail(r);
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
    const tree = [];
    order.forEach((slug, i) => {
      const n = i + 1;
      const raw = raws[slug];
      if (!raw) return;
      if (JSON.parse(raw.text).order === n) return;
      const text = raw.text.replace(/("order"\s*:\s*)\d+/, `$1${n}`);
      tree.push({ path: `${DIR}/${slug}.json`, mode: '100644', type: 'blob', content: text });
    });
    if (!tree.length) return { noop: true };
    const refR = await fetch(`${API}/repos/${REPO}/git/ref/heads/${BRANCH}`, { headers: head(t) });
    if (!refR.ok) await fail(refR);
    const base = (await refR.json()).object.sha;
    if (onStep) onStep('Committing…');
    const treeR = await fetch(`${API}/repos/${REPO}/git/trees`, {
      method: 'POST',
      headers: head(t),
      body: JSON.stringify({ base_tree: base, tree }),
    });
    if (!treeR.ok) await fail(treeR);
    const treeSha = (await treeR.json()).sha;
    const msg = 'chore(cms): reorder projects via admin';
    const commitR = await fetch(`${API}/repos/${REPO}/git/commits`, {
      method: 'POST',
      headers: head(t),
      body: JSON.stringify({ message: msg, tree: treeSha, parents: [base] }),
    });
    if (!commitR.ok) await fail(commitR);
    const commitSha = (await commitR.json()).sha;
    const refW = await fetch(`${API}/repos/${REPO}/git/ref/heads/${BRANCH}`, {
      method: 'PATCH',
      headers: head(t),
      body: JSON.stringify({ sha: commitSha }),
    });
    if (!refW.ok) await fail(refW);
    return { commit: commitSha.slice(0, 7) };
  }

  window.DrGH = { load, save };
})();
