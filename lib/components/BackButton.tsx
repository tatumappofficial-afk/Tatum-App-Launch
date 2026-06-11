import React from 'react'
import { Pressable, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors } from '../theme'

export interface BackButtonProps {
  onPress?: () => void
  accessibilityLabel?: string
}

/**
 * Canonical back button used in every screen header.
 *
 * - 34dp visual circle, but `hitSlop` extends the touch target to ~58dp so it
 *   clears Android's 48dp minimum and is forgiving to tap.
 * - The arrow `<Svg>` is wrapped in a `pointerEvents="none"` View — on Android
 *   an SVG child can otherwise swallow the center tap, leaving only a thin ring
 *   responsive.
 * - Pressed state shades the background and scales down, so every tap gives
 *   visible feedback.
 */
export const BackButton: React.FC<BackButtonProps> = ({ onPress, accessibilityLabel = 'Go back' }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    hitSlop={12}
    style={({ pressed }) => ({
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: pressed ? 'rgba(160,100,80,0.18)' : colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: pressed ? 0.94 : 1 }],
    })}
  >
    <View pointerEvents="none">
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.stone}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Polyline points="15 18 9 12 15 6" />
      </Svg>
    </View>
  </Pressable>
)
