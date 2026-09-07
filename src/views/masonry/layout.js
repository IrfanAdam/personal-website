// Shortest-column distributor: each item joins the lowest-fill column.
// heights[] are width-invariant relative estimates (aspect + text block).
// Returns buckets of item indices, one array per column.
export function distribute(n, heights) {
  const totals = new Array(n).fill(0);
  const cols = Array.from({ length: n }, () => []);
  heights.forEach((h, i) => {
    let c = 0;
    for (let k = 1; k < n; k++) if (totals[k] < totals[c]) c = k;
    cols[c].push(i);
    totals[c] += h;
  });
  return cols;
}
