/* ADAM/DS — ds/routes · route table · [plan:2026-09-24_150000-sound-to-foundations.md#phase-1] */
import { render as changelog, mount as mountChangelog } from './pages-changelog.js';
import { render as overview, mount as mountOverview } from './pages-overview.js';
import { render as foundations, mount as mountFoundations } from './pages-foundations.js';
import { render as patterns, mount as mountPatterns } from './pages-patterns.js';
import { render as primitives, mount as mountPrimitives } from './pages-primitives.js';
import { render as library, mount as mountLibrary } from './pages-library.js';
import { render as special, mount as mountSpecial } from './pages-special.js';
import { render as atlas, mount as mountAtlas } from './pages-atlas.js';
export const routes = [
  { hash: '#/', label: 'Overview', group: 'Start', render: overview, mount: mountOverview },
  { hash: '#/foundations', label: 'Foundations', group: 'Start', render: foundations, mount: mountFoundations },
  { hash: '#/atlas', label: 'Atlas', group: 'Start', render: atlas, mount: mountAtlas },
  { hash: '#/primitives', label: 'Primitives', group: 'Elements', render: primitives, mount: mountPrimitives },
  { hash: '#/library', label: 'Library', group: 'Elements', render: library, mount: mountLibrary },
  { hash: '#/special', label: 'Special', group: 'Elements', render: special, mount: mountSpecial },
  { hash: '#/patterns', label: 'Patterns', group: 'Elements', render: patterns, mount: mountPatterns },
  { hash: '#/changelog', label: 'Changelog', group: '', render: changelog, mount: mountChangelog },
];
