# Tatum Whisper

Pillar 3 — the most revolutionary feature. Tatum Whisper gives women the voice they were never taught to use. She knows what she wants. She doesn't know how to bring it up. She opens Tatum — and Tatum says it for her.

**Depends on:** `data-model` (WhisperMessage, WhisperTemplate, Partner), `design-system` (brand voice, CTA patterns), `partner-profiles` (partner selection)

---

## Core Flow

1. She opens Tatum and taps "I want something right now" (or navigates to Whisper)
2. She selects from warm, gentle prompts — or writes her own private message
3. She selects her partner from her partner profiles
4. Tatum sends a warm, tasteful message to that person on her behalf
5. She never had to say a single word out loud

---

## Whisper Composition Screen

### Step 1: Choose a Prompt or Write Your Own

Two paths, presented as tabs or a toggle:

**Browse Prompts** — a scrollable list of WhisperTemplates grouped by category:

| Category | Tone | Example Prompt (what she sees) |
|----------|------|-------------------------------|
| Desire | Warm, direct | "I've been thinking about you..." |
| Appreciation | Grateful, tender | "Last night meant everything to me" |
| Invitation | Playful, open | "What if we made tonight about us?" |
| Playful | Light, flirty | "I have an idea... come home early?" |

Each prompt card shows the prompt text she sees (Playfair Display italic, Fig) and a preview of the message that would be sent (DM Sans, smaller, Stone). Tapping selects it.

**Write Your Own** — a text area where she composes a custom message. Placeholder: "What do you wish you could say?" in Muted italic.

### Step 2: Select Partner

Partner row (same avatar bubble pattern from `partner-profiles`). She taps who it's for.

### Step 3: Preview and Send

- Full preview of the final message in a card styled like a text bubble
- Partner name and avatar shown as the recipient
- Delivery method selector: SMS, In-App (if partner has the app), or Copy to Clipboard
- "Send Whisper" primary CTA button
- "Edit" link to go back

---

## Message Design

Whisper messages are warm, tasteful, and never explicit. They should feel like something she'd be proud to have sent, not embarrassed by.

**Message principles:**
- Written in first person ("I've been thinking about you" not "Your partner wants...")
- Never clinical or transactional
- Never explicit or graphic
- Warm enough to communicate desire, classy enough to screenshot
- Always end with warmth, never with pressure

**Template structure:**
Each template has a `prompt` (what she sees in the app) and a `messageBody` (what gets sent). The message body is slightly expanded from the prompt — more complete, more personal-feeling.

---

## Delivery Methods

### SMS (v1 primary)
- Uses the device's native SMS composer (via `expo-sms` or `expo-linking`)
- Pre-fills the message body — she reviews and taps send in the native SMS app
- Tatum does NOT send messages directly — she always has final control
- This is critical: she must see the message before it leaves her phone

### Copy to Clipboard
- Copies the message body to clipboard
- Shows a confirmation: "Copied! Paste it wherever feels right."
- She can paste into any messaging app

### In-App (future)
- Not in v1. Would require partner accounts and a server layer.
- Reserved for the couples mode premium feature.

---

## Whisper History

A chronological list of sent whispers, accessible from the Whisper tab or profile.

### History Card
- Timestamp: DM Sans 300, Stone
- Partner: mini avatar + name
- Message preview: first ~50 chars of the message
- Delivery method badge: small pill (SMS, Copied, etc.)

---

## Scheduling (Premium)

Premium users can schedule a whisper for later:
- Date/time picker
- "Send this Friday at 8pm" — the app sends a local notification reminding her to send it (the app still uses the native SMS flow, so she needs to confirm)
- Scheduled whispers show in history with a "Scheduled" badge until sent

---

## Connection to Safe Space

If the user arrives at Whisper from a desire entry in the Safe Space (via the "Want to tell [Partner]?" prompt), the Whisper screen pre-selects that partner and suggests prompts in the "Desire" category.

---

## Template Management

### Free Tier
- Access to a curated set of ~20 templates across all categories
- Basic messaging (browse prompt, select partner, copy/SMS)

### Premium
- Full template library (50+ templates)
- Custom message library — save her own messages for reuse
- Scheduling
- Message history with search

---

## Constraints

- Tatum NEVER sends messages without the user's final confirmation. The native SMS composer or clipboard is always the intermediary.
- Messages never include "Sent via Tatum" or any app attribution — this is her voice, not an app's
- Template content must be reviewed carefully for tone — every message must pass the "would she be proud to have sent this?" test
- No AI-generated messages in v1 — all templates are human-written and curated
- Whisper messages are stored locally in WhisperMessage table for history, but the delivery itself is via native APIs
