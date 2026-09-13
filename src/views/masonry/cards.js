/* ADAM/PAGE — views/masonry/cards · cards · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: card(), row() — pure markup for grid + list
export function card(p) {
  const [slug, title, a, b, date, , , , img, , , w = 3, h = 4, mock] = p;
  const tags = [a, b].filter(Boolean).map((c) => `<i>${c}</i>`).join('');
  return `<a class="card" href="#/projects/${slug}" data-mock="${mock || img}">`
    + `<span class="img" style="aspect-ratio:${w}/${h}">`
    + `<canvas class="gr" aria-hidden="true"></canvas>`
    + `<img loading="lazy" decoding="async" width="${w}" height="${h}" src="${img}" alt="${title}" /></span>`
    + `<span class="tags">${tags}</span>`
    + `<span class="scrim" aria-hidden="true"></span>`
    + `<span class="card-info"><b>${title}</b><small>${slug} · ${date}</small></span></a>`;
}
export function row(p) {
  const [slug, title, a, b, date] = p;
  const cats = [a, b].filter(Boolean).join(' · ');
  return `<a class="work" href="#/projects/${slug}"><span class="work-title">${title}</span>`
    + `<span class="work-meta">${cats ? cats + ' · ' : ''}${slug} · ${date}</span></a>`;
}
