import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font } from '../../../theme'
import type { Period } from '../../../stats'

const PICKER_LABELS: Record<Period, string> = {
  week: 'Pick a week',
  month: 'Pick a month',
  year: 'Pick a year',
  all: '', // unused — All Time renders a static caption pill instead
}

export interface PeriodCaptionRowProps {
  period: Period
  /** Date-range caption shown on the left (e.g. "Apr 26 – May 2"). */
  caption: string
  /** For All Time mode: the "since X" caption rendered inside the static pill. */
  staticPillCaption?: string
  /** Tapped when the picker pill is pressed. Ignored on All Time. */
  onPickerPress?: () => void
}

export const PeriodCaptionRow: React.FC<PeriodCaptionRowProps> = ({
  period,
  caption,
  staticPillCaption,
  onPickerPress,
}) => {
  const isAllTime = period === 'all'
  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Text
        style={{
          fontFamily: font('dmSans', '400'),
          fontSize: 14,
          letterSpacing: 0.3,
          color: colors.stone,
          flexShrink: 1,
        }}
        numberOfLines={1}
      >
        {caption}
      </Text>

      {isAllTime ? (
        <View
          accessibilityRole="text"
          style={{
            borderRadius: 9999,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: colors.surface2,
            opacity: 0.85,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              fontFamily: font('dmSans', '400'),
              fontSize: 12,
              letterSpacing: 0.3,
              color: colors.stone,
            }}
          >
            {staticPillCaption ?? caption}
          </Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={PICKER_LABELS[period]}
          onPress={onPickerPress}
          style={{
            borderRadius: 9999,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.18)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 12,
              letterSpacing: 0.5,
              color: colors.terra,
            }}
          >
            {PICKER_LABELS[period]}
          </Text>
          <Svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.terra}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Polyline points="6 9 12 15 18 9" />
          </Svg>
        </Pressable>
      )}
    </View>
  )
}
