/* ADAM/SHARED — views/promo-video-icons · SVG icons · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: IC_PLAY, IC_PAUSE, IC_SOUND, IC_MUTE, IC_FS
const svg = (inner, size = 14) => '<svg viewBox="0 0 24 24" aria-hidden="true"'
  + ` width="${size}" height="${size}">${inner}</svg>`;
export const IC_PLAY = svg('<path fill="currentColor" d="M8 5.14v14l11-7z"/>', 18);
export const IC_PAUSE = svg('<path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/>', 18);
export const IC_SOUND = svg('<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/>'
  + '<path fill="currentColor" d="M16.5 12a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z" opacity=".9"/>');
export const IC_MUTE = svg('<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/>'
  + '<path stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M16 9l4 6M20 9l-4 6"/>');
export const IC_FS = svg('<path fill="none" stroke="currentColor" stroke-width="1.6"'
  + ' d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>');
