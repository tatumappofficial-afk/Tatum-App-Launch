import React from 'react'
import { Pressable, Text } from 'react-native'
import { colors, font, fontFamily, gradientStyle } from '../theme'

export interface GradientButtonProps {
  label: string
  onPress?: () => void
  height?: number
  fontSize?: number
  letterSpacing?: number
  fullWidth?: boolean
  icon?: React.ReactNode
  variant?: 'primary' | 'outline'
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
}) => {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: fullWidth ? '100%' : undefined,
        height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 7 : 0,
        ...(isPrimary
          ? gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)')
          : { backgroundColor: 'transparent' }),
        borderWidth: isPrimary ? 0 : 1.5,
        borderColor: isPrimary ? undefined : colors.terra,
        borderRadius: 9999,
        boxShadow: isPrimary
          ? '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)'
          : undefined,
        paddingHorizontal: fullWidth ? undefined : height * 0.54,
      }}
    >
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
    </Pressable>
  )
}
