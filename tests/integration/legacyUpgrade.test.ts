/**
 * Real v4 -> v5 upgrade of a database carrying legacy-shaped rows, driven
 * through the shipped migrations + the JS heals in src/db/index.ts.
 */
import { loadFreshDb } from '../support/dbHarness'
import { buildDbAtVersion } from '../support/legacyDb'

/** Insert an encounter straight into a pre-v5 (no activityLabels column) db. */
function insertLegacyEncounter(raw: import('node:sqlite').DatabaseSync, id: string, activities: string) {
  raw
    .prepare(
      'INSERT INTO encounters (id, date, activities, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .run(id, '2026-05-01', activities, '[]', null, null, '2026-05-01T12:00:00.000Z', '2026-05-01T12:00:00.000Z')
}

describe('legacy v4 -> v5 upgrade', () => {
  it('upgrades schema and heals legacy rows in one relaunch', async () => {
    const raw = buildDbAtVersion(4)

    // v1.0 object-format activities (each activity was a {emoji,label} snapshot).
    insertLegacyEncounter(raw, 'aaaaaaaa-0000-4000-8000-000000000001', '[{"emoji":"🔥","label":"Old Spark"}]')
    // Plain emoji-string array (every build since v1.0).
    insertLegacyEncounter(raw, 'aaaaaaaa-0000-4000-8000-000000000002', '["🕯️"]')
    // Unparseable activities text — heal must skip it, not crash.
    insertLegacyEncounter(raw, 'aaaaaaaa-0000-4000-8000-000000000003', '[{ broken json')
    // An already-inactive tag so migration 5 stamps deactivatedAt.
    raw
      .prepare('INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, 0, 0)')
      .run('tag-legacy-inactive', '🪩', 'Disco', 99)

    const { db } = await loadFreshDb({ raw })

    // Schema upgraded.
    const [{ user_version }] = await db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    expect(user_version).toBe(5)
    const cols = await db.getAllAsync<{ name: string }>("SELECT name FROM pragma_table_info('encounters')")
    expect(cols.map((c) => c.name)).toContain('activityLabels')

    // Object-format row -> bare emoji array WITH label preserved into the snapshot.
    const [objRow] = await db.getAllAsync<{ activities: string; activityLabels: string }>(
      'SELECT activities, activityLabels FROM encounters WHERE id = ?',
      ['aaaaaaaa-0000-4000-8000-000000000001'],
    )
    expect(JSON.parse(objRow.activities)).toEqual(['🔥'])
    expect(JSON.parse(objRow.activityLabels)).toEqual({ '🔥': 'Old Spark' })

    // Plain emoji-string row untouched, default '{}' labels.
    const [plainRow] = await db.getAllAsync<{ activities: string; activityLabels: string }>(
      'SELECT activities, activityLabels FROM encounters WHERE id = ?',
      ['aaaaaaaa-0000-4000-8000-000000000002'],
    )
    expect(JSON.parse(plainRow.activities)).toEqual(['🕯️'])
    expect(plainRow.activityLabels).toBe('{}')

    // Unparseable row survives untouched (the heal `continue`s past it).
    const [brokenRow] = await db.getAllAsync<{ activities: string; activityLabels: string }>(
      'SELECT activities, activityLabels FROM encounters WHERE id = ?',
      ['aaaaaaaa-0000-4000-8000-000000000003'],
    )
    expect(brokenRow.activities).toBe('[{ broken json')
    expect(brokenRow.activityLabels).toBe('{}')

    // Migration 5 stamped deactivatedAt onto the pre-existing inactive tag.
    const [tag] = await db.getAllAsync<{ deactivatedAt: string | null; isActive: number }>(
      'SELECT deactivatedAt, isActive FROM activity_tags WHERE id = ?',
      ['tag-legacy-inactive'],
    )
    expect(tag.isActive).toBe(0)
    expect(tag.deactivatedAt).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/))
  })
})
