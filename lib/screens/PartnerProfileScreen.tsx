import React from 'react'
import { colors, webFonts } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { StarRating } from '../components/StarRating'

interface Activity {
  emoji: string
  label: string
  count: number
  /** Bar fill 0-100 */
  percent: number
}

interface Session {
  date: string
  /** Star fill 0-100 */
  ratingPercent: number
  tags: string[]
  note: string
}

export interface PartnerProfileScreenProps {
  initials: string
  name: string
  since: string
  sessions: number
  avgRating: string
  topDay: string
  activities: Activity[]
  recentSessions: Session[]
  onBack?: () => void
  onEdit?: () => void
}

/* ── main component ── */

export const PartnerProfileScreen: React.FC<PartnerProfileScreenProps> = ({
  initials,
  name,
  since,
  sessions,
  avgRating,
  topDay,
  activities,
  recentSessions,
  onBack,
  onEdit,
}) => (
  <div style={{
    width: '100%', minHeight: '100vh',
    position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    fontFamily: webFonts.dmSans, color: colors.ink,
  }}>
    {/* Glow */}
    <DecorativeGlow position="center" size={320} opacity={0.13} />
    <div style={{ height: 54 }} />

    {/* Header: back + edit */}
    <div style={{
      padding: '6px 24px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0, position: 'relative', zIndex: 2,
    }}>
      <button
        onClick={onBack}
        style={{
          width: 34, height: 34, borderRadius: '50%',
          backgroundColor: colors.surface2, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke={colors.stone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={onEdit}
        style={{
          background: 'none',
          border: '1px solid rgba(160,100,80,0.3)',
          borderRadius: 9999, padding: '5px 14px',
          fontFamily: webFonts.dmSans,
          fontSize: 11, fontWeight: 500, color: colors.terra,
          letterSpacing: 0.5, cursor: 'pointer',
        }}
      >Edit</button>
    </div>

    {/* Hero */}
    <div style={{
      flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 24px 0', position: 'relative', zIndex: 1,
    }}>
      <AvatarCircle
        initials={initials}
        gradient="linear-gradient(135deg, #C07858, #7C4A5A)"
        size={72}
        borderWidth={3}
      />
      <div style={{ marginBottom: 10 }} />
      <div style={{
        fontFamily: webFonts.playfair,
        fontSize: 26, fontWeight: 700, color: colors.ink, marginBottom: 2,
      }}>{name}</div>
      <div style={{
        fontSize: 10, fontWeight: 300, color: colors.stone, letterSpacing: 0.5,
      }}>{since}</div>
    </div>

    {/* Stat strip */}
    <div style={{ margin: '14px 24px 0', flexShrink: 0 }}>
      <StatStrip stats={[
        { value: String(sessions), label: 'Sessions' },
        { value: avgRating, label: 'Avg Rating' },
        { value: topDay, label: 'Top Day' },
      ]} />
    </div>

    {/* Top Activities */}
    <SectionLabel label="Top Activities" />
    <div style={{
      margin: '0 24px',
      backgroundColor: colors.surface,
      border: '1px solid rgba(160,100,80,0.15)',
      borderRadius: 14, padding: '12px 14px',
      flexShrink: 0,
    }}>
      {activities.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: i < activities.length - 1 ? 7 : 0,
        }}>
          <div style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</div>
          <div style={{ fontSize: 10, color: colors.stone, width: 68, flexShrink: 0 }}>{a.label}</div>
          <div style={{
            flex: 1, height: 5, backgroundColor: colors.surface2,
            borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${a.percent}%`,
              background: `linear-gradient(to right, ${colors.terra}, ${colors.mauve})`,
              borderRadius: 3,
            }} />
          </div>
          <div style={{
            fontSize: 10, fontWeight: 500, color: colors.mauve,
            width: 14, textAlign: 'right', flexShrink: 0,
          }}>{a.count}</div>
        </div>
      ))}
    </div>

    {/* Recent Sessions */}
    <SectionLabel label="Recent Sessions" />
    <div style={{ flexShrink: 0, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 8,
        overflowX: 'auto', padding: '0 24px',
        paddingRight: 40,
      }}>
        {recentSessions.map((s, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 155,
            backgroundColor: colors.surface,
            border: '1px solid rgba(160,100,80,0.15)',
            borderRadius: 14, padding: 12,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 9, color: colors.stone, fontWeight: 300, paddingTop: 2 }}>{s.date}</div>
              <StarRating percent={s.ratingPercent} size={12} />
            </div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {s.tags.map((t, ti) => (
                <span key={ti} style={{
                  fontSize: 13, backgroundColor: colors.surface2,
                  borderRadius: 6, padding: '2px 5px',
                }}>{t}</span>
              ))}
            </div>
            {/* Note */}
            <div style={{
              fontSize: 10, fontWeight: 300, color: colors.stone,
              fontStyle: 'italic', lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              borderTop: '1px solid rgba(160,100,80,0.1)',
              paddingTop: 5, marginTop: 1,
            }}>{s.note}</div>
          </div>
        ))}
      </div>
    </div>

  </div>
)
