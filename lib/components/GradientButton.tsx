import React from 'react'
import { colors, webFonts } from '../theme'

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
    <button
      onClick={onPress}
      style={{
        width: fullWidth ? '100%' : undefined,
        height,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 7 : 0,
        background: isPrimary
          ? 'linear-gradient(135deg, #C07858, #7C4A5A)'
          : 'transparent',
        border: isPrimary
          ? 'none'
          : `1.5px solid ${colors.terra}`,
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: webFonts.dmSans,
        fontSize,
        fontWeight: 500,
        letterSpacing,
        textTransform: 'uppercase',
        color: isPrimary ? colors.white : colors.terra,
        boxShadow: isPrimary
          ? '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)'
          : 'none',
        padding: fullWidth ? undefined : `0 ${height * 0.54}px`,
      }}
    >
      {icon}
      {label}
    </button>
  )
}
