/**
 * eraseAllUserData(): wipes every data table (including rows written straight
 * to SQLite outside any collection), resets the profile row, and re-seeds the
 * default tags + Solo partner, keeping the in-memory collections consistent.
 */
import { loadFreshDb } from '../support/dbHarness'
import { makeEncounter } from '../support/factories'
import { DEFAULT_ACTIVITY_TAGS, PERIOD_TAG_ID } from '@/src/db/schema'
import { countRows, flush } from './_support'

describe('eraseAllUserData', () => {
  it('clears all data (collection- and raw-written), resets profile, re-seeds defaults', async () => {
    const { mod, db } = await loadFreshDb()

    // Give the profile some identity so we can prove the reset.
    await mod.userProfiles.preload()
    await mod.userProfiles.update('default', (d) => {
      d.displayName = 'Alex'
      d.email = 'alex@example.com'
      d.authProvider = 'google'
      d.providerUserId = 'provider-123'
      d.tier = 'premium'
    }).isPersisted.promise

    // A row written through a collection…
    await mod.encounters.insert(makeEncounter()).isPersisted.promise
    // …and rows written straight to SQLite, invisible to the collections.
    await db.runAsync(
      'INSERT INTO encounters (id, date, activities, activityLabels, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'ffffffff-0000-4000-8000-000000000001',
        '2026-05-01',
        '["🏁"]',
        '{}',
        '[]',
        null,
        null,
        '2026-05-01',
        '2026-05-01',
      ],
    )
    await db.runAsync(
      'INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, isMain, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['ffffffff-0000-4000-8000-000000000002', 'Raw Partner', 'initials', 'RP', '', 1, 0, '2026-05-01', '2026-05-01'],
    )
    await db.runAsync(
      'INSERT INTO affirmations (id, body, source, isFavorite, isActive, lastShownAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['ffffffff-0000-4000-8000-000000000003', 'Raw affirmation', 'curated', 0, 1, null, '2026-05-01'],
    )
    expect(await countRows(db, 'encounters')).toBe(2)

    // A non-default settings VALUE must survive the erase — row-count alone
    // would stay 1 even if erase wrongly reset settings.
    await db.runAsync("UPDATE user_settings SET calendarStartDay = 'monday' WHERE id = 'singleton'")

    await mod.eraseAllUserData()
    await flush(db)

    // Data tables empty (raw-written rows too).
    expect(await countRows(db, 'encounters')).toBe(0)
    expect(await countRows(db, 'desire_entries')).toBe(0)
    expect(await countRows(db, 'whisper_messages')).toBe(0)
    expect(await countRows(db, 'affirmations')).toBe(0)

    // Default tags re-seeded, Period keeps its stable id.
    expect(await countRows(db, 'activity_tags')).toBe(DEFAULT_ACTIVITY_TAGS.length)
    const [period] = await db.getAllAsync<{ id: string }>('SELECT id FROM activity_tags WHERE id = ?', [PERIOD_TAG_ID])
    expect(period.id).toBe(PERIOD_TAG_ID)

    // Solo partner re-created as the sole, main partner.
    const partners = await db.getAllAsync<{ displayName: string; isMain: number }>(
      'SELECT displayName, isMain FROM partners',
    )
    expect(partners).toHaveLength(1)
    expect(partners[0]).toMatchObject({ displayName: 'Solo', isMain: 1 })

    // Profile reset (row kept, fields cleared), user_settings untouched.
    const [profile] = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM user_profile WHERE id = 'default'")
    expect(profile).toMatchObject({
      id: 'default',
      displayName: null,
      email: null,
      authProvider: null,
      providerUserId: null,
      avatarValue: null,
      tier: 'free',
      premiumExpiresAt: null,
    })
    expect(await countRows(db, 'user_settings')).toBe(1)
    const [settings] = await db.getAllAsync<{ calendarStartDay: string }>(
      "SELECT calendarStartDay FROM user_settings WHERE id = 'singleton'",
    )
    expect(settings.calendarStartDay).toBe('monday')
  })

  it('leaves the in-memory collections consistent with SQLite after erase', async () => {
    const { mod, db } = await loadFreshDb()
    await mod.encounters.insert(makeEncounter()).isPersisted.promise

    await mod.eraseAllUserData()
    await flush(db)

    await mod.activityTags.preload()
    await mod.partners.preload()
    await mod.encounters.preload()

    expect(mod.activityTags.toArray).toHaveLength(await countRows(db, 'activity_tags'))
    expect(mod.partners.toArray).toHaveLength(await countRows(db, 'partners'))
    expect(mod.encounters.toArray).toHaveLength(0)
    expect(mod.partners.toArray[0].displayName).toBe('Solo')
  })
})
