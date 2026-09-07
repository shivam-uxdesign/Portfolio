# Figma Make Prompt — Hero Section UI/UX (Screenshot Reference)

Use the attached screenshot as the visual reference. Recreate this layout with the following UI specs and interaction notes.

---

## Layout

Full viewport hero. No scroll. Two-column grid above, card row below.

- Page background: #F0EDE8 (warm off-white)
- Left column: 280px fixed, vertically centered
- Right column: remaining width, vertically centered
- Cards row: full width, fixed height 220px, sits below the two columns
- Scroll cue: centered, bottom of viewport

---

## Left column — Polaroid photo frame

- White card (#FFFFFF), border 0.5px solid #E0DDD8, border-radius 4px
- Padding: 10px top/sides, 28px bottom
- Rotated: -3 degrees
- Two paper clip details at top: 16×26px ovals, border 2.5px solid #B0ADA8, one at rotate(-8deg), one at rotate(6deg)
- Inner photo area: 200×240px, background #C8B89A, border-radius 2px
- Replace placeholder with Shivam's actual photo — object-fit cover, face centered

---

## Right column — Identity block

Vertical stack, 14px gap between elements.

**Greeting**
- Text: "HEY, I AM"
- 15px, weight 500, uppercase, letter-spacing 0.07em, color #8A8780

**Name**
- Text: "Shivam"
- 80px, weight 500, color #1A1A1A, letter-spacing -0.04em, line-height 0.95
- Wrap in an overflow:hidden container for slide-up entrance animation

**Subcopy**
- Text: "A product designer who works from strategy to pixel."
- 17px, weight 400, color #6B6860, line-height 1.55, max-width 380px

**CTA row** — two elements side by side, 16px gap, aligned center

Primary button — "Get in touch →"
- Background #1A1A1A, color #F0EDE8
- Border-radius 99px, padding 9px 18px
- Font size 13px, weight 500
- Arrow icon to the right of text

Secondary link — "View my work"
- No background, no border
- Font size 13px, color #8A8780
- Plain text link

---

## Project cards row

Three equal-width cards. 10px gap. 52px left/right padding. Height 220px.

Each card:
- Border-radius 14px, overflow hidden
- Dark gradient overlay on bottom 65%: linear-gradient(transparent → rgba(0,0,0,0.78))
- Case study number top-right: 11px, rgba(255,255,255,0.3), letter-spacing 0.06em
- Label bottom-left: 12px, white, weight 500, line-height 1.4, padding 14px 16px
- "View case study →" line below label: 11px, white, weight 500 — hidden by default, shown on hover

Card backgrounds (replace with real screenshots when available):
- Card 01: #0F1923 (dark dashboard feel)
- Card 02: #B8A898 (warm neutral)
- Card 03: #8BACC0 (cool blue)

---

## Scroll cue

Centered at the bottom.
- Text: "See how I work" — 11px, #AAAAAA, letter-spacing 0.06em
- Chevron down icon below, 13px, #AAAAAA

---

## Hover interactions

**Polaroid photo**
- On hover: straightens to rotate(0deg), scales to 1.02
- Transition: 0.45s cubic-bezier spring
- On mouse out: returns to -3deg tilt, 0.5s ease out

**Name — "Shivam"**
- On hover: letter-spacing eases from -0.04em to 0.01em
- Transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1)

**Subcopy**
- On hover: color transitions from #6B6860 to #1A1A1A
- Transition: 0.35s ease

**CTA primary button**
- On hover: background lightens to #3B3B38, arrow nudges 2px right
- Transition: 0.3s ease

**CTA secondary link**
- On hover: color transitions from #8A8780 to #1A1A1A
- Transition: 0.3s ease

**Project cards**
- On hover: card lifts — translateY(-5px) scale(1.01)
- Card number opacity increases: 0.3 → 0.6
- Card label nudges up: translateY(-2px)
- "View case study →" slides up and fades in from below
- Transition: 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)

**Scroll cue**
- On hover: text and chevron color shift from #AAAAAA to #6B6860
- Transition: 0.3s ease

---

## Entrance animations (on page load)

All timings are staggered so elements arrive in reading order:

| Element | Animation | Delay | Duration |
|---------|-----------|-------|----------|
| Polaroid | Fade + slide up + spring scale | 0.2s | 0.8s |
| Greeting "HEY, I AM" | Fade up | 0.5s | 0.6s |
| Name "Shivam" | Slide up from clip mask | 0.65s | 0.7s |
| Name shimmer | Light sweep left→right, once | 1.4s | 0.9s |
| Subcopy | Fade up | 1.0s | 0.6s |
| CTA row | Fade up | 1.2s | 0.5s |
| Cards row | Fade up as group | 1.1s | 0.7s |
| Scroll cue | Fade up | 1.5s | 0.5s |
| Polaroid float | Slow vertical drift ±5px loop | 1.2s | 4s loop |
| Availability dot pulse | Opacity pulse | 2.0s | 2s loop |
| Chevron bounce | translateY ±3px loop | 2.0s | 2s loop |

---

## Typography summary

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Greeting | 15px | 500 | #8A8780 |
| Name | 80px | 500 | #1A1A1A |
| Subcopy | 17px | 400 | #6B6860 |
| CTA button | 13px | 500 | #F0EDE8 |
| CTA link | 13px | 400 | #8A8780 |
| Card label | 12px | 500 | #FFFFFF |
| Card CTA | 11px | 500 | #FFFFFF |
| Card number | 11px | 500 | rgba(255,255,255,0.3) |
| Scroll cue | 11px | 400 | #AAAAAA |

---

## Notes for Figma Make

- The polaroid tilt and entrance spring give it a physical, human feel — preserve the -3deg rotation as the resting state
- The name shimmer fires once on load only — not a loop
- Card "View case study" text is hidden at rest and slides up on hover — use a smart animate or prototype interaction for this
- CTA primary and secondary sit in a horizontal auto-layout frame with 16px gap
- Do not add any navigation bar above the hero
- Replace all placeholder colors with real photos when assets are available