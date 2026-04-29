import React from 'react'
import { View } from 'react-native'
import { SectionLabel } from '../shared/SectionLabel'
import { SessionsCountCard } from './shared/SessionsCountCard'
import { BarChart } from './shared/BarChart'
import { TopActivitiesList } from './shared/TopActivitiesList'
import { MostEnjoyedActivityCard } from './shared/MostEnjoyedActivityCard'
import { EmojiInventoryGrid } from './shared/EmojiInventoryGrid'
import { PartnerStrip } from './shared/PartnerStrip'
import { StandoutSessions } from './shared/StandoutSessions'
import { RecentReflections } from './shared/RecentReflections'
import { EmptyPeriod, type EmptyPeriodScenario } from './shared/EmptyPeriod'
import type { Encounter, Partner } from '@/src/db/schema'
import type { MonthStats, CalendarStartDay } from '../../stats'

const INLINE_LABEL = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

const WEEKDAY_LABELS_SUNDAY: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEKDAY_LABELS_MONDAY: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export interface MonthViewProps {
  stats: MonthStats
  calendarStartDay: CalendarStartDay
  emptyScenario?: EmptyPeriodScenario
  onLookBack?: () => void
  onJumpToNearest?: () => void
  onPartnerPress?: (partner: Partner) => void
  onViewAllPartners?: () => void
  onSessionPress?: (encounter: Encounter) => void
}

export const MonthView: React.FC<MonthViewProps> = ({
  stats,
  calendarStartDay,
  emptyScenario = 'past',
  onLookBack,
  onJumpToNearest,
  onPartnerPress,
  onViewAllPartners,
  onSessionPress,
}) => {
  if (stats.sessionsCount === 0) {
    return (
      <EmptyPeriod
        period="month"
        scenario={emptyScenario}
        onLookBack={onLookBack}
        onJumpToNearest={onJumpToNearest}
      />
    )
  }

  const weekdayLabels = calendarStartDay === 'sunday' ? WEEKDAY_LABELS_SUNDAY : WEEKDAY_LABELS_MONDAY

  return (
    <View style={{ gap: 9 }}>
      <SessionsCountCard count={stats.sessionsCount} countLabel="Sessions" />

      <SectionLabel label="Your weekly rhythm" style={INLINE_LABEL} />
      <BarChart data={stats.weeklyRhythm} labels={weekdayLabels} />

      {stats.topActivities.length > 0 && (
        <>
          <SectionLabel label="Top activities" style={INLINE_LABEL} />
          <TopActivitiesList activities={stats.topActivities} />
        </>
      )}

      {stats.mostEnjoyedActivity && (
        <>
          <SectionLabel label="Most enjoyed" style={INLINE_LABEL} />
          <MostEnjoyedActivityCard activity={stats.mostEnjoyedActivity} />
        </>
      )}

      {stats.emojiInventory.length > 0 && (
        <>
          <SectionLabel label="What you've explored" style={INLINE_LABEL} />
          <EmojiInventoryGrid inventory={stats.emojiInventory} />
        </>
      )}

      {stats.partners.length > 0 && (
        <>
          <SectionLabel label="Partners" style={INLINE_LABEL} />
          <PartnerStrip partners={stats.partners} onPress={onPartnerPress} onViewAll={onViewAllPartners} />
        </>
      )}

      {stats.standoutSessions.length > 0 && (
        <>
          <SectionLabel label="What stood out" style={INLINE_LABEL} />
          <StandoutSessions
            sessions={stats.standoutSessions}
            partners={stats.partners}
            onPress={onSessionPress}
          />
        </>
      )}

      {stats.recentNotes.length > 0 && (
        <>
          <SectionLabel label="Recent reflections" style={INLINE_LABEL} />
          <RecentReflections notes={stats.recentNotes} onPress={onSessionPress} />
        </>
      )}
    </View>
  )
}
