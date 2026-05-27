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
  /** Y-axis unit label shown above the chart (e.g. "Sessions"). */
  yAxisLabel?: string
}

const Y_AXIS_WIDTH = 22

function buildAxis(rawMax: number): { max: number; ticks: number[] } {
  if (rawMax < 1) return { max: 1, ticks: [0, 1] }
  let step: number
  if (rawMax <= 4) step = 1
  else if (rawMax <= 8) step = 2
  else if (rawMax <= 20) step = 5
  else if (rawMax <= 50) step = 10
  else if (rawMax <= 100) step = 20
  else step = Math.ceil(rawMax / 50) * 10
  const max = Math.ceil(rawMax / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= max; v += step) ticks.push(v)
  return { max, ticks }
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  mutedFromIndex,
  height = 110,
  yAxisLabel = 'Sessions',
}) => {
  const rawMax = Math.max(...data, 0)
  const { max, ticks } = buildAxis(rawMax)
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
      {yAxisLabel && (
        <Text style={{
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.muted,
          fontFamily: font('dmSans', '500'),
          marginBottom: 6,
        }}>{yAxisLabel}</Text>
      )}
      <View style={{ flexDirection: 'row', height }}>
        {/* Y-axis ticks */}
        <View style={{ width: Y_AXIS_WIDTH, height, position: 'relative' }}>
          {ticks.map((t) => {
            const top = height * (1 - t / max) - 6
            return (
              <Text
                key={t}
                style={{
                  position: 'absolute',
                  right: 4,
                  top,
                  fontSize: 10,
                  color: colors.muted,
                  fontFamily: font('dmSans', '400'),
                }}
              >
                {t}
              </Text>
            )
          })}
        </View>
        {/* Bars */}
        <View style={{
          flex: 1,
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
      </View>
      <View style={{
        flexDirection: 'row',
        marginTop: 6,
        gap: 4,
        paddingLeft: Y_AXIS_WIDTH,
      }}>
        {labels.map((label, i) => {
          const isMuted = mutedFromIndex !== undefined && i > mutedFromIndex
          return (
            <Text
              key={i}
              style={{
                flex: 1,
                fontSize: 12,
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
