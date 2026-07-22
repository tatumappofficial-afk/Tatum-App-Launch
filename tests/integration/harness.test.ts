/**
 * Harness self-test: proves the node:sqlite shim, module-registry reset, and
 * relaunch primitive work before any real suite relies on them.
 */
import { loadFreshDb } from '../support/dbHarness'
import { buildDbAtVersion } from '../support/legacyDb'

describe('db test harness', () => {
  it('initializes a fresh in-memory database to the target schema version', async () => {
    const { db } = await loadFreshDb()
    const rows = await db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    expect(rows[0].user_version).toBe(5)
    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
    )
    expect(tables.map((t) => t.name)).toEqual(
      expect.arrayContaining(['activity_tags', 'encounters', 'partners', 'user_settings']),
    )
  })

  it('gives each loadFreshDb call an isolated database', async () => {
    const first = await loadFreshDb()
    await first.db.runAsync('INSERT INTO partners (id, displayName, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [
      '00000000-0000-4000-8000-000000000001',
      'Isolation Check',
      '2026-01-01',
      '2026-01-01',
    ])
    const second = await loadFreshDb()
    const rows = await second.db.getAllAsync('SELECT * FROM partners WHERE displayName = ?', ['Isolation Check'])
    expect(rows).toHaveLength(0)
  })

  it('relaunches against the same database when given the raw handle back', async () => {
    const first = await loadFreshDb()
    await first.db.runAsync('INSERT INTO partners (id, displayName, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [
      '00000000-0000-4000-8000-000000000002',
      'Relaunch Check',
      '2026-01-01',
      '2026-01-01',
    ])
    const second = await loadFreshDb({ raw: first.raw })
    const rows = await second.db.getAllAsync('SELECT * FROM partners WHERE displayName = ?', ['Relaunch Check'])
    expect(rows).toHaveLength(1)
  })

  it('replays real migrations to build a historical schema version', () => {
    const raw = buildDbAtVersion(4)
    const version = raw.prepare('PRAGMA user_version').get() as { user_version: number }
    expect(version.user_version).toBe(4)
    const cols = raw.prepare("SELECT name FROM pragma_table_info('encounters')").all() as {
      name: string
    }[]
    expect(cols.map((c) => c.name)).not.toContain('activityLabels')
  })
})
