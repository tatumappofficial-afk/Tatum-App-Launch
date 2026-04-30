import { useMemo } from 'react'
import {
  firstEncounterYear,
  formatPeriodCaption,
  getWindow,
  type CalendarStartDay,
  type DateWindow,
  type Period,
} from '@/lib/stats'
import type { EmptyPeriodScenario } from '@/lib/screens/home/shared/EmptyPeriod'
import type { Encounter } from '@/src/db/schema'

export interface UsePeriodWindowResult {
  /** Date window for the (period, anchor) pair. `null` only for `period: 'all'` with zero encounters. */
  window: DateWindow | null
  /** Localized caption like "This week", "March 2026", "All time". */
  caption: string
  /** 'current' if `now` is inside the window, otherwise 'past'. Used by EmptyPeriod scenarios. */
  emptyScenario: EmptyPeriodScenario
  /** YYYY-MM-DD of the earliest encounter, or undefined if there are none. */
  firstEncounterDate: string | undefined
  /** Lowest year the period picker should allow (year of the first encounter, or current year). */
  minYear: number
  /** Highest year the period picker should allow (current year). */
  maxYear: number
  /** Memoized "now" Date so consumers can pass a stable reference into pickers. */
  now: Date
}

/**
 * Derives all date-related values the Home tab needs from a (period, anchor)
 * pair plus the encounter set. Pulls together what was previously a chain of
 * 5+ inline `useMemo` calls in `app/(tabs)/index.tsx`.
 */
export function usePeriodWindow(
  period: Period,
  anchor: Date,
  encounters: Encounter[],
  calendarStartDay: CalendarStartDay,
): UsePeriodWindowResult {
  const now = useMemo(() => new Date(), [])

  const window = useMemo(
    () => getWindow(period, anchor, { calendarStartDay, encounters }),
    [period, anchor, encounters, calendarStartDay],
  )

  const firstEncounterDate = useMemo(() => {
    if (encounters.length === 0) return undefined
    return encounters.reduce((min, e) => (e.date < min ? e.date : min), encounters[0].date)
  }, [encounters])

  const caption = useMemo(
    () => formatPeriodCaption(period, anchor, { calendarStartDay, firstEncounterDate }),
    [period, anchor, calendarStartDay, firstEncounterDate],
  )

  const emptyScenario: EmptyPeriodScenario = useMemo(() => {
    if (!window) return 'past'
    return now >= window.start && now < window.end ? 'current' : 'past'
  }, [window, now])

  const minYear = useMemo(() => firstEncounterYear(encounters, now), [encounters, now])
  const maxYear = now.getFullYear()

  return { window, caption, emptyScenario, firstEncounterDate, minYear, maxYear, now }
}
