import React from 'react'
import { colors, webFonts } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface ActivityTag {
  emoji: string
  label: string
}

export interface SessionPartner {
  initials: string
  name: string
  gradient: string
  sessionCount: number
  avgSatisfaction: number
}

export interface SessionDetailScreenProps {
  partners: SessionPartner[]
  partnerNames: string            // e.g. "Alex + Jordan"
  date: string                    // e.g. "Saturday, March 14, 2026"
  rating: number
  ratingMax?: number
  dayOfWeek: string               // e.g. "Sat"
  activities: ActivityTag[]
  note?: string
  onBack?: () => void
  onEdit?: () => void
  onEditNote?: () => void
  onPartnerPress?: (partner: SessionPartner) => void
}

/* ── Sub-components ── */

const PencilIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)

const ChevronForwardIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <polyline points="9 6 15 12 9 18" />
  </svg>
)

const ScreenHeader: React.FC<{
  onBack?: () => void
  onEdit?: () => void
}> = ({ onBack, onEdit }) => (
  <div style={{
    padding: '6px 24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <button
      onClick={onBack}
      aria-label="Go back"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: colors.surface2,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <button
      onClick={onEdit}
      style={{
        background: 'none',
        border: '1px solid rgba(160,100,80,0.3)',
        borderRadius: 9999,
        padding: '5px 14px',
        fontSize: 11,
        fontWeight: 500,
        fontFamily: webFonts.dmSans,
        color: colors.terra,
        letterSpacing: 0.5,
        cursor: 'pointer',
      }}
    >
      Edit
    </button>
  </div>
)

const HeroAvatars: React.FC<{ partners: SessionPartner[] }> = ({ partners }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
    {partners.map((p, i) => (
      <div key={p.initials} style={{ marginLeft: i > 0 ? -16 : 0 }}>
        <AvatarCircle
          initials={p.initials}
          gradient={p.gradient}
          size={68}
          borderWidth={3}
        />
      </div>
    ))}
  </div>
)

const Hero: React.FC<{
  partners: SessionPartner[]
  partnerNames: string
  date: string
}> = ({ partners, partnerNames, date }) => (
  <div style={{
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 24px 0',
    position: 'relative',
    zIndex: 1,
  }}>
    <HeroAvatars partners={partners} />
    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 22,
      fontWeight: 700,
      color: colors.ink,
      marginBottom: 3,
    }}>
      {partnerNames}
    </div>
    <div style={{
      fontSize: 11,
      fontWeight: 300,
      fontFamily: webFonts.dmSans,
      color: colors.stone,
      letterSpacing: 0.3,
    }}>
      {date}
    </div>
  </div>
)

const SessionStatStrip: React.FC<{
  rating: number
  ratingMax: number
  dayOfWeek: string
}> = ({ rating, ratingMax, dayOfWeek }) => (
  <div style={{ margin: '14px 24px 0', flexShrink: 0 }}>
    <StatStrip stats={[
      { value: rating, unit: ` /${ratingMax}`, label: 'Rating' },
      { value: dayOfWeek, label: 'Day' },
    ]} />
  </div>
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.terra,
    fontFamily: webFonts.dmSans,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '12px 24px 8px',
    flexShrink: 0,
  }}>
    {children}
    <div style={{ flex: 1, height: 1, background: 'rgba(160,100,80,0.15)' }} />
  </div>
)

const ActivityTags: React.FC<{ activities: ActivityTag[] }> = ({ activities }) => (
  <div style={{
    margin: '0 24px',
    flexShrink: 0,
    display: 'flex',
    gap: 7,
    flexWrap: 'wrap',
  }}>
    {activities.map((a) => (
      <TagPill key={a.label} emoji={a.emoji} label={a.label} variant="display" />
    ))}
  </div>
)

const NotesCard: React.FC<{
  note?: string
  onEditNote?: () => void
}> = ({ note, onEditNote }) => (
  <div style={{
    margin: '0 24px 14px',
    flexShrink: 0,
    position: 'relative',
  }}>
    {/* Stacked paper shadow */}
    <div style={{
      position: 'absolute',
      bottom: -4,
      left: 6,
      right: -6,
      top: 4,
      background: colors.surface2,
      borderRadius: 16,
      zIndex: 0,
    }} />
    {/* Main card */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      background: colors.surface,
      border: '1px solid rgba(160,100,80,0.14)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(61,43,37,0.06)',
    }}>
      {/* Ruled lines */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px)',
        backgroundPosition: '0 14px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Margin line */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 46,
        width: 1,
        background: 'rgba(192,120,88,0.12)',
        zIndex: 0,
      }} />
      {/* Text content */}
      {note ? (
        <div style={{
          position: 'relative', zIndex: 1,
          fontFamily: webFonts.playfair,
          fontSize: 13, fontWeight: 400, fontStyle: 'italic',
          color: '#5A3E36', lineHeight: '27px',
          padding: '12px 16px 16px',
        }}>{note}</div>
      ) : (
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '14px 16px',
          fontSize: 12, fontWeight: 300,
          fontFamily: webFonts.dmSans,
          color: '#C4B0A0', fontStyle: 'italic',
          lineHeight: '27px',
        }}>No notes yet...</div>
      )}
      {/* Edit note row */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px 12px',
        borderTop: '1px solid rgba(160,100,80,0.1)',
      }}>
        <button
          onClick={onEditNote}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, fontWeight: 400,
            fontFamily: webFonts.dmSans,
            color: colors.terra, padding: 0,
          }}
        >
          <PencilIcon />
          {note ? 'Edit note' : 'Add note'}
        </button>
      </div>
    </div>
  </div>
)

const PartnerRow: React.FC<{
  partner: SessionPartner
  onPress?: () => void
}> = ({ partner, onPress }) => (
  <div
    onClick={onPress}
    style={{
      background: colors.surface,
      border: '1px solid rgba(160,100,80,0.15)',
      borderRadius: 14,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
    }}
  >
    {/* Avatar */}
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={42}
      borderWidth={2}
    />
    {/* Name + subtitle */}
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: webFonts.playfair,
        fontSize: 14,
        fontWeight: 600,
        color: colors.ink,
      }}>
        {partner.name}
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 300,
        fontFamily: webFonts.dmSans,
        color: colors.stone,
        marginTop: 1,
      }}>
        {partner.sessionCount} sessions together &middot; {partner.avgSatisfaction} avg
      </div>
    </div>
    {/* Avg stat */}
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: webFonts.playfair,
        fontSize: 16,
        fontWeight: 600,
        color: colors.terra,
      }}>
        {partner.avgSatisfaction}
      </div>
      <div style={{
        fontSize: 7,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: webFonts.dmSans,
        color: colors.stone,
      }}>
        Avg Sat
      </div>
    </div>
    {/* Chevron */}
    <ChevronForwardIcon />
  </div>
)

/* ── Main Screen ── */

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  partners,
  partnerNames,
  date,
  rating,
  ratingMax = 10,
  dayOfWeek,
  activities,
  note,
  onBack,
  onEdit,
  onEditNote,
  onPartnerPress,
}) => (
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
    <DecorativeGlow position="center" size={320} opacity={0.12} />
    <div style={{ height: 54 }} />
    <ScreenHeader onBack={onBack} onEdit={onEdit} />

    <Hero partners={partners} partnerNames={partnerNames} date={date} />
    <SessionStatStrip rating={rating} ratingMax={ratingMax} dayOfWeek={dayOfWeek} />

    {/* Scrollable body */}
    <div style={{
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 16,
      scrollbarWidth: 'none',
    }}>
      <SectionLabel>What Happened</SectionLabel>
      <ActivityTags activities={activities} />

      <SectionLabel>Notes</SectionLabel>
      <NotesCard note={note} onEditNote={onEditNote} />

      <SectionLabel>With</SectionLabel>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        margin: '0 24px 14px',
      }}>
        {partners.map((p) => (
          <PartnerRow
            key={p.initials}
            partner={p}
            onPress={() => onPartnerPress?.(p)}
          />
        ))}
      </div>
    </div>

  </div>
)
