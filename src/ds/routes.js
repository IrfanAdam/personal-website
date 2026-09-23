/* ADAM/DS — ds/routes · route table · [plan:2026-09-23_174000-motion-elements-vertical.md#phase-7] */
import { render as changelog, mount as mountChangelog } from './pages-changelog.js';
import { render as overview, mount as mountOverview } from './pages-overview.js';
import { render as foundations, mount as mountFoundations } from './pages-foundations.js';
import { render as patterns, mount as mountPatterns } from './pages-patterns.js';
import { render as primitives, mount as mountPrimitives } from './pages-primitives.js';
import { render as library, mount as mountLibrary } from './pages-library.js';
import { render as sound, mount as mountSound } from './pages-sound.js';
import { render as special, mount as mountSpecial } from './pages-special.js';
import { render as atlas, mount as mountAtlas } from './pages-atlas.js';
export const routes = [
  { hash: '#/changelog', label: 'Changelog', group: '', render: changelog, mount: mountChangelog },
  { hash: '#/', label: 'Overview', group: 'Start', render: overview, mount: mountOverview },
  { hash: '#/foundations', label: 'Foundations', group: 'Start', render: foundations, mount: mountFoundations },
  { hash: '#/atlas', label: 'Atlas', group: 'Start', render: atlas, mount: mountAtlas },
  { hash: '#/primitives', label: 'Primitives', group: 'Elements', render: primitives, mount: mountPrimitives },
  { hash: '#/library', label: 'Library', group: 'Elements', render: library, mount: mountLibrary },
  { hash: '#/patterns', label: 'Patterns', group: 'Elements', render: patterns, mount: mountPatterns },
  { hash: '#/sound', label: 'Sound', group: 'Elements', render: sound, mount: mountSound },
  { hash: '#/special', label: 'Special', group: 'Special', render: special, mount: mountSpecial },
];
