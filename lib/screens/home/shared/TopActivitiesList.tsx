import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, fontFamily, gradientPoints, gradients } from '../../../theme'
import type { ActivityCount } from '../../../stats'

export interface TopActivitiesListProps {
  activities: ActivityCount[]
}

export const TopActivitiesList: React.FC<TopActivitiesListProps> = ({ activities }) => {
  const max = Math.max(...activities.map(a => a.count), 1)
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexShrink: 0,
    }}>
      {activities.map((a, i) => (
        <View key={a.emoji} style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          marginBottom: i < activities.length - 1 ? 7 : 0,
        }}>
          <Text style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</Text>
          <Text style={{
            fontSize: 10,
            color: colors.stone,
            width: 80,
            flexShrink: 0,
            fontFamily: fontFamily.dmSans,
          }} numberOfLines={1}>{a.label}</Text>
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
              style={{ height: 5, borderRadius: 3, width: `${Math.round((a.count / max) * 100)}%` }}
            />
          </View>
          <Text style={{
            fontSize: 10,
            color: colors.mauve,
            minWidth: 16,
            textAlign: 'right',
            flexShrink: 0,
            fontFamily: font('dmSans', '500'),
          }}>{a.count}</Text>
        </View>
      ))}
    </View>
  )
}
