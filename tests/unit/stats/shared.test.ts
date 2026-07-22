process.env.TZ = 'America/Los_Angeles'

import {
  averageRating,
  compareEncountersNewestFirst,
  dayOfWeekHistogram,
  distinctWeekdays,
  emojiInventory,
  filterByWindow,
  findNearestEncounterDate,
  lookupTagLabel,
  monthOfYearHistogram,
  mostEnjoyedActivity,
  partnerLifetimeStats,
  partnerPeriodStats,
  partnersInWindow,
  recentEncounters,
  recentNotes,
  standoutSessions,
  topActivities,
  topEnjoyedActivities,
  topPartners,
} from '@/lib/stats/shared'
import type { DateWindow } from '@/lib/stats/windows'
import { makeEncounter, makePartner, makeTag } from '../../support/factories'

// Neutral emoji fixtures.
const CANDLE = '🕯️'
const WAVE = '🌊'
const SPARK = '✨'

function window(startStr: string, endStr: string): DateWindow {
  return { startStr, endStr, start: new Date(startStr), end: new Date(endStr) }
}

describe('filterByWindow', () => {
  const items = [
    { date: '2026-06-30' },
    { date: '2026-07-01' },
    { date: '2026-07-15' },
    { date: '2026-07-31' },
    { date: '2026-08-01' },
  ]

  it('includes the inclusive start and excludes the exclusive end', () => {
    const kept = filterByWindow(items, window('2026-07-01', '2026-08-01'))
    expect(kept.map((i) => i.date)).toEqual(['2026-07-01', '2026-07-15', '2026-07-31'])
  })

  it('returns an empty array when nothing falls inside', () => {
    expect(filterByWindow(items, window('2027-01-01', '2027-02-01'))).toEqual([])
  })
})

describe('topActivities', () => {
  it('counts, ranks by frequency, and slices to the limit', () => {
    const encounters = [
      makeEncounter({ activities: [CANDLE, WAVE] }),
      makeEncounter({ activities: [CANDLE] }),
      makeEncounter({ activities: [CANDLE, SPARK] }),
      makeEncounter({ activities: [WAVE] }),
    ]
    const tags = [makeTag({ emoji: CANDLE, label: 'Candlelight' }), makeTag({ emoji: WAVE, label: 'Waves' })]
    const result = topActivities(encounters, tags, 2)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ emoji: CANDLE, label: 'Candlelight', count: 3 })
    expect(result[1].emoji).toBe(WAVE)
    expect(result[1].count).toBe(2)
  })
})

describe('emojiInventory', () => {
  it('lists every distinct emoji by descending frequency', () => {
    const encounters = [makeEncounter({ activities: [CANDLE, WAVE] }), makeEncounter({ activities: [CANDLE] })]
    const inv = emojiInventory(encounters, [makeTag({ emoji: CANDLE, label: 'Candlelight' })])
    expect(inv.map((i) => i.emoji)).toEqual([CANDLE, WAVE])
    expect(inv[0].count).toBe(2)
  })

  it('resolves labels through a retired tag when no active tag exists', () => {
    const inv = emojiInventory(
      [makeEncounter({ activities: [CANDLE] })],
      [
        makeTag({
          emoji: CANDLE,
          label: 'Retired',
          isActive: false,
          deactivatedAt: '2026-05-01T00:00:00.000Z',
        }),
      ],
    )
    expect(inv[0].label).toBe('Retired')
  })

  it('falls back to the bare emoji when no tag row matches', () => {
    const inv = emojiInventory([makeEncounter({ activities: [CANDLE] })], [])
    expect(inv[0].label).toBe(CANDLE)
  })
})

describe('topPartners', () => {
  it('counts per partner, credits each partner of a multi-partner session, and skips unknown ids', () => {
    const a = makePartner({ displayName: 'Ann' })
    const b = makePartner({ displayName: 'Bea' })
    const encounters = [
      makeEncounter({ partnerIds: [a.id, b.id] }),
      makeEncounter({ partnerIds: [a.id] }),
      makeEncounter({ partnerIds: ['00000000-0000-4000-8000-000000000009'] }),
    ]
    const ranked = topPartners(encounters, [a, b])
    expect(ranked.map((r) => [r.partner.id, r.count])).toEqual([
      [a.id, 2],
      [b.id, 1],
    ])
  })

  it('respects the limit when provided', () => {
    const a = makePartner()
    const b = makePartner()
    const encounters = [makeEncounter({ partnerIds: [a.id] }), makeEncounter({ partnerIds: [b.id] })]
    expect(topPartners(encounters, [a, b], 1)).toHaveLength(1)
  })
})

describe('dayOfWeekHistogram', () => {
  // 2026-07-05 Sun, 2026-07-06 Mon, 2026-07-01 Wed.
  const encounters = [
    makeEncounter({ date: '2026-07-05' }),
    makeEncounter({ date: '2026-07-06' }),
    makeEncounter({ date: '2026-07-01' }),
  ]

  it('indexes by day with Sunday at index 0 for a Sunday start', () => {
    // Sun→0, Mon→1, Wed→3
    expect(dayOfWeekHistogram(encounters, 'sunday')).toEqual([1, 1, 0, 1, 0, 0, 0])
  })

  it('shifts so Monday is index 0 for a Monday start', () => {
    // Mon→0, Wed→2, Sun→6
    expect(dayOfWeekHistogram(encounters, 'monday')).toEqual([1, 0, 1, 0, 0, 0, 1])
  })
})

describe('monthOfYearHistogram', () => {
  it('indexes counts by calendar month', () => {
    const hist = monthOfYearHistogram([
      makeEncounter({ date: '2026-01-10' }),
      makeEncounter({ date: '2026-01-20' }),
      makeEncounter({ date: '2026-12-01' }),
    ])
    expect(hist[0]).toBe(2)
    expect(hist[11]).toBe(1)
    expect(hist).toHaveLength(12)
  })
})

describe('mostEnjoyedActivity', () => {
  it('returns the highest-average activity meeting the minimum sample', () => {
    const encounters = [
      makeEncounter({ activities: [CANDLE], stars: 10 }),
      makeEncounter({ activities: [CANDLE], stars: 8 }),
      makeEncounter({ activities: [CANDLE], stars: 9 }),
      makeEncounter({ activities: [WAVE], stars: 2 }),
      makeEncounter({ activities: [WAVE], stars: 2 }),
      makeEncounter({ activities: [WAVE], stars: 2 }),
    ]
    const best = mostEnjoyedActivity(encounters, [makeTag({ emoji: CANDLE, label: 'Candlelight' })], 3)
    expect(best?.emoji).toBe(CANDLE)
    expect(best?.averageStars).toBe(9)
    expect(best?.sampleSize).toBe(3)
  })

  it('ignores activities below the minimum sample and unrated encounters', () => {
    const encounters = [
      makeEncounter({ activities: [CANDLE], stars: 10 }),
      makeEncounter({ activities: [CANDLE], stars: null }),
    ]
    expect(mostEnjoyedActivity(encounters, [], 3)).toBeNull()
  })
})

describe('topEnjoyedActivities', () => {
  it('ranks by average then breaks ties by larger sample size', () => {
    const encounters = [
      // CANDLE avg 8 over 4 samples
      makeEncounter({ activities: [CANDLE], stars: 8 }),
      makeEncounter({ activities: [CANDLE], stars: 8 }),
      makeEncounter({ activities: [CANDLE], stars: 8 }),
      makeEncounter({ activities: [CANDLE], stars: 8 }),
      // WAVE avg 8 over 3 samples
      makeEncounter({ activities: [WAVE], stars: 8 }),
      makeEncounter({ activities: [WAVE], stars: 8 }),
      makeEncounter({ activities: [WAVE], stars: 8 }),
    ]
    const ranked = topEnjoyedActivities(encounters, [], 5, 3)
    expect(ranked.map((r) => r.emoji)).toEqual([CANDLE, WAVE])
  })

  it('slices to the requested count', () => {
    const encounters = [
      makeEncounter({ activities: [CANDLE], stars: 10 }),
      makeEncounter({ activities: [CANDLE], stars: 10 }),
      makeEncounter({ activities: [CANDLE], stars: 10 }),
      makeEncounter({ activities: [WAVE], stars: 5 }),
      makeEncounter({ activities: [WAVE], stars: 5 }),
      makeEncounter({ activities: [WAVE], stars: 5 }),
    ]
    expect(topEnjoyedActivities(encounters, [], 1, 3)).toHaveLength(1)
  })
})

describe('standoutSessions', () => {
  it('keeps sessions at or above the threshold, newest first', () => {
    const encounters = [
      makeEncounter({ date: '2026-07-01', stars: 9 }),
      makeEncounter({ date: '2026-07-03', stars: 10 }),
      makeEncounter({ date: '2026-07-02', stars: 7 }),
      makeEncounter({ date: '2026-07-04', stars: null }),
    ]
    const out = standoutSessions(encounters, 8)
    expect(out.map((e) => e.date)).toEqual(['2026-07-03', '2026-07-01'])
  })
})

describe('averageRating', () => {
  it('returns the mean of rated encounters', () => {
    const encounters = [makeEncounter({ stars: 4 }), makeEncounter({ stars: 8 }), makeEncounter({ stars: null })]
    expect(averageRating(encounters)).toBe(6)
  })

  it('returns null when no encounter is rated', () => {
    expect(averageRating([makeEncounter({ stars: null })])).toBeNull()
    expect(averageRating([])).toBeNull()
  })
})

describe('recentNotes', () => {
  it('keeps only non-empty notes, newest first, sliced to the limit', () => {
    const encounters = [
      makeEncounter({ date: '2026-07-01', notes: 'first' }),
      makeEncounter({ date: '2026-07-05', notes: '   ' }),
      makeEncounter({ date: '2026-07-04', notes: 'later' }),
      makeEncounter({ date: '2026-07-03', notes: null }),
    ]
    const out = recentNotes(encounters, 3)
    expect(out.map((e) => e.notes)).toEqual(['later', 'first'])
  })
})

describe('compareEncountersNewestFirst', () => {
  it('orders by date descending', () => {
    const a = makeEncounter({ date: '2026-07-01' })
    const b = makeEncounter({ date: '2026-07-02' })
    expect(compareEncountersNewestFirst(a, b)).toBeGreaterThan(0)
    expect(compareEncountersNewestFirst(b, a)).toBeLessThan(0)
  })

  it('breaks same-day ties by createdAt descending', () => {
    const earlier = makeEncounter({ date: '2026-07-01', createdAt: '2026-07-01T08:00:00.000Z' })
    const later = makeEncounter({ date: '2026-07-01', createdAt: '2026-07-01T20:00:00.000Z' })
    const sorted = [earlier, later].sort(compareEncountersNewestFirst)
    expect(sorted[0]).toBe(later)
  })
})

describe('recentEncounters', () => {
  it('sorts newest first and slices, without mutating the input', () => {
    const encounters = [
      makeEncounter({ date: '2026-07-01' }),
      makeEncounter({ date: '2026-07-03' }),
      makeEncounter({ date: '2026-07-02' }),
    ]
    const snapshot = encounters.map((e) => e.date)
    const out = recentEncounters(encounters, 2)
    expect(out.map((e) => e.date)).toEqual(['2026-07-03', '2026-07-02'])
    expect(encounters.map((e) => e.date)).toEqual(snapshot)
  })
})

describe('partnerPeriodStats', () => {
  it('buckets encounters per present partner with stars, top activity, and sort order', () => {
    const ann = makePartner({ displayName: 'Ann' })
    const bea = makePartner({ displayName: 'Bea' })
    const encounters = [
      makeEncounter({ partnerIds: [ann.id], activities: [CANDLE], stars: 10 }),
      makeEncounter({ partnerIds: [ann.id], activities: [CANDLE, WAVE], stars: 6 }),
      makeEncounter({ partnerIds: [bea.id], activities: [WAVE], stars: null }),
    ]
    const rows = partnerPeriodStats(encounters, [ann, bea])
    expect(rows.map((r) => r.partner.id)).toEqual([ann.id, bea.id])
    expect(rows[0].sessionCount).toBe(2)
    expect(rows[0].averageStars).toBe(8)
    expect(rows[0].topActivityEmoji).toBe(CANDLE)
    expect(rows[1].averageStars).toBeNull()
  })

  it('sorts equal session counts by partner name ascending', () => {
    const bea = makePartner({ displayName: 'Bea' })
    const ann = makePartner({ displayName: 'Ann' })
    const encounters = [makeEncounter({ partnerIds: [bea.id] }), makeEncounter({ partnerIds: [ann.id] })]
    const rows = partnerPeriodStats(encounters, [bea, ann])
    expect(rows.map((r) => r.partner.displayName)).toEqual(['Ann', 'Bea'])
  })

  it('excludes partners not present in the encounters', () => {
    const ann = makePartner({ displayName: 'Ann' })
    const absent = makePartner({ displayName: 'Zed' })
    const rows = partnerPeriodStats([makeEncounter({ partnerIds: [ann.id] })], [ann, absent])
    expect(rows.map((r) => r.partner.id)).toEqual([ann.id])
  })
})

describe('partnerLifetimeStats', () => {
  it('covers every active partner, including those with zero sessions', () => {
    const active = makePartner({ displayName: 'Ann', isActive: true })
    const fresh = makePartner({ displayName: 'New', isActive: true })
    const inactive = makePartner({ displayName: 'Old', isActive: false })
    const encounters = [makeEncounter({ partnerIds: [active.id], activities: [CANDLE], stars: 7 })]
    const rows = partnerLifetimeStats(encounters, [active, fresh, inactive])
    const byId = new Map(rows.map((r) => [r.partner.id, r]))
    expect(byId.has(inactive.id)).toBe(false)
    expect(byId.get(active.id)?.sessionCount).toBe(1)
    expect(byId.get(active.id)?.averageStars).toBe(7)
    expect(byId.get(active.id)?.topActivityEmoji).toBe(CANDLE)
    expect(byId.get(fresh.id)?.sessionCount).toBe(0)
    expect(byId.get(fresh.id)?.averageStars).toBeNull()
    expect(byId.get(fresh.id)?.topActivityEmoji).toBeNull()
  })
})

describe('lookupTagLabel', () => {
  it('returns the current active label', () => {
    expect(lookupTagLabel(CANDLE, [makeTag({ emoji: CANDLE, label: 'Candlelight' })])).toBe('Candlelight')
  })

  it('returns the bare emoji when unknown', () => {
    expect(lookupTagLabel(CANDLE, [])).toBe(CANDLE)
  })
})

describe('partnersInWindow', () => {
  it('returns distinct partners present, including inactive ones', () => {
    const active = makePartner({ isActive: true })
    const inactive = makePartner({ isActive: false })
    const unused = makePartner()
    const encounters = [
      makeEncounter({ partnerIds: [active.id, inactive.id] }),
      makeEncounter({ partnerIds: [active.id] }),
    ]
    const out = partnersInWindow(encounters, [active, inactive, unused])
    expect(out.map((p) => p.id).sort()).toEqual([active.id, inactive.id].sort())
  })
})

describe('findNearestEncounterDate', () => {
  it('returns null with no encounters', () => {
    expect(findNearestEncounterDate([], new Date(2026, 6, 21))).toBeNull()
  })

  it('returns the encounter date closest to the anchor in absolute days', () => {
    const encounters = [makeEncounter({ date: '2026-07-01' }), makeEncounter({ date: '2026-07-30' })]
    expect(findNearestEncounterDate(encounters, new Date(2026, 6, 25))).toBe('2026-07-30')
    expect(findNearestEncounterDate(encounters, new Date(2026, 6, 10))).toBe('2026-07-01')
  })
})

describe('distinctWeekdays', () => {
  // 2026-07-05 Sun, 2026-07-06 Mon, 2026-07-01 Wed.
  const encounters = [
    makeEncounter({ date: '2026-07-06' }),
    makeEncounter({ date: '2026-07-05' }),
    makeEncounter({ date: '2026-07-01' }),
    makeEncounter({ date: '2026-07-06' }), // duplicate weekday
  ]

  it('lists distinct weekdays ordered from Sunday', () => {
    expect(distinctWeekdays(encounters, 'sunday')).toEqual(['Sun', 'Mon', 'Wed'])
  })

  it('lists distinct weekdays ordered from Monday', () => {
    expect(distinctWeekdays(encounters, 'monday')).toEqual(['Mon', 'Wed', 'Sun'])
  })
})
