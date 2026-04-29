import type { ActivityTag, Encounter, Partner } from '@/src/db/schema'
import {
  dayOfWeekHistogram,
  emojiInventory,
  filterByWindow,
  mostEnjoyedActivity,
  partnersInWindow,
  recentNotes,
  standoutSessions,
  topActivities,
} from './shared'
import type { MonthStats } from './types'
import type { CalendarStartDay, DateWindow } from './windows'

export function computeMonthStats(
  encounters: Encounter[],
  partners: Partner[],
  tags: ActivityTag[],
  window: DateWindow,
  calendarStartDay: CalendarStartDay,
): MonthStats {
  const inWindow = filterByWindow(encounters, window)
  return {
    sessionsCount: inWindow.length,
    weeklyRhythm: dayOfWeekHistogram(inWindow, calendarStartDay),
    topActivities: topActivities(inWindow, tags, 3),
    mostEnjoyedActivity: mostEnjoyedActivity(inWindow, tags, 3),
    emojiInventory: emojiInventory(inWindow, tags),
    partners: partnersInWindow(inWindow, partners),
    standoutSessions: standoutSessions(inWindow, 8),
    recentNotes: recentNotes(inWindow, 3),
  }
}
