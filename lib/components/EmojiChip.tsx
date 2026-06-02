import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, gradientPoints } from '../theme'

export interface EmojiChipProps {
  emoji: string
  /** Fixed pixel size. Ignored when flexBasis is provided. */
  size?: number
  /** When set, the chip uses flex sizing (flexBasis + aspectRatio:1) instead of a fixed size. */
  flexBasis?: string | number
  borderRadius?: number
  selected?: boolean
  disabled?: boolean
  /** Override the default (non-selected) chip background. Defaults to `colors.surface2`. */
  backgroundColor?: string
  onPress?: () => void
}

const SELECTED_COLORS = ['rgba(192,120,88,0.18)', 'rgba(124,74,90,0.12)'] as const

export const EmojiChip: React.FC<EmojiChipProps> = ({
  emoji,
  size = 46,
  flexBasis,
  borderRadius = 12,
  selected = false,
  disabled = false,
  backgroundColor,
  onPress,
}) => {
  const flex = flexBasis !== undefined
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={{
        ...(flex ? { flexBasis: flexBasis as number, aspectRatio: 1 } : { width: size, height: size }),
        borderRadius,
        overflow: 'hidden',
        backgroundColor: selected ? undefined : (backgroundColor ?? colors.surface2),
        borderWidth: 1.5,
        borderColor: selected ? colors.terra : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.22 : 1,
        shadowColor: '#7C4A5A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: selected ? 0.2 : 0,
        shadowRadius: 8,
        elevation: selected ? 3 : 0,
      }}
    >
      {selected && (
        <LinearGradient
          colors={SELECTED_COLORS}
          start={gradientPoints.diagonal.start}
          end={gradientPoints.diagonal.end}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      )}
      <Text style={{ fontSize: flex ? 20 : size * 0.52 }}>{emoji}</Text>
    </Pressable>
  )
}
