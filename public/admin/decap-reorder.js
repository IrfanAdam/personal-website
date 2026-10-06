/* ADAM/TOOL — public/admin/decap-reorder.js · inject drag reorder + thumbs into Decap Projects list */
(() => {
  const API_GET = '/__admin/projects';
  const API_POST = '/__admin/reorder';
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
  let projBySlug = null;
  let projOrder = [];
  let ghRaws = null;
  let bar = null;
  let saveBtn = null;
  let resetBtn = null;
  let statusEl = null;
  let initial = [];
  let suppressClick = false;
  let container = null;

  function autoScroll(y) {
    const m = 60;
    const sp = 14;
    if (y < m) window.scrollBy(0, -sp);
    if (y > window.innerHeight - m) window.scrollBy(0, sp);
  }

  function onGripDown(e, card) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const startY = e.clientY;
    let live = false;
    const move = (ev) => {
      if (!live) {
        if (Math.abs(ev.clientY - startY) < 5) return;
        live = true;
        card.classList.add('dragging');
      }
      const after = getAfter(ev.clientY);
      if (after == null) container.appendChild(card);
      else if (after !== card) container.insertBefore(card, after);
      container.querySelectorAll('.dr-card').forEach((n) => n.classList.remove('drag-over'));
      if (after && after !== card) after.classList.add('drag-over');
      autoScroll(ev.clientY);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!live) return;
      card.classList.remove('dragging');
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 80);
      container.querySelectorAll('.drag-over').forEach((n) => n.classList.remove('drag-over'));
      renumber();
      sync();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

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
    // live site — load from GitHub with the CMS login
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

  const currentOrder = () => {
    if (!container) return [];
    return [...container.querySelectorAll('.dr-card')].map((n) => n.dataset.slug);
  };
  const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const sync = () => {
    if (!saveBtn) return;
    saveBtn.disabled = same(initial, currentOrder());
  };
  const renumber = () => {
    if (!container) return;
    [...container.querySelectorAll('.dr-card')].forEach((el, i) => {
      const b = el.querySelector('.dr-badge');
      if (b) b.textContent = String(i + 1);
    });
  };

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

  function findCards() {
    // Decap list cards are anchors to entries; try multiple selectors
    let nodes = [...document.querySelectorAll('a[href*=\"/collections/projects/entries/\"]')];
    if (nodes.length === 0) {
      // fallback: cards containing (slug)
      const all = [...document.querySelectorAll('a, div')];
      nodes = all.filter((n) => {
        const t = n.textContent || '';
        return /\(.+\)$/.test(t.trim()) && n.children.length === 0 && t.includes('(');
      }).map((n) => n.closest('a') || n.closest('div'));
      nodes = [...new Set(nodes.filter(Boolean))];
    }
    // filter to only those whose text contains a known slug
    if (projBySlug) {
      nodes = nodes.filter((n) => {
        const txt = (n.textContent || '').toLowerCase();
        return Object.keys(projBySlug).some((s) => txt.includes(`(${s})`) || txt.includes(s));
      });
    }
    // dedupe and keep only visible cards
    nodes = [...new Set(nodes)].filter((n) => n.offsetParent !== null);
    // if still few, try broader: find white cards stack
    if (nodes.length < 3) {
      const cand = [...document.querySelectorAll('div')].filter((d) => {
        const s = getComputedStyle(d);
        return s.backgroundColor === 'rgb(255, 255, 255)' && d.textContent.includes('(') && d.offsetHeight > 20 && d.offsetHeight < 90;
      });
      if (cand.length >= 8) nodes = cand;
    }
    return nodes;
  }

  function findContainer(cards) {
    if (!cards.length) return null;
    // common parent of all cards
    let p = cards[0].parentElement;
    while (p && p !== document.body) {
      const containsAll = cards.every((c) => p.contains(c));
      if (containsAll) return p;
      p = p.parentElement;
    }
    return cards[0].parentElement;
  }

  function ensureBar(cont) {
    if (bar && document.contains(bar)) return;
    bar = document.createElement('div');
    bar.className = 'dr-bar';
    bar.innerHTML = '<strong>Reorder</strong><small>drag · save commits to main</small><span class="spacer"></span><span class="dr-status"></span><button class="dr-btn" type="button">Reset</button><button class="dr-btn primary" type="button" disabled>Save order</button>';
    statusEl = bar.querySelector('.dr-status');
    resetBtn = bar.querySelector('.dr-btn:not(.primary)');
    saveBtn = bar.querySelector('.dr-btn.primary');
    resetBtn.addEventListener('click', () => {
      if (!container) return;
      const map = new Map([...container.querySelectorAll('.dr-card')].map((el) => [el.dataset.slug, el]));
      // remove all then re-append in initial order
      for (const slug of initial) {
        const el = map.get(slug);
        if (el) container.appendChild(el);
      }
      renumber();
      sync();
      setStatus('Reset', 1500);
    });
    saveBtn.addEventListener('click', async () => {
      const order = currentOrder();
      saveBtn.disabled = true;
      setStatus('Saving…');
      try {
        if (isLocal) {
          const r = await fetch(API_POST, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.error || r.status);
          initial = [...order];
          sync();
          setStatus('Saved ✓', 2200);
          return;
        }
        // live site — one commit to main with the CMS login, Vercel redeploys
        if (!window.DrGH) throw new Error('Reorder script failed to load — refresh');
        const g = await window.DrGH.save(order, ghRaws || {}, (s) => setStatus(s));
        initial = [...order];
        sync();
        if (g.noop) setStatus('No changes', 2200);
        else setStatus(`Saved ✓ ${g.commit} — redeploying`, 5000);
      } catch (e) {
        setStatus(String(e.message || e).slice(0, 90));
        saveBtn.disabled = false;
      }
    });
    // insert before the cards container, or after the Projects header
    const header = [...document.querySelectorAll('h1,h2')].find((h) => h.textContent.trim() === 'Projects');
    const anchor = cont;
    if (header) {
      // header is inside a top bar; insert bar after that bar
      let topBar = header.closest('div');
      while (topBar && topBar.nextElementSibling !== anchor && topBar.parentElement !== document.body) {
        if (topBar.parentElement && topBar.parentElement.contains(anchor)) break;
        topBar = topBar.parentElement;
      }
      if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(bar, anchor);
      else header.parentElement.insertAdjacentElement('afterend', bar);
    } else if (cont && cont.parentElement) {
      cont.parentElement.insertBefore(bar, cont);
    }
  }

  function enhance() {
    if (!onProjectsPage()) {
      if (bar && bar.parentElement) bar.remove();
      return;
    }
    const cards = findCards();
    if (cards.length < 2) return;
    // need project data for thumbs
    if (!projBySlug) return;
    const cont = findContainer(cards);
    if (!cont) return;
    container = cont;
    ensureBar(cont);
    document.querySelectorAll('.dr-notice').forEach((n) => n.remove());
    // enhance each card
    for (const card of cards) {
      if (card.dataset.drDone) continue;
      // extract slug
      let slug = '';
      const href = card.getAttribute('href') || '';
      if (href.includes('/entries/')) slug = href.split('/').pop().split('?')[0].split('#')[0];
      if (!slug) {
        const txt = card.textContent || '';
        const m = txt.match(/\(([^)]+)\)\s*$/);
        if (m) slug = m[1].trim();
      }
      slug = slug.toLowerCase();
      if (!projBySlug[slug]) continue;
      const p = projBySlug[slug];
      card.classList.add('dr-card');
      card.dataset.slug = slug;
      card.dataset.drDone = '1';
      // inject grip + thumb + badge if not present
      // avoid duplicating if already injected
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
        img.src = p.image || '';
        // insert after grip
        const grip = card.querySelector('.dr-grip');
        if (grip && grip.nextSibling) grip.insertAdjacentElement('afterend', img);
        else card.prepend(img);
      }
      if (!card.querySelector('.dr-badge')) {
        const badge = document.createElement('span');
        badge.className = 'dr-badge';
        badge.textContent = String(p.order || '?');
        card.appendChild(badge);
      }
      // pointer drag from the grip — reliable inside Decap rows
      const grip = card.querySelector('.dr-grip');
      if (grip && !grip.dataset.bound) {
        grip.dataset.bound = '1';
        grip.addEventListener('pointerdown', (e) => onGripDown(e, card));
      }
      // block the row's navigation click right after a drag
      card.addEventListener('click', (e) => {
        if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    }
    // set initial order from current DOM if not set
    const cur = currentOrder();
    if (initial.length === 0 && cur.length) {
      if (cur.length >= projOrder.length) {
        // every row recognised — arrange DOM to the true order
        initial = [...projOrder].filter((s) => cur.includes(s));
        const map = new Map([...container.querySelectorAll('.dr-card')].map((el) => [el.dataset.slug, el]));
        for (const slug of initial) {
          const el = map.get(slug);
          if (el) container.appendChild(el);
        }
      } else {
        // some rows unrecognised — leave Decap order alone, treat DOM as truth
        initial = [...cur];
      }
      renumber();
      sync();
    } else {
      renumber();
      sync();
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
    // retry a few times because Decap renders async
    if (tries < 20 && (!container || container.querySelectorAll('.dr-card').length < 8)) {
      tries += 1;
      setTimeout(tick, 400);
    }
  };

  // observe hash and DOM
  window.addEventListener('hashchange', () => { initial = []; container = null; bar = null; setTimeout(tick, 300); });
  const obs = new MutationObserver(() => {
    if (onProjectsPage() && (!container || !document.contains(container) || document.querySelectorAll('.dr-card').length === 0)) {
      tick();
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  // also poll visible
  setInterval(tick, 1200);
  // initial
  setTimeout(tick, 800);
})();
