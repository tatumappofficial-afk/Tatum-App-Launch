import React from 'react'
import { Pressable, Text } from 'react-native'
import { colors, gradientStyle } from '../theme'

export interface EmojiChipProps {
  emoji: string
  /** Fixed pixel size. Ignored when flexBasis is provided. */
  size?: number
  /** When set, the chip uses flex sizing (flexBasis + aspectRatio:1) instead of a fixed size. */
  flexBasis?: string | number
  borderRadius?: number
  selected?: boolean
  disabled?: boolean
  onPress?: () => void
}

export const EmojiChip: React.FC<EmojiChipProps> = ({
  emoji,
  size = 46,
  flexBasis,
  borderRadius = 12,
  selected = false,
  disabled = false,
  onPress,
}) => {
  const flex = flexBasis !== undefined
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        ...(flex
          ? { flexBasis: flexBasis as number, aspectRatio: 1 }
          : { width: size, height: size }),
        borderRadius,
        ...(selected
          ? gradientStyle('linear-gradient(135deg, rgba(192,120,88,0.18), rgba(124,74,90,0.12))')
          : { backgroundColor: colors.surface2 }),
        borderWidth: 1.5,
        borderColor: selected ? colors.terra : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.22 : 1,
        boxShadow: selected ? '0 2px 8px rgba(124,74,90,0.2)' : undefined,
        flexShrink: 0,
      }}
    >
      <Text style={{ fontSize: flex ? 20 : size * 0.52 }}>{emoji}</Text>
    </Pressable>
  )
}
