/* ADAM/TOOL — public/admin/decap-reorder-panel · own-DOM arrange sheet */
// Exports: DrPanel.open, DrPanel.close
(() => {
  let root = null;
  let list = null;
  let statusEl = null;

  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const items = () => (window.DrReorder ? window.DrReorder.items() : []);
  const setStatus = (t) => { if (statusEl) statusEl.textContent = t; };
  const order = () => (list ? [...list.querySelectorAll('.pr-row')].map((n) => n.dataset.slug) : []);

  function renumber() {
    if (!list) return;
    [...list.querySelectorAll('.pr-row')].forEach((n, i) => {
      const b = n.querySelector('.dr-badge');
      if (b) b.textContent = String(i + 1);
    });
    const sub = root.querySelector('.pr-sub');
    if (sub) sub.textContent = `${order().length} projects · drop to move · autosaves`;
  }

  async function dropped() {
    renumber();
    const o = order();
    if (window.DrReorder) window.DrReorder.syncList(o);
    setStatus('Saving…');
    if (window.DrReorder) await window.DrReorder.save(o);
    setStatus('');
  }

  function step(el, d) {
    const sib = d < 0 ? el.previousElementSibling : el.nextElementSibling;
    if (!sib || !sib.classList.contains('pr-row')) return;
    if (d < 0) list.insertBefore(el, sib);
    else list.insertBefore(sib, el);
    dropped();
  }

  function after(y) {
    const els = [...list.querySelectorAll('.pr-row:not(.dragging)')];
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
        el.classList.add('dragging');
      }
      const a = after(ev.clientY);
      if (a == null) list.appendChild(el);
      else if (a !== el) list.insertBefore(el, a);
      renumber();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!live) return;
      el.classList.remove('dragging');
      dropped();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function row(p, i) {
    const el = document.createElement('div');
    el.className = 'pr-row';
    el.dataset.slug = p.slug;
    el.innerHTML = `<span class="pr-grip" aria-hidden="true">⋮⋮</span>`
      + `<img class="pr-thumb" alt="" loading="lazy" draggable="false" src="${p.image || ''}">`
      + `<span class="pr-title">${esc(p.title)}</span>`
      + `<span class="pr-mv"><button type="button" data-up="1" title="Move up">▲</button>`
      + `<button type="button" data-down="1" title="Move down">▼</button></span>`
      + `<span class="dr-badge">${i + 1}</span>`;
    el.querySelector('[data-up]').addEventListener('click', () => step(el, -1));
    el.querySelector('[data-down]').addEventListener('click', () => step(el, 1));
    el.querySelector('.pr-grip').addEventListener('pointerdown', (e) => onDown(e, el));
    el.addEventListener('dragstart', (e) => e.preventDefault());
    return el;
  }

  function build() {
    root = document.createElement('div');
    root.className = 'pr-wrap';
    root.hidden = true;
    root.innerHTML = `<div class="pr-back"></div>`
      + `<div class="pr-sheet" role="dialog" aria-label="Reorder projects">`
      + `<div class="pr-head"><strong>Reorder projects</strong><span class="pr-sub"></span>`
      + `<span class="spacer"></span><button class="dr-btn" type="button" data-close>Done</button></div>`
      + `<div class="pr-list"></div>`
      + `<div class="pr-foot"><span class="pr-status"></span></div></div>`;
    document.body.appendChild(root);
    list = root.querySelector('.pr-list');
    statusEl = root.querySelector('.pr-status');
    root.querySelector('[data-close]').addEventListener('click', close);
    root.querySelector('.pr-back').addEventListener('click', close);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root && !root.hidden) close();
    });
  }

  function open() {
    if (!root) build();
    const ps = items();
    if (!ps.length) return;
    list.innerHTML = '';
    ps.forEach((p, i) => list.appendChild(row(p, i)));
    renumber();
    setStatus('');
    root.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!root) return;
    root.hidden = true;
    document.body.style.overflow = '';
  }

  window.DrPanel = { open, close };
})();
