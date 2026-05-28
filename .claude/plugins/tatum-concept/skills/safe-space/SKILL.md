---
name: safe-space
description: Privacy-first design — local storage, biometric lock, data ownership
---

# Safe Space

Pillar 2 of Tatum — a place to log desire in real time. Not tied to what happened (that's the Tracker), but to what she's feeling right now. For the first time, she has somewhere to go when she feels turned on and doesn't know how to bring it up. When she wants closeness but can't find the words. When she just needs to acknowledge her own desire without acting on it immediately.

**Depends on:** `data-model` (DesireEntry, Partner), `design-system` (brand voice, card patterns)

---

## Core Concept

The Safe Space is a real-time desire journal. Over time, these entries build a picture of her sexual appetite that she has never had access to before — patterns, cycles, and needs she can see with clarity and compassion.

This is not a to-do list for sex. It's a private space to acknowledge desire as it happens, without pressure to act on it.

---

## Entry Flow

Triggered by a prominent entry point — "I want something right now" button or a dedicated tab.

### Quick Entry

1. **"I'm feeling it"** — large, warm button (Terra→Fig gradient). Tapping creates a timestamped entry immediately.
2. **Intensity** (optional) — a 1–5 scale, presented as warmth levels (not numbers). Could be visual: a gradient bar from soft blush to deep fig, or 5 flame/warmth icons.
3. **Who** (optional) — partner selector row. "About someone specific?" She can select a partner or skip.
4. **Words** (optional) — freeform text. Placeholder: "What are you feeling?" in Muted italic.
5. **Save** — entry is logged with timestamp.

The flow should feel like exhaling. Low friction, no required fields beyond the initial tap. She pressed the button — that's enough. Everything else is optional detail.

---

## Feed / History View

A chronological feed of desire entries, styled as a private journal.

### Entry Card

- **Timestamp:** "Tuesday, 10:42 PM" — DM Sans 300, Stone
- **Intensity indicator:** visual warmth level (if logged)
- **Partner tag:** mini avatar + name (if linked)
- **Body text:** the freeform text (if entered), DM Sans 400, Ink
- **Acted on badge:** If she later logged an encounter linked to this desire, show a subtle "✓ Acted on" in Sage

### Grouping

Entries are grouped by day, with date headers in Playfair Display.

---

## Pattern Recognition (Premium)

Over time, the Safe Space data reveals patterns. These are computed views (see `data-model` Computed Views), displayed as insights.

### Insight Cards

- **Time patterns:** "You tend to feel desire most on Tuesday and Thursday evenings." Visualized as a heat map or time-of-day distribution.
- **Cycle correlation:** If period tracking is active (🩸 emoji), overlay desire patterns against cycle. "Your desire peaks around day 12–14 of your cycle."
- **Partner patterns:** "Most of your desire entries are about [Partner]." Shown as a simple breakdown.
- **Acted-on ratio:** "You acted on 40% of your desire entries this month." Presented without judgment — the insight is for her awareness, not her improvement.

### Tone for Insights

Insights must follow the brand voice rigorously. Never comparative, never prescriptive. Frame as observation and celebration:

- ✅ "You tend to feel most alive on Thursday evenings."
- ❌ "You should try to act on your desires more often."
- ✅ "This month, your desire showed up 12 times. That's your truth."
- ❌ "Your desire frequency is lower than average."

There is no average. There is no normal. There is only her data.

---

## Connection to Tracker

When a DesireEntry leads to an encounter:

- The user can link them after the fact: from the Quick Log, "Was this inspired by a desire?" shows recent unlinked desire entries
- Or from the desire feed: tapping "Acted on" opens the option to link to an encounter
- The `linkedEncounterId` field in DesireEntry captures this connection

---

## Connection to Whisper

The Safe Space can naturally flow into Tatum Whisper. If she logged a desire entry linked to a partner, a gentle prompt appears: "Want to tell [Partner]? Tatum can say it for you." This links to the `tatum-whisper` skill.

---

## Constraints

- Free tier: basic desire logging (timestamp + intensity + partner)
- Premium: pattern recognition insights, freeform text, cycle correlation
- Desire entries are private — stored locally on the device, same as Private Notes. (Encryption-at-rest is aspirational and not yet implemented; see `private-notes/SKILL.md`.)
- No notifications or reminders to log desire — this is purely self-initiated
- The "I'm feeling it" button must be accessible from the home screen, not buried in navigation
