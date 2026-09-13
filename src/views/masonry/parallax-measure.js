/* ADAM/PAGE — parallax-measure · deficits + image gate · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: measureDeficits, gateOnImages — pure measure helpers

// — Measure —
export function measureDeficits(cols) {
  const hs = cols.map((c) => c.getBoundingClientRect().height);
  const tallest = Math.max(...hs);
  return hs.map((h) => Math.max(0, tallest - h));
}

// — Gate: wait for images, then measure —
export function gateOnImages(grid, measure) {
  const imgs = [...grid.querySelectorAll('img')];
  let pending = imgs.length;
  const afterImages = () => {
    if (pending <= 0) measure();
  };
  if (pending === 0) {
    requestAnimationFrame(measure);
    return;
  }
  imgs.forEach((img) => {
    if (img.complete) pending--;
    else {
      img.addEventListener('load', () => { pending--; afterImages(); }, { once: true });
      img.addEventListener('error', () => { pending--; afterImages(); }, { once: true });
    }
  });
  requestAnimationFrame(measure);
  if (pending <= 0) measure();
}
