import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints, gradients } from '../../../theme'

export interface BarChartProps {
  /** Per-bar values. Length sets the bar count (typically 7 for weekday or 12 for month). */
  data: number[]
  /** Per-bar short labels rendered under each bar (e.g. ["Su","Mo",…] or ["J","F","M",…]). */
  labels: string[]
  /** Bars at indexes > this are rendered muted (used for YTD year-by-month). */
  mutedFromIndex?: number
  /** Visual height of the chart area in px. */
  height?: number
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  mutedFromIndex,
  height = 110,
}) => {
  const max = Math.max(...data, 1)
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexShrink: 0,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height,
        gap: 4,
      }}>
        {data.map((value, i) => {
          const isMuted = mutedFromIndex !== undefined && i > mutedFromIndex
          const fillPct = max === 0 ? 0 : value / max
          const barHeight = Math.max(fillPct * height, value > 0 ? 4 : 2)
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height }}>
              {value === 0 ? (
                <View style={{
                  height: 2,
                  width: '100%',
                  borderRadius: 2,
                  backgroundColor: colors.surface2,
                  opacity: isMuted ? 0.5 : 1,
                }} />
              ) : (
                <View style={{
                  height: barHeight,
                  width: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  opacity: isMuted ? 0.4 : 1,
                }}>
                  <LinearGradient
                    colors={gradients.activityBar}
                    start={gradientPoints.vertical.start}
                    end={gradientPoints.vertical.end}
                    style={{ flex: 1 }}
                  />
                </View>
              )}
            </View>
          )
        })}
      </View>
      <View style={{
        flexDirection: 'row',
        marginTop: 6,
        gap: 4,
      }}>
        {labels.map((label, i) => {
          const isMuted = mutedFromIndex !== undefined && i > mutedFromIndex
          return (
            <Text
              key={i}
              style={{
                flex: 1,
                fontSize: 9,
                textAlign: 'center',
                color: isMuted ? colors.muted : colors.stone,
                fontFamily: font('dmSans', '500'),
                opacity: isMuted ? 0.6 : 1,
              }}
            >
              {label}
            </Text>
          )
        })}
      </View>
    </View>
  )
}
