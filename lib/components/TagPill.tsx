import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../theme'

export interface TagPillProps {
  emoji: string
  label: string
  selected?: boolean
  onPress?: () => void
  variant?: 'display' | 'selectable'
}

export const TagPill: React.FC<TagPillProps> = ({
  emoji,
  label,
  selected = false,
  onPress,
  variant = 'display',
}) => {
  const isSelectable = variant === 'selectable'
  const isActive = isSelectable && selected

  return (
    <Pressable
      onPress={onPress}
      disabled={!isSelectable}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: isActive ? 'rgba(192,120,88,0.12)' : colors.surface,
        borderWidth: isActive ? 1.5 : 1,
        borderColor: isActive ? colors.terra : 'rgba(160,100,80,0.18)',
        borderRadius: 9999,
        paddingVertical: 6,
        paddingLeft: 9,
        paddingRight: 12,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 18 }}>{emoji}</Text>
      <Text style={{
        fontFamily: font('dmSans', isActive ? '500' : '400'),
        fontSize: 14,
        color: isActive ? colors.terra : '#6A4A40',
      }}>{label}</Text>
    </Pressable>
  )
}
