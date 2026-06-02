import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font } from '../../../theme'
import type { Period } from '../../../stats'

export type EmptyPeriodScenario = 'current' | 'past'

export interface EmptyPeriodProps {
  period: Period
  scenario: EmptyPeriodScenario
  /** Scenario 'current' (Scenario B): tap to step the picker one period back. */
  onLookBack?: () => void
  /** Scenario 'past' (Scenario C): tap to jump anchor to nearest activity. */
  onJumpToNearest?: () => void
}

const COPY: Record<EmptyPeriodScenario, Record<Period, { title: string; cta?: string }>> = {
  current: {
    week: { title: 'A fresh week — nothing logged yet.', cta: 'Look back at last week' },
    month: { title: 'Nothing in this month yet.', cta: 'Look back at last month' },
    year: { title: 'No sessions logged this year yet.', cta: 'Look back at last year' },
    all: { title: 'Nothing logged yet — and that’s okay.' },
  },
  past: {
    week: { title: 'Nothing logged this week.', cta: 'Jump to nearest activity' },
    month: { title: 'Nothing logged this month.', cta: 'Jump to nearest activity' },
    year: { title: 'No sessions logged this year.', cta: 'Jump to nearest activity' },
    all: { title: 'Nothing logged yet.' },
  },
}

export const EmptyPeriod: React.FC<EmptyPeriodProps> = ({ period, scenario, onLookBack, onJumpToNearest }) => {
  const copy = COPY[scenario][period]
  const onCta = scenario === 'current' ? onLookBack : onJumpToNearest
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.13)',
        borderRadius: 16,
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 28, opacity: 0.4 }}>🌙</Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.stone,
          lineHeight: 19,
          fontFamily: font('dmSans', '300'),
          textAlign: 'center',
        }}
      >
        {copy.title}
      </Text>
      {copy.cta && onCta && (
        <Pressable
          onPress={onCta}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: 4,
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 9999,
            backgroundColor: pressed ? 'rgba(160,100,80,0.18)' : colors.surface2,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 14,
              letterSpacing: 0.5,
              color: colors.terra,
              fontFamily: font('dmSans', '500'),
            }}
          >
            {copy.cta}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
