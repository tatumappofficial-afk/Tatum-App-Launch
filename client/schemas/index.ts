import { z } from 'zod';

// Activity Emoji - fixed set
export const ActivityEmojiSchema = z.object({
  code: z.string(),
  label: z.string(),
  category: z.enum(['sexual', 'intimate', 'milestone', 'cycle']),
});
export type ActivityEmoji = z.infer<typeof ActivityEmojiSchema>;

// Vibe tags
export const VibeTagSchema = z.enum([
  'Passionate', 'Tender', 'Playful', 'Quickie',
  'Emotional', 'Adventurous', 'Routine', 'Reconnecting',
]);
export type VibeTag = z.infer<typeof VibeTagSchema>;

// Partner
export const PartnerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1),
  avatarType: z.enum(['initials', 'emoji', 'color']),
  avatarValue: z.string(),
  avatarGradient: z.tuple([z.string(), z.string()]),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Partner = z.infer<typeof PartnerSchema>;

// Encounter
export const EncounterSchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  activities: z.array(z.string()).min(1),
  partnerId: z.string().uuid().nullable(),
  rating: z.enum(['up', 'down']).nullable(),
  stars: z.number().int().min(1).max(5).nullable(),
  vibes: z.array(VibeTagSchema),
  noteId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Encounter = z.infer<typeof EncounterSchema>;

// Private Note
export const PrivateNoteSchema = z.object({
  id: z.string().uuid(),
  encounterId: z.string().uuid().nullable(),
  partnerId: z.string().uuid().nullable(),
  body: z.string(),
  emojiTags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type PrivateNote = z.infer<typeof PrivateNoteSchema>;

// Desire Entry (Safe Space)
export const DesireEntrySchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  intensity: z.number().int().min(1).max(5).nullable(),
  body: z.string().nullable(),
  partnerId: z.string().uuid().nullable(),
  actedOn: z.boolean().default(false),
  linkedEncounterId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type DesireEntry = z.infer<typeof DesireEntrySchema>;

// Whisper Template
export const WhisperTemplateSchema = z.object({
  id: z.string(),
  category: z.enum(['desire', 'appreciation', 'invitation', 'playful']),
  prompt: z.string(),
  messageBody: z.string(),
  tier: z.enum(['free', 'premium']),
});
export type WhisperTemplate = z.infer<typeof WhisperTemplateSchema>;

// Whisper Message
export const WhisperMessageSchema = z.object({
  id: z.string().uuid(),
  partnerId: z.string().uuid(),
  templateId: z.string().nullable(),
  customBody: z.string().nullable(),
  finalMessage: z.string(),
  deliveryMethod: z.enum(['sms', 'in-app', 'copy']),
  sentAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type WhisperMessage = z.infer<typeof WhisperMessageSchema>;

// Affirmation
export const AffirmationSchema = z.object({
  id: z.string().uuid(),
  body: z.string(),
  source: z.enum(['curated', 'custom']),
  isFavorite: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastShownAt: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Affirmation = z.infer<typeof AffirmationSchema>;

// User Settings
export const UserSettingsSchema = z.object({
  notifications: z.boolean().default(false),
  whisperDeliveryDefault: z.enum(['sms', 'in-app', 'copy']).default('sms'),
  calendarStartDay: z.enum(['sunday', 'monday']).default('sunday'),
  biometricLock: z.boolean().default(false),
  theme: z.literal('warm').default('warm'),
});
export type UserSettings = z.infer<typeof UserSettingsSchema>;

// User Profile
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().nullable(),
  createdAt: z.string().datetime(),
  tier: z.enum(['free', 'premium']).default('free'),
  premiumExpiresAt: z.string().datetime().nullable(),
  settings: UserSettingsSchema,
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// Tier type
export type Tier = 'free' | 'premium';
