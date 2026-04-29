import type { ActivityTag, Encounter, Partner } from '@/src/db/schema'
import {
  averageRating,
  distinctWeekdays,
  filterByWindow,
  partnerLifetimeStats,
  recentEncounters,
  topActivities,
} from './shared'
import type { WeekStats } from './types'
import type { CalendarStartDay, DateWindow } from './windows'

export function computeWeekStats(
  encounters: Encounter[],
  partners: Partner[],
  tags: ActivityTag[],
  window: DateWindow,
  calendarStartDay: CalendarStartDay,
): WeekStats {
  const inWindow = filterByWindow(encounters, window)
  return {
    sessionsCount: inWindow.length,
    weekdayList: distinctWeekdays(inWindow, calendarStartDay),
    topActivities: topActivities(inWindow, tags, 5),
    partnersLifetime: partnerLifetimeStats(encounters, partners),
    averageRating: averageRating(inWindow),
    recentSessions: recentEncounters(inWindow, 5),
  }
}
