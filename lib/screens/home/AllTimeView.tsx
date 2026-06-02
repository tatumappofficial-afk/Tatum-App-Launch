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
import type { Encounter, Partner } from '@/src/db/schema'
import type { AllTimeStats, CalendarStartDay } from '../../stats'

const INLINE_LABEL = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

const MONTH_LABELS: string[] = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const WEEKDAY_LABELS_SUNDAY: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEKDAY_LABELS_MONDAY: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export interface AllTimeViewProps {
  stats: AllTimeStats
  calendarStartDay: CalendarStartDay
  onPartnerPress?: (partner: Partner) => void
  onViewAllPartners?: () => void
  onSessionPress?: (encounter: Encounter) => void
}

export const AllTimeView: React.FC<AllTimeViewProps> = ({
  stats,
  calendarStartDay,
  onPartnerPress,
  onViewAllPartners,
  onSessionPress,
}) => {
  const weekdayLabels = calendarStartDay === 'sunday' ? WEEKDAY_LABELS_SUNDAY : WEEKDAY_LABELS_MONDAY

  return (
    <View style={{ gap: 9 }}>
      <SessionsCountCard count={stats.sessionsCount} countLabel="Total sessions" />

      <SectionLabel label="Your weekly rhythm" style={INLINE_LABEL} />
      <BarChart data={stats.weeklyRhythm} labels={weekdayLabels} />

      <SectionLabel label="The seasons of you" style={INLINE_LABEL} />
      <BarChart data={stats.monthOfYear} labels={MONTH_LABELS} />

      {stats.topActivities.length > 0 && (
        <>
          <SectionLabel label="Top activities" style={INLINE_LABEL} />
          <TopActivitiesList activities={stats.topActivities} />
        </>
      )}

      {stats.topEnjoyedActivities.length > 0 && (
        <>
          <SectionLabel label="Most enjoyed" style={INLINE_LABEL} />
          <View style={{ gap: 8 }}>
            {stats.topEnjoyedActivities.map((a) => (
              <MostEnjoyedActivityCard key={a.emoji} activity={a} />
            ))}
          </View>
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
          <SectionLabel label="Your partner history" style={INLINE_LABEL} />
          <PartnerStrip partners={stats.partners} onPress={onPartnerPress} onViewAll={onViewAllPartners} />
        </>
      )}

      {stats.standoutSessions.length > 0 && (
        <>
          <SectionLabel label="What stood out" style={INLINE_LABEL} />
          <StandoutSessions sessions={stats.standoutSessions} partners={stats.partners} onPress={onSessionPress} />
        </>
      )}
    </View>
  )
}
