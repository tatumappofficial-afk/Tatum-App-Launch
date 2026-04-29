import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../../../theme'

export interface SessionsCountCardProps {
  count: number
  countLabel?: string
  averageRating?: number | null
}

export const SessionsCountCard: React.FC<SessionsCountCardProps> = ({
  count,
  countLabel = 'Sessions',
  averageRating = null,
}) => {
  const cells: Array<{ label: string; value: string }> = [
    { label: countLabel, value: String(count) },
  ]
  if (averageRating !== null) {
    cells.push({ label: 'Avg Rating', value: averageRating.toFixed(1) })
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
          paddingHorizontal: 10,
          borderRightWidth: i < cells.length - 1 ? 1 : 0,
          borderRightColor: 'rgba(160,100,80,0.12)',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 3,
            fontFamily: font('dmSans', '500'),
          }}>{c.label}</Text>
          <Text style={{
            fontFamily: font('playfair', '600'),
            fontSize: 28,
            color: colors.terra,
            lineHeight: 28,
            marginBottom: 2,
          }}>{c.value}</Text>
        </View>
      ))}
    </View>
  )
}
