import React from 'react'
import { colors, webFonts } from '../theme'

export interface ActivityBarItem {
  emoji: string
  label: string
  count: number
  percent: number
}

export interface ActivityBarChartProps {
  activities: ActivityBarItem[]
}

export const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ activities }) => (
  <div style={{
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: '12px 14px',
    flexShrink: 0,
  }}>
    {activities.map((a, i) => (
      <div key={a.label} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: i < activities.length - 1 ? 7 : 0,
      }}>
        <div style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</div>
        <div style={{
          fontSize: 10,
          color: colors.stone,
          width: 62,
          flexShrink: 0,
          fontFamily: webFonts.dmSans,
        }}>{a.label}</div>
        <div style={{
          flex: 1,
          height: 5,
          background: colors.surface2,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #C07858, #B07080)',
            borderRadius: 3,
            width: `${a.percent}%`,
          }} />
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 500,
          color: colors.mauve,
          width: 12,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: webFonts.dmSans,
        }}>{a.count}</div>
      </div>
    ))}
  </div>
)
