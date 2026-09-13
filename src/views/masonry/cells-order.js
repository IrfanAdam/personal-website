/* ADAM/PAGE — cells-order · split-order policies · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: orderByDetail, orderRandom — same slots, different pick order
// Hierarchy holds: kids queue only after parent is eligible.

// — Detail-first —
export function orderByDetail(branches, at) {
  const pending = branches.filter((c) => c.splitAt > at);
  if (pending.length < 2) return;
  const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
  const queue = pending.filter((c) => !c.parent || c.parent.splitAt <= at);
  let next = 0;
  while (queue.length && next < slots.length) {
    let pick = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].detail > queue[pick].detail) pick = i;
    }
    const c = queue.splice(pick, 1)[0];
    c.splitAt = slots[next++];
    for (const k of c.kids ?? []) {
      if (k.kids) queue.push(k);
    }
  }
}

// — Random —
export function orderRandom(branches, at) {
  const pending = branches.filter((c) => c.splitAt > at);
  if (pending.length < 2) return;
  const slots = pending.map((c) => c.splitAt).sort((a, b) => a - b);
  const queue = pending.filter((c) => !c.parent || c.parent.splitAt <= at);
  let next = 0;
  while (queue.length && next < slots.length) {
    const c = queue.splice((Math.random() * queue.length) | 0, 1)[0];
    c.splitAt = slots[next++];
    for (const k of c.kids ?? []) {
      if (k.kids) queue.push(k);
    }
  }
}
