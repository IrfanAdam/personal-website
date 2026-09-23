/* ADAM/DS — ds/routes · route table · [plan:2026-09-23_174000-motion-elements-vertical.md#phase-2] */
import { render as changelog, mount as mountChangelog } from './pages-changelog.js';
import { render as overview, mount as mountOverview } from './pages-overview.js';
import { render as foundations, mount as mountFoundations } from './pages-foundations.js';
import { render as patterns, mount as mountPatterns } from './pages-patterns.js';
import { render as primitives, mount as mountPrimitives } from './pages-primitives.js';
import { render as library, mount as mountLibrary } from './pages-library.js';
import { render as motion, mount as mountMotion } from './pages-motion.js';
import { render as sound, mount as mountSound } from './pages-sound.js';
import { render as functions, mount as mountFunctions } from './pages-functions.js';
import { render as gridReveal, mount as mountGrid } from './functions/grid-reveal.js';
import { render as shimmer, mount as mountShimmer } from './functions/shimmer.js';
import { render as rise, mount as mountRise } from './functions/rise.js';
import { render as viewer, mount as mountViewer } from './functions/viewer.js';
import { render as glimmer, mount as mountGlimmer } from './functions/glimmer-orb.js';
import { render as glitch, mount as mountGlitch } from './functions/glitch.js';
import { render as scramble, mount as mountScramble } from './functions/scramble.js';
import { render as atlas, mount as mountAtlas } from './pages-atlas.js';
export const routes = [
  { hash: '#/changelog', label: 'Changelog', group: '', render: changelog, mount: mountChangelog },
  { hash: '#/', label: 'Overview', group: 'Start', render: overview, mount: mountOverview },
  { hash: '#/foundations', label: 'Foundations', group: 'Start', render: foundations, mount: mountFoundations },
  { hash: '#/atlas', label: 'Atlas', group: 'Start', render: atlas, mount: mountAtlas },
  { hash: '#/primitives', label: 'Primitives', group: 'Elements', render: primitives, mount: mountPrimitives },
  { hash: '#/library', label: 'Library', group: 'Elements', render: library, mount: mountLibrary },
  { hash: '#/patterns', label: 'Patterns', group: 'Elements', render: patterns, mount: mountPatterns },
  { hash: '#/motion', label: 'Motion', group: 'Elements', render: motion, mount: mountMotion },
  { hash: '#/sound', label: 'Sound', group: 'Elements', render: sound, mount: mountSound },
  { hash: '#/functions', label: 'Motion', group: 'Motion', render: functions, mount: mountFunctions },
  { hash: '#/functions/grid-reveal', label: 'GridReveal', group: 'Motion', render: gridReveal, mount: mountGrid },
  { hash: '#/functions/shimmer', label: 'Shimmer', group: 'Motion', render: shimmer, mount: mountShimmer },
  { hash: '#/functions/rise', label: 'Rise', group: 'Motion', render: rise, mount: mountRise },
  { hash: '#/functions/viewer', label: 'Viewer', group: 'Motion', render: viewer, mount: mountViewer },
  { hash: '#/functions/glimmer-orb', label: 'Glimmer orb', group: 'Motion', render: glimmer, mount: mountGlimmer },
  { hash: '#/functions/glitch', label: 'Glitch', group: 'Motion', render: glitch, mount: mountGlitch },
  { hash: '#/functions/scramble', label: 'Scramble', group: 'Motion', render: scramble, mount: mountScramble },
];
