import type { DesireEntry, Encounter, Partner } from '@/src/db/schema'
import type { ActivityCount, MostEnjoyedActivity, PartnerLifetimeStats } from './shared'

export interface WeekStats {
  sessionsCount: number
  weekdayList: string[]
  topActivities: ActivityCount[]
  partnersLifetime: PartnerLifetimeStats[]
  averageRating: number | null
  recentSessions: Encounter[]
}

export interface MonthStats {
  sessionsCount: number
  weeklyRhythm: number[]
  topActivities: ActivityCount[]
  mostEnjoyedActivity: MostEnjoyedActivity | null
  emojiInventory: ActivityCount[]
  partners: Partner[]
  standoutSessions: Encounter[]
  recentNotes: Encounter[]
}

export interface YearStats {
  sessionsCount: number
  monthOfYear: number[]
  weeklyRhythm: number[]
  topActivities: ActivityCount[]
  mostEnjoyedActivity: MostEnjoyedActivity | null
  emojiInventory: ActivityCount[]
  partners: Partner[]
  standoutSessions: Encounter[]
  desireToAction: DesireToAction | null
  /** Whether the year is YTD (months past `currentMonthIndex` should render muted). */
  isYearToDate: boolean
  /** 0–11. When `isYearToDate`, months > this index are muted. */
  currentMonthIndex: number
}

export interface AllTimeStats {
  sessionsCount: number
  firstEncounterDate: string
  weeklyRhythm: number[]
  monthOfYear: number[]
  topActivities: ActivityCount[]
  mostEnjoyedActivity: MostEnjoyedActivity | null
  emojiInventory: ActivityCount[]
  partners: Partner[]
  standoutSessions: Encounter[]
}

export interface DesireToAction {
  logged: number
  acted: number
}
