import { z } from 'zod'

// ── Activity Tag ──

export const ActivityTagSchema = z.object({
  id: z.string(),
  emoji: z.string(),
  label: z.string().max(50),
  sortOrder: z.number(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
})

export type ActivityTag = z.infer<typeof ActivityTagSchema>

// Stable id for the Period tag. Period is the one protected default — it can't
// be renamed, have its emoji swapped, or be deleted, because its presence is
// what unlocks period-only logging (no partner required). A stable id lets
// every site check `tag.id === PERIOD_TAG_ID` without depending on the
// (mutable) label or the (originally random) UUID assigned at seed time.
export const PERIOD_TAG_ID = 'tag-period'

export const DEFAULT_ACTIVITY_TAGS: { id?: string; emoji: string; label: string }[] = [
  { emoji: '🥂', label: 'Drunk Sex' },
  { emoji: '🤭', label: 'In The Butt Bob' },
  { emoji: '🫱', label: 'Manual' },
  { emoji: '🏁', label: 'Quickie' },
  { emoji: '👄', label: 'Just The Tip' },
  { emoji: '⌛️', label: 'Marathon Sex' },
  { emoji: '🏡', label: 'At Home Sex' },
  { emoji: '😛', label: 'Gave Oral' },
  { emoji: '👅', label: 'Got Oral' },
  { emoji: '☀️', label: 'Afternoon Delight' },
  { emoji: '🤝', label: 'Mutually Initiated' },
  { emoji: '😴', label: 'Sleepy Sex' },
  { emoji: '🌅', label: 'Morning Sex' },
  { emoji: '🛁', label: 'Shower Sex' },
  { emoji: '🏖', label: 'Vacation Sex' },
  { emoji: '😡', label: 'Angry Sex' },
  { emoji: '✋', label: 'Hand job' },
  { emoji: '💦', label: 'Orgasm' },
  { emoji: '🍑', label: 'From Behind' },
  { emoji: '🍆', label: 'Penetration' },
  { emoji: '👉', label: 'Fingering' },
  { emoji: '🌬️', label: 'Blow Job' },
  { emoji: '✨', label: 'Solo' },
  { emoji: '💃', label: 'She Initiated' },
  { emoji: '🥸', label: 'Faked it' },
  { id: PERIOD_TAG_ID, emoji: '🩸', label: 'Period' },
]

// ── Encounter ──

export const EncounterSchema = z.object({
  id: z.string().uuid(),
  date: z.string(), // ISO date YYYY-MM-DD
  activities: z.array(z.string()).min(1), // emoji codes, at least one required
  partnerIds: z.array(z.string().uuid()), // optional — sessions can be logged without a partner
  stars: z.number().min(0).max(10).nullable(),
  notes: z.string().max(3000).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Encounter = z.infer<typeof EncounterSchema>

// ── Partner ──

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  avatarType: z.enum(['initials', 'emoji', 'color']),
  avatarValue: z.string(),
  avatarGradient: z.string(), // CSS gradient string
  isActive: z.boolean(),
  isMain: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Partner = z.infer<typeof PartnerSchema>

// ── Desire Entry (Safe Space) ──

export const DesireEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string(),
  intensity: z.number().min(1).max(5).nullable(),
  body: z.string().nullable(),
  partnerId: z.string().uuid().nullable(),
  actedOn: z.boolean(),
  linkedEncounterId: z.string().uuid().nullable(),
  createdAt: z.string(),
})

export type DesireEntry = z.infer<typeof DesireEntrySchema>

// ── Whisper Message ──

export const WhisperMessageSchema = z.object({
  id: z.string().uuid(),
  partnerId: z.string().uuid(),
  templateId: z.string().nullable(),
  customBody: z.string().nullable(),
  finalMessage: z.string(),
  deliveryMethod: z.enum(['sms', 'in-app', 'copy']),
  sentAt: z.string(),
  createdAt: z.string(),
})

export type WhisperMessage = z.infer<typeof WhisperMessageSchema>

// ── Affirmation ──

export const AffirmationSchema = z.object({
  id: z.string().uuid(),
  body: z.string(),
  source: z.enum(['curated', 'custom']),
  isFavorite: z.boolean(),
  isActive: z.boolean(),
  lastShownAt: z.string().nullable(),
  createdAt: z.string(),
})

export type Affirmation = z.infer<typeof AffirmationSchema>

// ── User Profile ──

// Singleton row — there's only ever one user_settings row, with id='singleton'.
// Modeled as a TanStack collection so subscribers (useLiveQuery / useSettings)
// pick up changes reactively instead of having to re-fetch.
export const SETTINGS_ID = 'singleton' as const

export const UserSettingsSchema = z.object({
  id: z.literal(SETTINGS_ID),
  notifications: z.boolean(),
  whisperDeliveryDefault: z.enum(['sms', 'in-app', 'copy']),
  calendarStartDay: z.enum(['sunday', 'monday']),
  biometricLock: z.boolean(),
  backupEnabled: z.boolean(),
  hasOnboarded: z.boolean(),
  theme: z.literal('warm'),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().nullable(),
  avatarValue: z.string().nullable(),
  avatarGradient: z.string().nullable(),
  createdAt: z.string(),
  tier: z.enum(['free', 'premium']),
  premiumExpiresAt: z.string().nullable(),
  email: z.string().nullable(),
  authProvider: z.enum(['apple', 'google']).nullable(),
  // Stable per-user identifier from the OAuth provider — Apple's `user` field
  // or Google's `sub`. Bound to identity: once set, only sign-ins from the
  // same identifier can return into this device's local data. A reset is only
  // offered from Settings after the current local account is open.
  providerUserId: z.string().nullable(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

export const DEFAULT_SETTINGS: UserSettings = {
  id: SETTINGS_ID,
  notifications: true,
  whisperDeliveryDefault: 'copy',
  calendarStartDay: 'sunday',
  biometricLock: false,
  backupEnabled: true,
  hasOnboarded: false,
  theme: 'warm',
}
