import {
  ActivityTagSchema,
  AffirmationSchema,
  DEFAULT_ACTIVITY_TAGS,
  DesireEntrySchema,
  EncounterSchema,
  PartnerSchema,
  PERIOD_TAG_ID,
  WhisperMessageSchema,
} from '@/src/db/schema'
import {
  makeAffirmation,
  makeDesireEntry,
  makeEncounter,
  makePartner,
  makeTag,
  makeWhisperMessage,
} from '../support/factories'

describe('schema round-trips via factories', () => {
  it('parses a factory-built value for each entity without loss', () => {
    const cases = [
      [ActivityTagSchema, makeTag()],
      [PartnerSchema, makePartner()],
      [EncounterSchema, makeEncounter()],
      [DesireEntrySchema, makeDesireEntry()],
      [WhisperMessageSchema, makeWhisperMessage()],
      [AffirmationSchema, makeAffirmation()],
    ] as const
    for (const [schema, value] of cases) {
      expect((schema as { parse: (v: unknown) => unknown }).parse(value)).toEqual(value)
    }
  })
})

describe('EncounterSchema validation', () => {
  it('rejects an empty activities array', () => {
    expect(() => makeEncounter({ activities: [] })).toThrow()
  })

  it('rejects stars above the 0–10 range', () => {
    expect(() => makeEncounter({ stars: 11 })).toThrow()
  })

  it('rejects negative stars', () => {
    expect(() => makeEncounter({ stars: -1 })).toThrow()
  })

  it('accepts null stars and null notes', () => {
    const enc = makeEncounter({ stars: null, notes: null })
    expect(enc.stars).toBeNull()
    expect(enc.notes).toBeNull()
  })

  it('rejects notes longer than 3000 chars', () => {
    expect(() => makeEncounter({ notes: 'x'.repeat(3001) })).toThrow()
  })

  it('rejects a non-uuid id', () => {
    expect(() => makeEncounter({ id: 'not-a-uuid' })).toThrow()
  })
})

describe('ActivityTagSchema validation', () => {
  it('rejects a label longer than 50 chars', () => {
    expect(() => makeTag({ label: 'x'.repeat(51) })).toThrow()
  })

  it('accepts a label at the 50-char bound', () => {
    expect(makeTag({ label: 'x'.repeat(50) }).label).toHaveLength(50)
  })

  it('accepts a null deactivatedAt', () => {
    expect(makeTag({ deactivatedAt: null }).deactivatedAt).toBeNull()
  })
})

describe('DEFAULT_ACTIVITY_TAGS invariants', () => {
  it('has 26 entries', () => {
    expect(DEFAULT_ACTIVITY_TAGS).toHaveLength(26)
  })

  it('has exactly one Period entry keyed by PERIOD_TAG_ID with the blood-drop emoji', () => {
    const periodEntries = DEFAULT_ACTIVITY_TAGS.filter((t) => t.id === PERIOD_TAG_ID)
    expect(periodEntries).toHaveLength(1)
    expect(periodEntries[0].emoji).toBe('🩸')
  })

  it('only the Period entry carries a preset id', () => {
    const withId = DEFAULT_ACTIVITY_TAGS.filter((t) => t.id !== undefined)
    expect(withId).toHaveLength(1)
    expect(withId[0].id).toBe(PERIOD_TAG_ID)
  })

  it('keeps every label within the ActivityTag 50-char bound', () => {
    for (const tag of DEFAULT_ACTIVITY_TAGS) {
      expect(tag.label.length).toBeLessThanOrEqual(50)
    }
  })

  it('gives every entry a non-empty emoji and label', () => {
    for (const tag of DEFAULT_ACTIVITY_TAGS) {
      expect(tag.emoji.length).toBeGreaterThan(0)
      expect(tag.label.length).toBeGreaterThan(0)
    }
  })
})
