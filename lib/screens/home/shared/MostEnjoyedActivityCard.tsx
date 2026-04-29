import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../../../theme'
import type { MostEnjoyedActivity } from '../../../stats'

export interface MostEnjoyedActivityCardProps {
  activity: MostEnjoyedActivity
}

export const MostEnjoyedActivityCard: React.FC<MostEnjoyedActivityCardProps> = ({ activity }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  }}>
    <Text style={{ fontSize: 30 }}>{activity.emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontFamily: font('playfair', '600'),
        fontSize: 16,
        color: colors.ink,
        lineHeight: 20,
      }}>{activity.label}</Text>
      <Text style={{
        fontSize: 10,
        color: colors.stone,
        fontFamily: font('dmSans', '300'),
        marginTop: 2,
      }}>
        {activity.averageStars.toFixed(1)} ★ avg across {activity.sampleSize} {activity.sampleSize === 1 ? 'session' : 'sessions'}
      </Text>
    </View>
  </View>
)
