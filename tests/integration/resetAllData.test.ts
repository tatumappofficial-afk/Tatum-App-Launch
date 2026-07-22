/**
 * resetAllData(): the dev/test raw-SQL wipe. Unlike eraseAllUserData it also
 * clears user_settings + user_profile and re-seeds them, and does NOT re-create
 * the Solo partner.
 */
import { loadFreshDb } from '../support/dbHarness'
import { makeEncounter } from '../support/factories'
import { DEFAULT_ACTIVITY_TAGS } from '@/src/db/schema'
import { countRows } from './_support'

describe('resetAllData', () => {
  it('wipes every table then re-seeds profile, default tags, and settings', async () => {
    const { mod, db } = await loadFreshDb()
    await mod.encounters.insert(makeEncounter()).isPersisted.promise
    await db.runAsync(
      'INSERT INTO affirmations (id, body, source, isFavorite, isActive, lastShownAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['aaaa1111-0000-4000-8000-000000000001', 'x', 'curated', 0, 1, null, '2026-05-01'],
    )

    await mod.resetAllData()

    // Data tables fully cleared — including partners (NOT re-seeded here).
    expect(await countRows(db, 'encounters')).toBe(0)
    expect(await countRows(db, 'partners')).toBe(0)
    expect(await countRows(db, 'affirmations')).toBe(0)
    expect(await countRows(db, 'whisper_messages')).toBe(0)
    expect(await countRows(db, 'desire_entries')).toBe(0)

    // Default tags re-seeded.
    expect(await countRows(db, 'activity_tags')).toBe(DEFAULT_ACTIVITY_TAGS.length)

    // Single default profile row, free tier.
    const [profile] = await db.getAllAsync<{ id: string; tier: string; displayName: string | null }>(
      'SELECT id, tier, displayName FROM user_profile',
    )
    expect(profile).toMatchObject({ id: 'default', tier: 'free', displayName: null })

    // user_settings singleton re-inserted with defaults (backupEnabled falls to
    // its column default of 1 since the INSERT omits it).
    const [settings] = await db.getAllAsync<Record<string, unknown>>('SELECT * FROM user_settings')
    expect(settings).toMatchObject({
      id: 'singleton',
      notifications: 1,
      whisperDeliveryDefault: 'copy',
      calendarStartDay: 'sunday',
      biometricLock: 0,
      hasOnboarded: 0,
      theme: 'warm',
      backupEnabled: 1,
    })
  })
})
