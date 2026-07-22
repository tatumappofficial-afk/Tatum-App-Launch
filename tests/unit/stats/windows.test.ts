// These window helpers use the machine's local calendar (getDay/getMonth/…),
// so the suite is timezone-sensitive. Pin a fixed zone before anything runs.
process.env.TZ = 'America/Los_Angeles'

import {
  canStepForward,
  firstEncounterYear,
  formatDateString,
  formatPeriodCaption,
  getAllTimeWindow,
  getMonthWindow,
  getWeekWindow,
  getWindow,
  getYearWindow,
  parseDateString,
} from '@/lib/stats/windows'

describe('parseDateString / formatDateString', () => {
  it('round-trips a YYYY-MM-DD string through a local Date', () => {
    for (const s of ['2026-07-01', '2026-01-01', '2026-12-31', '2025-02-28']) {
      expect(formatDateString(parseDateString(s))).toBe(s)
    }
  })

  it('parses into local-time components (no UTC shift)', () => {
    const d = parseDateString('2026-07-01')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(6)
    expect(d.getDate()).toBe(1)
    expect(d.getHours()).toBe(0)
  })

  it('zero-pads month and day when formatting', () => {
    expect(formatDateString(new Date(2026, 0, 3))).toBe('2026-01-03')
  })
})

describe('getWeekWindow', () => {
  // 2026-07-01 is a Wednesday. Sunday-week: Jun 28 – Jul 4. Monday-week: Jun 29 – Jul 5.
  const anchor = new Date(2026, 6, 1)

  it('anchors a Sunday-start week to the preceding Sunday', () => {
    const w = getWeekWindow(anchor, 'sunday')
    expect(w.startStr).toBe('2026-06-28')
    expect(w.endStr).toBe('2026-07-05')
    expect(w.start.getDay()).toBe(0)
  })

  it('anchors a Monday-start week to the preceding Monday', () => {
    const w = getWeekWindow(anchor, 'monday')
    expect(w.startStr).toBe('2026-06-29')
    expect(w.endStr).toBe('2026-07-06')
    expect(w.start.getDay()).toBe(1)
  })

  it('spans exactly seven days (end is exclusive)', () => {
    const w = getWeekWindow(anchor, 'sunday')
    const days = (w.end.getTime() - w.start.getTime()) / 86_400_000
    expect(days).toBe(7)
  })

  it('returns the same window when the anchor is the start-day boundary', () => {
    const sunday = new Date(2026, 5, 28) // 2026-06-28, a Sunday
    expect(getWeekWindow(sunday, 'sunday').startStr).toBe('2026-06-28')
  })

  it('returns the same window when the anchor is the last day of the week', () => {
    const saturday = new Date(2026, 6, 4) // 2026-07-04, last day of the Sunday-week
    expect(getWeekWindow(saturday, 'sunday').startStr).toBe('2026-06-28')
  })
})

describe('getMonthWindow', () => {
  it('spans the first of the month through the first of the next (exclusive)', () => {
    const w = getMonthWindow(new Date(2026, 6, 15))
    expect(w.startStr).toBe('2026-07-01')
    expect(w.endStr).toBe('2026-08-01')
  })

  it('rolls the end into next year for December', () => {
    const w = getMonthWindow(new Date(2026, 11, 10))
    expect(w.startStr).toBe('2026-12-01')
    expect(w.endStr).toBe('2027-01-01')
  })
})

describe('getYearWindow', () => {
  it('runs a past year Jan 1 through Jan 1 of the next year', () => {
    const w = getYearWindow(new Date(2025, 3, 1), new Date(2026, 6, 21))
    expect(w.startStr).toBe('2025-01-01')
    expect(w.endStr).toBe('2026-01-01')
  })

  it('runs the current year Jan 1 through tomorrow (YTD)', () => {
    const now = new Date(2026, 6, 21) // 2026-07-21
    const w = getYearWindow(new Date(2026, 2, 1), now)
    expect(w.startStr).toBe('2026-01-01')
    expect(w.endStr).toBe('2026-07-22')
  })
})

describe('getAllTimeWindow', () => {
  it('returns null for an empty encounter set', () => {
    expect(getAllTimeWindow([], new Date(2026, 6, 21))).toBeNull()
  })

  it('runs the earliest encounter date through tomorrow', () => {
    const now = new Date(2026, 6, 21)
    const w = getAllTimeWindow([{ date: '2026-03-15' }, { date: '2026-01-02' }, { date: '2026-05-01' }], now)
    expect(w?.startStr).toBe('2026-01-02')
    expect(w?.endStr).toBe('2026-07-22')
  })
})

describe('getWindow dispatch', () => {
  const opts = { calendarStartDay: 'sunday' as const, now: new Date(2026, 6, 21) }

  it('routes each period to its builder', () => {
    expect(getWindow('week', new Date(2026, 6, 1), opts)?.startStr).toBe('2026-06-28')
    expect(getWindow('month', new Date(2026, 6, 1), opts)?.startStr).toBe('2026-07-01')
    expect(getWindow('year', new Date(2026, 6, 1), opts)?.startStr).toBe('2026-01-01')
  })

  it('returns null for all-time with no encounters', () => {
    expect(getWindow('all', new Date(2026, 6, 1), opts)).toBeNull()
  })

  it('resolves all-time from the encounters option', () => {
    const w = getWindow('all', new Date(2026, 6, 1), { ...opts, encounters: [{ date: '2026-02-02' }] })
    expect(w?.startStr).toBe('2026-02-02')
  })
})

describe('canStepForward', () => {
  const now = new Date(2026, 6, 21) // 2026-07-21

  it('is always false for all-time', () => {
    expect(canStepForward('all', new Date(2020, 0, 1), 'sunday', now)).toBe(false)
  })

  it('allows stepping a past week forward but not the current week', () => {
    expect(canStepForward('week', new Date(2026, 5, 1), 'sunday', now)).toBe(true)
    expect(canStepForward('week', now, 'sunday', now)).toBe(false)
  })

  it('allows stepping a past month forward but not the current month', () => {
    expect(canStepForward('month', new Date(2026, 5, 1), 'sunday', now)).toBe(true)
    expect(canStepForward('month', new Date(2026, 6, 1), 'sunday', now)).toBe(false)
    expect(canStepForward('month', new Date(2025, 11, 1), 'sunday', now)).toBe(true)
  })

  it('allows stepping a past year forward but not the current year', () => {
    expect(canStepForward('year', new Date(2025, 0, 1), 'sunday', now)).toBe(true)
    expect(canStepForward('year', new Date(2026, 0, 1), 'sunday', now)).toBe(false)
  })
})

describe('firstEncounterYear', () => {
  it('falls back to the current year when empty', () => {
    expect(firstEncounterYear([], new Date(2026, 6, 21))).toBe(2026)
  })

  it('returns the calendar year of the earliest encounter', () => {
    expect(firstEncounterYear([{ date: '2024-11-01' }, { date: '2026-01-01' }])).toBe(2024)
  })
})

describe('formatPeriodCaption', () => {
  const now = new Date(2026, 6, 21) // 2026-07-21

  it('formats a same-month week as one month range', () => {
    // Week of 2026-07-15 (Wed) → Jul 12 – 18 (Sunday start).
    expect(formatPeriodCaption('week', new Date(2026, 6, 15), { calendarStartDay: 'sunday', now })).toBe('Jul 12 – 18')
  })

  it('formats a cross-month week with both month names', () => {
    // Week of 2026-07-01 (Wed) → Jun 28 – Jul 4 (Sunday start).
    expect(formatPeriodCaption('week', new Date(2026, 6, 1), { calendarStartDay: 'sunday', now })).toBe(
      'Jun 28 – Jul 4',
    )
  })

  it('formats a month as full month name and year', () => {
    expect(formatPeriodCaption('month', new Date(2026, 3, 1), { now })).toBe('April 2026')
  })

  it('formats the current year as a YTD range', () => {
    expect(formatPeriodCaption('year', new Date(2026, 0, 1), { now })).toBe('Jan 1 – Jul 21, 2026')
  })

  it('formats a past year as the bare year', () => {
    expect(formatPeriodCaption('year', new Date(2025, 0, 1), { now })).toBe('2025')
  })

  it('formats all-time with a since-date when the first encounter is known', () => {
    expect(formatPeriodCaption('all', new Date(2026, 6, 1), { firstEncounterDate: '2026-02-14', now })).toBe(
      'Since Feb 14, 2026',
    )
  })

  it('formats all-time as "All Time" without a first-encounter date', () => {
    expect(formatPeriodCaption('all', new Date(2026, 6, 1), { now })).toBe('All Time')
  })
})
