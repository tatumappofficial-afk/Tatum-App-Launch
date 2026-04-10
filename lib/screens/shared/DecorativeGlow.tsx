import React from 'react'

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
    : { top: -20, left: '50%', transform: 'translateX(-50%)' }

  return (
    <div style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(192,120,88,${opacity}) 0%, transparent 70%)`,
      pointerEvents: 'none',
      zIndex: 0,
      ...posStyle,
    }} />
  )
}
