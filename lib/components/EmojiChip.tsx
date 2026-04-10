import React from 'react'
import { colors } from '../theme'

export interface EmojiChipProps {
  emoji: string
  size?: number
  borderRadius?: number
  selected?: boolean
  disabled?: boolean
  onPress?: () => void
}

export const EmojiChip: React.FC<EmojiChipProps> = ({
  emoji,
  size = 46,
  borderRadius = 12,
  selected = false,
  disabled = false,
  onPress,
}) => (
  <div
    onClick={() => !disabled && onPress?.()}
    style={{
      width: size,
      height: size,
      borderRadius,
      background: selected
        ? 'linear-gradient(135deg, rgba(192,120,88,0.18), rgba(124,74,90,0.12))'
        : colors.surface2,
      border: selected
        ? `1.5px solid ${colors.terra}`
        : '1.5px solid transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.52,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.22 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
      boxShadow: selected ? '0 2px 8px rgba(124,74,90,0.2)' : 'none',
      flexShrink: 0,
    }}
  >
    {emoji}
  </div>
)
