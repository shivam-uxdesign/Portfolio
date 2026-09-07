# Figma Make Prompt — Resume Cards (Two-Card Layout)

Use this prompt in Figma Make to generate the two-card resume layout.

---

## Prompt

Create a two-card mobile UI layout for a product designer's resume profile. Use a warm off-white page background (#F2F0EB). Both cards should have a white background, 1px border in light gray (#E0DDD8), and 24px corner radius. Max card width is 420px, centered, with 12px gap between cards. All typography uses a clean sans-serif. No shadows or gradients.

---

### Card 1 — Identity

Layout: Single card, padding 24px.

**Header row:**
- A small filled green circle (9px, color #1D9E75) on the left as an availability indicator
- Bold text "Product Designer" (17px, weight 500) next to the dot
- Below and indented (aligned with the title): muted text "@rupyy" in 13px, color #999

**Divider:** 1px horizontal line, light gray, full width, 16px vertical margin.

**Three content sections**, each with:
- An uppercase label in 11px, letter-spacing 0.07em, color #AAAAAA
- A value in 15px, color #1A1A1A, line-height 1.5
- 16px gap between sections

Section 1 — Label: "CURRENT FOCUS" / Value: "Scaling design systems & simplifying complex workflows"

Section 2 — Label: "DESK RIGHT NOW" with a small coffee cup icon (14px) before the label text / Value: "Coffee, Figma tabs, and too many sticky notes"

Section 3 — Label: "LEARNING" / Value: "3D in Spline + cinematic UI transitions"

**Divider:** same as above.

**Footer row (space-between):**
- Left: small map pin icon (14px, muted) + text "Based in India" in 13px, color #777
- Right: "IST · 11:55 AM" — "IST ·" in 12px muted gray, time in 15px weight 500 dark

**Quip line:** Centered italic text below footer — "Probably adjusting spacing by 2px right now." — 12px, color #BBBBBB.

---

### Card 2 — Work & Credentials

Layout: Single card, padding 24px.

**Header:**
- Title "Work & credentials" — 17px, weight 500
- Subtitle below: "Crafting scalable systems and intuitive digital experiences with a focus on clarity, motion, and usability." — 13px, color #666, line-height 1.6, margin-bottom 20px

**2×2 Stat grid**, 8px gap, each cell has 16px corner radius and 14px padding:

| Stat | Number | Label | Background |
|------|--------|-------|------------|
| Top-left | 3+ | YEARS OF EXPERIENCE | #EEECEA (warm gray) |
| Top-right | 8 | PRODUCTS SHIPPED | #DDE8F5 (soft blue) |
| Bottom-left | 0→1 | DESIGN SYSTEMS BUILT | #E8E5F8 (soft purple) |
| Bottom-right | 12 | PERSONAS UPDATED | #F5ECD9 (soft amber) |

Number style: 28px, weight 500, dark (#1A1A1A)
Label style: 11px, uppercase, letter-spacing 0.06em, color #888

**Divider:** same as Card 1.

**Education section:**
- Label: "EDUCATION" in uppercase, 11px muted
- Two pill tags below (8px gap, flex-wrap):
  - "B.FA — JJ School of Art, Mumbai"
  - "M.Des — NIFT Delhi"
  - Tag style: 12px, color #666, background #F5F4F1, border 1px solid #E5E3DE, border-radius 8px, padding 5px 10px

**Quote block:**
- Left border: 2px solid #CCCCCC, no border-radius on the left side
- Text: "Built on an art foundation, refined through systems thinking."
- 13px italic, color #888, padding-left 10px, margin-top 16px

**CTA Button:**
- Full width, border-radius 14px, background #5F6B50 (sage green)
- Text: "Download Resume" — white, 15px, weight 500
- Download icon (16px, white) to the left of the text
- Padding: 14px vertical
- Margin-top: 14px

---

## Design Tokens Summary

| Token | Value |
|-------|-------|
| Page background | #F2F0EB |
| Card background | #FFFFFF |
| Card border | 1px solid #E0DDD8 |
| Card radius | 24px |
| Stat box radius | 16px |
| Tag radius | 8px |
| Font | System sans-serif (or Inter) |
| Primary text | #1A1A1A |
| Secondary text | #666666 |
| Muted text | #AAAAAA |
| Availability green | #1D9E75 |
| CTA green | #5F6B50 |
| Stat gray bg | #EEECEA |
| Stat blue bg | #DDE8F5 |
| Stat purple bg | #E8E5F8 |
| Stat amber bg | #F5ECD9 |

---

## Notes for Figma Make

- Replace existing frames with this two-card stacked layout
- Card 1 height is approximately 420px, Card 2 approximately 480px
- Both cards sit in a vertical auto-layout frame with 12px gap
- Use auto-layout with vertical stacking inside each card
- The stat grid uses a horizontal auto-layout row wrapping into 2 columns
- The clock text ("11:55 AM") should be a separate text layer so it can be made dynamic
