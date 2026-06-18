import React from 'react'
import { Pressable, Text } from 'react-native'
import { colors, font } from '../theme'

export interface TagPillProps {
  emoji: string
  label: string
  selected?: boolean
  onPress?: () => void
  variant?: 'display' | 'selectable'
  /** Discretion mode: render only the emoji, no text label — for surfaces where
   *  the activity must stay private (e.g. a calendar day's session list). The
   *  accessibility label is kept generic so screen readers don't leak it either. */
  emojiOnly?: boolean
}

export const TagPill: React.FC<TagPillProps> = ({
  emoji,
  label,
  selected = false,
  onPress,
  variant = 'display',
  emojiOnly = false,
}) => {
  const isSelectable = variant === 'selectable'
  const isActive = isSelectable && selected

  return (
    <Pressable
      onPress={onPress}
      disabled={!isSelectable}
      accessibilityLabel={emojiOnly ? 'Activity' : label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: emojiOnly ? 0 : 5,
        backgroundColor: isActive ? 'rgba(192,120,88,0.12)' : colors.surface,
        borderWidth: isActive ? 1.5 : 1,
        borderColor: isActive ? colors.terra : 'rgba(160,100,80,0.18)',
        borderRadius: 9999,
        paddingVertical: 6,
        paddingLeft: emojiOnly ? 10 : 9,
        paddingRight: emojiOnly ? 10 : 12,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 18 }}>{emoji}</Text>
      {!emojiOnly && (
        <Text
          style={{
            fontFamily: font('dmSans', isActive ? '500' : '400'),
            fontSize: 14,
            color: isActive ? colors.terra : '#6A4A40',
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  )
}
