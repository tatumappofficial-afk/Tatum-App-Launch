---
name: milestones
description: Achievement milestones and celebration moments
---

# Milestones

Celebration moments within Tatum. When she logs a milestone emoji or hits a personal record, Tatum celebrates with her. Not just a data point — a moment she'll remember.

**Depends on:** `data-model` (ActivityEmoji milestone category, Encounter), `design-system` (animation principles, brand voice), `emoji-calendar` (where milestones are logged), `affirmations` (milestone-specific affirmations)

---

## Milestone Types

### Emoji Milestones

Logging a milestone-category emoji (🩷 First I Love You, and any future milestone emojis) triggers a celebration.

### Achievement Milestones

Computed from encounter data — the user doesn't log these directly:

| Milestone | Trigger | Copy |
|-----------|---------|------|
| First Log | First encounter ever logged | "Welcome to your truth. This is where it begins." |
| Week Streak | 2+ consecutive weeks with at least one encounter | "Two weeks of showing up. That's a pattern worth noticing." |
| Month Streak | 2+ consecutive months | "Another month of knowing yourself." |
| 10 Encounters | 10 total encounters logged | "Ten moments. Ten truths. All yours." |
| 50 Encounters | 50 total encounters logged | "Fifty. Not that anyone's counting. (Okay, Tatum is.)" |
| Partner Anniversary | One year since first encounter with a specific partner | "One year with [Partner]. Tatum remembers every one." |
| Solo Celebration | 5 solo (✨) encounters | "Taking care of yourself is its own celebration." |

---

## Celebration UX

When a milestone is triggered:

### Inline Celebration (primary)

After the encounter is saved (Quick Log → "Log It" tap), instead of silently returning to the calendar:

1. The screen transitions to a **celebration card** — a full-width card with:
   - Terra→Fig gradient background (like the tone card)
   - Milestone emoji, large (40px+)
   - Milestone title in Playfair Display italic, white
   - Milestone body copy in DM Sans 300, white/translucent
   - Subtle confetti or sparkle animation (tasteful, not overwhelming — think 3–5 floating ✨ particles, not a birthday party)
2. The card is visible for 3–4 seconds or until tapped
3. Tapping dismisses and returns to the calendar with the new entry visible

### Milestone Feed (future)

A section in the Profile tab showing all milestones earned, in chronological order. Each milestone card shows the date, the emoji/achievement, and the copy. This creates a timeline of her journey.

Not in v1 scope — but the data should be stored so it can be surfaced later.

---

## Milestone Data

Milestones are derived, not stored as a separate entity. The logic lives in `src/` (ephemeral) and computes from Encounter data:

- First Log: `encounters.length === 1` after insert
- Streaks: computed from weekly/monthly encounter groupings
- Count milestones: `encounters.length` hitting thresholds
- Partner anniversary: `first encounter date + 1 year`

The celebration state (which milestones have been shown) is stored in MMKV as a simple set of milestone keys: `shown_milestones: Set<string>`. Each milestone is shown once.

---

## Connection to Affirmations

When a milestone is triggered, the next day's affirmation should be milestone-aware (see `affirmations` skill). The affirmation rotation checks if a milestone was earned yesterday and selects a relevant affirmation.

---

## Animation Specifications

- **Confetti/sparkle:** 3–5 ✨ emoji particles, random positions, float upward with gentle rotation, fade out over 2s. Use `react-native-reanimated` for performant animation.
- **Card entrance:** Scale from 0.9→1.0, opacity 0→1, 300ms spring ease
- **Card exit:** Fade out, 200ms

Keep animations warm and understated. This is an intimate celebration, not a game achievement.

---

## Constraints

- Milestone celebrations must not interrupt the logging flow — they appear after the save, not before
- Each milestone is shown once (tracked in MMKV)
- Milestone copy follows brand voice — celebratory but never comparative or prescriptive
- No sound effects in v1 (haptic feedback via `expo-haptics` is fine — a gentle success haptic)
- Achievement milestones are computed client-side — no server needed
