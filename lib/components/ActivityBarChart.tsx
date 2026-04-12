import React from 'react'
import { Text, View } from 'react-native'
import { colors, font, fontFamily, gradientStyle } from '../theme'

export interface ActivityBarItem {
  emoji: string
  label: string
  count: number
  percent: number
}

export interface ActivityBarChartProps {
  activities: ActivityBarItem[]
}

export const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ activities }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    flexShrink: 0,
  }}>
    {activities.map((a, i) => (
      <View key={a.label} style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: i < activities.length - 1 ? 7 : 0,
      }}>
        <Text style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</Text>
        <Text style={{
          fontSize: 10,
          color: colors.stone,
          width: 62,
          flexShrink: 0,
          fontFamily: fontFamily.dmSans,
        }}>{a.label}</Text>
        <View style={{
          flex: 1,
          height: 5,
          backgroundColor: colors.surface2,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            height: 5,
            ...gradientStyle('linear-gradient(to right, #C07858, #B07080)'),
            borderRadius: 3,
            width: `${a.percent}%` as unknown as number,
          }} />
        </View>
        <Text style={{
          fontSize: 10,
          color: colors.mauve,
          width: 12,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: font('dmSans', '500'),
        }}>{a.count}</Text>
      </View>
    ))}
  </View>
)
