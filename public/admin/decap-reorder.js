/* ADAM/TOOL — public/admin/decap-reorder.js · own rows in list view, instant save */
(() => {
  const API_GET = '/__admin/projects';
  const API_POST = '/__admin/reorder';
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  let projBySlug = null;
  let projOrder = [];
  let ghRaws = null;
  let bar = null;
  let statusEl = null;
  let subEl = null;
  let container = null;
  let ourList = null;
  let saving = false;
  let pending = null;
  let dragLive = false;
  let suppressClick = false;

  const onProjectsPage = () => location.hash.includes('/collections/projects') && !location.hash.includes('/entries/') && !location.hash.includes('/new');
  const fetchProjects = async () => {
    if (projBySlug) return;
    if (isLocal) {
      try {
        const r = await fetch(API_GET);
        if (!r.ok) throw new Error(r.status);
        const arr = await r.json();
        projBySlug = Object.fromEntries(arr.map((p) => [p.slug, p]));
        projOrder = arr.map((p) => p.slug);
        return;
      } catch {}
    }
    if (!window.DrGH) throw new Error('Reorder script failed to load — refresh');
    const g = await window.DrGH.load();
    ghRaws = g.raws;
    projBySlug = Object.fromEntries(g.items.map((p) => [p.slug, p]));
    projOrder = g.items.map((p) => p.slug);
  };

  const setStatus = (t, ms = 0) => {
    if (!statusEl) return;
    statusEl.textContent = t;
    if (ms) setTimeout(() => { if (statusEl.textContent === t) statusEl.textContent = ''; }, ms);
  };
  const currentOrder = () => (ourList ? [...ourList.querySelectorAll('.dr-row')].map((n) => n.dataset.slug) : []);
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const renumber = () => {
    if (!ourList) return;
    [...ourList.querySelectorAll('.dr-row')].forEach((el, i) => {
      const b = el.querySelector('.dr-badge');
      if (b) b.textContent = String(i + 1);
    });
  };
  const counter = () => {
    if (!subEl || !projOrder.length) return;
    const n = ourList ? ourList.querySelectorAll('.dr-row').length : 0;
    subEl.textContent = `${n}/${projOrder.length} rows · drop to save`;
  };
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // instant save on drop — optimistic reorder, rollback on failure
  async function commitDrop(order) {
    if (!order.length || same(projOrder, order)) { renumber(); counter(); return; }
    const prev = [...projOrder];
    projOrder = [...order];
    order.forEach((s, i) => { if (projBySlug[s]) projBySlug[s].order = i + 1; });
    renumber();
    counter();
    if (saving) { pending = [...order]; return; }
    saving = true;
    setStatus('Saving…');
    try {
      if (isLocal) {
        const r = await fetch(API_POST, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || `Local ${r.status} · saving order`);
        setStatus('Saved ✓', 2200);
      } else {
        if (!window.DrGH) throw new Error('Reorder script failed to load — refresh');
        const g = await window.DrGH.save(order, ghRaws || {}, (s) => setStatus(s));
        if (ghRaws && !g.noop) {
          order.forEach((slug, i) => {
            const raw = ghRaws[slug];
            if (raw && typeof raw.text === 'string') {
              raw.text = raw.text.replace(/("order"\s*:\s*)\d+/, `$1${i + 1}`);
            }
          });
        }
        if (g.noop) setStatus('No changes', 2200);
        else setStatus(`Saved ✓ ${g.commit} · ${g.login}`, 5000);
      }
    } catch (e) {
      projOrder = [...prev];
      prev.forEach((s, i) => { if (projBySlug[s]) projBySlug[s].order = i + 1; });
      renderList();
      setStatus(String(e.message || e).slice(0, 110));
    } finally {
      saving = false;
      if (pending) { const q = pending; pending = null; commitDrop(q); }
    }
  }

  function after(y) {
    const els = [...ourList.querySelectorAll('.dr-row:not(.dragging)')];
    let best = { off: Number.NEGATIVE_INFINITY, el: null };
    for (const el of els) {
      const b = el.getBoundingClientRect();
      const off = y - b.top - b.height / 2;
      if (off < 0 && off > best.off) best = { off, el };
    }
    return best.el;
  }

  function onDown(e, el) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const y0 = e.clientY;
    let live = false;
    const move = (ev) => {
      if (!live) {
        if (Math.abs(ev.clientY - y0) < 5) return;
        live = true;
        dragLive = true;
        el.classList.add('dragging');
      }
      const a = after(ev.clientY);
      if (a == null) ourList.appendChild(el);
      else if (a !== el) ourList.insertBefore(el, a);
      renumber();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!live) return;
      dragLive = false;
      el.classList.remove('dragging');
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 120);
      renumber();
      commitDrop(currentOrder());
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function step(el, d) {
    const sib = d < 0 ? el.previousElementSibling : el.nextElementSibling;
    if (!sib || !sib.classList.contains('dr-row')) return;
    if (d < 0) ourList.insertBefore(el, sib);
    else ourList.insertBefore(sib, el);
    renumber();
    commitDrop(currentOrder());
  }

  function rowEl(p) {
    const el = document.createElement('div');
    el.className = 'dr-row';
    el.dataset.slug = p.slug;
    el.innerHTML = `<span class="dr-grip" aria-hidden="true">⋮⋮</span>`
      + `<img class="dr-thumb" alt="" loading="lazy" draggable="false" src="${p.image || ''}">`
      + `<span class="dr-title">${esc(p.title)} (${esc(p.slug)})</span>`
      + `<span class="dr-mv"><button type="button" data-up="1" title="Move up">▲</button>`
      + `<button type="button" data-down="1" title="Move down">▼</button></span>`
      + `<span class="dr-badge">?</span>`;
    el.querySelector('[data-up]').addEventListener('click', (e) => { e.stopPropagation(); step(el, -1); });
    el.querySelector('[data-down]').addEventListener('click', (e) => { e.stopPropagation(); step(el, 1); });
    el.querySelector('.dr-grip').addEventListener('pointerdown', (e) => onDown(e, el));
    el.addEventListener('dragstart', (e) => e.preventDefault());
    el.addEventListener('click', () => {
      if (suppressClick) return;
      location.hash = `#/collections/projects/entries/${p.slug}`;
    });
    return el;
  }

  function renderList() {
    if (!ourList || !document.contains(ourList)) {
      ourList = document.createElement('div');
      ourList.className = 'dr-list';
      if (bar && bar.parentElement) bar.insertAdjacentElement('afterend', ourList);
      else if (container && container.parentElement) container.parentElement.insertBefore(ourList, container);
      else return;
    }
    if (dragLive) return;
    const have = new Map([...ourList.querySelectorAll('.dr-row')].map((el) => [el.dataset.slug, el]));
    for (const [s, el] of have) {
      if (!projBySlug[s]) { el.remove(); have.delete(s); }
    }
    for (const s of projOrder) {
      let el = have.get(s);
      if (!el) {
        if (!projBySlug[s]) continue;
        el = rowEl(projBySlug[s]);
        have.set(s, el);
      }
      ourList.appendChild(el);
    }
    renumber();
  }

  function findCards() {
    return [...document.querySelectorAll('a[href*="/collections/projects/entries/"]')]
      .filter((n) => n.offsetParent !== null);
  }

  function findContainer(cards) {
    if (!cards.length) return null;
    let p = cards[0].parentElement;
    while (p && p !== document.body) {
      if (cards.every((c) => p.contains(c))) return p;
      p = p.parentElement;
    }
    return cards[0].parentElement;
  }

  // list view only: flip grid back to list, hide the toggle pair + Sort-by control
  // runs on every pass — Decap re-renders must never bring them back
  function tidyControls() {
    const btns = [...document.querySelectorAll('button')].filter((b) => b.querySelector('svg') && !b.textContent.trim());
    if (btns.length === 2 && btns[0].parentElement === btns[1].parentElement) {
      const inactive = 'rgb(179,185,196)';
      const color = (b) => getComputedStyle(b).color.replace(/\s/g, '');
      if (color(btns[1]) !== inactive && color(btns[0]) === inactive) btns[0].click();
      btns[0].parentElement.style.display = 'none';
    }
    // hide Sort-by: kill the whole row-reverse controls row that contains it
    if (document.body.textContent.includes('Sort by')) {
      const divs = [...document.querySelectorAll('div')];
      for (const d of divs) {
        if (d === document.body || d.style.display === 'none') continue;
        if (!d.textContent.includes('Sort by')) continue;
        let cs = null;
        try { cs = getComputedStyle(d); } catch { continue; }
        if (cs.display === 'flex' && cs.flexDirection === 'row-reverse') d.style.display = 'none';
      }
    }
  }

  function ensureBar(cont) {
    if (bar && document.contains(bar)) return;
    bar = document.createElement('div');
    bar.className = 'dr-bar';
    bar.innerHTML = '<strong>Reorder</strong><small class="dr-sub"></small><span class="spacer"></span><span class="dr-status"></span>';
    statusEl = bar.querySelector('.dr-status');
    subEl = bar.querySelector('.dr-sub');
    if (cont && cont.parentElement) cont.parentElement.insertBefore(bar, cont);
  }

  function enhance() {
    if (!onProjectsPage()) {
      if (bar && bar.parentElement) bar.remove();
      if (ourList && ourList.parentElement) ourList.remove();
      return;
    }
    tidyControls();
    const cards = findCards();
    if (cards.length < 2) return;
    if (!projBySlug) return;
    const cont = findContainer(cards);
    if (!cont) return;
    container = cont;
    ensureBar(cont);
    tidyControls();
    document.querySelectorAll('.dr-notice').forEach((n) => n.remove());
    for (const card of cards) {
      if (card.style.display !== 'none') card.style.display = 'none';
    }
    renderList();
    counter();
  }

  function notice(msg) {
    if (document.querySelector('.dr-notice')) return;
    const header = [...document.querySelectorAll('h1,h2')].find((h) => h.textContent.trim() === 'Projects');
    if (!header) return;
    const el = document.createElement('div');
    el.className = 'dr-bar dr-notice';
    el.innerHTML = `<strong>Reorder unavailable:</strong><small>${msg}</small>`;
    header.parentElement.insertAdjacentElement('afterend', el);
  }

  let tries = 0;
  const tick = async () => {
    if (!onProjectsPage()) { tries = 0; return; }
    if (!projBySlug) {
      try {
        await fetchProjects();
      } catch (e) {
        notice(String(e.message || e).slice(0, 90));
        return;
      }
    }
    enhance();
    const seen = ourList ? ourList.querySelectorAll('.dr-row').length : 0;
    if (tries < 30 && (projOrder.length && seen < projOrder.length)) {
      tries += 1;
      setTimeout(tick, 400);
    }
  };

  window.addEventListener('hashchange', () => {
    saving = false; pending = null; dragLive = false;
    container = null; bar = null; ourList = null;
    projBySlug = null; projOrder = []; ghRaws = null;
    setTimeout(tick, 300);
  });
  const obs = new MutationObserver(() => {
    if (onProjectsPage() && (!ourList || !document.contains(ourList) || document.querySelectorAll('.dr-row').length === 0)) {
      tick();
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(tick, 1200);
  setTimeout(tick, 800);
})();
