/* ADAM/TOOL — public/admin/reorder.js · drag reorder + save */
const list = document.getElementById('list');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const statusEl = document.getElementById('status');

let initial = [];
let dragEl = null;

const setStatus = (t, ms = 0) => {
  statusEl.textContent = t;
  if (ms) setTimeout(() => { if (statusEl.textContent === t) statusEl.textContent = ''; }, ms);
};

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const currentOrder = () => [...list.querySelectorAll('.item')].map((li) => li.dataset.slug);
const renumber = () => {
  [...list.querySelectorAll('.item')].forEach((li, i) => {
    li.querySelector('.badge').textContent = String(i + 1);
  });
};
const dirty = () => !same(initial, currentOrder());
const sync = () => { saveBtn.disabled = !dirty(); };

function getAfter(y) {
  const els = [...list.querySelectorAll('.item:not(.dragging)')];
  let closest = { off: Number.NEGATIVE_INFINITY, el: null };
  for (const el of els) {
    const box = el.getBoundingClientRect();
    const off = y - box.top - box.height / 2;
    if (off < 0 && off > closest.off) closest = { off, el };
  }
  return closest.el;
}

function render(items) {
  list.innerHTML = '';
  for (const p of items) {
    const li = document.createElement('li');
    li.className = 'item';
    li.draggable = true;
    li.dataset.slug = p.slug;
    const img = p.image || '';
    li.innerHTML = `<span class="grip" aria-hidden="true">⋮⋮</span>`
      + `<img class="thumb" alt="" loading="lazy" src="${img}">`
      + `<span class="meta"><strong>${p.title}</strong><span>${p.slug} · ${p.tag}</span></span>`
      + `<span class="badge">${p.order}</span>`;
    list.appendChild(li);
  }
  renumber();
}

async function load() {
  setStatus('Loading…');
  const r = await fetch('/__admin/projects');
  if (!r.ok) throw new Error(`GET failed ${r.status}`);
  const items = await r.json();
  initial = items.map((p) => p.slug);
  render(items);
  sync();
  setStatus('');
}

list.addEventListener('dragstart', (e) => {
  const li = e.target.closest('.item');
  if (!li) return;
  dragEl = li;
  li.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', li.dataset.slug);
});

list.addEventListener('dragend', () => {
  if (dragEl) dragEl.classList.remove('dragging');
  dragEl = null;
  list.querySelectorAll('.drag-over').forEach((n) => n.classList.remove('drag-over'));
  renumber();
  sync();
});

list.addEventListener('dragover', (e) => {
  e.preventDefault();
  const after = getAfter(e.clientY);
  if (!dragEl) return;
  if (after == null) list.appendChild(dragEl);
  else list.insertBefore(dragEl, after);
  list.querySelectorAll('.item').forEach((n) => n.classList.remove('drag-over'));
  if (after) after.classList.add('drag-over');
});

saveBtn.addEventListener('click', async () => {
  const order = currentOrder();
  saveBtn.disabled = true;
  setStatus('Saving…');
  try {
    const r = await fetch('/__admin/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || `save ${r.status}`);
    initial = [...order];
    sync();
    setStatus('Saved ✓', 2500);
  } catch (e) {
    setStatus(String(e).slice(0, 120));
    saveBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  const map = new Map([...list.querySelectorAll('.item')].map((li) => [li.dataset.slug, li]));
  list.innerHTML = '';
  for (const slug of initial) {
    const el = map.get(slug);
    if (el) list.appendChild(el);
  }
  renumber();
  sync();
  setStatus('Reset', 1500);
});

load().catch((e) => setStatus(String(e)));
