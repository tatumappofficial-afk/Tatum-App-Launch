# Design System

Tatum's visual identity and brand voice. This skill governs every component in `lib/`, every screen in `src/screens/`, and every piece of copy in the app.

---

## The One Rule

**Every word in this app should make her feel more confident than she did before she read it.**

That is the only rule. Every design decision, every color choice, every piece of microcopy filters through this. If it doesn't pass, it doesn't ship.

---

## Brand Voice

Tatum speaks like a warm, trusted, unapologetic best friend.

**Tatum is:** Warm. Honest. Playful. Empowering. Private. Celebratory.

**Tatum never:** Sounds clinical. Uses the word "should." Compares her to anyone. Implies what her frequency means. Judges. Prescribes.

**Tone pairs:**
- Warm, not clinical
- Honest, not prescriptive
- Playful, not juvenile
- Empowering, not preachy
- Private, not secretive
- Celebratory, not performative

**Primary tagline:** "You show up more than he remembers."
**Emotional anchor:** "You've always been enough. Tatum proves it."

---

## Color Palette

All colors are defined as CSS custom properties and as a React Native theme object.

| Name | Hex | Usage |
|------|-----|-------|
| Warm Sand | `#F5EFE8` | Primary background |
| Surface | `#FBF7F2` | Card backgrounds |
| Surface 2 | `#EDE3D8` | Secondary surfaces, input backgrounds |
| Border | `rgba(160,100,80,0.18)` | Subtle borders |
| Terra | `#C07858` | Primary accent, CTAs, headings |
| Fig | `#7C4A5A` | Secondary accent, gradient endpoints |
| Mauve | `#B07080` | Tertiary accent, highlights |
| Gold | `#C4993A` | Star ratings, premium badges |
| Blush | `#E8C4B0` | Soft highlights, decorative elements |
| Sage | `#8BA888` | Positive indicators (thumbs up, active states) |
| Stone | `#9A8878` | Secondary text, labels |
| Ink | `#3D2B25` | Primary text |
| Muted | `#A08878` | Placeholder text, hints |

### Gradients

- **Primary CTA:** `linear-gradient(135deg, Terra, Fig)` — used for buttons, app icon, nav highlights
- **Positive:** `linear-gradient(135deg, #8BA888, #5A8060)` — thumbs up selected
- **Negative:** `linear-gradient(135deg, #B07080, #7C4A5A)` — thumbs down selected
- **Partner avatars:** Each partner gets a unique gradient pair from the palette

---

## Typography

Two font families only.

| Role | Font | Weight | Size Range |
|------|------|--------|------------|
| Display / Headings | Playfair Display | 600–700 | 28–62px |
| Italic accents | Playfair Display Italic | 400–600 | 12–22px |
| Body | DM Sans | 300–500 | 10–14px |
| Labels / Tags | DM Sans | 500 | 8–10px, uppercase, letter-spacing 1.5–4px |

**Expo/RN loading:** Use `expo-font` or `@expo-google-fonts/playfair-display` and `@expo-google-fonts/dm-sans`.

### Hierarchy

- Screen titles: Playfair Display 700, 28px, Ink
- Section labels: DM Sans 500, 9px, uppercase, letter-spacing 3–4px, Stone or Terra
- Card titles: Playfair Display 600, 17–19px, Ink
- Stat numbers: Playfair Display 600, 36px, Terra
- Body text: DM Sans 300–400, 11–12px, Ink
- Hints / placeholders: DM Sans 300, 9–10px italic, Muted

---

## Component Patterns

These patterns inform every component in `lib/`. Components should be built as pure presentational units with Storybook stories.

### Cards

- Background: Surface (`#FBF7F2`)
- Border: 1px solid Border
- Border radius: 14–16px
- Padding: 16–22px
- Shadow: `0 2px 8px rgba(61,43,37,0.1)` (subtle, warm)

### Buttons

- **Primary:** Terra→Fig gradient, white text, 50px border-radius, uppercase DM Sans 500, letter-spacing 2.5px, shadow `0 8px 22px rgba(124,74,90,0.3)`
- **Secondary:** Surface2 background, Stone text, 1px Border
- **Icon button:** 26–46px circle, Surface2 background, centered icon

### Avatar Bubbles

- 54px circle with 2px white border
- Gradient background (partner-specific)
- Content: initials (Playfair Display 600, 18px, white) or emoji (26px)
- Active indicator: 14px Sage circle, bottom-right, 2px Surface border
- Add button: dashed border, Surface2 background, Muted "+" text

### Tags / Pills

- Inactive: Surface background, 1px Border, 20px border-radius, 10px DM Sans, Stone text
- Active: Terra→Fig gradient, white text, no border, shadow `0 2px 8px rgba(192,120,88,0.3)`

### Emoji Items

- 38px square, 10px border-radius
- Surface2 background, 1px Border
- 20px emoji centered
- Hover/press: scale(1.15), elevated shadow
- Dragging state: opacity 0.5

### Section Dividers

- Label: DM Sans 500, 9px, uppercase, letter-spacing 4px, Terra
- Line: flex-grow, 1px, Border color
- Pattern: label text + line extending to right edge

---

## Layout

- Maximum content width: 390px (phone frame reference)
- Horizontal padding: 28px (content sections)
- Vertical section spacing: 24px
- Card gap: 8–10px

---

## Iconography

Tatum uses emoji as the primary icon system for activity logging. For navigation and UI chrome, use Ionicons from `@expo/vector-icons` (ships with Expo, no extra native deps) in the warm palette.

### Bottom Navigation Icons

Four tabs + center FAB, custom tab bar. Icons: Ionicons outline style, 22px. Active: Terra color. Inactive: Stone color. Labels: DM Sans 500, 8.5px uppercase, letter-spacing 1.5px. Center FAB: 56px Terra circle with white "✦" text, elevated shadow.

---

## Animation Principles

- Transitions: 150ms ease for interactive states (hover, press, toggle)
- Entry animations: `fadeIn` — opacity 0→1, translateY 6px→0, 200ms ease
- Drag feedback: scale(1.15) on grab, opacity 0.5 on drag, drop-target highlight with dashed Terra border
- No gratuitous animation. Every motion serves feedback or delight.

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for body text (Ink on Warm Sand passes)
- Touch targets: minimum 44px
- All emoji have accessible labels
- Biometric lock screen must support VoiceOver/TalkBack
- Never rely on color alone to communicate state — pair with shape, text, or icon

---

## Dark Mode

Not in v1. The warm palette is the singular identity. Dark mode is a future consideration that would need its own design pass — it's not just inverting colors.
