import type { ActivityTag, DesireEntry, Encounter, Partner } from '@/src/db/schema'
import {
  dayOfWeekHistogram,
  emojiInventory,
  filterByWindow,
  monthOfYearHistogram,
  partnersInWindow,
  recentEncounters,
  standoutSessions,
  topActivities,
  topEnjoyedActivities,
} from './shared'
import type { DesireToAction, YearStats } from './types'
import type { CalendarStartDay, DateWindow } from './windows'

export function computeYearStats(
  encounters: Encounter[],
  partners: Partner[],
  tags: ActivityTag[],
  desires: DesireEntry[],
  window: DateWindow,
  calendarStartDay: CalendarStartDay,
  now: Date = new Date(),
): YearStats {
  const inWindow = filterByWindow(encounters, window)
  const isYearToDate = window.start.getFullYear() === now.getFullYear()
  return {
    sessionsCount: inWindow.length,
    monthOfYear: monthOfYearHistogram(inWindow),
    weeklyRhythm: dayOfWeekHistogram(inWindow, calendarStartDay),
    topActivities: topActivities(inWindow, tags, 5),
    topEnjoyedActivities: topEnjoyedActivities(inWindow, tags, 3, 3),
    emojiInventory: emojiInventory(inWindow, tags),
    partners: partnersInWindow(inWindow, partners),
    recentSessions: recentEncounters(inWindow, 50),
    standoutSessions: standoutSessions(inWindow, 8),
    desireToAction: computeDesireToAction(desires, window),
    isYearToDate,
    currentMonthIndex: now.getMonth(),
  }
}

function computeDesireToAction(desires: DesireEntry[], window: DateWindow): DesireToAction | null {
  // DesireEntry.timestamp is an ISO string; compare against window's date strings
  // by slicing the YYYY-MM-DD prefix. Both windows and desires use local-day semantics.
  const inWindow = desires.filter(d => {
    const dateOnly = d.timestamp.slice(0, 10)
    return dateOnly >= window.startStr && dateOnly < window.endStr
  })
  if (inWindow.length === 0) return null
  return {
    logged: inWindow.length,
    acted: inWindow.filter(d => d.actedOn).length,
  }
}
