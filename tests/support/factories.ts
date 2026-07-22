/**
 * Fixture builders. Every factory parses its result through the real Zod
 * schema so fixtures can never drift from the app's data contract.
 *
 * Wording rule (project-wide): fixture labels, names, and notes stay neutral —
 * never restate the default tag labels from schema.ts as string literals in
 * tests; assert against DEFAULT_ACTIVITY_TAGS programmatically instead.
 */
import {
  ActivityTagSchema,
  AffirmationSchema,
  DesireEntrySchema,
  EncounterSchema,
  PartnerSchema,
  WhisperMessageSchema,
  type ActivityTag,
  type Affirmation,
  type DesireEntry,
  type Encounter,
  type Partner,
  type WhisperMessage,
} from '@/src/db/schema'
import { generateId } from '@/src/utils/uuid'

const NOW = '2026-07-01T12:00:00.000Z'

let tagCounter = 0

export function makeTag(overrides: Partial<ActivityTag> = {}): ActivityTag {
  tagCounter += 1
  return ActivityTagSchema.parse({
    id: `tag-test-${tagCounter}`,
    emoji: '🕯️',
    label: 'Candlelight',
    sortOrder: tagCounter,
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    ...overrides,
  })
}

export function makePartner(overrides: Partial<Partner> = {}): Partner {
  return PartnerSchema.parse({
    id: generateId(),
    displayName: 'Jordan Reyes',
    avatarType: 'initials',
    avatarValue: 'JR',
    avatarGradient: '',
    isActive: true,
    isMain: false,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  })
}

export function makeEncounter(overrides: Partial<Encounter> = {}): Encounter {
  return EncounterSchema.parse({
    id: generateId(),
    date: '2026-07-01',
    activities: ['🕯️'],
    activityLabels: {},
    partnerIds: [],
    stars: null,
    notes: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  })
}

export function makeDesireEntry(overrides: Partial<DesireEntry> = {}): DesireEntry {
  return DesireEntrySchema.parse({
    id: generateId(),
    timestamp: NOW,
    intensity: null,
    body: null,
    partnerId: null,
    actedOn: false,
    linkedEncounterId: null,
    createdAt: NOW,
    ...overrides,
  })
}

export function makeWhisperMessage(overrides: Partial<WhisperMessage> = {}): WhisperMessage {
  return WhisperMessageSchema.parse({
    id: generateId(),
    partnerId: generateId(),
    templateId: null,
    customBody: null,
    finalMessage: 'Thinking of you',
    deliveryMethod: 'copy',
    sentAt: NOW,
    createdAt: NOW,
    ...overrides,
  })
}

export function makeAffirmation(overrides: Partial<Affirmation> = {}): Affirmation {
  return AffirmationSchema.parse({
    id: generateId(),
    body: 'You are enough.',
    source: 'curated',
    isFavorite: false,
    isActive: true,
    lastShownAt: null,
    createdAt: NOW,
    ...overrides,
  })
}
