import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../../theme'
import { SectionLabel } from '../shared/SectionLabel'
import { TopActivitiesList } from './shared/TopActivitiesList'
import { RichPartnerStrip } from './shared/RichPartnerStrip'
import { RecentSessionsScroller } from './shared/RecentSessionsScroller'
import { EmptyPeriod, type EmptyPeriodScenario } from './shared/EmptyPeriod'
import type { Encounter, Partner } from '@/src/db/schema'
import type { WeekStats } from '../../stats'

const INLINE_LABEL = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

export interface WeekViewProps {
  stats: WeekStats
  /** All partners — passed through to RecentSessionsScroller for avatar lookup. */
  partners: Partner[]
  emptyScenario?: EmptyPeriodScenario
  onLookBack?: () => void
  onJumpToNearest?: () => void
  onPartnerPress?: (partnerId: string) => void
  onPartnersHeaderPress?: () => void
  onSessionsHeaderPress?: () => void
  onSessionPress?: (encounter: Encounter) => void
}

export const WeekView: React.FC<WeekViewProps> = ({
  stats,
  partners,
  emptyScenario = 'past',
  onLookBack,
  onJumpToNearest,
  onPartnerPress,
  onPartnersHeaderPress,
  onSessionsHeaderPress,
  onSessionPress,
}) => {
  if (stats.sessionsCount === 0) {
    return (
      <EmptyPeriod
        period="week"
        scenario={emptyScenario}
        onLookBack={onLookBack}
        onJumpToNearest={onJumpToNearest}
      />
    )
  }

  return (
    <View style={{ gap: 9 }}>
      <WeekOverviewCard
        sessionsCount={stats.sessionsCount}
        averageRating={stats.averageRating}
        weekdays={stats.weekdayList}
      />

      {stats.topActivities.length > 0 && (
        <>
          <SectionLabel label="Top activities" style={INLINE_LABEL} />
          <TopActivitiesList activities={stats.topActivities} />
        </>
      )}

      {stats.partnersLifetime.length > 0 && (
        <>
          <SectionLabel
            label="Partners"
            showChevron
            style={INLINE_LABEL}
            onPress={onPartnersHeaderPress}
          />
          <RichPartnerStrip partners={stats.partnersLifetime} onPress={onPartnerPress} onViewAll={onPartnersHeaderPress} />
        </>
      )}

      {stats.recentSessions.length > 0 && (
        <>
          <SectionLabel
            label="Sessions"
            showChevron
            style={INLINE_LABEL}
            onPress={onSessionsHeaderPress}
          />
          <RecentSessionsScroller
            sessions={stats.recentSessions}
            partners={partners}
            onPress={onSessionPress}
          />
        </>
      )}
    </View>
  )
}

// ── Inline overview card (Week-specific) ──

interface WeekOverviewCardProps {
  sessionsCount: number
  averageRating: number | null
  weekdays: string[]
}

const WeekOverviewCard: React.FC<WeekOverviewCardProps> = ({ sessionsCount, averageRating, weekdays }) => {
  const cells: Array<{ label: string; render: () => React.ReactNode }> = [
    {
      label: 'Sessions',
      render: () => (
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 28,
          color: colors.terra,
          lineHeight: 28,
        }}>{sessionsCount}</Text>
      ),
    },
  ]
  if (averageRating !== null) {
    cells.push({
      label: 'Avg Rating',
      render: () => (
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 28,
          color: colors.terra,
          lineHeight: 28,
        }}>{averageRating.toFixed(1)}</Text>
      ),
    })
  }
  if (weekdays.length > 0) {
    cells.push({
      label: 'Days',
      render: () => (
        <Text
          numberOfLines={1}
          style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 14,
            color: colors.terra,
            lineHeight: 28,
            letterSpacing: 0.4,
          }}
        >
          {weekdays.join(' · ')}
        </Text>
      ),
    })
  }
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      flexShrink: 0,
    }}>
      {cells.map((c, i) => (
        <View key={c.label} style={{
          flex: 1,
          paddingHorizontal: 8,
          borderRightWidth: i < cells.length - 1 ? 1 : 0,
          borderRightColor: 'rgba(160,100,80,0.12)',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
          <Text style={{
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 3,
            fontFamily: font('dmSans', '500'),
            textAlign: 'center',
          }}>{c.label}</Text>
          {c.render()}
        </View>
      ))}
    </View>
  )
}
