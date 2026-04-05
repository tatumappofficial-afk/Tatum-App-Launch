# Affirmations

Daily affirmations that greet her when she opens the app. Warm, empowering, never prescriptive. These are the voice of Tatum — reminding her that she is enough, that her desires are valid, and that her truth matters.

**Depends on:** `data-model` (Affirmation entity — needs to be added), `design-system` (brand voice, tone card pattern), `revenue-tiers` (free: curated daily affirmations; premium: custom affirmation library)

---

## Daily Affirmation Display

When the user opens Tatum, a daily affirmation appears as a warm greeting — either on the splash/home screen or as a subtle banner at the top of the Calendar tab.

### Presentation Options

**Option A — Home Banner:** A tone card (Terra→Fig gradient, see `design-system`) at the top of the Calendar screen, showing today's affirmation in Playfair Display italic, white text. Dismissible with a tap or swipe up. Reappears each new day.

**Option B — Splash Transition:** After the biometric unlock (or on cold open), a brief affirmation screen appears for 2–3 seconds before transitioning to the main app. Tap anywhere to dismiss early.

Recommendation: Option A (banner) — it's less interruptive and she can linger on it or dismiss it. The splash transition risks feeling like an ad for her own app.

### Affirmation Content

All affirmations follow the brand voice (see `design-system`):

- First person or second person ("You" or "I")
- Never uses "should"
- Never comparative
- Celebrates her as she is
- Warm, not performative

**Example affirmations:**
- "You've always been enough. Your body knows it."
- "Your desires are not too much. They're yours."
- "Showing up for yourself is the bravest thing you'll do today."
- "You don't need permission to want what you want."
- "Your truth doesn't need anyone else's approval."

### Rotation

- One affirmation per day, selected from the library
- Rotation can be random or follow a curated sequence
- The same affirmation should not repeat within a 30-day window
- v1 ships with ~60 curated affirmations (2 months without repeats)

---

## Custom Affirmation Library (Premium)

Premium users can save their own affirmations and add them to the rotation.

### Custom Affirmation Flow

1. In Settings or a dedicated "My Affirmations" section (accessible from Profile tab)
2. "Add affirmation" — text input, placeholder: "Write something you need to hear"
3. Saved affirmations appear in a list she can edit, delete, or toggle on/off
4. Custom affirmations are mixed into the daily rotation alongside the curated ones
5. She can also "favorite" curated affirmations to increase their frequency

### Data Model Addition

```
Affirmation {
  id: uuid
  body: string                    — the affirmation text
  source: 'curated' | 'custom'   — built-in or user-created
  isFavorite: boolean             — increases rotation frequency
  isActive: boolean               — included in daily rotation
  lastShownAt: ISO date | null    — for rotation logic
  createdAt: ISO datetime
}
```

This entity needs to be added to the `data-model` skill.

---

## Milestone Affirmations

When a milestone emoji (🩷) is logged, the next day's affirmation can be milestone-specific:
- "Yesterday was a first. Tatum remembers."
- "Some moments change everything. You logged one."

This connects to the `milestones` skill for celebration UX.

---

## Constraints

- Free tier: daily curated affirmations (full access, not gated)
- Premium: custom affirmation library + favorites
- Affirmations never reference specific encounters, partners, or stats — they're universal truths
- The affirmation display must not block the user from getting to her main task — it should be delightful, not an obstacle
- No push notifications for affirmations — they appear when she opens the app, not when she doesn't
