---
name: data-model
description: Complete Zod data schema for all Tatum entities
---

# Data Model

The complete data schema for Tatum. These definitions live in `client/schemas/` as Zod schemas and are the single source of truth for all data shapes in the app. Everything in `src/` derives from these types.

---

## Entities

### Encounter

An encounter is the core logging event — one entry on the emoji calendar. A single encounter can have multiple activity emojis.

```
Encounter {
  id: uuid
  date: ISO date (YYYY-MM-DD)
  activities: ActivityEmoji[]    — one or more emoji codes from the activity set
  partnerId: uuid | null         — linked partner, or null for solo
  rating: 'up' | 'down' | null  — thumbs up/down, optional
  stars: 1–10 | null             — star rating (/10 scale), optional (premium)
  vibes: VibeTag[]               — zero or more vibe tags
  noteId: uuid | null            — linked private note, optional
  createdAt: ISO datetime
  updatedAt: ISO datetime
}
```

### ActivityEmoji

The fixed set of activity emojis. Each has a code (the emoji), a label, and a category. This set is defined at the app level, not user-configurable in v1.

```
ActivityEmoji {
  code: string         — the emoji character (e.g. "🍆")
  label: string        — human label (e.g. "Intercourse")
  category: 'sexual' | 'intimate' | 'milestone' | 'cycle'
}
```

**v1 activity set:**

| Emoji | Label | Category |
|-------|-------|----------|
| 🍆 | Intercourse | sexual |
| ✋ | Hand | sexual |
| 👉 | Fingering | sexual |
| 💋 | Oral (received) | sexual |
| 🌬️ | Oral (given) | sexual |
| 😘 | Kiss | intimate |
| 🍑 | Anal | sexual |
| ✨ | Solo | sexual |
| 🌙 | Cuddle | intimate |
| 🩷 | First I Love You | milestone |
| 🩸 | Period Start | cycle |

### Partner

A partner profile. Users create these with whatever level of detail they want — initials, nickname, emoji avatar. No real names required.

```
Partner {
  id: uuid
  displayName: string           — nickname or initials
  avatarType: 'initials' | 'emoji' | 'color'
  avatarValue: string           — the initials, emoji character, or color hex
  avatarGradient: [string, string]  — two hex colors for the avatar background
  isActive: boolean             — soft delete / archive
  createdAt: ISO datetime
  updatedAt: ISO datetime
}
```

### PrivateNote

An encrypted, freeform journal entry linked to an encounter or standalone.

```
PrivateNote {
  id: uuid
  encounterId: uuid | null      — linked encounter, or standalone
  partnerId: uuid | null        — linked partner for context
  body: string                  — encrypted at rest
  emojiTags: string[]           — emoji tags attached to the note
  createdAt: ISO datetime
  updatedAt: ISO datetime
}
```

### DesireEntry

A Safe Space log — capturing a moment of desire in real time. Not tied to an encounter (though it may lead to one).

```
DesireEntry {
  id: uuid
  timestamp: ISO datetime       — when the desire was felt
  intensity: 1–5 | null         — optional intensity scale
  body: string | null           — freeform text, optional
  partnerId: uuid | null        — who it's about, optional
  actedOn: boolean              — did she act on it?
  linkedEncounterId: uuid | null — if it led to an encounter
  createdAt: ISO datetime
}
```

### WhisperMessage

A Tatum Whisper — a message sent to a partner on the user's behalf.

```
WhisperMessage {
  id: uuid
  partnerId: uuid               — who it's being sent to
  templateId: string | null     — if using a preset prompt
  customBody: string | null     — if she wrote her own
  finalMessage: string          — the actual message sent
  deliveryMethod: 'sms' | 'in-app' | 'copy'  — how it was delivered
  sentAt: ISO datetime
  createdAt: ISO datetime
}
```

### WhisperTemplate

Preset message prompts for Tatum Whisper. Warm, gentle, never clinical.

```
WhisperTemplate {
  id: string
  category: 'desire' | 'appreciation' | 'invitation' | 'playful'
  prompt: string                — what she sees (e.g. "I've been thinking about you...")
  messageBody: string           — the actual message text
  tier: 'free' | 'premium'
}
```

### Affirmation

A daily affirmation shown when the user opens the app. Can be curated (shipped with the app) or custom (user-created, premium).

```
Affirmation {
  id: uuid
  body: string                    — the affirmation text
  source: 'curated' | 'custom'   — built-in or user-created
  isFavorite: boolean             — increases rotation frequency
  isActive: boolean               — included in daily rotation
  lastShownAt: ISO date | null    — for rotation logic (no repeat within 30 days)
  createdAt: ISO datetime
}
```

### UserProfile

Minimal user profile. Tatum does not require real identity — privacy is foundational.

```
UserProfile {
  id: uuid
  displayName: string | null
  createdAt: ISO datetime
  tier: 'free' | 'premium'
  premiumExpiresAt: ISO datetime | null
  settings: UserSettings
}
```

### UserSettings

```
UserSettings {
  notifications: boolean
  whisperDeliveryDefault: 'sms' | 'in-app' | 'copy'
  calendarStartDay: 'sunday' | 'monday'
  biometricLock: boolean
  theme: 'warm' (only one theme in v1)
}
```

---

## Storage Strategy

All data is **local-first**. v1 has no server — everything lives on-device.

- **expo-sqlite** for ALL data: Encounters, Partners, Notes, DesireEntries, WhisperMessages, UserProfile, UserSettings, Affirmations
- **expo-sqlite/localStorage** polyfill for simple key-value settings (replaces MMKV — MMKV does not work in Expo Go)
- **TanStack DB** with custom expo-sqlite collection adapter for reactive queries
- **Encryption**: Private notes encrypted at rest using expo-crypto or a lightweight encryption layer. The key is derived from the device and optional biometric lock.

No cloud sync in v1. Data export (premium) writes to a local file the user can save.

---

## Implementation Notes

### TanStack DB + expo-sqlite

- TanStack DB collections are backed by SQLite tables via a custom `createSqliteCollection` factory in `src/db/collections.ts`
- Each collection has `sync` (loads from SQLite on init), `onInsert`, `onUpdate`, `onDelete` handlers that persist mutations
- JSON columns (activities, vibes, emojiTags) are serialized/deserialized automatically
- Boolean columns (isActive, actedOn) are converted to 0/1 for SQLite

### Critical: crypto.randomUUID polyfill

TanStack DB uses `crypto.randomUUID()` internally for mutation and transaction IDs. React Native's Hermes engine doesn't have this API. A global polyfill must be loaded before any TanStack DB code runs — see `src/utils/crypto-polyfill.ts`, imported at the top of `app/_layout.tsx`.

### Critical: useLiveQuery reactivity

For reactive updates to work, `useLiveQuery` MUST use the query function form with `.select()` destructuring:

```tsx
// CORRECT — reactive
const { data } = useLiveQuery((q) =>
  q.from({ partners }).select(({ partners }) => ({ ...partners }))
)

// WRONG — not reactive, stale data
const { data } = useLiveQuery(partners)
```

### Mutations

Always use collection methods (`collection.insert()`, `collection.update()`, `collection.delete()`) for mutations — never raw SQL. Raw SQL bypasses TanStack DB's reactive layer and the UI won't update.

---

## Relationships

```
User 1──* Partner
User 1──* Encounter
User 1──* DesireEntry
User 1──* WhisperMessage

Encounter *──1 Partner (optional)
Encounter 1──1 PrivateNote (optional)
DesireEntry *──1 Partner (optional)
DesireEntry 1──1 Encounter (optional, if acted on)
WhisperMessage *──1 Partner
WhisperMessage *──1 WhisperTemplate (optional)

User 1──* Affirmation (custom only; curated are app-level)
```

---

## Computed Views (not stored, derived)

These are computed from the entities above, never stored separately:

- **DailyStats**: encounter count, activity breakdown, partner breakdown for a day
- **WeeklyStats**: same, aggregated to week
- **MonthlyStats**: same, aggregated to month
- **YearlyStats**: same, aggregated to year (premium)
- **PartnerStats**: total encounters, thumbs ratio, most common activities, most common vibes, streak data per partner
- **DesirePatterns**: time-of-day distribution, day-of-week distribution, intensity trends, acted-on ratio

---

## Constraints

- All IDs are UUIDs generated client-side
- Dates are ISO 8601, stored as strings
- No server dependency in v1 — the app must work fully offline
- Schemas must be Zod so they serve as both validation and TypeScript types
- The schema files in `client/schemas/` are Layer 2 (Foundation) — they survive regeneration of `src/`
