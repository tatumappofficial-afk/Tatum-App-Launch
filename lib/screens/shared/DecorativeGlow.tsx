import React from 'react'
import { View } from 'react-native'
import { gradientStyle } from '../../theme'

interface DecorativeGlowProps {
  position?: 'top-right' | 'center'
  size?: number
  opacity?: number
}

export const DecorativeGlow: React.FC<DecorativeGlowProps> = ({
  position = 'top-right',
  size = 280,
  opacity = 0.1,
}) => {
  const posStyle = position === 'top-right'
    ? { top: -40, right: -60 }
    : { top: -20, left: '50%' as unknown as number, transform: [{ translateX: '-50%' as unknown as number }] }

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        ...gradientStyle(`radial-gradient(circle, rgba(192,120,88,${opacity}) 0%, transparent 70%)`),
        zIndex: 0,
        ...posStyle,
      }}
    />
  )
}
