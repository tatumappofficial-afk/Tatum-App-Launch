import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints, gradients, shadows } from '../../../theme'
import type { Period } from '../../../stats'

const TABS: Array<{ id: Period; label: string }> = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'all', label: 'All Time' },
]

export interface PeriodTabsProps {
  active: Period
  onChange: (period: Period) => void
  /** When true, no tab renders as selected — used for the global empty state. */
  inert?: boolean
}

export const PeriodTabs: React.FC<PeriodTabsProps> = ({ active, onChange, inert }) => (
  <View style={{
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    {TABS.map(tab => {
      const isActive = !inert && active === tab.id
      return (
        <Pressable
          key={tab.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={tab.label}
          onPress={() => onChange(tab.id)}
          style={{
            flex: 1,
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? undefined : colors.surface2,
            height: 32,
            overflow: 'hidden',
            ...(isActive ? shadows.pillSoft : shadows.pillFlat),
          }}
        >
          {isActive && (
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
            />
          )}
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 11,
            letterSpacing: 0.5,
            lineHeight: 13.2,
            color: isActive ? colors.white : colors.stone,
          }}>{tab.label}</Text>
        </Pressable>
      )
    })}
  </View>
)
