// One selection frame glides across every header tab — the list/grid
// switcher and the project thumbs share the same row and animation.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAD = 0;

function glide(frame, target) {
  if (!frame) return;
  if (!target) {
    frame.style.opacity = '0';
    return;
  }
  frame.style.opacity = '1';
  frame.style.transform = `translate(${target.offsetLeft - PAD}px, ${target.offsetTop - PAD}px)`;
  frame.style.width = `${target.offsetWidth + PAD * 2}px`;
  frame.style.height = `${target.offsetHeight + PAD * 2}px`;
}

export function syncHeaderFrames() {
  const strip = document.getElementById('strip');
  const active = strip
    ? strip.querySelector(':scope > a.on') ?? strip.querySelector(':scope > .vtab.on')
    : null;
  glide(document.getElementById('tabframe'), active);
}

export function centerActiveThumb() {
  const strip = document.getElementById('strip');
  const active = strip
    ? strip.querySelector(':scope > a.on') ?? strip.querySelector(':scope > .vtab.on')
    : null;
  if (!strip || !active) return;
  const left = active.offsetLeft - 8;
  const right = active.offsetLeft + active.offsetWidth + 8;
  if (left < strip.scrollLeft || right > strip.scrollLeft + strip.clientWidth) {
    strip.scrollTo({
      left: left - strip.clientWidth / 2 + active.offsetWidth / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }
}
