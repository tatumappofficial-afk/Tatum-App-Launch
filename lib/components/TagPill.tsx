import React from 'react'
import { colors, webFonts } from '../theme'

export interface TagPillProps {
  emoji: string
  label: string
  selected?: boolean
  onPress?: () => void
  variant?: 'display' | 'selectable'
}

export const TagPill: React.FC<TagPillProps> = ({
  emoji,
  label,
  selected = false,
  onPress,
  variant = 'display',
}) => {
  const isSelectable = variant === 'selectable'
  const isActive = isSelectable && selected

  return (
    <div
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: isActive ? 'rgba(192,120,88,0.12)' : colors.surface,
        border: isActive
          ? `1.5px solid ${colors.terra}`
          : '1px solid rgba(160,100,80,0.18)',
        borderRadius: 9999,
        padding: '6px 12px 6px 9px',
        cursor: isSelectable ? 'pointer' : 'default',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
      <span style={{
        fontFamily: webFonts.dmSans,
        fontSize: 12,
        fontWeight: isActive ? 500 : 400,
        color: isActive ? colors.terra : '#6A4A40',
      }}>{label}</span>
    </div>
  )
}
