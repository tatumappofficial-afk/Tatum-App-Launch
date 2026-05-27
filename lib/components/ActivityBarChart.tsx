import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, fontFamily, gradientPoints, gradients } from '../theme'

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
  }}>
    {activities.map((a, i) => (
      <View key={a.label} style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: i < activities.length - 1 ? 7 : 0,
      }}>
        <Text style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{a.emoji}</Text>
        <Text style={{
          fontSize: 12,
          color: colors.stone,
          width: 62,
          fontFamily: fontFamily.dmSans,
        }}>{a.label}</Text>
        <View style={{
          flex: 1,
          height: 5,
          backgroundColor: colors.surface2,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <LinearGradient
            colors={gradients.activityBar}
            start={gradientPoints.horizontal.start}
            end={gradientPoints.horizontal.end}
            style={{
              height: 5,
              borderRadius: 3,
              width: `${a.percent}%`,
            }}
          />
        </View>
        <Text style={{
          fontSize: 12,
          color: colors.mauve,
          width: 12,
          textAlign: 'right',
          fontFamily: font('dmSans', '500'),
        }}>{a.count}</Text>
      </View>
    ))}
  </View>
)
