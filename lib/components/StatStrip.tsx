import React from 'react'
import { colors, webFonts } from '../theme'

export interface StatItem {
  value: string | number
  unit?: string
  label: string
}

export interface StatStripProps {
  stats: StatItem[]
}

export const StatStrip: React.FC<StatStripProps> = ({ stats }) => (
  <div style={{
    backgroundColor: colors.surface,
    border: '1px solid rgba(160,100,80,0.15)',
    borderRadius: 16,
    padding: '12px 0',
    display: 'grid',
    gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
  }}>
    {stats.map((stat, i) => (
      <div key={stat.label} style={{
        textAlign: 'center',
        borderRight: i < stats.length - 1 ? '1px solid rgba(160,100,80,0.12)' : 'none',
        padding: '0 4px',
      }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 22,
          fontWeight: 600,
          color: colors.terra,
          lineHeight: 1,
        }}>
          {stat.value}
          {stat.unit && (
            <span style={{ fontSize: 12, fontWeight: 300, color: '#C4B0A0' }}>{stat.unit}</span>
          )}
        </div>
        <div style={{
          fontFamily: webFonts.dmSans,
          fontSize: 7.5,
          fontWeight: 500,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 3,
        }}>{stat.label}</div>
      </div>
    ))}
  </div>
)
