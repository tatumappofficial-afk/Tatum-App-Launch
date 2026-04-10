import React from 'react'
import { colors } from '../theme'

export interface ToggleSwitchProps {
  enabled: boolean
  onToggle?: () => void
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <div
    onClick={(e) => { e.stopPropagation(); onToggle?.() }}
    style={{
      width: 44,
      height: 26,
      borderRadius: 13,
      background: enabled
        ? 'linear-gradient(135deg, #C07858, #7C4A5A)'
        : colors.surface2,
      position: 'relative',
      flexShrink: 0,
      boxShadow: enabled ? '0 1px 4px rgba(124,74,90,0.3)' : 'none',
      cursor: 'pointer',
    }}
  >
    <div style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: colors.white,
      position: 'absolute',
      top: 3,
      ...(enabled ? { right: 3 } : { left: 3 }),
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }} />
  </div>
)
