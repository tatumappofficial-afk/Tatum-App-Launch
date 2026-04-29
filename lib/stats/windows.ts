/**
 * Date windows for the Home stats periods.
 *
 * Encounter.date is stored as 'YYYY-MM-DD' in the user's local calendar.
 * Filtering uses string comparison against the window's `startStr`/`endStr`
 * (inclusive start, exclusive end) to avoid timezone foot-guns from
 * `new Date('YYYY-MM-DD')` being parsed as UTC midnight.
 */

export type Period = 'week' | 'month' | 'year' | 'all'
export type CalendarStartDay = 'sunday' | 'monday'

export interface DateWindow {
  /** Local midnight of the first day in the window. */
  start: Date
  /** Local midnight of the day AFTER the last day in the window (exclusive). */
  end: Date
  /** 'YYYY-MM-DD' of the first day. */
  startStr: string
  /** 'YYYY-MM-DD' of `end` (exclusive — first day NOT in window). */
  endStr: string
}

export interface EncounterDate { date: string }

// ── String / Date helpers ──

export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function makeWindow(start: Date, end: Date): DateWindow {
  return { start, end, startStr: formatDateString(start), endStr: formatDateString(end) }
}

// ── Window builders ──

export function getWeekWindow(anchor: Date, calendarStartDay: CalendarStartDay): DateWindow {
  const start = startOfDay(anchor)
  const dow = start.getDay() // 0=Sun .. 6=Sat
  const offset = calendarStartDay === 'sunday' ? dow : (dow === 0 ? 6 : dow - 1)
  start.setDate(start.getDate() - offset)
  return makeWindow(start, addDays(start, 7))
}

export function getMonthWindow(anchor: Date): DateWindow {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1)
  return makeWindow(start, end)
}

/**
 * Current calendar year → Jan 1 through tomorrow (YTD).
 * Past calendar year → Jan 1 through Jan 1 of next year (full year).
 */
export function getYearWindow(anchor: Date, now: Date = new Date()): DateWindow {
  const year = anchor.getFullYear()
  const isCurrent = year === now.getFullYear()
  const start = new Date(year, 0, 1)
  const end = isCurrent ? addDays(startOfDay(now), 1) : new Date(year + 1, 0, 1)
  return makeWindow(start, end)
}

/** First-encounter date through tomorrow. Returns null if there are no encounters. */
export function getAllTimeWindow(encounters: EncounterDate[], now: Date = new Date()): DateWindow | null {
  if (encounters.length === 0) return null
  const minStr = encounters.reduce((min, e) => (e.date < min ? e.date : min), encounters[0].date)
  return makeWindow(parseDateString(minStr), addDays(startOfDay(now), 1))
}

export interface GetWindowOptions {
  calendarStartDay: CalendarStartDay
  encounters?: EncounterDate[]
  now?: Date
}

export function getWindow(period: Period, anchor: Date, options: GetWindowOptions): DateWindow | null {
  const now = options.now ?? new Date()
  switch (period) {
    case 'week': return getWeekWindow(anchor, options.calendarStartDay)
    case 'month': return getMonthWindow(anchor)
    case 'year': return getYearWindow(anchor, now)
    case 'all': return getAllTimeWindow(options.encounters ?? [], now)
  }
}

// ── Picker bounds ──

/** Whether stepping +1 period from `anchor` would still be ≤ `now`. */
export function canStepForward(
  period: Period,
  anchor: Date,
  calendarStartDay: CalendarStartDay = 'sunday',
  now: Date = new Date(),
): boolean {
  if (period === 'all') return false
  if (period === 'week') {
    const anchorWeek = getWeekWindow(anchor, calendarStartDay)
    const nowWeek = getWeekWindow(now, calendarStartDay)
    return anchorWeek.startStr < nowWeek.startStr
  }
  if (period === 'month') {
    return anchor.getFullYear() < now.getFullYear() ||
      (anchor.getFullYear() === now.getFullYear() && anchor.getMonth() < now.getMonth())
  }
  return anchor.getFullYear() < now.getFullYear()
}

/** Min calendar year present in encounters. Falls back to current year when empty. */
export function firstEncounterYear(encounters: EncounterDate[], now: Date = new Date()): number {
  if (encounters.length === 0) return now.getFullYear()
  const minStr = encounters.reduce((min, e) => (e.date < min ? e.date : min), encounters[0].date)
  return parseDateString(minStr).getFullYear()
}

// ── Captions ──

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export interface CaptionOptions {
  calendarStartDay?: CalendarStartDay
  now?: Date
  firstEncounterDate?: string
}

/** Caption shown under the period tabs (e.g. "Apr 26 – May 2", "April 2026"). */
export function formatPeriodCaption(period: Period, anchor: Date, options: CaptionOptions = {}): string {
  const now = options.now ?? new Date()
  const calendarStartDay = options.calendarStartDay ?? 'sunday'

  if (period === 'week') {
    const w = getWeekWindow(anchor, calendarStartDay)
    const last = addDays(w.end, -1)
    const sameMonth = w.start.getMonth() === last.getMonth()
    return sameMonth
      ? `${MONTH_SHORT[w.start.getMonth()]} ${w.start.getDate()} – ${last.getDate()}`
      : `${MONTH_SHORT[w.start.getMonth()]} ${w.start.getDate()} – ${MONTH_SHORT[last.getMonth()]} ${last.getDate()}`
  }
  if (period === 'month') {
    return `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`
  }
  if (period === 'year') {
    const isCurrent = anchor.getFullYear() === now.getFullYear()
    return isCurrent
      ? `Jan 1 – ${MONTH_SHORT[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
      : String(anchor.getFullYear())
  }
  // all
  if (options.firstEncounterDate) {
    const d = parseDateString(options.firstEncounterDate)
    return `Since ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }
  return 'All Time'
}
