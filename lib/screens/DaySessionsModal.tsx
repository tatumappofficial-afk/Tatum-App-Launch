import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { BottomNav } from './shared/BottomNav'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface SessionCardData {
  id: string
  partners: {
    initials: string
    gradient: string
  }[]
  partnerName: string   // display name, e.g. "Alex" or "Alex + Jordan"
  time: string          // e.g. "Evening · 9:30 pm"
  score: number         // out of 10
  tags: string[]        // emoji tags
  duration?: string     // e.g. "45 min"
  noteSnippet?: string
}

export interface DaySessionsModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  dayLabel: string
  sessionCount: number
  sessions: SessionCardData[]
  onLogAnother?: () => void
  onLogSession?: () => void
  onSessionPress?: (id: string) => void
  onDismiss?: () => void
}

/* ── Helpers ── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}
function getFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay()
}

/* ── Calendar Background ── */

const CalendarBackground: React.FC<{
  month: number; year: number; today?: number; selectedDay: number; loggedDays: LoggedDay[]
}> = ({ month, year, today, selectedDay, loggedDays }) => {
  const daysInMonth = getDaysInMonth(month, year)
  const firstDow = getFirstDayOfWeek(month, year)
  const logMap = new Map<number, LoggedDay>()
  loggedDays.forEach((ld) => logMap.set(ld.day, ld))

  const cells: React.ReactNode[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push(<div key={`e-${i}`} style={{ aspectRatio: '1' }} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const logged = logMap.get(d)
    const isToday = d === today
    const isSelected = d === selectedDay
    let bgStyle: React.CSSProperties = {}
    if (isToday) bgStyle = { background: 'linear-gradient(135deg, #C07858, #7C4A5A)' }
    else if (isSelected) bgStyle = { background: 'rgba(192,120,88,0.12)', outline: `2px solid ${colors.terra}`, outlineOffset: -1 }

    cells.push(
      <div key={d} style={{
        aspectRatio: '1', borderRadius: '50%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', ...bgStyle,
      }}>
        <span style={{
          fontFamily: webFonts.dmSans, fontSize: 12, lineHeight: 1,
          color: isToday ? colors.white : (isSelected || !!logged) ? colors.terra : colors.ink,
          fontWeight: isToday ? 700 : isSelected ? 600 : logged ? 500 : 400,
        }}>{d}</span>
        {logged && !isToday && (
          <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1, marginTop: 1, opacity: isSelected ? 0.7 : 1 }}>
            <span style={{ fontSize: 8 }}>{logged.emoji}</span>
            {logged.hasMultiple && <span style={{ fontSize: 7, fontWeight: 600, color: '#B07080', marginLeft: 1 }}>+</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: colors.warmSand, zIndex: 0 }}>
      <div style={{ padding: '50px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 12px' }}>
          <div style={{ fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700, color: colors.ink }}>
            {MONTH_NAMES[month - 1]} {year}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['back', 'forward'].map((dir) => (
              <div key={dir} style={{
                width: 30, height: 30, borderRadius: '50%', background: colors.surface2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {dir === 'back' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
                </svg>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
          {DAY_LABELS.map((lbl) => (
            <div key={lbl} style={{
              textAlign: 'center', fontFamily: webFonts.dmSans, fontSize: 9, fontWeight: 500,
              letterSpacing: 0.5, textTransform: 'uppercase', color: colors.stone, padding: '4px 0',
            }}>{lbl}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>{cells}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 4px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10 }}>🍆</span>
            <span style={{ fontFamily: webFonts.dmSans, fontSize: 9, color: colors.stone }}>Logged</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10, color: colors.terra, fontWeight: 600 }}>🍆+</span>
            <span style={{ fontFamily: webFonts.dmSans, fontSize: 9, color: colors.stone }}>Multiple</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg, #C07858, #7C4A5A)' }} />
            <span style={{ fontFamily: webFonts.dmSans, fontSize: 9, color: colors.stone }}>Today</span>
          </div>
        </div>
      </div>
      <BottomNav activeTab="calendar" />
    </div>
  )
}

/* ── Session Card ── */

const SessionCard: React.FC<{
  session: SessionCardData
  onPress?: () => void
}> = ({ session, onPress }) => {
  const isMultiPartner = session.partners.length > 1

  return (
    <div
      onClick={onPress}
      style={{
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.14)',
        borderRadius: 18, padding: '14px 16px', marginBottom: 10,
        cursor: 'pointer', position: 'relative',
        boxShadow: '3px 4px 0 0 #EDE3D8',
        overflow: 'hidden',
      }}
    >
      {/* Ruled lines overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 26px, rgba(160,100,80,0.07) 26px, rgba(160,100,80,0.07) 27px)',
        backgroundPosition: '0 52px',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Card top row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10, position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar(s) */}
          {isMultiPartner ? (
            <div style={{ display: 'flex', position: 'relative', width: 54, height: 38, flexShrink: 0 }}>
              <div style={{
                position: 'absolute', left: 0, zIndex: 2,
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: webFonts.playfair, fontSize: 13, fontWeight: 700, color: 'white',
                background: session.partners[0].gradient,
                border: `2px solid ${colors.warmSand}`, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
              }}>{session.partners[0].initials}</div>
              <div style={{
                position: 'absolute', left: 18, zIndex: 1,
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: webFonts.playfair, fontSize: 13, fontWeight: 700, color: 'white',
                background: session.partners[1].gradient,
                border: `2px solid ${colors.warmSand}`, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
              }}>{session.partners[1].initials}</div>
            </div>
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: webFonts.playfair, fontSize: 13, fontWeight: 700, color: 'white',
              background: session.partners[0].gradient,
              border: `2px solid ${colors.warmSand}`, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
            }}>{session.partners[0].initials}</div>
          )}
          <div style={{ marginLeft: isMultiPartner ? 6 : 0 }}>
            <div style={{
              fontFamily: webFonts.playfair, fontSize: 14, fontWeight: 600, color: colors.ink,
            }}>{session.partnerName}</div>
            <div style={{
              fontFamily: webFonts.dmSans, fontSize: 9, fontWeight: 300, color: colors.stone, marginTop: 2,
            }}>{session.time}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, textAlign: 'right' }}>
            <span style={{
              fontFamily: webFonts.playfair, fontSize: 24, fontWeight: 700, color: colors.terra,
            }}>{session.score}</span>
            <span style={{ fontSize: 13, fontWeight: 300, color: '#C4B0A0', margin: '0 1px' }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 300, color: '#C4B0A0' }}>10</span>
          </div>
          <button style={{
            background: 'none', border: 'none', opacity: 0.45, cursor: 'pointer',
            display: 'flex', padding: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tags + duration row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap',
        marginBottom: session.noteSnippet ? 8 : 0,
        position: 'relative', zIndex: 1,
      }}>
        {session.tags.map((tag, i) => (
          <span key={i} style={{
            fontSize: 15, background: 'rgba(237,227,216,0.9)',
            borderRadius: 7, padding: '2px 6px',
          }}>{tag}</span>
        ))}
        {session.duration && (
          <span style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3,
            fontFamily: webFonts.dmSans, fontSize: 9.5, fontWeight: 300, color: colors.muted,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {session.duration}
          </span>
        )}
      </div>

      {/* Note snippet */}
      {session.noteSnippet && (
        <div style={{
          fontFamily: webFonts.playfair, fontSize: 12, fontStyle: 'italic',
          color: '#7A5040', lineHeight: '26px', position: 'relative', zIndex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>{session.noteSnippet}</div>
      )}
    </div>
  )
}

/* ── Main Component ── */

export const DaySessionsModal: React.FC<DaySessionsModalProps> = ({
  month, year, today, loggedDays = [], selectedDay, dayLabel,
  sessionCount, sessions, onLogAnother, onLogSession, onSessionPress, onDismiss,
}) => (
  <div style={{
    width: '100%', height: '100vh', position: 'relative', overflow: 'hidden',
    fontFamily: webFonts.dmSans, color: colors.ink,
  }}>
    <CalendarBackground month={month} year={year} today={today} selectedDay={selectedDay} loggedDays={loggedDays} />
    <DynamicIsland />
    <StatusBar />

    {/* Dim overlay */}
    <div onClick={onDismiss} style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(30,18,12,0.42)', zIndex: 10,
    }} />

    {/* Bottom sheet */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 440,
      background: colors.warmSand, borderRadius: '28px 28px 0 0',
      zIndex: 20, display: 'flex', flexDirection: 'column',
      boxShadow: '0 -8px 40px rgba(61,43,37,0.2)',
    }}>
      {/* Handle */}
      <div style={{
        width: 36, height: 4, background: 'rgba(160,100,80,0.25)',
        borderRadius: 2, margin: '12px auto 0', flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '12px 20px 0', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700, color: colors.ink }}>
            {dayLabel}
          </div>
          <div style={{ fontFamily: webFonts.dmSans, fontSize: 12, fontWeight: 300, color: colors.stone, marginTop: 2 }}>
            {sessionCount} session{sessionCount !== 1 ? 's' : ''} logged
          </div>
        </div>
        <button
          onClick={onLogAnother}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: '1px solid rgba(192,120,88,0.35)',
            borderRadius: 9999, padding: '5px 12px',
            fontFamily: webFonts.dmSans, fontSize: 11, fontWeight: 400, color: colors.terra,
            cursor: 'pointer', flexShrink: 0, marginTop: 4,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log another
        </button>
      </div>

      {/* Session cards scroll */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 16px 0',
        scrollbarWidth: 'none',
      }}>
        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} onPress={() => onSessionPress?.(s.id)} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0, padding: '8px 16px 24px',
        borderTop: '1px solid rgba(160,100,80,0.1)',
      }}>
        <button
          onClick={onLogSession}
          style={{
            width: '100%', height: 46,
            background: 'transparent',
            border: '1.5px solid rgba(192,120,88,0.3)', borderRadius: 9999, cursor: 'pointer',
            fontFamily: webFonts.dmSans, fontSize: 12, fontWeight: 500,
            letterSpacing: 1.5, textTransform: 'uppercase', color: colors.terra,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log a Session
        </button>
      </div>
    </div>
  </div>
)
