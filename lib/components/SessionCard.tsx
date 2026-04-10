import React from 'react'
import { colors, webFonts } from '../theme'

export interface SessionCardProps {
  partnerInitials: string
  partnerGradient: string
  date: string
  ratingPercent: number
  activityEmojis: string[]
  note?: string
  width?: number
  onPress?: () => void
}

const StarRating: React.FC<{ percent: number }> = ({ percent }) => (
  <div style={{ position: 'relative', display: 'inline-block', fontSize: 13, letterSpacing: 1, lineHeight: 1 }}>
    <div style={{ color: colors.surface2 }}>{'★★★★★'}</div>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      color: colors.terra,
      whiteSpace: 'nowrap',
      width: `${percent}%`,
    }}>{'★★★★★'}</div>
  </div>
)

export const SessionCard: React.FC<SessionCardProps> = ({
  partnerInitials,
  partnerGradient,
  date,
  ratingPercent,
  activityEmojis,
  note,
  width = 158,
  onPress,
}) => (
  <div
    onClick={onPress}
    style={{
      flexShrink: 0,
      width,
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      cursor: onPress ? 'pointer' : undefined,
      height: '100%',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: webFonts.playfair,
        fontSize: 13,
        fontWeight: 700,
        color: colors.white,
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(61,43,37,0.15)',
        background: partnerGradient,
        flexShrink: 0,
      }}>{partnerInitials}</div>
      <div style={{
        fontSize: 9,
        color: colors.stone,
        fontWeight: 300,
        fontFamily: webFonts.dmSans,
      }}>{date}</div>
    </div>
    <StarRating percent={ratingPercent} />
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {activityEmojis.map((e, i) => (
        <span key={i} style={{
          fontSize: 13,
          background: colors.surface2,
          borderRadius: 6,
          padding: '3px 6px',
        }}>{e}</span>
      ))}
    </div>
    {note !== undefined && (
      <div style={{
        fontSize: 10,
        fontWeight: 300,
        color: colors.stone,
        fontStyle: 'italic',
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        borderTop: '1px solid rgba(160,100,80,0.1)',
        paddingTop: 6,
        marginTop: 2,
        fontFamily: webFonts.dmSans,
      }}>{note}</div>
    )}
  </div>
)
