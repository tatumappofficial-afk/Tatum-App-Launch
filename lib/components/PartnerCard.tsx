import React from 'react'
import { colors, webFonts } from '../theme'

export interface PartnerCardProps {
  initials: string
  gradient: string
  name?: string
  sessions?: number
  avgSatisfaction?: number
  topActivityEmoji?: string
  emptyText?: string
  onPress?: () => void
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  initials,
  gradient,
  name,
  sessions,
  avgSatisfaction,
  topActivityEmoji,
  emptyText,
  onPress,
}) => {
  const hasStats = sessions !== undefined && avgSatisfaction !== undefined

  return (
    <div
      onClick={onPress}
      style={{
        flexShrink: 0,
        width: hasStats ? 126 : 110,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: hasStats ? '16px 12px' : '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: hasStats ? 8 : 6,
        position: 'relative',
        overflow: 'hidden',
        cursor: onPress ? 'pointer' : undefined,
      }}
    >
      <div style={{
        width: hasStats ? 52 : 44,
        height: hasStats ? 52 : 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: webFonts.playfair,
        fontSize: hasStats ? 18 : 16,
        fontWeight: 700,
        color: colors.white,
        border: hasStats ? '2.5px solid white' : '2px solid white',
        boxShadow: hasStats ? '0 3px 12px rgba(61,43,37,0.15)' : '0 2px 8px rgba(61,43,37,0.12)',
        background: gradient,
        flexShrink: 0,
      }}>{initials}</div>

      {name && (
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: colors.ink,
          fontFamily: webFonts.dmSans,
        }}>{name}</div>
      )}

      {hasStats && (
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontFamily: webFonts.playfair,
              fontSize: 17,
              fontWeight: 600,
              color: colors.terra,
              lineHeight: 1,
            }}>{sessions}</div>
            <div style={{
              fontSize: 7,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: colors.stone,
              marginTop: 2,
              fontFamily: webFonts.dmSans,
            }}>Sessions</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontFamily: webFonts.playfair,
              fontSize: 17,
              fontWeight: 600,
              color: colors.terra,
              lineHeight: 1,
            }}>{avgSatisfaction!.toFixed(1)}</div>
            <div style={{
              fontSize: 7,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: colors.stone,
              marginTop: 2,
              fontFamily: webFonts.dmSans,
            }}>Avg Sat.</div>
          </div>
        </div>
      )}

      {topActivityEmoji && (
        <div style={{
          fontSize: 10,
          color: colors.muted,
          fontWeight: 300,
          fontFamily: webFonts.dmSans,
        }}>{topActivityEmoji} Most common</div>
      )}

      {emptyText && (
        <div style={{
          fontSize: 10,
          fontWeight: 300,
          color: '#C4B0A0',
          fontStyle: 'italic',
          fontFamily: webFonts.dmSans,
        }}>{emptyText}</div>
      )}
    </div>
  )
}
