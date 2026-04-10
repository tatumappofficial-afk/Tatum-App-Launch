import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { BottomNav } from './shared/BottomNav'
import { AvatarCircle } from '../components/AvatarCircle'
import { StarRating } from '../components/StarRating'
import { GradientButton } from '../components/GradientButton'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface SessionRow {
  id: string
  initials: string
  gradient: string
  partnerName: string
  tags: string[]
  rating: number       // 1-5 star rating
  noteSnippet?: string
}

export interface CalendarDayModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  dayLabel: string       // e.g. "Thursday, March 19"
  sessions?: SessionRow[]
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
  month: number
  year: number
  today?: number
  selectedDay: number
  loggedDays: LoggedDay[]
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
    if (isToday) {
      bgStyle = { background: 'linear-gradient(135deg, #C07858, #7C4A5A)' }
    } else if (isSelected) {
      bgStyle = {
        background: 'rgba(192,120,88,0.12)',
        outline: `2px solid ${colors.terra}`,
        outlineOffset: -1,
      }
    }

    cells.push(
      <div key={d} style={{
        aspectRatio: '1',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...bgStyle,
      }}>
        <span style={{
          fontFamily: webFonts.dmSans,
          fontSize: 12,
          lineHeight: 1,
          color: isToday ? colors.white : (isSelected || !!logged) ? colors.terra : colors.ink,
          fontWeight: isToday ? 700 : isSelected ? 600 : logged ? 500 : 400,
        }}>{d}</span>
        {logged && !isToday && (
          <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1, marginTop: 1 }}>
            <span style={{ fontSize: 8 }}>{logged.emoji}</span>
            {logged.hasMultiple && (
              <span style={{ fontSize: 7, fontWeight: 600, color: '#B07080', marginLeft: 1 }}>+</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: colors.warmSand, zIndex: 0,
    }}>
      <div style={{ padding: '50px 20px 0' }}>
        {/* Calendar header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 4px 12px',
        }}>
          <div style={{
            fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700, color: colors.ink,
          }}>{MONTH_NAMES[month - 1]} {year}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: colors.surface2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['back', 'forward'].map((dir) => (
                <div key={dir} style={{
                  width: 30, height: 30, borderRadius: '50%', background: colors.surface2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {dir === 'back'
                      ? <polyline points="15 18 9 12 15 6" />
                      : <polyline points="9 6 15 12 9 18" />}
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day of week row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
          {DAY_LABELS.map((lbl) => (
            <div key={lbl} style={{
              textAlign: 'center', fontFamily: webFonts.dmSans, fontSize: 9, fontWeight: 500,
              letterSpacing: 0.5, textTransform: 'uppercase', color: colors.stone, padding: '4px 0',
            }}>{lbl}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {cells}
        </div>

        {/* Legend */}
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
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
            }} />
            <span style={{ fontFamily: webFonts.dmSans, fontSize: 9, color: colors.stone }}>Today</span>
          </div>
        </div>
      </div>

      {/* Background nav */}
      <BottomNav activeTab="calendar" />
    </div>
  )
}

/* ── Empty State ── */

const EmptyState: React.FC<{ onLogSession?: () => void }> = ({ onLogSession }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '0 32px 16px', textAlign: 'center',
  }}>
    {/* Gradient square placeholder for tatum logo */}
    <div style={{
      width: 96, height: 96, marginBottom: 16, opacity: 0.5,
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(192,120,88,0.3), rgba(124,74,90,0.2))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: webFonts.playfair, fontSize: 28, fontWeight: 700,
        color: colors.terra, opacity: 0.6,
      }}>T</span>
    </div>
    <div style={{
      fontFamily: webFonts.playfair, fontSize: 18, fontWeight: 600,
      color: colors.ink, marginBottom: 6,
    }}>Nothing logged yet</div>
    <div style={{
      fontFamily: webFonts.dmSans, fontSize: 13, fontWeight: 300,
      color: colors.stone, lineHeight: 1.6, marginBottom: 24,
    }}>You haven't logged anything for this day. Want to capture a moment?</div>
    <button
      onClick={onLogSession}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        border: 'none', borderRadius: 9999, padding: '12px 28px',
        fontFamily: webFonts.dmSans, fontSize: 13, fontWeight: 500,
        letterSpacing: 1.5, textTransform: 'uppercase', color: 'white', cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Log a Session
    </button>
  </div>
)

/* ── Sessions State ── */

const SessionsState: React.FC<{
  sessions: SessionRow[]
  onSessionPress?: (id: string) => void
  onLogSession?: () => void
}> = ({ sessions, onSessionPress, onLogSession }) => (
  <>
    <div style={{
      flex: 1, overflowY: 'auto', padding: '10px 20px 0',
      scrollbarWidth: 'none',
    }}>
      {sessions.map((s) => (
        <div
          key={s.id}
          onClick={() => onSessionPress?.(s.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: colors.surface, border: '1px solid rgba(160,100,80,0.13)',
            borderRadius: 14, padding: '12px 14px', marginBottom: 8, cursor: 'pointer',
          }}
        >
          <AvatarCircle
            initials={s.initials}
            gradient={s.gradient}
            size={38}
            borderWidth={2}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: webFonts.dmSans, fontSize: 13, fontWeight: 500, color: colors.ink,
            }}>{s.partnerName}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
              {s.tags.map((t, i) => (
                <span key={i} style={{ fontSize: 13 }}>{t}</span>
              ))}
            </div>
            {s.noteSnippet && (
              <div style={{
                fontFamily: webFonts.dmSans, fontSize: 10, fontWeight: 300,
                color: colors.muted, fontStyle: 'italic', marginTop: 3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140,
              }}>"{s.noteSnippet}"</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <StarRating percent={(s.rating / 5) * 100} size={13} />
          </div>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer', color: colors.terra,
            opacity: 0.5, marginLeft: 4, display: 'flex', alignItems: 'center', padding: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div style={{
      flexShrink: 0, padding: '8px 20px 24px',
      borderTop: '1px solid rgba(160,100,80,0.1)', background: colors.warmSand,
    }}>
      <GradientButton
        label="Log Another Session"
        variant="outline"
        height={46}
        fontSize={12}
        letterSpacing={1.5}
        onPress={onLogSession}
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      />
    </div>
  </>
)

/* ── Main Component ── */

export const CalendarDayModal: React.FC<CalendarDayModalProps> = ({
  month,
  year,
  today,
  loggedDays = [],
  selectedDay,
  dayLabel,
  sessions = [],
  onLogSession,
  onSessionPress,
  onDismiss,
}) => {
  const hasSessions = sessions.length > 0
  const subtitle = hasSessions ? `${sessions.length} session${sessions.length > 1 ? 's' : ''}` : 'No sessions logged'

  return (
    <div style={{
      width: '100%', height: '100vh', position: 'relative', overflow: 'hidden',
      fontFamily: webFonts.dmSans, color: colors.ink,
    }}>
      {/* Calendar background */}
      <CalendarBackground
        month={month} year={year} today={today}
        selectedDay={selectedDay} loggedDays={loggedDays}
      />

      <DynamicIsland />
      <StatusBar />

      {/* Dim overlay */}
      <div
        onClick={onDismiss}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30,18,12,0.4)', zIndex: 10,
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 400,
        background: colors.warmSand, borderRadius: '28px 28px 0 0',
        zIndex: 20, display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(61,43,37,0.2)',
      }}>
        {/* Handle bar */}
        <div style={{
          width: 36, height: 4, background: 'rgba(160,100,80,0.25)',
          borderRadius: 2, margin: '12px auto 0', flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 0', flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700, color: colors.ink,
            }}>{dayLabel}</div>
            <div style={{
              fontFamily: webFonts.dmSans, fontSize: 12, fontWeight: 300,
              color: colors.stone, marginTop: 1,
            }}>{subtitle}</div>
          </div>
        </div>

        {/* Content */}
        {hasSessions ? (
          <SessionsState
            sessions={sessions}
            onSessionPress={onSessionPress}
            onLogSession={onLogSession}
          />
        ) : (
          <EmptyState onLogSession={onLogSession} />
        )}
      </div>
    </div>
  )
}
