/**
 * Flagship regression replay for tag-name history. Mirrors the exact collection
 * writes performed by app/(sheets)/edit-tag.tsx (handleSave/handleDelete) and
 * app/(sheets)/log-session.tsx (handleSave): custom-tag create, rename, emoji
 * swap (retire old + update live), soft-delete, emoji re-create, no-op re-save,
 * and a cold relaunch. Every past session must keep the label its tag had at
 * log time; only sessions logged afterwards see the new name.
 */
import { loadFreshDb } from '../support/dbHarness'
import type { FreshDb } from '../support/dbHarness'
import { makeEncounter } from '../support/factories'
import { sessionTagLabel } from '@/src/utils/tagLabels'
import type { ActivityTag, Encounter } from '@/src/db/schema'

const CANDLE = '🕯️'
const DISCO = '🪩'

/** Live tags array from the collection's optimistic store (mirrors the
 * useLiveQuery the screens hand to buildActivityLabels/sessionTagLabel). */
function tagsOf(mod: FreshDb['mod']): ActivityTag[] {
  return mod.activityTags.toArray
}

function encOf(mod: FreshDb['mod'], id: string): Encounter {
  return mod.encounters.toArray.find((e) => e.id === id)!
}

describe('tag-name history replay', () => {
  it('keeps every past session on its log-time label through rename/swap/delete/re-create + relaunch', async () => {
    const { mod, raw } = await loadFreshDb()
    await mod.activityTags.preload()
    await mod.encounters.preload()

    // ── (a) create custom tag 🕯️ 'Candlelight' ──
    const nextOrder = Math.max(...tagsOf(mod).map((t) => t.sortOrder)) + 1
    const candleTagId = 'cccccccc-0000-4000-8000-0000000000c1'
    await mod.activityTags.insert({
      id: candleTagId,
      emoji: CANDLE,
      label: 'Candlelight',
      sortOrder: nextOrder,
      isDefault: false,
      isActive: true,
      deactivatedAt: null,
    }).isPersisted.promise

    // ── (b) log session A (snapshots 'Candlelight') ──
    const encA = makeEncounter({
      id: 'eeeeeeee-0000-4000-8000-0000000000a1',
      activities: [CANDLE],
      activityLabels: mod.buildActivityLabels([CANDLE], {}, tagsOf(mod)),
    })
    await mod.encounters.insert(encA).isPersisted.promise
    expect(encA.activityLabels).toEqual({ [CANDLE]: 'Candlelight' })

    // ── (c) rename tag to 'Firelight' (same emoji), then log session B ──
    await mod.activityTags.update(candleTagId, (d) => {
      d.label = 'Firelight'
      d.emoji = CANDLE
    }).isPersisted.promise
    const encB = makeEncounter({
      id: 'eeeeeeee-0000-4000-8000-0000000000b1',
      activities: [CANDLE],
      activityLabels: mod.buildActivityLabels([CANDLE], {}, tagsOf(mod)),
    })
    await mod.encounters.insert(encB).isPersisted.promise

    expect(sessionTagLabel(encOf(mod, encA.id), CANDLE, tagsOf(mod))).toBe('Candlelight')
    expect(sessionTagLabel(encOf(mod, encB.id), CANDLE, tagsOf(mod))).toBe('Firelight')

    // ── (d) emoji swap 🕯️ -> 🪩, exactly as edit-tag.tsx handleSave does ──
    const live = tagsOf(mod).find((t) => t.id === candleTagId)!
    await mod.activityTags.insert({
      id: 'cccccccc-0000-4000-8000-0000000000c2',
      emoji: live.emoji, // old 🕯️
      label: live.label, // current 'Firelight'
      sortOrder: live.sortOrder,
      isDefault: false,
      isActive: false,
      deactivatedAt: new Date().toISOString(),
    }).isPersisted.promise
    await mod.activityTags.update(candleTagId, (d) => {
      d.label = 'Firelight'
      d.emoji = DISCO
    }).isPersisted.promise

    // A/B keep their historic labels through the swap.
    expect(sessionTagLabel(encOf(mod, encA.id), CANDLE, tagsOf(mod))).toBe('Candlelight')
    expect(sessionTagLabel(encOf(mod, encB.id), CANDLE, tagsOf(mod))).toBe('Firelight')

    // A legacy (no-snapshot) session on 🕯️ resolves the retired row's label,
    // never the bare glyph.
    const legacyCandle = makeEncounter({
      id: 'eeeeeeee-0000-4000-8000-0000000000c9',
      activities: [CANDLE],
      activityLabels: {},
    })
    await mod.encounters.insert(legacyCandle).isPersisted.promise
    expect(sessionTagLabel(encOf(mod, legacyCandle.id), CANDLE, tagsOf(mod))).toBe('Firelight')

    // ── (e) soft-delete the live 🪩 tag ──
    mod.deactivateTag(candleTagId)
    // deactivateTag doesn't return the transaction; let its persist settle.
    await new Promise((r) => setTimeout(r, 25))

    // ── (f) re-create 🪩 under a new name, then log session C ──
    await mod.activityTags.insert({
      id: 'cccccccc-0000-4000-8000-0000000000c3',
      emoji: DISCO,
      label: 'Disco',
      sortOrder: nextOrder + 1,
      isDefault: false,
      isActive: true,
      deactivatedAt: null,
    }).isPersisted.promise
    const encC = makeEncounter({
      id: 'eeeeeeee-0000-4000-8000-0000000000c1',
      activities: [DISCO],
      activityLabels: mod.buildActivityLabels([DISCO], {}, tagsOf(mod)),
    })
    await mod.encounters.insert(encC).isPersisted.promise

    expect(sessionTagLabel(encOf(mod, encC.id), DISCO, tagsOf(mod))).toBe('Disco')
    expect(sessionTagLabel(encOf(mod, encA.id), CANDLE, tagsOf(mod))).toBe('Candlelight')
    expect(sessionTagLabel(encOf(mod, encB.id), CANDLE, tagsOf(mod))).toBe('Firelight')
    // A legacy 🪩 session now resolves the active re-created tag.
    const legacyDisco = makeEncounter({
      id: 'eeeeeeee-0000-4000-8000-0000000000d9',
      activities: [DISCO],
      activityLabels: {},
    })
    await mod.encounters.insert(legacyDisco).isPersisted.promise
    expect(sessionTagLabel(encOf(mod, legacyDisco.id), DISCO, tagsOf(mod))).toBe('Disco')

    // ── (g) re-save session A (edit path) — labels must not change ──
    const aNow = encOf(mod, encA.id)
    await mod.encounters.update(encA.id, (d) => {
      d.activityLabels = mod.buildActivityLabels(aNow.activities, aNow.activityLabels, tagsOf(mod))
      d.notes = 'edited notes'
    }).isPersisted.promise
    expect(encOf(mod, encA.id).activityLabels).toEqual({ [CANDLE]: 'Candlelight' })

    // ── (h) cold relaunch — every assertion still holds from SQLite ──
    const relaunch = await loadFreshDb({ raw })
    await relaunch.mod.activityTags.preload()
    await relaunch.mod.encounters.preload()
    const tags2 = tagsOf(relaunch.mod)
    expect(sessionTagLabel(encOf(relaunch.mod, encA.id), CANDLE, tags2)).toBe('Candlelight')
    expect(sessionTagLabel(encOf(relaunch.mod, encB.id), CANDLE, tags2)).toBe('Firelight')
    expect(sessionTagLabel(encOf(relaunch.mod, encC.id), DISCO, tags2)).toBe('Disco')
    expect(sessionTagLabel(encOf(relaunch.mod, legacyCandle.id), CANDLE, tags2)).toBe('Firelight')
    expect(sessionTagLabel(encOf(relaunch.mod, legacyDisco.id), DISCO, tags2)).toBe('Disco')
    expect(encOf(relaunch.mod, encA.id).activityLabels).toEqual({ [CANDLE]: 'Candlelight' })
  })

  it('resolves legacy sessions via the most-recently deactivated tag when none is active', async () => {
    const { mod } = await loadFreshDb()
    await mod.activityTags.preload()
    await mod.encounters.preload()
    const emoji = '🪩'

    // Two retired rows for the same emoji, no active row. Set deactivatedAt to
    // fixed, unambiguous instants so the "most recent" tiebreak is deterministic.
    await mod.activityTags.insert({
      id: 'dddddddd-0000-4000-8000-000000000001',
      emoji,
      label: 'Older',
      sortOrder: 100,
      isDefault: false,
      isActive: false,
      deactivatedAt: '2021-01-01T00:00:00.000Z',
    }).isPersisted.promise
    await mod.activityTags.insert({
      id: 'dddddddd-0000-4000-8000-000000000002',
      emoji,
      label: 'Newer',
      sortOrder: 101,
      isDefault: false,
      isActive: false,
      deactivatedAt: '2022-01-01T00:00:00.000Z',
    }).isPersisted.promise

    const legacy = makeEncounter({ activities: [emoji], activityLabels: {} })
    await mod.encounters.insert(legacy).isPersisted.promise
    expect(sessionTagLabel(encOf(mod, legacy.id), emoji, tagsOf(mod))).toBe('Newer')
  })

  it('falls back to the bare emoji when no tag row exists at all', async () => {
    const { mod } = await loadFreshDb()
    await mod.activityTags.preload()
    await mod.encounters.preload()
    const orphan = '🛼' // no default tag, no custom tag
    const legacy = makeEncounter({ activities: [orphan], activityLabels: {} })
    await mod.encounters.insert(legacy).isPersisted.promise
    expect(sessionTagLabel(encOf(mod, legacy.id), orphan, tagsOf(mod))).toBe(orphan)
  })
})
