import { Home } from './views/home.js';
import { Masonry, mountMasonry, setCols } from './views/masonry.js';
import { Project } from './views/project.js';
import { Contact } from './views/contact.js';
const root = document.getElementById('app');
const colBtns = [...document.querySelectorAll('[data-cols]')];
colBtns.forEach((b) => b.addEventListener('click', () => {
  colBtns.forEach((x) => x.classList.remove('on'));
  b.classList.add('on');
  setCols(Number(b.dataset.cols));
}));
function route() {
  const h = location.hash || '#/';
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-nav]').forEach((a) =>
    a.classList.toggle('on', h.startsWith(a.dataset.nav)));
  if (h.startsWith('#/projects/')) root.innerHTML = Project(h.split('/')[2]);
  else if (h.startsWith('#/masonry')) { root.innerHTML = Masonry(); mountMasonry(root); }
  else if (h.startsWith('#/contact')) root.innerHTML = Contact();
  else root.innerHTML = Home();
}
window.addEventListener('hashchange', route);
if (!location.hash) location.hash = '#/masonry';
route();
