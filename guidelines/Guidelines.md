# Design System

Rules that apply to every component and page in this project. Follow them in all future changes without exception.

---

## Spacing

Use only this scale. Never use arbitrary bracket values like `gap-[10px]`, `p-[14px]`, `px-[52px]`, or `pb-[28px]`.

| px | Tailwind class |
|----|----------------|
| 4  | `p-1` / `gap-1` |
| 8  | `p-2` / `gap-2` |
| 12 | `p-3` / `gap-3` |
| 16 | `p-4` / `gap-4` |
| 24 | `p-6` / `gap-6` |
| 32 | `p-8` / `gap-8` |
| 48 | `p-12` / `gap-12` |
| 64 | `p-16` / `gap-16` |

---

## Radius

| Element | Class | Value |
|---------|-------|-------|
| Cards | `rounded-2xl` | 16px |
| Buttons & inputs | `rounded-xl` | 12px |
| Pills / badges | `rounded-full` | — |

Never use `rounded-[14px]` or any other arbitrary radius.

---

## Typography

Use these named roles only. Never use arbitrary `text-[px]` sizes. The minimum rendered size is **12px (caption)** — never go smaller.

| Role | CSS value | Tailwind approach |
|------|-----------|-------------------|
| display | `clamp(2.75rem, 12vw, 5rem)` | inline style or custom utility |
| h2 | `1.5rem` | `text-2xl` |
| h3 | `1.25rem` | `text-xl` |
| body | `1.0625rem` (17px) | `text-[1.0625rem]` (one allowed exception) |
| label | `0.8125rem` (13px) | `text-sm` |
| caption | `0.75rem` (12px) | `text-xs` |

---

## Color

Use theme tokens exclusively. Do not hardcode hex colors inline on any element.

**Allowed tokens:** `foreground`, `muted-foreground`, `card`, `border`, `primary`, `primary-foreground`, `background`, `ring`

**Allowed accent hexes** (add as CSS tokens, never inline):
- `--accent-blue` — underline accent
- `--accent-tan` — underline accent

Any new color need must be added as a token in `src/styles/theme.css`, not hardcoded inline.

---

## Container

Every full-width section uses the same horizontal padding. No exceptions.

```
px-6 md:px-12 lg:px-20
```

---

## Interactive Elements

- Clickable things must be real `<a>` or `<button>` elements. Never use `onClick` on a `<div>`, `<span>`, or other non-interactive element.
- Every interactive element must have a visible `:focus-visible` ring using the `--ring` token (Tailwind: `focus-visible:ring-2 focus-visible:ring-ring`).
- Minimum tap target size is **44×44px**. Use padding to meet this if the visual element is smaller.
