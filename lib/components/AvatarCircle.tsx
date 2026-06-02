import React from 'react'
import { Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints, parseGradientColors, shadows } from '../theme'

export interface AvatarCircleProps {
  initials: string
  gradient: string
  size?: number
  borderWidth?: number
  showShadow?: boolean
}

export const AvatarCircle: React.FC<AvatarCircleProps> = ({
  initials,
  gradient,
  size = 52,
  borderWidth = 2.5,
  showShadow = true,
}) => {
  const fontSize = Math.round(size * 0.35)

  return (
    <LinearGradient
      colors={parseGradientColors(gradient)}
      start={gradientPoints.diagonal.start}
      end={gradientPoints.diagonal.end}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth,
        borderColor: colors.white,
        ...(showShadow ? shadows.cardSubtle : null),
      }}
    >
      <Text
        style={{
          fontFamily: font('playfair', '700'),
          fontSize,
          color: colors.white,
          textAlign: 'center',
        }}
      >
        {initials}
      </Text>
    </LinearGradient>
  )
}
