/**
 * TanStack DB collection <-> SQLite marshalling: JSON columns, boolean
 * columns, round-trips, deletes, cold reload, and malformed-JSON tolerance.
 * Mirrors the write patterns in app/(sheets)/log-session.tsx.
 */
import { loadFreshDb } from '../support/dbHarness'
import { makeEncounter, makeTag } from '../support/factories'
import { countRows } from './_support'

describe('collections CRUD + marshalling', () => {
  it('serializes JSON columns to text in the SQLite row', async () => {
    const { mod, db } = await loadFreshDb()
    const enc = makeEncounter({
      activities: ['🕯️'],
      activityLabels: { '🕯️': 'Candlelight' },
      partnerIds: [],
    })
    const tx = mod.encounters.insert(enc)
    await tx.isPersisted.promise

    const [raw] = await db.getAllAsync<{ activities: string; activityLabels: string; partnerIds: string }>(
      'SELECT activities, activityLabels, partnerIds FROM encounters WHERE id = ?',
      [enc.id],
    )
    expect(raw.activities).toBe('["🕯️"]')
    expect(raw.activityLabels).toBe('{"🕯️":"Candlelight"}')
    expect(raw.partnerIds).toBe('[]')
    expect(typeof raw.activityLabels).toBe('string')
  })

  it('marshals arrays and booleans and parses them back on read', async () => {
    const { mod } = await loadFreshDb()
    // Boolean columns live on activity_tags (isDefault/isActive).
    const tag = makeTag({ label: 'Candlelight', isDefault: false, isActive: true })
    const tx = mod.activityTags.insert(tag)
    await tx.isPersisted.promise

    await mod.activityTags.preload()
    const stored = mod.activityTags.toArray.find((t) => t.id === tag.id)!
    expect(stored.isDefault).toBe(false)
    expect(stored.isActive).toBe(true)
  })

  it('stores booleans as 0/1 in the underlying row', async () => {
    const { mod, db } = await loadFreshDb()
    const tag = makeTag({ isDefault: false, isActive: true })
    await mod.activityTags.insert(tag).isPersisted.promise
    const [raw] = await db.getAllAsync<{ isDefault: number; isActive: number }>(
      'SELECT isDefault, isActive FROM activity_tags WHERE id = ?',
      [tag.id],
    )
    expect(raw.isDefault).toBe(0)
    expect(raw.isActive).toBe(1)
  })

  it('round-trips an update through SQLite', async () => {
    const { mod, db } = await loadFreshDb()
    const enc = makeEncounter({ notes: null })
    await mod.encounters.insert(enc).isPersisted.promise

    await mod.encounters.update(enc.id, (draft) => {
      draft.notes = 'Updated note'
      draft.stars = 9
    }).isPersisted.promise

    const [raw] = await db.getAllAsync<{ notes: string; stars: number }>(
      'SELECT notes, stars FROM encounters WHERE id = ?',
      [enc.id],
    )
    expect(raw.notes).toBe('Updated note')
    expect(raw.stars).toBe(9)
  })

  it('deletes remove the row from SQLite', async () => {
    const { mod, db } = await loadFreshDb()
    const enc = makeEncounter()
    await mod.encounters.insert(enc).isPersisted.promise
    expect(await countRows(db, 'encounters')).toBe(1)

    await mod.encounters.delete(enc.id).isPersisted.promise
    expect(await countRows(db, 'encounters')).toBe(0)
  })

  it('reloads collections from SQLite on relaunch with JSON columns parsed', async () => {
    const first = await loadFreshDb()
    const enc = makeEncounter({
      activities: ['🕯️', '🏁'],
      activityLabels: { '🕯️': 'Candlelight' },
      partnerIds: [],
    })
    await first.mod.encounters.insert(enc).isPersisted.promise

    const second = await loadFreshDb({ raw: first.raw })
    await second.mod.encounters.preload()
    const reloaded = second.mod.encounters.toArray.find((e) => e.id === enc.id)!
    expect(reloaded.activities).toEqual(['🕯️', '🏁'])
    expect(reloaded.activityLabels).toEqual({ '🕯️': 'Candlelight' })
    expect(reloaded.partnerIds).toEqual([])
  })

  it('falls back (no crash) when a row has malformed JSON in an object column', async () => {
    const first = await loadFreshDb()
    const enc = makeEncounter({ activityLabels: {} })
    await first.mod.encounters.insert(enc).isPersisted.promise
    // Plant malformed JSON straight into SQLite, bypassing the collection.
    await first.db.runAsync('UPDATE encounters SET activityLabels = ? WHERE id = ?', ['{not json', enc.id])

    const second = await loadFreshDb({ raw: first.raw })
    await second.mod.encounters.preload()
    const reloaded = second.mod.encounters.toArray.find((e) => e.id === enc.id)!
    // jsonObjectColumns fall back to {} (parseJsonColumn), not a thrown parse.
    expect(reloaded.activityLabels).toEqual({})
  })
})
