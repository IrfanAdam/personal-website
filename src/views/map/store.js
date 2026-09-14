/* ADAM/PAGE — views/map/store · live mode state (functions · ia) + lookups
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import raw from '../../data/arch-map.json';
import { layoutGroup, reorder, boundsOf } from './geom.js';
import { dataset } from './chunk.js';
// Exports: KINDS, EDGE_KINDS, LINKS, NODES, GROUPS, EDGES, getMode, setMode,
//   byId, groupOf, membersOf, bounds, reorderNode, resetGroup, resetAll
const KEY = 'map:mode';
const MODES = ['functions', 'ia'];
const stored = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
let MODE = MODES.includes(stored()) ? stored() : 'functions';
let cur = dataset(MODE);
export const LINKS = raw.edges;
export const KINDS = raw.kinds;
export const EDGE_KINDS = raw.edgeKinds;
export let NODES = cur.nodes;
export let GROUPS = cur.groups;
export let EDGES = cur.edges;
let BY = new Map();
let GX = new Map();
const reindex = () => {
  BY = new Map(NODES.map((n) => [n.id, n]));
  GX = new Map(GROUPS.map((g) => [g.id, g]));
};
reindex();
// — Lookups + mode —
export const getMode = () => MODE;
export const byId = (id) => BY.get(id) || GX.get(id) || null;
export const groupOf = (n) => GX.get(n.group) || null;
export const membersOf = (g) => NODES.filter((n) => n.group === g.id);
export const bounds = () => boundsOf(GROUPS);
export function setMode(next) {
  if (!MODES.includes(next) || next === MODE) return false;
  MODE = next;
  try { localStorage.setItem(KEY, MODE); } catch {}
  cur = dataset(MODE);
  NODES = cur.nodes;
  GROUPS = cur.groups;
  EDGES = cur.edges;
  reindex();
  return true;
}
// — Layout resets —
export function reorderNode(n, wy) {
  const g = groupOf(n);
  if (g) reorder(n, wy, g, membersOf(g));
}
export const resetGroup = (g) => {
  g.x = g.base.x;
  g.y = g.base.y;
  layoutGroup(g, membersOf(g));
};
export const resetAll = () => GROUPS.forEach(resetGroup);
