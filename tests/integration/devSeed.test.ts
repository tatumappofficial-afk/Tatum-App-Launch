/**
 * Dev seed: env gating, fresh-awareness, deterministic content, and the
 * onboarded/auth-identity spot checks that let automation skip sign-in.
 */
import { loadFreshDb } from '../support/dbHarness'
import { countRows, dumpTable } from './_support'

describe('devSeed gating', () => {
  it('seeds nothing without the env flag', async () => {
    const { db } = await loadFreshDb()
    expect(await countRows(db, 'encounters')).toBe(0)
  })

  it('seeds a heavy dataset when devSeed is enabled', async () => {
    const { db } = await loadFreshDb({ devSeed: true })
    expect(await countRows(db, 'encounters')).toBeGreaterThan(0)
  })

  it('is fresh-aware: re-seeding an already-seeded db changes no row counts', async () => {
    const first = await loadFreshDb({ devSeed: true })
    const counts = {
      encounters: await countRows(first.db, 'encounters'),
      partners: await countRows(first.db, 'partners'),
      desire_entries: await countRows(first.db, 'desire_entries'),
    }

    const second = await loadFreshDb({ raw: first.raw, devSeed: true })
    expect(await countRows(second.db, 'encounters')).toBe(counts.encounters)
    expect(await countRows(second.db, 'partners')).toBe(counts.partners)
    expect(await countRows(second.db, 'desire_entries')).toBe(counts.desire_entries)
  })
})

describe('devSeed determinism', () => {
  afterEach(() => jest.useRealTimers())

  it('produces byte-identical content (id columns projected out) across two fresh seeds', async () => {
    jest.useFakeTimers({ now: new Date('2026-07-15T12:00:00.000Z') })

    const a = await loadFreshDb({ devSeed: true })
    const b = await loadFreshDb({ devSeed: true })

    // Columns that carry random UUIDs (or references to them) are projected out;
    // everything else is content that the constant-seeded PRNG + fixed clock make
    // deterministic.
    const projections: Record<string, string[]> = {
      encounters: ['id', 'partnerIds'],
      partners: ['id'],
      activity_tags: ['id'],
      desire_entries: ['id', 'partnerId', 'linkedEncounterId'],
      whisper_messages: ['id', 'partnerId'],
      affirmations: ['id'],
    }
    for (const [table, omit] of Object.entries(projections)) {
      expect(await dumpTable(b.db, table, omit)).toEqual(await dumpTable(a.db, table, omit))
    }
  })
})

describe('devSeed spot checks', () => {
  it('creates three named partners plus Solo, with a named partner as main', async () => {
    const { db } = await loadFreshDb({ devSeed: true })
    const partners = await db.getAllAsync<{ displayName: string; isMain: number }>(
      'SELECT displayName, isMain FROM partners',
    )
    expect(partners).toHaveLength(4) // 3 named + Solo
    expect(partners.filter((p) => p.displayName === 'Solo')).toHaveLength(1)

    const [main] = await db.getAllAsync<{ displayName: string }>('SELECT displayName FROM partners WHERE isMain = 1')
    expect(main.displayName).not.toBe('Solo')
  })

  it('marks the user onboarded and stamps a fake auth identity', async () => {
    const { db } = await loadFreshDb({ devSeed: true })
    const [settings] = await db.getAllAsync<{ hasOnboarded: number }>(
      "SELECT hasOnboarded FROM user_settings WHERE id = 'singleton'",
    )
    expect(settings.hasOnboarded).toBe(1)

    const [profile] = await db.getAllAsync<{ email: string; authProvider: string; providerUserId: string }>(
      "SELECT email, authProvider, providerUserId FROM user_profile WHERE id = 'default'",
    )
    expect(profile).toMatchObject({
      email: 'dev-seed@example.com',
      authProvider: 'google',
      providerUserId: 'dev-seed-user',
    })
  })
})
