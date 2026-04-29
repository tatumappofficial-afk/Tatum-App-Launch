import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../../theme'
import { SectionLabel } from '../shared/SectionLabel'
import { SessionsCountCard } from './shared/SessionsCountCard'
import { BarChart } from './shared/BarChart'
import { TopActivitiesList } from './shared/TopActivitiesList'
import { MostEnjoyedActivityCard } from './shared/MostEnjoyedActivityCard'
import { EmojiInventoryGrid } from './shared/EmojiInventoryGrid'
import { PartnerStrip } from './shared/PartnerStrip'
import { StandoutSessions } from './shared/StandoutSessions'
import { EmptyPeriod, type EmptyPeriodScenario } from './shared/EmptyPeriod'
import type { Encounter, Partner } from '@/src/db/schema'
import type { CalendarStartDay, DesireToAction, YearStats } from '../../stats'

const INLINE_LABEL = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

const MONTH_LABELS: string[] = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const WEEKDAY_LABELS_SUNDAY: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEKDAY_LABELS_MONDAY: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export interface YearViewProps {
  stats: YearStats
  calendarStartDay: CalendarStartDay
  emptyScenario?: EmptyPeriodScenario
  onLookBack?: () => void
  onJumpToNearest?: () => void
  onPartnerPress?: (partner: Partner) => void
  onViewAllPartners?: () => void
  onSessionPress?: (encounter: Encounter) => void
}

export const YearView: React.FC<YearViewProps> = ({
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
        period="year"
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

      <SectionLabel label="Your year, by month" style={INLINE_LABEL} />
      <BarChart
        data={stats.monthOfYear}
        labels={MONTH_LABELS}
        mutedFromIndex={stats.isYearToDate ? stats.currentMonthIndex : undefined}
      />

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
          <SectionLabel label="Partners this year" style={INLINE_LABEL} />
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

      {stats.desireToAction && (
        <>
          <SectionLabel label="Desire → action" style={INLINE_LABEL} />
          <DesireActionCard data={stats.desireToAction} />
        </>
      )}
    </View>
  )
}

const DesireActionCard: React.FC<{ data: DesireToAction }> = ({ data }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  }}>
    <Text style={{
      fontFamily: font('playfair', '600'),
      fontSize: 18,
      color: colors.terra,
      lineHeight: 22,
    }}>
      {data.acted} of {data.logged}
    </Text>
    <Text style={{
      fontSize: 11,
      color: colors.stone,
      lineHeight: 16,
      marginTop: 4,
      fontFamily: font('dmSans', '300'),
    }}>
      {data.acted === 1 ? 'desire' : 'desires'} you logged in Safe Space showed up in your encounters this year.
    </Text>
  </View>
)
