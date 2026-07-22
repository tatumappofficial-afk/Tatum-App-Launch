/**
 * initDatabase(): fresh seeding, the Period-tag heals, premium/initials/date
 * backfills, and idempotency across repeated init + relaunch.
 */
// Pin the timezone so the legacy UTC quick-log date heal is deterministic.
import { loadFreshDb } from '../support/dbHarness'
import { buildDbAtVersion } from '../support/legacyDb'
import { DEFAULT_ACTIVITY_TAGS, PERIOD_TAG_ID } from '@/src/db/schema'
import { countRows, dumpTable } from './_support'

/** Ensure at least one activity_tags row exists so initDatabase skips the
 * bulk default-seed path and we can isolate a single heal. */
function seedOneTag(
  raw: import('node:sqlite').DatabaseSync,
  id: string,
  emoji: string,
  label: string,
  isDefault = 1,
  isActive = 1,
) {
  raw
    .prepare('INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, emoji, label, 0, isDefault, isActive)
}

describe('initDatabase fresh seeding', () => {
  it('creates the default profile, all default tags, and an isMain Solo partner', async () => {
    const { db } = await loadFreshDb()

    const [profile] = await db.getAllAsync<{ id: string; tier: string }>('SELECT id, tier FROM user_profile')
    expect(profile).toMatchObject({ id: 'default', tier: 'free' })

    expect(await countRows(db, 'activity_tags')).toBe(DEFAULT_ACTIVITY_TAGS.length)

    const [solo] = await db.getAllAsync<{ displayName: string; isMain: number; isActive: number }>(
      "SELECT displayName, isMain, isActive FROM partners WHERE displayName = 'Solo'",
    )
    expect(solo).toMatchObject({ displayName: 'Solo', isMain: 1, isActive: 1 })
  })

  it('seeds Period with the stable PERIOD_TAG_ID', async () => {
    const { db } = await loadFreshDb()
    const [period] = await db.getAllAsync<{ id: string; emoji: string }>(
      'SELECT id, emoji FROM activity_tags WHERE id = ?',
      [PERIOD_TAG_ID],
    )
    expect(period.emoji).toBe('🩸')
  })
})

describe('initDatabase Period heals', () => {
  it('rewrites a mis-ided Period row to PERIOD_TAG_ID', async () => {
    const raw = buildDbAtVersion(5)
    // A Period tag installed under a random UUID (pre-stable-id builds).
    seedOneTag(raw, 'random-uuid-1234', '🩸', 'Period')

    const { db } = await loadFreshDb({ raw })
    const rows = await db.getAllAsync<{ id: string }>("SELECT id FROM activity_tags WHERE emoji = '🩸'")
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe(PERIOD_TAG_ID)
  })

  it('re-inserts Period when it is missing', async () => {
    const raw = buildDbAtVersion(5)
    // Some non-Period tag exists (so the bulk seed is skipped) but no Period.
    seedOneTag(raw, 'tag-other', '🕯️', 'Candlelight', 0, 1)

    const { db } = await loadFreshDb({ raw })
    const [period] = await db.getAllAsync<{ id: string; label: string; isActive: number }>(
      'SELECT id, label, isActive FROM activity_tags WHERE id = ?',
      [PERIOD_TAG_ID],
    )
    expect(period).toMatchObject({ id: PERIOD_TAG_ID, label: 'Period', isActive: 1 })
  })

  it('reactivates a soft-deleted Period and clears its deactivatedAt', async () => {
    const raw = buildDbAtVersion(5)
    raw
      .prepare(
        'INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive, deactivatedAt) VALUES (?, ?, ?, ?, 1, 0, ?)',
      )
      .run(PERIOD_TAG_ID, '🩸', 'Period', 5, '2020-01-01T00:00:00.000Z')

    const { db } = await loadFreshDb({ raw })
    const [period] = await db.getAllAsync<{ isActive: number; deactivatedAt: string | null }>(
      'SELECT isActive, deactivatedAt FROM activity_tags WHERE id = ?',
      [PERIOD_TAG_ID],
    )
    expect(period.isActive).toBe(1)
    expect(period.deactivatedAt).toBeNull()
  })
})

describe('initDatabase backfills', () => {
  it('upgrades an onboarded free user to premium', async () => {
    const raw = buildDbAtVersion(5)
    raw.exec("UPDATE user_settings SET hasOnboarded = 1 WHERE id = 'singleton'")
    raw
      .prepare(
        "INSERT INTO user_profile (id, displayName, avatarGradient, createdAt, tier, premiumExpiresAt) VALUES ('default', NULL, '', '2026-01-01T00:00:00.000Z', 'free', '2026-12-01T00:00:00.000Z')",
      )
      .run()

    const { db } = await loadFreshDb({ raw })
    const [profile] = await db.getAllAsync<{ tier: string; premiumExpiresAt: string | null }>(
      "SELECT tier, premiumExpiresAt FROM user_profile WHERE id = 'default'",
    )
    expect(profile.tier).toBe('premium')
    expect(profile.premiumExpiresAt).toBeNull()
  })

  it('backfills a single-character legacy partner initial', async () => {
    const raw = buildDbAtVersion(5)
    raw
      .prepare(
        "INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, isMain, createdAt, updatedAt) VALUES ('11111111-0000-4000-8000-000000000001', 'Jordan Reyes', 'initials', 'J', '', 1, 0, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')",
      )
      .run()

    const { db } = await loadFreshDb({ raw })
    const [partner] = await db.getAllAsync<{ avatarValue: string }>('SELECT avatarValue FROM partners WHERE id = ?', [
      '11111111-0000-4000-8000-000000000001',
    ])
    expect(partner.avatarValue).toBe('JO') // deriveInitials('Jordan Reyes')
  })

  it('rewrites a legacy UTC quick-log date to the local date, leaving manual dates alone', async () => {
    const raw = buildDbAtVersion(5)
    // Bug row: date equals the UTC slice of createdAt, but local (LA) date differs.
    raw
      .prepare(
        'INSERT INTO encounters (id, date, activities, activityLabels, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        'bbbbbbbb-0000-4000-8000-000000000001',
        '2026-03-10',
        '["🏁"]',
        '{}',
        '[]',
        null,
        null,
        '2026-03-10T02:00:00.000Z', // 2026-03-09 18:00 in America/Los_Angeles
        '2026-03-10T02:00:00.000Z',
      )
    // Control row: manually-dated full log — date does NOT match the UTC slice.
    raw
      .prepare(
        'INSERT INTO encounters (id, date, activities, activityLabels, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        'bbbbbbbb-0000-4000-8000-000000000002',
        '2026-03-10',
        '["🏁"]',
        '{}',
        '[]',
        null,
        null,
        '2026-03-11T20:00:00.000Z',
        '2026-03-11T20:00:00.000Z',
      )

    const { db } = await loadFreshDb({ raw })
    const [bugRow] = await db.getAllAsync<{ date: string }>('SELECT date FROM encounters WHERE id = ?', [
      'bbbbbbbb-0000-4000-8000-000000000001',
    ])
    const [controlRow] = await db.getAllAsync<{ date: string }>('SELECT date FROM encounters WHERE id = ?', [
      'bbbbbbbb-0000-4000-8000-000000000002',
    ])
    expect(bugRow.date).toBe('2026-03-09') // healed to local date
    expect(controlRow.date).toBe('2026-03-10') // untouched
  })
})

describe('initDatabase idempotency', () => {
  it('does not duplicate seed rows when initDatabase runs twice in one registry', async () => {
    const { mod, db } = await loadFreshDb()
    const tagsBefore = await countRows(db, 'activity_tags')
    const partnersBefore = await countRows(db, 'partners')

    await mod.initDatabase() // guarded by the `initialized` flag — a no-op

    expect(await countRows(db, 'activity_tags')).toBe(tagsBefore)
    expect(await countRows(db, 'partners')).toBe(partnersBefore)
  })

  it('produces identical activity_tags/partners dumps across two relaunches', async () => {
    const first = await loadFreshDb()
    const second = await loadFreshDb({ raw: first.raw })
    const dumpA = {
      tags: await dumpTable(second.db, 'activity_tags'),
      partners: await dumpTable(second.db, 'partners'),
    }
    const third = await loadFreshDb({ raw: first.raw })
    const dumpB = {
      tags: await dumpTable(third.db, 'activity_tags'),
      partners: await dumpTable(third.db, 'partners'),
    }
    expect(dumpB).toEqual(dumpA)
  })
})
