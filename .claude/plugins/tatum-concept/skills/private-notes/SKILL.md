---
name: private-notes
description: Private journal notes attached to sessions
---

# Private Notes

Encrypted, freeform journal entries linked to encounters or standalone. Her private diary — nobody else ever sees it. This is the most intimate part of the Tracker pillar.

**Depends on:** `data-model` (PrivateNote, Encounter, Partner), `design-system` (card patterns, typography)

---

## Note Types

### Encounter-Linked Note

Created from the Quick Log flow ("Add a note" expansion) or from tapping an encounter in the calendar. Automatically linked to the encounter's date, partner, and activities.

### Standalone Note

Created from the "+" FAB or a dedicated notes tab. Not tied to a specific encounter — for capturing thoughts, feelings, or reflections outside of specific events.

---

## Note Editor

A bottom sheet or full-screen modal with:

1. **Header:** Date in Playfair Display + "Private Note" label
2. **Emoji tags row:** If linked to an encounter, shows the activity emojis as pills. User can add more emoji tags for emotional context.
3. **Text area:** Surface2 background, 10px border-radius, DM Sans 12px, Ink text. Placeholder: "How did it feel? What do you want to remember?" in Muted italic.
4. **Partner tag:** If linked, shows the partner's mini avatar (28px) + name. Can be changed or removed.
5. **Save button:** Primary CTA "Save Note"

### Copy / Tone

The placeholder text and any prompting copy must follow the brand voice: warm, non-judgmental, inviting. Never "describe your experience" (clinical). Instead: "How did it feel?" or "What do you want to remember?"

---

## Note Display

In the calendar view, a logged day with a note shows a small pencil icon or note indicator. Tapping reveals the note in a read-only card:

- Date header
- Emoji tag row
- Note body text
- Partner tag (if linked)
- "Edit" button to reopen the editor

---

## Encryption

Private notes are the most sensitive data in the app. They are encrypted at rest.

### v1 Implementation

- Encrypt the `body` field of PrivateNote before writing to SQLite
- Use a device-derived key (via `expo-crypto` or `expo-secure-store`)
- If biometric lock is enabled (UserSettings), the decryption key is behind biometric auth
- Notes are decrypted only when the note is opened for viewing — never in bulk for list display
- List views show only the date, emoji tags, and partner name — never the note body

### Constraints

- Note bodies must never appear in logs, analytics, or error reports
- No cloud backup of note content in v1
- Data export (premium) includes notes only if the user explicitly opts in per-export

---

## Notes List View

A scrollable list of all notes, accessible from a tab or section of the tracker.

- Grouped by month (Playfair Display month header)
- Each row: date (DM Sans, Stone) + emoji tags + partner avatar + truncated preview (only first ~30 chars, or just "Private note" if body is short)
- Actually, no preview — to maintain privacy, the list shows date + emoji tags + partner only. Body is revealed only on tap.
- Sort: newest first

---

## Constraints

- Free tier: unlimited notes (notes are core to the experience, not gated)
- Premium: data export includes notes
- Maximum note length: 2000 characters (generous but bounded for storage)
- Notes can be deleted — this is a true delete, not soft delete, since notes are the user's private journal and she should have full control
