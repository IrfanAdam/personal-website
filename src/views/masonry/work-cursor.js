/* ADAM/PAGE — views/masonry/work-cursor · tiny open hint at cursor ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: attachWorkCursor — cursor-follow “Open ↗” on .work rows, top-left at mouse
export function attachWorkCursor(grid) {
  if (matchMedia('(hover: none)').matches) return () => {};
  const rows = [...grid.querySelectorAll('.work')];
  if (!rows.length) return () => {};
  const el = document.createElement('div');
  el.className = 'work-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span>Open</span><span aria-hidden="true">↗</span>';
  document.body.appendChild(el);
  let raf = 0;
  let x = 0;
  let y = 0;
  let on = false;
  const PAD = 12;
// — Visibility —
  const show = () => {
    if (on) return;
    on = true;
    el.classList.add('on');
    document.documentElement.classList.add('work-cursor-active');
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const hide = () => {
    if (!on) return;
    on = false;
    el.classList.remove('on');
    document.documentElement.classList.remove('work-cursor-active');
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  };
// — Position —
  const tick = () => {
    raf = 0;
    if (!on) return;
    const hr = el.getBoundingClientRect();
    let nx = x;
    let ny = y;
    if (nx + hr.width > innerWidth - PAD) nx = innerWidth - PAD - hr.width;
    if (nx < PAD) nx = PAD;
    if (ny + hr.height > innerHeight - PAD) ny = innerHeight - PAD - hr.height;
    if (ny < PAD) ny = PAD;
    el.style.transform = `translate3d(${nx}px,${ny}px,0)`;
  };
  const aim = (cx, cy) => {
    x = cx;
    y = cy;
    if (!on) return;
    if (!raf) raf = requestAnimationFrame(tick);
  };
// — Events —
  const onEnter = (e) => {
    aim(e.clientX, e.clientY);
    show();
  };
  const onMove = (e) => {
    aim(e.clientX, e.clientY);
    if (!on) show();
  };
  const onGridMove = (e) => {
    if (!on) return;
    aim(e.clientX, e.clientY);
  };
  rows.forEach((r) => {
    r.addEventListener('mouseenter', onEnter);
    r.addEventListener('mousemove', onMove);
    r.addEventListener('mouseleave', hide);
  });
  grid.addEventListener('mousemove', onGridMove);
  grid.addEventListener('mouseleave', hide);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    document.documentElement.classList.remove('work-cursor-active');
    grid.removeEventListener('mousemove', onGridMove);
    grid.removeEventListener('mouseleave', hide);
    rows.forEach((r) => {
      r.removeEventListener('mouseenter', onEnter);
      r.removeEventListener('mousemove', onMove);
      r.removeEventListener('mouseleave', hide);
    });
    el.remove();
  };
}
