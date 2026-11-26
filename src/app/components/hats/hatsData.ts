// Copy, palettes and expressions for the hats, shared by the hero engine,
// the hero tagline and the Work-cell peek. Ported from the reference prototype.
import type { HatId } from './props';

export type WearableId = HatId | 'me';

export interface HatInfo { id: HatId; name: string; hat: string; line: string }

export const HATS: HatInfo[] = [
  { id: 'notes',     name: 'Product designer',   hat: 'sticky notes',     line: '3+ years turning messy hypotheses into small, testable products.' },
  { id: 'party',     name: 'The friend with a plan', hat: 'party hat',    line: '“We should hang out” lasts about five minutes before I put a date on it.' },
  { id: 'helmet',    name: 'Biker',              hat: 'helmet',           line: 'Long rides with friends. Getting outside is the whole point.' },
  { id: 'beret',     name: 'Artist',             hat: 'beret',            line: 'Fine arts at JJ School of Art. I drew everything on this page.' },
  { id: 'propeller', name: 'Motion & animation', hat: 'propeller beanie', line: 'Timing, easing, physics. Tap the propeller and watch it ease out.' },
  { id: 'ninja',     name: 'Anime kid',          hat: 'ninja headband',   line: 'Raised on anime. I know when a reference lands and when it is trying too hard.' },
  { id: 'cat',       name: 'Cat lover',          hat: 'cat',              line: 'All my work is reviewed by a very strict, very furry supervisor.' },
];

/** Orbit order, left → right along the arc. */
export const ORDER: HatId[] = ['cat', 'notes', 'party', 'helmet', 'beret', 'propeller', 'ninja'];

export interface Palette { card: string; halo: string; accent: string }

// Per-hat colour lives only inside the portrait card and the tagline accent.
// Default ("me") is the site's blue, taken from his glasses, rather than the prototype's yellow.
export const PAL: Record<WearableId, Palette> = {
  me:        { card: '#DCE4F5', halo: '#EBF0FA', accent: '#3F63CF' },
  notes:     { card: '#FFE27A', halo: '#FFEDA8', accent: '#A57B00' },
  party:     { card: '#FF9EC7', halo: '#FFC0DB', accent: '#D12C74' },
  helmet:    { card: '#3A3D45', halo: '#4A4E58', accent: '#E8462A' },
  beret:     { card: '#F7B9B9', halo: '#FAD3D3', accent: '#C81E33' },
  propeller: { card: '#9FE8D3', halo: '#C2F1E3', accent: '#0B8467' },
  ninja:     { card: '#F59E5B', halo: '#F8BC8A', accent: '#C4621B' },
  cat:       { card: '#F9C894', halo: '#FCDDB9', accent: '#C0621A' },
};

export interface Face { eyes?: string; mouth?: string; brows?: string; blush?: string }

// Resting expression per hat. Sticky notes: closed happy eyes + soft smile; the
// −12° head tilt is applied by CSS for exactly that combination. The cat lands
// with a surprised "o" (see the engine) and then settles to this content face.
export const FACE: Record<WearableId, Face> = {
  me: {},
  notes: { eyes: 'happy', mouth: 'soft' },
  party: { eyes: 'happy' },
  helmet: {},
  beret: { eyes: 'happy', mouth: 'smile' },
  propeller: {},
  ninja: { brows: 'down', mouth: 'smile' },
  cat: { eyes: 'happy', mouth: 'soft' },
};

export const DEFAULT_TAGLINE_HTML = 'A product designer who works from <em>strategy</em> to pixel.';
