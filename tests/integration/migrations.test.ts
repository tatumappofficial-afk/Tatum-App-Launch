/**
 * Forward-only migration runner: fresh v0->5 build, idempotent relaunch,
 * ahead-of-target handling, and per-migration transactional atomicity.
 */
import { loadFreshDb } from '../support/dbHarness'
import { buildDbAtVersion } from '../support/legacyDb'
import { countRows } from './_support'

describe('migrations', () => {
  it('brings a fresh database to the target schema version 5', async () => {
    const { db } = await loadFreshDb()
    const [{ user_version }] = await db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    expect(user_version).toBe(5)
  })

  it('creates every table', async () => {
    const { db } = await loadFreshDb()
    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    )
    expect(tables.map((t) => t.name).sort()).toEqual(
      [
        'activity_tags',
        'affirmations',
        'desire_entries',
        'encounters',
        'partners',
        'user_profile',
        'user_settings',
        'whisper_messages',
      ].sort(),
    )
  })

  it('seeds the user_settings singleton with defaults', async () => {
    const { db } = await loadFreshDb()
    expect(await countRows(db, 'user_settings')).toBe(1)
    const [s] = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM user_settings WHERE id = 'singleton'")
    expect(s).toMatchObject({
      id: 'singleton',
      notifications: 1,
      whisperDeliveryDefault: 'copy',
      calendarStartDay: 'sunday',
      biometricLock: 0,
      hasOnboarded: 0,
      theme: 'warm',
      backupEnabled: 1, // added by migration 4
    })
  })

  it('defaults encounters.activityLabels to {} and indexes encounters.date', async () => {
    const { db } = await loadFreshDb()
    const cols = await db.getAllAsync<{ name: string; dflt_value: string | null }>(
      "SELECT name, dflt_value FROM pragma_table_info('encounters')",
    )
    const labelsCol = cols.find((c) => c.name === 'activityLabels')
    expect(labelsCol?.dflt_value).toBe("'{}'")

    const idx = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='index' AND name = 'idx_encounters_date'",
    )
    expect(idx).toHaveLength(1)
  })

  it('is a no-op on relaunch (no schema churn, no duplicate seed rows)', async () => {
    const first = await loadFreshDb()
    const tagsBefore = await countRows(first.db, 'activity_tags')
    const settingsBefore = await countRows(first.db, 'user_settings')

    const second = await loadFreshDb({ raw: first.raw })
    const [{ user_version }] = await second.db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    expect(user_version).toBe(5)
    expect(await countRows(second.db, 'activity_tags')).toBe(tagsBefore)
    expect(await countRows(second.db, 'user_settings')).toBe(settingsBefore)
  })

  it('warns but does not throw or downgrade when the DB is ahead of the target', async () => {
    const { raw } = await loadFreshDb()
    raw.exec('PRAGMA user_version = 99')
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const relaunch = await loadFreshDb({ raw })
    const [{ user_version }] = await relaunch.db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    expect(user_version).toBe(99) // not downgraded
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ahead of'))
    warn.mockRestore()
  })

  it('rolls a failing migration back atomically (version and schema change both revert)', async () => {
    // MIGRATIONS is const, so we can't inject a poisoned entry into the real
    // runner. Instead we drive the exact per-migration primitive runMigrations
    // uses — withTransactionAsync wrapping `up` then `PRAGMA user_version` — and
    // prove a throw inside it reverts BOTH, which is the atomicity guarantee the
    // runner (src/db/sqlite.ts) relies on.
    const raw = buildDbAtVersion(4)
    const shim = require('../shims/expo-sqlite') as typeof import('../shims/expo-sqlite')
    shim.__setNextRawDatabase(raw)
    const wrapped = await shim.openDatabaseAsync('atomicity.db')

    await expect(
      wrapped.withTransactionAsync(async () => {
        await wrapped.execAsync('PRAGMA user_version = 5')
        await wrapped.execAsync('CREATE TABLE poison (id TEXT);')
        await wrapped.execAsync('THIS IS NOT VALID SQL') // throws -> ROLLBACK
      }),
    ).rejects.toThrow()

    const version = raw.prepare('PRAGMA user_version').get() as { user_version: number }
    expect(version.user_version).toBe(4) // version bump rolled back
    const poison = raw.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = 'poison'").all()
    expect(poison).toHaveLength(0) // schema change rolled back
  })
})
