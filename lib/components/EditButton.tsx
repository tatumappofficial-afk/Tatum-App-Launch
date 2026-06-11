import React from 'react'
import { Pressable, Text } from 'react-native'
import { colors, font } from '../theme'

export interface EditButtonProps {
  onPress?: () => void
  label?: string
}

/**
 * Canonical pill button for header actions (Edit, etc.).
 *
 * - `hitSlop` gives it a forgiving 48dp+ touch target.
 * - Pressed state shades the fill + border and dims slightly, so every tap
 *   gives visible feedback.
 */
export const EditButton: React.FC<EditButtonProps> = ({ onPress, label = 'Edit' }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={12}
    style={({ pressed }) => ({
      backgroundColor: pressed ? 'rgba(192,120,88,0.12)' : 'transparent',
      borderWidth: 1,
      borderColor: pressed ? colors.terra : 'rgba(160,100,80,0.3)',
      borderRadius: 9999,
      paddingVertical: 5,
      paddingHorizontal: 14,
      opacity: pressed ? 0.85 : 1,
    })}
  >
    <Text style={{ fontSize: 14, fontFamily: font('dmSans', '500'), color: colors.terra, letterSpacing: 0.5 }}>
      {label}
    </Text>
  </Pressable>
)
