/* ADAM/DS — ds/routes · route table · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { render as changelog, mount as mountChangelog } from './pages-changelog.js';
import { render as overview, mount as mountOverview } from './pages-overview.js';
import { render as foundations, mount as mountFoundations } from './pages-foundations.js';
import { render as components } from './pages-components.js';
import { render as patterns, mount as mountPatterns } from './pages-patterns.js';
import { render as functions, mount as mountFunctions } from './pages-functions.js';
import { render as primitives, mount as mountPrimitives } from './pages-primitives.js';
import { render as library, mount as mountLibrary } from './pages-library.js';
import { render as gridReveal, mount as mountGrid } from './functions/grid-reveal.js';
import { render as shimmer, mount as mountShimmer } from './functions/shimmer.js';
import { render as rise, mount as mountRise } from './functions/rise.js';
import { render as viewer, mount as mountViewer } from './functions/viewer.js';
import { render as glimmer, mount as mountGlimmer } from './functions/glimmer-orb.js';
import { render as glitch, mount as mountGlitch } from './functions/glitch.js';
import { render as scramble, mount as mountScramble } from './functions/scramble.js';
import { render as atlas, mount as mountAtlas } from './pages-atlas.js';
export const routes = [
  { hash: '#/changelog', label: 'Changelog', group: 'Start', render: changelog, mount: mountChangelog },
  { hash: '#/', label: 'Overview', group: 'Start', render: overview, mount: mountOverview },
  { hash: '#/foundations',
    label: 'Foundations · Tokens',
    group: 'Start',
    render: foundations,
    mount: mountFoundations },
  { hash: '#/atlas', label: 'Atlas', group: 'Start', render: atlas, mount: mountAtlas },
  { hash: '#/primitives', label: 'Primitives', group: 'Components', render: primitives, mount: mountPrimitives },
  { hash: '#/library', label: 'Library · Landing', group: 'Components', render: library, mount: mountLibrary },
  { hash: '#/components', label: 'Components', group: 'Components', render: components },
  { hash: '#/patterns', label: 'Patterns · Quality', group: 'Components', render: patterns, mount: mountPatterns },
  { hash: '#/functions', label: 'Functions', group: 'Functions', render: functions, mount: mountFunctions },
  { hash: '#/functions/grid-reveal', label: 'GridReveal', group: 'Functions', render: gridReveal, mount: mountGrid },
  { hash: '#/functions/shimmer', label: 'Shimmer', group: 'Functions', render: shimmer, mount: mountShimmer },
  { hash: '#/functions/rise', label: 'Rise', group: 'Functions', render: rise, mount: mountRise },
  { hash: '#/functions/viewer', label: 'Viewer', group: 'Functions', render: viewer, mount: mountViewer },
  { hash: '#/functions/glimmer-orb', label: 'Glimmer orb', group: 'Functions', render: glimmer, mount: mountGlimmer },
  { hash: '#/functions/glitch', label: 'Glitch', group: 'Functions', render: glitch, mount: mountGlitch },
  { hash: '#/functions/scramble', label: 'Scramble', group: 'Functions', render: scramble, mount: mountScramble },
];
