process.env.TZ = 'America/Los_Angeles'

import { PERIOD_TAG_ID } from '@/src/db/schema'
import { computeAllTimeStats, computeMonthStats, computeWeekStats, computeYearStats } from '@/lib/stats'
import { getAllTimeWindow, getMonthWindow, getWeekWindow, getYearWindow } from '@/lib/stats/windows'
import { makeDesireEntry, makeEncounter, makePartner, makeTag } from '../../support/factories'

const CANDLE = '🕯️'
const PERIOD = '🩸'

// A partnerless Period-tagged session — logged with no partner, blood-drop emoji.
function periodEncounter(date: string) {
  return makeEncounter({ date, activities: [PERIOD], partnerIds: [], stars: null })
}

const periodTag = makeTag({ id: PERIOD_TAG_ID, emoji: PERIOD, label: 'Period', isDefault: true })
const candleTag = makeTag({ emoji: CANDLE, label: 'Candlelight' })
const tags = [candleTag, periodTag]

describe('computeWeekStats', () => {
  it('counts a partnerless Period session in totals but not in partner stats', () => {
    const ann = makePartner({ displayName: 'Ann' })
    const window = getWeekWindow(new Date(2026, 6, 1), 'sunday') // Jun 28 – Jul 5
    const encounters = [
      makeEncounter({ date: '2026-07-01', partnerIds: [ann.id], activities: [CANDLE], stars: 8 }),
      periodEncounter('2026-06-29'),
      makeEncounter({ date: '2026-08-01', partnerIds: [ann.id], activities: [CANDLE], stars: 4 }), // out of window
    ]
    const stats = computeWeekStats(encounters, [ann], tags, window, 'sunday')

    expect(stats.sessionsCount).toBe(2)
    expect(stats.weekdayList).toEqual(['Mon', 'Wed'])
    expect(stats.averageRating).toBe(8) // only the rated in-window session
    // Period session contributes to activities...
    const periodRow = stats.topActivities.find((a) => a.emoji === PERIOD)
    expect(periodRow?.label).toBe('Period')
    // ...but never to partner stats (it has no partner).
    expect(stats.partnerStats).toHaveLength(1)
    expect(stats.partnerStats[0].partner.id).toBe(ann.id)
    expect(stats.partnerStats[0].sessionCount).toBe(1)
  })
})

describe('computeMonthStats', () => {
  it('includes a Period emoji in the inventory and omits it from partners', () => {
    const ann = makePartner({ displayName: 'Ann' })
    const window = getMonthWindow(new Date(2026, 6, 15)) // July 2026
    const encounters = [
      makeEncounter({ date: '2026-07-02', partnerIds: [ann.id], activities: [CANDLE], stars: 9 }),
      periodEncounter('2026-07-10'),
    ]
    const stats = computeMonthStats(encounters, [ann], tags, window, 'sunday')

    expect(stats.sessionsCount).toBe(2)
    expect(stats.emojiInventory.map((i) => i.emoji).sort()).toEqual([CANDLE, PERIOD].sort())
    const periodRow = stats.emojiInventory.find((i) => i.emoji === PERIOD)
    expect(periodRow?.label).toBe('Period')
    // Only the partnered session surfaces a partner.
    expect(stats.partners.map((p) => p.id)).toEqual([ann.id])
  })
})

describe('computeYearStats', () => {
  it('marks the current year as year-to-date and pairs desires to action', () => {
    const now = new Date(2026, 6, 21) // 2026-07-21
    const window = getYearWindow(new Date(2026, 0, 1), now)
    const encounters = [
      makeEncounter({ date: '2026-03-01', activities: [CANDLE], stars: 10 }),
      periodEncounter('2026-04-01'),
    ]
    const desires = [
      makeDesireEntry({ timestamp: '2026-02-10T09:00:00.000Z', actedOn: true }),
      makeDesireEntry({ timestamp: '2026-05-05T09:00:00.000Z', actedOn: false }),
      makeDesireEntry({ timestamp: '2025-12-31T09:00:00.000Z', actedOn: true }), // out of window
    ]
    const stats = computeYearStats(encounters, [], tags, desires, window, 'sunday', now)

    expect(stats.sessionsCount).toBe(2)
    expect(stats.isYearToDate).toBe(true)
    expect(stats.currentMonthIndex).toBe(6)
    expect(stats.monthOfYear[2]).toBe(1) // March
    expect(stats.monthOfYear[3]).toBe(1) // April (Period session)
    expect(stats.desireToAction).toEqual({ logged: 2, acted: 1 })
  })
})

describe('computeAllTimeStats', () => {
  it('reports the first-encounter date and total across the full history', () => {
    const now = new Date(2026, 6, 21)
    const encounters = [
      makeEncounter({ date: '2026-05-01', activities: [CANDLE], stars: 9 }),
      periodEncounter('2026-01-15'),
    ]
    const window = getAllTimeWindow(encounters, now)!
    const stats = computeAllTimeStats(encounters, [], tags, window, 'sunday')

    expect(stats.sessionsCount).toBe(2)
    expect(stats.firstEncounterDate).toBe('2026-01-15')
    expect(stats.emojiInventory.map((i) => i.emoji).sort()).toEqual([CANDLE, PERIOD].sort())
  })
})
