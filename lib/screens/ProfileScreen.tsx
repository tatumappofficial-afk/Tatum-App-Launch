import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { BottomNav } from './shared/BottomNav'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { StarRating } from '../components/StarRating'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface Partner {
  initials: string
  gradient: string
  since: string
}

export interface ActivityTag {
  emoji: string
  label: string
}

export interface RecentSession {
  partnerInitials: string
  partnerGradient: string
  date: string
  /** 0-100 percentage for the star fill width */
  ratingPercent: number
  tags: string[]
  note: string
}

export interface ProfileScreenProps {
  userName: string
  userInitial: string
  sinceDate: string
  tagline?: string
  stats: {
    sessions: number | string
    avgSat: number | string
    partners: number | string
  }
  partners: Partner[]
  activityTags: ActivityTag[]
  recentSessions: RecentSession[]
  onEdit?: () => void
  onSettings?: () => void
  onAddPartner?: () => void
  onAddTag?: () => void
  onPartnersSection?: () => void
}

/* ── Inline icon helpers ── */

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = colors.stone }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)

const ChevronIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = colors.terra }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const AddCircleIcon: React.FC<{ size?: number; color?: string; opacity?: number }> = ({ size = 20, color = colors.terra, opacity = 0.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

const AddIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = colors.terra }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

/* ── Main component ── */

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName,
  userInitial,
  sinceDate,
  tagline,
  stats,
  partners,
  activityTags,
  recentSessions,
  onEdit,
  onSettings,
  onAddPartner,
  onAddTag,
  onPartnersSection,
}) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}>
      <DecorativeGlow position="top-right" size={220} opacity={0.09} />
      <DynamicIsland />
      <StatusBar />

      {/* ── Screen Header ── */}
      <div style={{
        padding: '6px 24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 20,
          fontWeight: 700,
          color: colors.ink,
        }}>Profile</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              background: 'none',
              border: '1px solid rgba(160,100,80,0.3)',
              borderRadius: 9999,
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 500,
              color: colors.terra,
              letterSpacing: 0.5,
              cursor: 'pointer',
              fontFamily: webFonts.dmSans,
            }}
          >Edit</button>
          <button
            onClick={onSettings}
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
            }}
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {/* ── Identity Block ── */}
      <div style={{
        padding: '14px 24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        <AvatarCircle
          initials={userInitial}
          gradient="linear-gradient(135deg, #C07858, #7C4A5A)"
          size={58}
          borderWidth={3}
        />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 20,
            fontWeight: 700,
            color: colors.ink,
            lineHeight: 1.1,
          }}>{userName}</div>
          <div style={{
            fontSize: 10,
            fontWeight: 300,
            color: colors.stone,
            letterSpacing: 0.5,
            marginTop: 2,
          }}>{sinceDate}</div>
          {tagline && (
            <div style={{
              fontFamily: webFonts.playfair,
              fontSize: 11,
              fontStyle: 'italic',
              color: colors.mauve,
              marginTop: 3,
              lineHeight: 1.4,
            }}>{tagline}</div>
          )}
        </div>
      </div>

      {/* ── Stat Strip ── */}
      <div style={{ margin: '12px 24px 0', flexShrink: 0 }}>
        <StatStrip stats={[
          { value: stats.sessions, label: 'Sessions' },
          { value: stats.avgSat, label: 'Avg Sat.' },
          { value: stats.partners, label: 'Partners' },
        ]} />
      </div>

      {/* ── Partners Section ── */}
      <button
        onClick={onPartnersSection}
        style={{
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: colors.terra,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '12px 24px 8px',
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: 'calc(100% - 48px)',
          fontFamily: webFonts.dmSans,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          Partners
          <ChevronIcon />
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(160,100,80,0.15)' }} />
      </button>
      <div style={{ flexShrink: 0, marginRight: -24 }}>
        <div style={{
          display: 'flex',
          gap: 8,
          overflow: 'hidden',
          padding: '0 24px 2px',
          paddingRight: 40,
        }}>
          {partners.map((p, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 110,
              backgroundColor: colors.surface,
              border: '1px solid rgba(160,100,80,0.15)',
              borderRadius: 14,
              padding: '12px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}>
              <AvatarCircle
                initials={p.initials}
                gradient={p.gradient}
                size={44}
                borderWidth={2}
              />
              <div style={{
                fontSize: 9,
                color: colors.stone,
                fontWeight: 300,
              }}>{p.since}</div>
            </div>
          ))}
          {/* Add partner ghost card */}
          <div
            onClick={onAddPartner}
            style={{
              flexShrink: 0,
              width: 72,
              border: '1.5px dashed rgba(160,100,80,0.28)',
              borderRadius: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
              marginRight: 24,
            }}
          >
            <AddCircleIcon />
            <div style={{
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: colors.terra,
              opacity: 0.6,
              textAlign: 'center',
            }}>Add</div>
          </div>
        </div>
      </div>

      {/* ── Activity Tags ── */}
      <SectionLabel label="My Activity Tags" />
      <div style={{ flexShrink: 0, padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {activityTags.map((tag, i) => (
            <TagPill key={i} emoji={tag.emoji} label={tag.label} variant="display" />
          ))}
          {/* Add tag chip */}
          <div
            onClick={onAddTag}
            style={{
              backgroundColor: 'transparent',
              border: '1px dashed rgba(160,100,80,0.15)',
              borderRadius: 9999,
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              opacity: 0.5,
              cursor: 'pointer',
            }}
          >
            <AddIcon />
            <span style={{ fontSize: 10, fontWeight: 400, color: colors.stone }}>Add tag</span>
          </div>
        </div>
      </div>

      {/* ── Recent Sessions ── */}
      <SectionLabel label="Recent Sessions" />
      <div style={{ flexShrink: 0, marginRight: -24 }}>
        <div style={{
          display: 'flex',
          gap: 8,
          overflow: 'hidden',
          padding: '0 24px',
          paddingRight: 40,
        }}>
          {recentSessions.map((session, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 150,
              backgroundColor: colors.surface,
              border: '1px solid rgba(160,100,80,0.15)',
              borderRadius: 14,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <AvatarCircle
                  initials={session.partnerInitials}
                  gradient={session.partnerGradient}
                  size={32}
                  borderWidth={1.5}
                />
                <div style={{
                  fontSize: 8.5,
                  color: colors.stone,
                  fontWeight: 300,
                }}>{session.date}</div>
              </div>
              <StarRating percent={session.ratingPercent} size={12} />
              <div style={{ display: 'flex', gap: 4 }}>
                {session.tags.map((tag, j) => (
                  <span key={j} style={{
                    fontSize: 13,
                    backgroundColor: colors.surface2,
                    borderRadius: 6,
                    padding: '2px 5px',
                  }}>{tag}</span>
                ))}
              </div>
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
              }}>{session.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom spacer + nav ── */}
      <div style={{ height: 72, flexShrink: 0 }} />
      <BottomNav activeTab="profile" />
    </div>
  )
}
