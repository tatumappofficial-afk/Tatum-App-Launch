import React from 'react'
import { Text, View } from 'react-native'
import { colors, font, fontFamily, gradientStyle } from '../theme'

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
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      ...gradientStyle(gradient),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth,
      borderColor: colors.white,
      boxShadow: showShadow ? '0 3px 12px rgba(61,43,37,0.15)' : undefined,
      flexShrink: 0,
    }}>
      <Text style={{
        fontFamily: font('playfair', '700'),
        fontSize,
        color: colors.white,
      }}>
        {initials}
      </Text>
    </View>
  )
}
