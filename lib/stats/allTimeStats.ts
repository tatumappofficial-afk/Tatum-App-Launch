import type { ActivityTag, Encounter, Partner } from '@/src/db/schema'
import {
  dayOfWeekHistogram,
  emojiInventory,
  filterByWindow,
  monthOfYearHistogram,
  partnersInWindow,
  standoutSessions,
  topActivities,
  topEnjoyedActivities,
} from './shared'
import type { AllTimeStats } from './types'
import type { CalendarStartDay, DateWindow } from './windows'

export function computeAllTimeStats(
  encounters: Encounter[],
  partners: Partner[],
  tags: ActivityTag[],
  window: DateWindow,
  calendarStartDay: CalendarStartDay,
): AllTimeStats {
  const inWindow = filterByWindow(encounters, window)
  return {
    sessionsCount: inWindow.length,
    firstEncounterDate: window.startStr,
    weeklyRhythm: dayOfWeekHistogram(inWindow, calendarStartDay),
    monthOfYear: monthOfYearHistogram(inWindow),
    topActivities: topActivities(inWindow, tags, 5),
    topEnjoyedActivities: topEnjoyedActivities(inWindow, tags, 3, 3),
    emojiInventory: emojiInventory(inWindow, tags),
    partners: partnersInWindow(inWindow, partners),
    standoutSessions: standoutSessions(inWindow, 8),
  }
}
