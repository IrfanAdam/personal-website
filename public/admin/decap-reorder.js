/* ADAM/TOOL — public/admin/decap-reorder.js · in-list drag reorder, instant save */
(() => {
  const API_GET = '/__admin/projects';
  const API_POST = '/__admin/reorder';
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  let projBySlug = null;
  let projOrder = [];
  let projByTitle = {};
  let ghRaws = null;
  let bar = null;
  let statusEl = null;
  let subEl = null;
  let container = null;
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
        projByTitle = Object.fromEntries(arr.map((p) => [String(p.title || '').toLowerCase(), p.slug]));
        return;
      } catch {}
    }
    if (!window.DrGH) throw new Error('Reorder script failed to load — refresh');
    const g = await window.DrGH.load();
    ghRaws = g.raws;
    projBySlug = Object.fromEntries(g.items.map((p) => [p.slug, p]));
    projOrder = g.items.map((p) => p.slug);
    projByTitle = Object.fromEntries(g.items.map((p) => [String(p.title || '').toLowerCase(), p.slug]));
  };

  const setStatus = (t, ms = 0) => {
    if (!statusEl) return;
    statusEl.textContent = t;
    if (ms) setTimeout(() => { if (statusEl.textContent === t) statusEl.textContent = ''; }, ms);
  };
  const currentOrder = () => {
    if (!container) return [];
    return [...container.querySelectorAll('.dr-card')].map((n) => n.dataset.slug);
  };
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const renumber = () => {
    if (!container) return;
    [...container.querySelectorAll('.dr-card')].forEach((el, i) => {
      const b = el.querySelector('.dr-badge');
      if (b) b.textContent = String(i + 1);
    });
  };
  const counter = () => {
    if (!subEl || !projOrder.length) return;
    const n = container ? container.querySelectorAll('.dr-card').length : 0;
    subEl.textContent = `${n}/${projOrder.length} rows · drop to save`;
  };
  const arrangeDom = (order) => {
    if (!container) return;
    const map = new Map([...container.querySelectorAll('.dr-card')].map((el) => [el.dataset.slug, el]));
    for (const slug of order) {
      const el = map.get(slug);
      if (el) container.appendChild(el);
    }
  };

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
      arrangeDom(prev);
      renumber();
      setStatus(String(e.message || e).slice(0, 110));
    } finally {
      saving = false;
      if (pending) { const q = pending; pending = null; commitDrop(q); }
    }
  }

  function getAfter(y) {
    const els = [...container.querySelectorAll('.dr-card:not(.dragging)')];
    let best = { off: Number.NEGATIVE_INFINITY, el: null };
    for (const el of els) {
      const box = el.getBoundingClientRect();
      const off = y - box.top - box.height / 2;
      if (off < 0 && off > best.off) best = { off, el };
    }
    return best.el;
  }

  function onDown(e, card) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const y0 = e.clientY;
    let live = false;
    const move = (ev) => {
      if (!live) {
        if (Math.abs(ev.clientY - y0) < 5) return;
        live = true;
        dragLive = true;
        card.classList.add('dragging');
      }
      const after = getAfter(ev.clientY);
      if (after == null) container.appendChild(card);
      else if (after !== card) container.insertBefore(card, after);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!live) return;
      dragLive = false;
      card.classList.remove('dragging');
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 120);
      renumber();
      commitDrop(currentOrder());
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function findCards() {
    let nodes = [...document.querySelectorAll('a[href*="/collections/projects/entries/"]')];
    if (!projBySlug) return nodes;
    nodes = nodes.filter((n) => {
      const txt = (n.textContent || '').toLowerCase();
      return Object.keys(projBySlug).some((s) => txt.includes(`(${s})`) || txt.includes(s));
    });
    nodes = [...new Set(nodes)].filter((n) => n.offsetParent !== null);
    return nodes;
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

  // list view only: flip grid back to list, then hide the toggle pair
  function forceListView() {
    const btns = [...document.querySelectorAll('button')].filter((b) => b.querySelector('svg') && !b.textContent.trim());
    if (btns.length !== 2 || btns[0].parentElement !== btns[1].parentElement) return;
    const inactive = 'rgb(179,185,196)';
    const color = (b) => getComputedStyle(b).color.replace(/\s/g, '');
    if (color(btns[1]) !== inactive && color(btns[0]) === inactive) btns[0].click();
    btns[0].parentElement.style.display = 'none';
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
      return;
    }
    const cards = findCards();
    if (cards.length < 2) return;
    if (!projBySlug) return;
    const cont = findContainer(cards);
    if (!cont) return;
    container = cont;
    ensureBar(cont);
    forceListView();
    document.querySelectorAll('.dr-notice').forEach((n) => n.remove());
    for (const card of cards) {
      if (card.dataset.drDone) continue;
      let slug = '';
      const href = card.getAttribute('href') || '';
      if (href.includes('/entries/')) slug = href.split('/').pop().split('?')[0].split('#')[0];
      if (!slug) {
        const m = (card.textContent || '').match(/\(([^)]+)\)\s*$/);
        if (m) slug = m[1].trim();
      }
      slug = slug.toLowerCase();
      if (!projBySlug[slug]) {
        const low = (card.textContent || '').toLowerCase();
        const hit = Object.keys(projByTitle).find((t) => t && low.includes(t));
        if (hit) slug = projByTitle[hit];
      }
      if (!projBySlug[slug]) continue;
      const p = projBySlug[slug];
      card.classList.add('dr-card');
      card.dataset.slug = slug;
      card.dataset.drDone = '1';
      if (!card.querySelector('.dr-grip')) {
        const grip = document.createElement('span');
        grip.className = 'dr-grip';
        grip.textContent = '⋮⋮';
        grip.setAttribute('aria-hidden', 'true');
        card.prepend(grip);
      }
      if (!card.querySelector('.dr-thumb')) {
        const img = document.createElement('img');
        img.className = 'dr-thumb';
        img.alt = '';
        img.loading = 'lazy';
        img.draggable = false;
        img.src = p.image || '';
        const grip = card.querySelector('.dr-grip');
        if (grip) grip.insertAdjacentElement('afterend', img);
        else card.prepend(img);
      }
      if (!card.querySelector('.dr-badge')) {
        const badge = document.createElement('span');
        badge.className = 'dr-badge';
        badge.textContent = String(p.order || '?');
        card.appendChild(badge);
      }
      const grip = card.querySelector('.dr-grip');
      if (grip && !grip.dataset.bound) {
        grip.dataset.bound = '1';
        grip.addEventListener('pointerdown', (e) => onDown(e, card));
      }
      if (!card.dataset.clickOff) {
        card.dataset.clickOff = '1';
        card.addEventListener('click', (e) => {
          if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
        }, true);
        card.addEventListener('dragstart', (e) => e.preventDefault());
      }
    }
    // always display the true order (except mid-drag — never yank the row)
    const cur = currentOrder();
    if (cur.length) {
      const missing = projOrder.filter((s) => !cur.includes(s));
      if (!missing.length && !dragLive && !same(projOrder, cur)) arrangeDom(projOrder);
      counter();
      renumber();
    }
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
    const seen = container ? container.querySelectorAll('.dr-card').length : 0;
    if (tries < 30 && (!container || (projOrder.length && seen < projOrder.length))) {
      tries += 1;
      setTimeout(tick, 400);
    }
  };

  window.addEventListener('hashchange', () => { saving = false; pending = null; dragLive = false; container = null; bar = null; setTimeout(tick, 300); });
  const obs = new MutationObserver(() => {
    if (onProjectsPage() && (!container || !document.contains(container) || document.querySelectorAll('.dr-card').length === 0)) {
      tick();
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(tick, 1200);
  setTimeout(tick, 800);
})();
