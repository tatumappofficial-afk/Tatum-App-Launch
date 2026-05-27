import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../../../theme'
import type { Encounter } from '@/src/db/schema'

export interface RecentReflectionsProps {
  notes: Encounter[]
  onPress?: (encounter: Encounter) => void
}

export const RecentReflections: React.FC<RecentReflectionsProps> = ({ notes, onPress }) => (
  <View style={{ gap: 6 }}>
    {notes.map(n => (
      <Pressable
        key={n.id}
        onPress={() => onPress?.(n)}
        accessibilityRole="button"
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.surface2 : colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 14,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          numberOfLines={3}
          style={{
            fontSize: 16,
            color: colors.stone,
            fontStyle: 'italic',
            lineHeight: 20,
            fontFamily: font('dmSans', '300'),
          }}
        >
          {n.notes}
        </Text>
        <Text style={{
          fontSize: 12,
          color: colors.muted,
          fontFamily: fontFamily.dmSans,
          marginTop: 4,
        }}>
          {formatDateShort(n.date)}
        </Text>
      </Pressable>
    ))}
  </View>
)

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
