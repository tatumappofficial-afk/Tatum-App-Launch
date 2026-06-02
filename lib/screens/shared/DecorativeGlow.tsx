import React from 'react'
import { View, type ViewStyle } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'

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
  const posStyle: ViewStyle =
    position === 'top-right' ? { top: -40, right: -60 } : { top: -20, left: '50%', marginLeft: -size / 2 }

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        ...posStyle,
      }}
    >
      <RadialGlow size={size} color="rgb(192,120,88)" opacity={opacity} />
    </View>
  )
}

interface RadialGlowProps {
  size: number
  color: string
  opacity: number
  /** % at which the glow fades to fully transparent (default 70). */
  falloff?: number
}

let glowIdCounter = 0
const nextGlowId = () => `radial-glow-${++glowIdCounter}`

export const RadialGlow: React.FC<RadialGlowProps> = ({ size, color, opacity, falloff = 70 }) => {
  const id = React.useMemo(nextGlowId, [])
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
          <Stop offset={`${falloff}%`} stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={size} height={size} fill={`url(#${id})`} />
    </Svg>
  )
}
