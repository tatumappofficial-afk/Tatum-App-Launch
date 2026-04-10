import React from 'react'
import { colors, webFonts } from '../../theme'

interface SectionLabelProps {
  label: string
  showChevron?: boolean
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, showChevron = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '12px 24px 8px',
  }}>
    <span style={{
      fontFamily: webFonts.dmSans,
      fontSize: 8,
      fontWeight: 500,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: colors.terra,
      whiteSpace: 'nowrap',
    }}>{label}</span>
    <div style={{
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(160,100,80,0.18)',
    }} />
    {showChevron && (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    )}
  </div>
)
