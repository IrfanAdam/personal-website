/* ADAM/DS — ds/foundations/sound/usage · usage guide markup ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: usageHtml
// — Markup —
import { note, code } from '../../specimens.js';

export function usageHtml() {
  return [
    `<h3>Usage — how to play</h3>`,
    `<p class="sub">Two paths share the same mute gate (`,
    `<span class="tok">adam-sound</span> + <span class="tok">prefers-reduced-motion</span>). ` +
      `Always guard with <span class="tok">isMuted()</span> before playing.</p>`,
  ].join('')
    + code([
      `// procedural — gesture-free (recommended)
`,
      `import { playVoice } from '@/views/element-sound.js';
`,
      `import { isMuted } from '@/views/audio-ctx.js';
`,
      `if (!isMuted()) await playVoice('blip', { ms: 140, gain: 0.6, freq: 880 });
`,
      `// ms 40–900 · gain 0–1 · freq 200–3400 (tick/blip only)
`,
      `// voices: tick, static, blip, chime, hum, data, scanner, zap, zapscan`,
    ].join(''))
    + code([
      `// file — vendored + remote fallback
`,
      `import { playFileId } from '@/views/element-sound.js';
`,
      `if (!isMuted()) await playFileId('load.wav', 0.8);
`,
      `// add: public/sounds/foo.wav → FILES in sound-files.js {id, url, remote, desc}`,
    ].join(''))
    + code([
      `// raw WebAudio — only if you own a context + gesture
`,
      `import { synth } from '@/views/sound-palette.js';
`,
      `import { getCtx, getNoise } from '@/views/audio-ctx.js';
`,
      `const ctx = getCtx(); // null until gesture
`,
      `synth(ctx, getNoise(), 'hum', 0.5, { ms: 320 });`,
    ].join(''))
    + code([
      `// attr — declarative glitch hits
`,
      `<button data-glitch-sound="5000-9000 hum">hover me</button>
`,
      `<button data-glitch-sound="static,blip">pool rotates per hit</button>`,
    ].join(''))
    + note('Do', [
      `Use <span class="tok">playVoice</span>/<span class="tok">playFileId</span> (` +
        `<span class="tok">element-sound</span>) — offline → ` +
        `<span class="tok">&lt;audio&gt;</span> plays without a live ` +
        `<span class="tok">AudioContext</span> and survives silent Safari.`,
    ].join(''))
    + note('Don’t', [
      `No autoplay on load. Don&apos;t bypass <span class="tok">isMuted()</span>. ` +
        `No base64 inline — add files to <span class="tok">public/sounds</span> + ` +
        `<span class="tok">FILES</span>. Raw <span class="tok">synth()</span> only on canvases ` +
        `that already gate on gesture.`,
    ].join(''), 'dont')
    + [
      `<h3>Contract — when sound plays</h3>`,
      `<p class="sub">Defaults <b>on</b> (<span class="tok">localStorage adam-sound</span>). ` +
        `Header <span class="tok">.snd-pill</span> + <span class="tok">.ds-controls</span> share the ` +
        `flag. <span class="tok">prefers-reduced-motion: reduce</span> forces mute.</p>`,
    ].join('');
}
