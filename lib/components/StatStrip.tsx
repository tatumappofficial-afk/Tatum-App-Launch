import React from 'react'
import { Text, View } from 'react-native'
import { colors, font, fontFamily } from '../theme'

export interface StatItem {
  value: string | number
  unit?: string
  label: string
}

export interface StatStripProps {
  stats: StatItem[]
}

export const StatStrip: React.FC<StatStripProps> = ({ stats }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  }}>
    {stats.map((stat, i) => (
      <View key={stat.label} style={{
        flex: 1,
        alignItems: 'center',
        borderRightWidth: i < stats.length - 1 ? 1 : 0,
        borderRightColor: 'rgba(160,100,80,0.12)',
        paddingHorizontal: 4,
      }}>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 22,
          color: colors.terra,
          lineHeight: 22,
        }}>
          {stat.value}
          {stat.unit && (
            <Text style={{ fontSize: 14, fontWeight: '300', color: '#C4B0A0' }}>{stat.unit}</Text>
          )}
        </Text>
        <Text style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 3,
        }}>{stat.label}</Text>
      </View>
    ))}
  </View>
)
