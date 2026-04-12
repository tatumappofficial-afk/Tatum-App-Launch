import { z } from 'zod'

// ── Activity Emoji (fixed set, not stored) ──

export const ActivityEmojiSchema = z.object({
  code: z.string(),
  label: z.string(),
  category: z.enum(['sexual', 'intimate', 'milestone', 'cycle']),
})

export type ActivityEmoji = z.infer<typeof ActivityEmojiSchema>

export const ACTIVITY_EMOJIS: ActivityEmoji[] = [
  { code: '🍆', label: 'Intercourse', category: 'sexual' },
  { code: '✋', label: 'Hand', category: 'sexual' },
  { code: '👉', label: 'Fingering', category: 'sexual' },
  { code: '💋', label: 'Oral (received)', category: 'sexual' },
  { code: '🌬️', label: 'Oral (given)', category: 'sexual' },
  { code: '😘', label: 'Kiss', category: 'intimate' },
  { code: '🍑', label: 'Anal', category: 'sexual' },
  { code: '✨', label: 'Solo', category: 'sexual' },
  { code: '🌙', label: 'Cuddle', category: 'intimate' },
  { code: '🩷', label: 'First I Love You', category: 'milestone' },
  { code: '🩸', label: 'Period Start', category: 'cycle' },
]

// ── Encounter ──

export const EncounterSchema = z.object({
  id: z.string().uuid(),
  date: z.string(), // ISO date YYYY-MM-DD
  activities: z.array(z.string()), // emoji codes
  partnerId: z.string().uuid().nullable(),
  rating: z.enum(['up', 'down']).nullable(),
  stars: z.number().min(1).max(10).nullable(),
  vibes: z.array(z.string()),
  noteId: z.string().uuid().nullable(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Partner = z.infer<typeof PartnerSchema>

// ── Private Note ──

export const PrivateNoteSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid().nullable(),
  partnerId: z.string().uuid().nullable(),
  body: z.string(),
  emojiTags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PrivateNote = z.infer<typeof PrivateNoteSchema>

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

export const UserSettingsSchema = z.object({
  notifications: z.boolean(),
  whisperDeliveryDefault: z.enum(['sms', 'in-app', 'copy']),
  calendarStartDay: z.enum(['sunday', 'monday']),
  biometricLock: z.boolean(),
  theme: z.literal('warm'),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().nullable(),
  createdAt: z.string(),
  tier: z.enum(['free', 'premium']),
  premiumExpiresAt: z.string().nullable(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

export const DEFAULT_SETTINGS: UserSettings = {
  notifications: true,
  whisperDeliveryDefault: 'copy',
  calendarStartDay: 'sunday',
  biometricLock: false,
  theme: 'warm',
}
