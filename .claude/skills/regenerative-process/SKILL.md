---
name: regenerative-process
description: Regenerative architecture build process — source of truth hierarchy, Storybook-first workflow, component extraction, completion criteria
---

# Regenerative Process

How to build Tatum correctly using the regenerative architecture.

## Source of truth hierarchy

1. **HTML mockups** (`../design-showcase/screenflow/screens/`) — visual ground truth
2. **Product skills** (`.claude/plugins/tatum-concept/skills/`) — feature specs and design system
3. **Stories** (`stories/`) — executable visual contracts
4. **Shared components** (`lib/components/`) — extracted, reusable UI primitives
5. **Source code** — ephemeral, always regenerable

When source code and a story disagree, fix the code.

## Phase 1: Storybook-first

Build a web Storybook before writing any React Native code. Stories are the specification layer — they establish the visual contract before any platform commitment.

### Why this order works

- Stories don't require Expo, React Native, or a simulator
- HTML → React component is a mechanical translation; catching visual errors here is cheap
- The component library emerges naturally from the screens, not from up-front abstraction

### The workflow that works

1. **Read the HTML mockups** — extract exact colors, fonts, sizes, spacing from the design showcase files
2. **Build screens as monoliths first** — each screen is one file in `lib/screens/`, one story in `stories/`. Get the visuals right before worrying about reuse
3. **Extract shared components second** — once screens exist, patterns become visible. Extract components that appear in 2+ screens into `lib/components/` with their own stories in `stories/components/`
4. **Delete inline implementations** — when a shared component replaces inline code in a screen, delete the old inline version in the same pass

### Component extraction priority

Extract in this order (most reuse → least):
- **HIGH**: Components used in 5+ screens (AvatarCircle, GradientButton, StatStrip, StarRating, TagPill)
- **MEDIUM**: Components used in 2-4 screens (ActivityBarChart, NotesCard, SessionCard, PartnerCard, CalendarGrid, StepDots, BackButton)
- **LOW**: Complex-but-single-use components worth isolating for testability (EmojiChip, SettingsRow, ToggleSwitch)

### Don't prematurely abstract

Three similar lines of code is better than a premature abstraction. Wait until you've built the screens before deciding what to extract. The HTML mockups will show you which patterns recur — trust them, not guesses.

## File layout

```
lib/
  theme.ts                    ← design tokens (colors, fonts, spacing, radii, shadows)
  components/                 ← shared UI components (AvatarCircle, StatStrip, etc.)
  screens/                    ← full screen components
    shared/                   ← layout primitives (StatusBar, BottomNav, DynamicIsland, etc.)
stories/
  *.stories.tsx               ← screen stories
  components/
    *.stories.tsx              ← component stories
```

Import conventions:
- From `lib/components/*.tsx`: use `../theme`
- From `lib/screens/*.tsx`: use `../theme`
- From `lib/screens/shared/*.tsx`: use `../../theme`

## Screen architecture

### Regular screens (scrollable content)

Root container uses `width: '100%'`, `minHeight: '100vh'`. Content flows in document order. Background color comes from Storybook canvas, not the component.

### Modal/overlay screens (absolute positioning)

Root container uses `width: '100%'`, `height: '100vh'` (NOT `minHeight`). Modals use absolute-positioned children (dim overlay, bottom sheet) which need a fixed-height parent to position against. These screens keep their own `background` on inner layers for the blur/overlay effect.

Modal screens: AddTagModal, CalendarDayModal, DaySessionsModal, SessionDetailModal, LogSessionScreen.

## Completion criteria

A screen is done when ALL of the following are true:
- [ ] `npx tsc --noEmit` passes
- [ ] `npx storybook build` passes
- [ ] Story renders visually and matches the HTML mockup
- [ ] Shared components extracted where patterns recur

For the native app (Phase 2), additionally:
- [ ] App boots in Expo Go on the simulator
- [ ] Screen renders visually
- [ ] At least one Maestro flow passes

## Deletion gates

When replacing a pattern, delete the old one in the same pass:
- Inline component replaced by shared component → delete inline version
- Old state management replaced → delete old state, old hooks
- No dead code. No commented-out blocks. No "keep for reference" fragments.

## Do not generate CLAUDE.md or AGENTS.md

Process knowledge lives in skills (this directory). Product knowledge lives in the tatum-concept plugin (`.claude/plugins/tatum-concept/skills/`).

## Build order

```
Phase 1: Storybook
  1. Design tokens          → lib/theme.ts
  2. Screen components      → lib/screens/ (monoliths from HTML mockups)
  3. Screen stories          → stories/ (one per screen, default + variant states)
  4. Component extraction   → lib/components/ + stories/components/
  5. Visual verification    → npm run storybook, check every screen in browser

Phase 2: Native App
  1. Layout primitives      → lib/screens/shared/ (already done in Phase 1)
  2. Route files            → app/ (thin wrappers, no logic)
  3. Screens                → adapt web components to React Native primitives
  4. Data schemas           → client/schemas/ (Zod from data-model skill)
  5. Store                  → src/store/ (data layer from schemas)
  6. Wiring                 → connect screens to store
```
