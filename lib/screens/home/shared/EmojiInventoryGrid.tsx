import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '../../../theme'
import type { ActivityCount } from '../../../stats'

export interface EmojiInventoryGridProps {
  inventory: ActivityCount[]
}

export const EmojiInventoryGrid: React.FC<EmojiInventoryGridProps> = ({ inventory }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  }}>
    {inventory.map(a => (
      <View
        key={a.emoji}
        accessible
        accessibilityLabel={a.label}
        style={{
          backgroundColor: colors.surface2,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>{a.emoji}</Text>
      </View>
    ))}
  </View>
)
