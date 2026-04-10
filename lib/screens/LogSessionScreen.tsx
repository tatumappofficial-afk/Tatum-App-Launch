import React from 'react'
import { colors, webFonts, gradients } from '../theme'
import { GradientButton } from '../components/GradientButton'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface Partner {
  id: string
  initials: string
  name: string
  gradient: string
  isSolo?: boolean
}

export interface ActivityTag {
  id: string
  emoji: string
  label: string
}

export interface LogSessionScreenProps {
  date?: string
  partners?: Partner[]
  selectedPartnerIds?: string[]
  activities?: ActivityTag[]
  selectedActivityIds?: string[]
  rating?: number
  notes?: string
  onPartnerToggle?: (id: string) => void
  onActivityToggle?: (id: string) => void
  onRatingChange?: (value: number) => void
  onNotesChange?: (value: string) => void
  onSave?: () => void
}

/* ── Default data ── */

const defaultPartners: Partner[] = [
  { id: 'alex', initials: 'AL', name: 'Alex', gradient: `linear-gradient(135deg, ${colors.terra}, ${colors.fig})` },
  { id: 'jordan', initials: 'JO', name: 'Jordan', gradient: `linear-gradient(135deg, ${colors.mauve}, ${colors.fig})` },
  { id: 'solo', initials: '', name: 'Solo', gradient: `linear-gradient(135deg, ${colors.stone}, #6A5848)`, isSolo: true },
]

const defaultActivities: ActivityTag[] = [
  { id: 'penetration', emoji: '\u{1F346}', label: 'Penetration' },
  { id: 'oral', emoji: '\u{1F48B}', label: 'Oral' },
  { id: 'manual', emoji: '\u270B', label: 'Manual' },
  { id: 'solo', emoji: '\u2728', label: 'Solo' },
  { id: 'kissing', emoji: '\u{1F618}', label: 'Kissing' },
  { id: 'cuddle', emoji: '\u{1F319}', label: 'Cuddle' },
  { id: 'toys', emoji: '\u{1FA84}', label: 'Toys' },
  { id: 'period', emoji: '\u{1FA78}', label: 'Period' },
]

/* ── Component ── */

export const LogSessionScreen: React.FC<LogSessionScreenProps> = ({
  date = 'Tue, Mar 25',
  partners = defaultPartners,
  selectedPartnerIds = ['alex'],
  activities = defaultActivities,
  selectedActivityIds = ['penetration', 'manual'],
  rating = 8.5,
  notes = '',
  onPartnerToggle,
  onActivityToggle,
  onRatingChange,
  onNotesChange,
  onSave,
}) => {
  const ratingPct = (rating / 10) * 100

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}>
      {/* ── Blurred home background ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: colors.warmSand,
        zIndex: 0,
      }}>
        <div style={{ padding: '52px 24px 0', filter: 'blur(1px)' }}>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 6,
            color: colors.terra,
            marginBottom: 16,
          }}>TATUM</div>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Sessions', value: '12', sub: '\u2191 3 more' },
              { label: 'Avg Sat', value: '8.2', sub: '\u2191 best yet' },
              { label: 'Avg Rating', value: '8.2', sub: 'same' },
            ].map((s) => (
              <div key={s.label} style={{
                background: colors.surface,
                borderRadius: 12,
                padding: 12,
                border: `1px solid rgba(160,100,80,0.13)`,
              }}>
                <div style={{ fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.stone, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700, color: colors.terra }}>{s.value}</div>
                <div style={{ fontSize: 8, color: colors.sage, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: colors.stone, margin: '12px 0 8px' }}>Partners</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { initials: 'AL', name: 'Alex', stat: '8 \u00B7 8.4', grad: `linear-gradient(135deg,${colors.terra},${colors.fig})` },
              { initials: 'JO', name: 'Jordan', stat: '4 \u00B7 7.8', grad: `linear-gradient(135deg,${colors.mauve},${colors.fig})` },
              { initials: 'SO', name: 'Solo', stat: '2 \u00B7 9.0', grad: `linear-gradient(135deg,${colors.stone},#6A5848)` },
            ].map((p) => (
              <div key={p.name} style={{
                flex: 1,
                background: colors.surface,
                borderRadius: 14,
                padding: '12px 10px',
                border: `1px solid rgba(160,100,80,0.13)`,
                textAlign: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: webFonts.playfair, fontSize: 14, fontWeight: 700, color: colors.white,
                  background: p.grad, border: `2px solid ${colors.white}`,
                  boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
                }}>{p.initials}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: colors.ink }}>{p.name}</div>
                <div style={{ fontSize: 8, color: colors.stone, marginTop: 1 }}>{p.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dim overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(30,18,12,0.45)',
        zIndex: 10,
      }} />

      {/* ── Bottom sheet ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 574,
        background: colors.warmSand,
        borderRadius: '28px 28px 0 0',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(61,43,37,0.2)',
      }}>
        {/* Handle */}
        <div style={{
          width: 36,
          height: 4,
          background: 'rgba(160,100,80,0.25)',
          borderRadius: 2,
          margin: '12px auto 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px 0',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 20,
            fontWeight: 700,
            color: colors.ink,
          }}>Log a Session</div>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: `linear-gradient(135deg, ${gradients.primaryCta[0]}, ${gradients.primaryCta[1]})`,
            border: 'none',
            borderRadius: 9999,
            padding: '6px 10px 6px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(124,74,90,0.28)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: colors.white }}>{date}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Scrollable form body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '14px 20px 0',
        }}>
          {/* ── WITH (partners) ── */}
          <FormLabel>With</FormLabel>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {partners.map((p) => {
              const selected = selectedPartnerIds.includes(p.id)
              return (
                <div
                  key={p.id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                  onClick={() => onPartnerToggle?.(p.id)}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: webFonts.playfair,
                      fontSize: p.isSolo ? 20 : 15,
                      fontWeight: 700,
                      color: colors.white,
                      background: p.gradient,
                      border: selected ? `2.5px solid ${colors.terra}` : '2.5px solid transparent',
                      boxShadow: selected
                        ? `0 0 0 3px rgba(192,120,88,0.18), 0 2px 8px rgba(61,43,37,0.12)`
                        : '0 2px 8px rgba(61,43,37,0.12)',
                    }}>
                      {p.isSolo ? '\u2728' : p.initials}
                    </div>
                    {selected && (
                      <div style={{
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: colors.terra,
                        border: `2px solid ${colors.warmSand}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 8,
                        color: colors.white,
                        fontWeight: 700,
                      }}>{'\u2713'}</div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 9,
                    fontWeight: selected ? 500 : 400,
                    color: selected ? colors.terra : colors.stone,
                  }}>{p.name}</div>
                </div>
              )
            })}
            {/* Add button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: `1.5px dashed rgba(192,120,88,0.35)`,
                  color: colors.terra,
                  fontFamily: webFonts.dmSans,
                  fontSize: 20,
                }}>{'\uFF0B'}</div>
              </div>
              <div style={{ fontSize: 9, fontWeight: 400, color: colors.terra }}>Add</div>
            </div>
          </div>

          {/* ── WHAT HAPPENED (activity tags) ── */}
          <FormLabel>What happened</FormLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {activities.map((tag) => (
              <TagPill
                key={tag.id}
                emoji={tag.emoji}
                label={tag.label}
                variant="selectable"
                selected={selectedActivityIds.includes(tag.id)}
                onPress={() => onActivityToggle?.(tag.id)}
              />
            ))}
          </div>

          {/* ── RATING ── */}
          <FormLabel>Rating</FormLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <span style={{
              fontFamily: webFonts.playfair,
              fontSize: 22,
              fontWeight: 700,
              color: colors.terra,
            }}>{rating}</span>
            <span style={{ fontSize: 11, fontWeight: 300, color: colors.stone }}> / 10</span>
          </div>
          <div style={{
            position: 'relative',
            height: 4,
            background: colors.surface2,
            borderRadius: 2,
            marginBottom: 4,
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${ratingPct}%`,
              background: `linear-gradient(to right, ${colors.terra}, ${colors.mauve})`,
              borderRadius: 2,
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${ratingPct}%`,
              transform: 'translate(-50%, -50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: colors.white,
              border: `2.5px solid ${colors.terra}`,
              boxShadow: '0 2px 8px rgba(124,74,90,0.3)',
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 8.5,
            fontWeight: 300,
            color: '#C4B0A0',
            marginBottom: 16,
          }}>
            {['None', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {/* ── NOTES ── */}
          <FormLabel>Notes</FormLabel>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="How did it feel? What made tonight special\u2026"
            rows={3}
            style={{
              width: '100%',
              background: colors.surface,
              border: `1.5px solid ${colors.border}`,
              borderRadius: 14,
              padding: '12px 14px',
              fontFamily: webFonts.playfair,
              fontSize: 13,
              fontStyle: 'italic',
              color: '#5A3E36',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.65,
              marginBottom: 4,
              minHeight: 70,
              boxSizing: 'border-box',
              backgroundImage: `repeating-linear-gradient(
                to bottom, transparent, transparent 27px,
                rgba(160,100,80,0.07) 27px, rgba(160,100,80,0.07) 28px
              )`,
              backgroundPosition: '0 14px',
            }}
          />
        </div>

        {/* ── Footer ── */}
        <div style={{
          flexShrink: 0,
          padding: '10px 20px 24px',
          borderTop: '1px solid rgba(160,100,80,0.1)',
          background: colors.warmSand,
        }}>
          <GradientButton label="Save Session" onPress={onSave} height={50} />
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.stone,
    marginBottom: 8,
  }}>{children}</div>
)
