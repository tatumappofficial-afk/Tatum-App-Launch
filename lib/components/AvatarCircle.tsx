import React from 'react'
import { colors, webFonts } from '../theme'

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
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: webFonts.playfair,
      fontSize,
      fontWeight: 700,
      color: colors.white,
      border: `${borderWidth}px solid ${colors.white}`,
      boxShadow: showShadow ? '0 3px 12px rgba(61,43,37,0.15)' : 'none',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}
