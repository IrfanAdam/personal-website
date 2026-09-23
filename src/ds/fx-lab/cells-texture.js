/* ADAM/DS — fx-lab/cells-texture · texture sampling + image load ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-1] */
// Exports: makeTexture — image→measureTree sampling; hooks back into lab rebuild/draw/play
import { measureTree } from '../../views/masonry/cells.js';
import { SAMPLE } from './color.js';

const imgMap = { helix: '/images/helix.png', fluxx: '/images/fluxx.jpg', 'tas-35': '/images/tas-35.jpg' };

export function makeTexture(hooks) {
  let texImg = null, hasTex = false;
  const sampleTex = () => {
    const root = hooks.getRoot();
    if (!texImg || !texImg.complete || !texImg.naturalWidth || !root) return;
    const c = document.createElement('canvas'); c.width = SAMPLE; c.height = SAMPLE;
    const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return;
    const sc = Math.max(SAMPLE / texImg.naturalWidth, SAMPLE / texImg.naturalHeight);
    x.drawImage(texImg,
      (SAMPLE - texImg.naturalWidth * sc) / 2,
      (SAMPLE - texImg.naturalHeight * sc) / 2,
      texImg.naturalWidth * sc,
      texImg.naturalHeight * sc);
    try { measureTree(root, x.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE); hasTex = true; } catch {}
  };
  const clear = () => { hasTex = false; };
  const loadImage = (key) => {
    hasTex = false; texImg = null;
    const src = imgMap[key];
    if (!src) { hooks.rebuild(); hooks.draw(); return; }
    const im = new Image(); im.crossOrigin = 'anonymous'; im.src = src;
    im.onload = () => { texImg = im; hasTex = false; hooks.rebuild(); hooks.draw();
      if (hooks.onTextureReady) hooks.onTextureReady(); else if (hooks.playing()) hooks.play(); };
    im.onerror = () => { texImg = null; hasTex = false; hooks.rebuild(); hooks.draw(); };
  };
  return {
    get img() { return texImg; },
    get has() { return hasTex; },
    sampleTex,
    clear,
    loadImage,
  };
}
