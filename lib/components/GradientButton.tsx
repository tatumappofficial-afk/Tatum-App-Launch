import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { colors, font, gradientPoints, gradients, shadows } from '../theme'

export interface GradientButtonProps {
  label: string
  onPress?: () => void
  height?: number
  fontSize?: number
  letterSpacing?: number
  fullWidth?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'outline'
  disabled?: boolean
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  height = 52,
  fontSize = 13,
  letterSpacing = 2,
  fullWidth = true,
  icon,
  variant = 'primary',
  disabled = false,
}) => {
  const isPrimary = variant === 'primary'

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.()
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{
        width: fullWidth ? '100%' : undefined,
        height,
        borderRadius: 9999,
        overflow: 'hidden',
        borderWidth: isPrimary ? 0 : 1.5,
        borderColor: isPrimary ? undefined : colors.terra,
        backgroundColor: isPrimary ? undefined : 'transparent',
        opacity: disabled ? 0.4 : 1,
        ...(isPrimary && !disabled ? shadows.primaryButtonStrong : null),
      }}
    >
      {isPrimary && (
        <LinearGradient
          colors={gradients.primaryCta}
          start={gradientPoints.diagonal.start}
          end={gradientPoints.diagonal.end}
          style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
        />
      )}
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 7 : 0,
        paddingHorizontal: fullWidth ? undefined : height * 0.54,
      }}>
        {icon}
        <Text style={{
          fontFamily: font('dmSans', '500'),
          fontSize,
          letterSpacing,
          textTransform: 'uppercase',
          color: isPrimary ? colors.white : colors.terra,
        }}>
          {label}
        </Text>
      </View>
    </Pressable>
  )
}
