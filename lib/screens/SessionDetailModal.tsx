import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface ActivityTag {
  emoji: string
  label: string
}

export interface SessionDetailModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  backLabel: string        // e.g. "March 7"
  partnerName: string
  partnerInitials: string
  partnerGradient: string
  dateLabel: string        // e.g. "Saturday, March 7, 2026 · Evening"
  rating: number           // out of 10
  dayOfWeek: string        // e.g. "Sat"
  tags: ActivityTag[]
  noteText?: string
  onBack?: () => void
  onEdit?: () => void
  onEditNote?: () => void
  onDelete?: () => void
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

/* ── Blurred Calendar Background ── */

const BlurredCalendarBackground: React.FC<{
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
          fontFamily: webFonts.dmSans, fontSize: 11, lineHeight: 1,
          color: isToday ? colors.white : (isSelected || !!logged) ? colors.terra : colors.ink,
          fontWeight: isToday ? 700 : isSelected ? 600 : logged ? 500 : 400,
        }}>{d}</span>
        {logged && !isToday && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
            <span style={{ fontSize: 7 }}>{logged.emoji}</span>
            {logged.hasMultiple && <span style={{ fontSize: 6, fontWeight: 600, color: '#B07080', marginLeft: 1 }}>+</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: colors.warmSand, zIndex: 0 }}>
      <div style={{ padding: '50px 20px 0', filter: 'blur(1.5px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 10px' }}>
          <div style={{ fontFamily: webFonts.playfair, fontSize: 20, fontWeight: 700, color: colors.ink }}>
            {MONTH_NAMES[month - 1]} {year}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
          {DAY_LABELS.map((lbl) => (
            <div key={lbl} style={{
              textAlign: 'center', fontFamily: webFonts.dmSans, fontSize: 8, fontWeight: 500,
              textTransform: 'uppercase', color: colors.stone, padding: '3px 0',
            }}>{lbl}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>{cells}</div>
      </div>
    </div>
  )
}

/* ── Main Component ── */

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  month, year, today, loggedDays = [], selectedDay,
  backLabel, partnerName, partnerInitials, partnerGradient,
  dateLabel, rating, dayOfWeek, tags, noteText,
  onBack, onEdit, onEditNote, onDelete,
}) => (
  <div style={{
    width: '100%', height: '100vh', position: 'relative', overflow: 'hidden',
    fontFamily: webFonts.dmSans, color: colors.ink,
  }}>
    <BlurredCalendarBackground
      month={month} year={year} today={today}
      selectedDay={selectedDay} loggedDays={loggedDays}
    />
    <DynamicIsland />
    <StatusBar />

    {/* Heavier dim overlay */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(30,18,12,0.5)', zIndex: 10,
    }} />

    {/* Bottom sheet */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 440,
      background: colors.warmSand, borderRadius: '28px 28px 0 0',
      zIndex: 20, display: 'flex', flexDirection: 'column',
      boxShadow: '0 -8px 40px rgba(61,43,37,0.22)',
    }}>
      {/* Handle */}
      <div style={{
        width: 36, height: 4, background: 'rgba(160,100,80,0.25)',
        borderRadius: 2, margin: '12px auto 0', flexShrink: 0,
      }} />

      {/* Header: back pill + edit */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px 0', flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: colors.surface2, border: 'none', borderRadius: 9999,
            padding: '6px 12px 6px 8px', cursor: 'pointer',
            fontFamily: webFonts.dmSans, fontSize: 12, fontWeight: 400, color: colors.stone,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {backLabel}
        </button>
        <button
          onClick={onEdit}
          style={{
            background: 'none', border: '1px solid rgba(160,100,80,0.3)',
            borderRadius: 9999, padding: '5px 14px',
            fontFamily: webFonts.dmSans, fontSize: 11, fontWeight: 500, color: colors.terra,
            letterSpacing: 0.5, cursor: 'pointer',
          }}
        >Edit</button>
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1, overflowY: 'auto', scrollbarWidth: 'none',
      }}>
        {/* Hero */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '16px 24px 0',
        }}>
          <div style={{ marginBottom: 10 }}>
            <AvatarCircle
              initials={partnerInitials}
              gradient={partnerGradient}
              size={68}
              borderWidth={3}
            />
          </div>
          <div style={{
            fontFamily: webFonts.playfair, fontSize: 22, fontWeight: 700,
            color: colors.ink, marginBottom: 3,
          }}>{partnerName}</div>
          <div style={{
            fontFamily: webFonts.dmSans, fontSize: 11, fontWeight: 300, color: colors.stone,
          }}>{dateLabel}</div>
        </div>

        {/* Stat strip */}
        <div style={{ margin: '14px 20px 0' }}>
          <StatStrip stats={[
            { value: rating, unit: ' /10', label: 'Rating' },
            { value: dayOfWeek, label: 'Day' },
          ]} />
        </div>

        {/* What Happened */}
        <SectionLabel label="What Happened" />
        <div style={{
          display: 'flex', gap: 7, flexWrap: 'wrap', margin: '0 20px',
        }}>
          {tags.map((tag, i) => (
            <TagPill key={i} emoji={tag.emoji} label={tag.label} variant="display" />
          ))}
        </div>

        {/* Notes */}
        {noteText && (
          <>
            <SectionLabel label="Notes" />
            <div style={{
              margin: '0 20px 14px', borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(160,100,80,0.14)', position: 'relative',
              boxShadow: '3px 4px 0 0 #EDE3D8',
            }}>
              <div style={{
                position: 'relative', background: colors.surface,
                borderRadius: 16, overflow: 'hidden',
              }}>
                {/* Ruled lines */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px)',
                  backgroundPosition: '0 14px', pointerEvents: 'none',
                }} />
                {/* Margin line */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 46,
                  width: 1, background: 'rgba(192,120,88,0.12)',
                }} />
                {/* Note text */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  fontFamily: webFonts.playfair, fontSize: 13, fontWeight: 400,
                  fontStyle: 'italic', color: '#5A3E36',
                  lineHeight: '27px', padding: '12px 16px',
                }}>{noteText}</div>
                {/* Edit note row */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px 10px',
                  borderTop: '1px solid rgba(160,100,80,0.1)',
                }}>
                  <button
                    onClick={onEditNote}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: webFonts.dmSans, fontSize: 11, color: colors.terra, padding: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                    Edit note
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 24px' }}>
          <button
            onClick={onDelete}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: webFonts.dmSans, fontSize: 11, fontWeight: 300,
              color: '#C4B0A0', letterSpacing: 0.5,
            }}
          >Delete this session</button>
        </div>
      </div>
    </div>
  </div>
)
