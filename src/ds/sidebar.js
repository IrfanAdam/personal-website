/* ADAM/DS — ds/sidebar · sidebar collapse · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function mountSidebar(){
const sideBtn = document.getElementById('ds-side-toggle');
const applySide = (c) => { document.body.classList.toggle('side-collapsed',
    c); localStorage.setItem('adam-ds-side', c ? '1' : '0');
  sideBtn.textContent = c ? '▶' : '◀';
  sideBtn.setAttribute('aria-expanded',
    String(!c)); };
sideBtn.addEventListener('click', () => applySide(!document.body.classList.contains('side-collapsed')));
applySide(localStorage.getItem('adam-ds-side') === '1');
}
