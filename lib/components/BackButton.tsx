import React from 'react'
import { colors } from '../theme'

export interface BackButtonProps {
  onPress?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <button
    onClick={onPress}
    style={{
      width: 34,
      height: 34,
      borderRadius: '50%',
      backgroundColor: colors.surface2,
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
    }}
  >
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.stone}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button>
)
