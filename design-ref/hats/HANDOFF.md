# Hats Hero — build brief for the Portfolio repo

Paste this whole file into Claude Code in the Portfolio repo, with the three reference files from this folder copied into `design-ref/hats/` at the repo root.

## Goal

Replace the polaroid in the Home grid's **Hero cell** with the interactive "I wear a lot of hats" portrait, and add a **peek** gag to the **Work cell**. The visuals and behaviour already exist as a working vanilla prototype. Port them faithfully into this React/Vite/Tailwind app. Do not redesign them.

## Reference files (source of truth)

- `design-ref/hats/hats-hero-reference.html`: the complete working prototype. Open it in a browser first and play with it. Everything below is already implemented there. Port it; don't reinvent it.
- `design-ref/hats/shivam.svg`: the layered vector portrait (viewBox 0 0 800 1000). Named groups: `bg`, `bodywrap`, `headwrap`, `head`, `hair`, `hair-under`, `sideburns`, `ears`, `face`, `blush`, `nose`, `mouth` (variants `m-grin`, `m-o`, `m-small`, `m-smile`, `m-flat`, `m-tongue`, `m-soft`, `m-hmm`, `m-laugh`), `brow-l`, `brow-r`, `eye-l`, `eye-r` (`.pupil`, `.e-happy`, `.e-squint`, `.e-closed`), `glasses`, `shake`.
- `design-ref/hats/props.js`: the seven hats as SVG-string factories (`PROPS[id].svg(icon)`, `PROPS[id].vb`), plus `PBLADES(theta, speed)` for the propeller.

## Current code to know (Home.tsx)

- 3×3 grid in `GRID`: Gallery / **Work** / Fun, About / **Hero** / Contact, Interests / Resume / Stack. Home is `HOME_POS {row:1,col:1}`.
- `WorldCells` renders a 5×5 set of cells for the wraparound. The hero appears **only once**, so the SVG ids are safe. Do not render the hero inside clone cells.
- Navigation: pointer drag on the world container (`onPointerDown/Up`, `DRAG_THRESHOLD`), the global `wheel` handler, global arrow keys, Compass and EdgeIndicators. `overviewProgress` (0 to 1) drives the pinch/zoom-out overview. `runIntro` plays a first-visit intro that ends by zooming into Home.
- `HeroCell` currently holds a polaroid with a stock Unsplash photo, the name block, and 2 project cards that duplicate the Work cell directly above it.

## What to build

### 1. Components (`src/app/components/hats/`)
- `portrait.ts`: export the SVG markup from `shivam.svg` as a string. Add `id="bgrect"` and `id="bghalo"` to the two bg shapes, and an empty `<g id="props"></g>` as the last child of `#head` (see the reference).
- `props.ts`: a typed port of `props.js` (`PROPS`, `PBLADES`).
- `hatsEngine.ts`: a port of the reference `<script>`, **scoped to a root element**. Replace every `document.getElementById` and global query with `root.querySelector`. API: `createHatsEngine(root, { reducedMotion }) → { setActive(on: boolean), setOverview(p: number), currentHat(): string, onHatChange(cb), destroy() }`. It keeps all of: the orbit with spring physics and drag-to-wear with the magnetic head zone and ring; tap or Enter to wear; evenly re-spacing the remaining hats when one is worn; per-hat card palette, tagline, expression, entrance burst, pop cards and the visor sequence; the propeller physics with onion-skin ghosts; and every face poke (eyes → glasses up/down/fall off, nose boop, tongue, blush, ear wiggle, hair sway, tickle shake, background surprise), with cursor-following pupils.
- `HatsHero.tsx`: renders the stage (the portrait SVG via `dangerouslySetInnerHTML` plus the hat buttons), creates the engine in `useEffect`, destroys it on unmount, and forwards the props `isActive` and `overviewProgress`.

**Drop entirely:** the phone 70/30 "Selected Work" panel, its drag or touch logic, and its hands. The grid already owns vertical swipes.

### 2. Hero cell layout
Replace `HeroCell` with:
- **Stage:** the portrait card with the hat orbit, as large as the cell's safe area allows (mind the existing padding `pt-8 pl-9 pr-14 pb-14 md:…`).
- **Text:** "Hey, I am" / **Shivam** (keep the existing name animation and hover letter-spacing) / the tagline, which changes per hat. Default tagline: "A product designer who works from *strategy* to pixel. I wear a lot of hats."
- **A small "Work ↑" nudge** that navigates to the Work cell through the existing navigation function. Pass a callback prop down, and don't duplicate the nav logic.
- **Remove** the two project cards and the Unsplash image.
- **Layout per breakpoint:** on phones, the text goes above the stage. From `md` up, the stage goes above the text, centred like the reference at 820px and 1440px.

### 3. Gestures: the grid wins, hats win only on hats
- **Hat buttons:** keep `pointerdown` with `stopPropagation()` and `setPointerCapture`, so dragging a hat never triggers cell navigation. Set `touch-action: none` on the hats only.
- **Face taps** are pokes. A swipe that starts on the face must still navigate the grid. Do not `preventDefault` or stop propagation on the SVG.
- **No hero listeners** on `wheel`, `keydown` arrows or `touchmove`. Hat activation via Enter/Space on a focused hat button is fine.
- **Two-finger touches** (pinch) must never trigger a poke. Ignore the pointerdown when `e.isPrimary` is false.

### 4. Active, paused and overview states
- **Active state:** `isActive = physPos is Hero && overviewProgress === 0 && intro finished && not mid-navigation`.
- **When inactive:** stop the rAF loop and add a `.paused` class that sets `animation-play-state: paused` on all hero CSS animations.
- **In overview (`overviewProgress > 0`):** fade out and hide the orbiting hats, and keep the portrait static, wearing the current hat. Optional: one small "wave", a 300ms happy face, when the overview fully opens.
- **Intro choreography:** when the intro's final zoom into Home lands, the hats fly in from off-screen to their orbit slots, staggered by 60ms.

### 5. Peek in the Work cell
- **New component `WorkPeek`,** absolutely positioned at the bottom centre of `WorkCell`, above the cards.
- **What it shows:** the same portrait, cropped so everything above the glasses' lower edge shows (viewBox y ≈ 0–494), with the **current hat** on. Share the current hat through a tiny context or store fed by `onHatChange`. Two hands grip the cell's bottom edge; reuse the hand SVG and the palm-then-fingers-fold animation from the reference.
- **Behaviour on arrival in Work (from Hero):** rise from the bottom edge (spring) → palms pop up → fingers fold over the edge in a stagger. Eyes look up toward the cards, blinking continues, and fingers drum every ~6s.
- **If a nav-progress value is available,** scrub this timeline with it. Otherwise, play it as a ~700ms timeline after arrival.
- **Tapping the peeking head** navigates back to Hero. Leaving Work resets the peek.
- **Hidden in overview,** and fully static with reduced motion.

### 6. Visual and colour
- **The page background never changes.** Per-hat colour lives only inside the portrait card (`#bgrect` / `#bghalo`) and the tagline accent (CSS var).
- **Default card colour:** change the yellow (`#F4CD55` / `#F7D97A`) to a soft sage that sits with the site: `#DCE5D2` / `#E8EEE1`. Keep the per-hat palettes from the reference.
- **Dark mode:** follow the site's existing theme. Give hat icons a subtle white glow in dark mode (the reference uses `--glow`).
- **Fonts:** Plus Jakarta Sans and the Playfair italic accent, as the site already uses.

### 7. Copy
| Hat | Name | Line |
|---|---|---|
| sticky notes | Product designer | 3+ years turning messy hypotheses into small, testable products. |
| party hat | Plan starter | The friend who turns "we should hang out" into an actual plan. **(Shivam to confirm)** |
| helmet | Biker | Long rides with friends. Getting outside is the whole point. |
| beret | Artist | Fine arts at JJ School of Art. I drew everything on this page. |
| propeller beanie | Motion & animation | Timing, easing, physics. Tap the propeller and watch it ease out. |
| ninja headband | Anime kid | Raised on anime. I know when a reference lands and when it is trying too hard. |
| cat | Cat lover | All my work is reviewed by a very strict, very furry supervisor. |

Expressions: the sticky notes get closed happy eyes, a soft smile and a −12° head tilt. The cat gets a surprised "o" on landing, then the same content face without the tilt. Everything else follows the reference's `FACE` map.

### 8. Accessibility and motion
- **Hats** are `<button>`s with `aria-label` "Put on the {hat}: {name}", and Enter or Space wears one.
- **The tagline** has `aria-live="polite"`.
- **The SVG** has `role="img"` plus a label.
- **Reduced motion:** no orbit bob, no bursts, instant hat swap, a static peek. The site already honours `prefers-reduced-motion` globally; keep that working.
- **Focus rings** use the site's ring token.

### 9. Constraints
- No new dependencies. `motion` is already installed; use it only where it helps.
- Do not change the grid, navigation, intro or overview logic beyond reading their state and passing callbacks.
- Keep `HOME_POS`, the Compass, EdgeIndicators and analytics untouched. You may add `trackEvent('hat_worn', { hat })`.

## QA checklist (verify each before finishing)
- [ ] `npm run build` passes with no type errors and no console errors at runtime.
- [ ] At 390×844, 820×1180 and 1440×900, the hero fits inside the cell's safe area and nothing sits under the Compass or edge labels.
- [ ] Dragging a hat never changes cells. Swiping from the face or empty space does. Arrow keys still navigate.
- [ ] Wear all 7 hats: orbit re-spacing, palette, tagline, expression and the special effects (visor sequence, propeller ease-out, confetti and pop cards) all match the reference.
- [ ] The glasses tap sequence works, including tapping the fallen glasses to put them back.
- [ ] Pinch to overview: hats hidden, animations paused, and zooming back restores everything.
- [ ] Intro (clear `localStorage.hasSeenIntro`): the hats fly in after the zoom lands.
- [ ] Hero → Work: the peek plays with the current hat, and tapping the head returns to Hero.
- [ ] No rAF or CSS animation running while you're on other cells (check the Performance panel).
- [ ] Dark mode and reduced motion both look right.
