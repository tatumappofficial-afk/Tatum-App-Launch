import React, { useState } from 'react'
import { colors, webFonts } from '../theme'
import { BottomNav } from './shared/BottomNav'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { AvatarCircle } from '../components/AvatarCircle'
import { GradientButton } from '../components/GradientButton'

/* ── Types ── */

export interface JournalPartner {
  initials: string
  gradient: string // CSS linear-gradient value
}

export interface JournalEntry {
  id: string
  partners: JournalPartner[]
  partnerName: string
  date: string
  score: number
  maxScore?: number
  tags: string[] // emoji strings
  mood?: { emoji: string; label: string }
  note?: string
  monthSeparator?: string // rendered before this entry
}

export interface CalendarDay {
  day: number | null
  logged?: boolean
  emoji?: string
  hasPlus?: boolean
  isToday?: boolean
}

export interface JournalScreenProps {
  entries: JournalEntry[]
  currentMonth?: string
  entryCount?: number
  calendarDays?: CalendarDay[]
  showCalendar?: boolean
}

/* ── Sub-components ── */

const ChevronDown: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ChevronUp: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 15 12 9 18 15" />
  </svg>
)

const ChevronBack: React.FC<{ color?: string; size?: number }> = ({ color = colors.stone, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronForward: React.FC<{ color?: string; size?: number }> = ({ color = colors.stone, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
)

const ArrowUpRight: React.FC<{ color?: string; size?: number }> = ({ color = colors.terra, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
)

const PlusIcon: React.FC<{ color?: string; size?: number }> = ({ color = 'white', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

/* ── Month Separator ── */

const MonthSeparator: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    fontSize: 8,
    fontFamily: webFonts.dmSans,
    fontWeight: 500,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    color: colors.terra,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '4px 0 10px',
  }}>
    {label}
    <div style={{ flex: 1, height: 1, background: 'rgba(160,100,80,0.18)' }} />
  </div>
)

/* ── Entry Card ── */

const EntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  const isCompact = !entry.note
  const hasMultiplePartners = entry.partners.length > 1

  return (
    <div style={{
      position: 'relative',
      marginBottom: 14,
    }}>
      {/* Shadow stack behind (depth) */}
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

      {/* Main paper */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: colors.surface,
        borderRadius: 16,
        border: `1px solid rgba(160,100,80,0.14)`,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(61,43,37,0.07)',
      }}>
        {/* Ruled lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent, transparent 27px,
            rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px
          )`,
          backgroundPosition: '0 54px',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Margin line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 50,
          width: 1,
          background: 'rgba(192,120,88,0.12)',
          zIndex: 0,
        }} />

        {/* Header band */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 12px 10px 14px',
          borderBottom: '1px solid rgba(160,100,80,0.1)',
          background: 'rgba(245,239,232,0.6)',
        }}>
          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasMultiplePartners ? (
              <div style={{ position: 'relative', width: 46, height: 32, flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: 0, zIndex: 2 }}>
                  <AvatarCircle
                    initials={entry.partners[0].initials}
                    gradient={entry.partners[0].gradient}
                    size={32}
                    borderWidth={2}
                  />
                </div>
                <div style={{ position: 'absolute', left: 14, zIndex: 1 }}>
                  <AvatarCircle
                    initials={entry.partners[1].initials}
                    gradient={entry.partners[1].gradient}
                    size={32}
                    borderWidth={2}
                  />
                </div>
              </div>
            ) : (
              <AvatarCircle
                initials={entry.partners[0].initials}
                gradient={entry.partners[0].gradient}
                size={32}
                borderWidth={2}
              />
            )}
            <div style={hasMultiplePartners ? { marginLeft: 8 } : undefined}>
              <div style={{
                fontFamily: webFonts.playfair,
                fontSize: 13,
                fontWeight: 600,
                color: colors.ink,
                lineHeight: 1.1,
              }}>
                {entry.partnerName}
              </div>
              <div style={{
                fontSize: 8.5,
                fontWeight: 300,
                color: colors.stone,
                marginTop: 1,
              }}>
                {entry.date}
              </div>
            </div>
          </div>

          {/* Right side -- score + arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{
                fontFamily: webFonts.playfair,
                fontSize: 22,
                fontWeight: 700,
                color: colors.terra,
                lineHeight: 1,
              }}>
                {entry.score}
              </span>
              <span style={{
                fontSize: 13,
                fontWeight: 300,
                color: '#C4B0A0',
                margin: '0 1px',
              }}>/</span>
              <span style={{
                fontSize: 12,
                fontWeight: 300,
                color: '#C4B0A0',
              }}>
                {entry.maxScore ?? 10}
              </span>
            </div>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              opacity: 0.5,
            }}>
              <ArrowUpRight />
            </button>
          </div>
        </div>

        {/* Tags row */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexWrap: 'wrap',
          padding: '7px 14px 5px',
          borderBottom: '1px solid rgba(160,100,80,0.07)',
        }}>
          {entry.tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 14,
              background: 'rgba(237,227,216,0.85)',
              borderRadius: 7,
              padding: '2px 6px',
            }}>
              {tag}
            </span>
          ))}
          {entry.mood && (
            <span style={{
              fontSize: 10,
              background: 'rgba(192,120,88,0.1)',
              border: '1px solid rgba(192,120,88,0.2)',
              borderRadius: 9999,
              padding: '2px 8px',
              color: colors.terra,
            }}>
              {entry.mood.emoji} {entry.mood.label}
            </span>
          )}
        </div>

        {/* Note body */}
        {!isCompact && (
          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '10px 16px 14px',
            minHeight: 56,
          }}>
            <div style={{
              fontFamily: webFonts.playfair,
              fontSize: 13,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#5A3E36',
              lineHeight: '27px',
              letterSpacing: 0.1,
            }}>
              {entry.note}
            </div>
          </div>
        )}

        {/* Compact cards: smaller bottom padding area */}
        {isCompact && (
          <div style={{
            position: 'relative',
            zIndex: 2,
            minHeight: 0,
            padding: '7px 16px 10px',
          }} />
        )}
      </div>
    </div>
  )
}

/* ── Calendar Dropdown ── */

const DOW_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const CalendarDropdown: React.FC<{
  monthLabel: string
  days: CalendarDay[]
}> = ({ monthLabel, days }) => (
  <div style={{
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 24,
    width: 318,
    background: colors.surface,
    border: '1px solid rgba(160,100,80,0.18)',
    borderRadius: 22,
    boxShadow: '0 16px 48px rgba(61,43,37,0.18), 0 2px 8px rgba(61,43,37,0.08)',
    zIndex: 200,
    overflow: 'hidden',
  }}>
    {/* Nav */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px 10px',
      borderBottom: '1px solid rgba(160,100,80,0.1)',
    }}>
      <button style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: colors.surface2,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <ChevronBack />
      </button>
      <div style={{
        fontFamily: webFonts.playfair,
        fontSize: 16,
        fontWeight: 600,
        color: colors.ink,
      }}>
        {monthLabel}
      </div>
      <button style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: colors.surface2,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <ChevronForward />
      </button>
    </div>

    {/* Day-of-week header */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      padding: '8px 10px 3px',
    }}>
      {DOW_LABELS.map((d) => (
        <div key={d} style={{
          textAlign: 'center',
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: colors.stone,
          padding: '3px 0',
        }}>
          {d}
        </div>
      ))}
    </div>

    {/* Day grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 0,
      padding: '2px 10px 14px',
    }}>
      {days.map((d, i) => {
        const isEmpty = d.day === null
        const isToday = d.isToday
        return (
          <div key={i} style={{
            aspectRatio: '1',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isEmpty ? 'default' : 'pointer',
            pointerEvents: isEmpty ? 'none' : 'auto',
            background: isToday ? 'linear-gradient(135deg, #C07858, #7C4A5A)' : 'transparent',
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: isToday ? 700 : d.logged ? 500 : 400,
              color: isToday ? 'white' : d.logged ? colors.terra : colors.ink,
              lineHeight: 1,
              opacity: isEmpty ? 0 : 1,
            }}>
              {d.day ?? ''}
            </span>
            {d.logged && !isToday && (
              <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1, marginTop: 1 }}>
                <span style={{ fontSize: 7 }}>{d.emoji}</span>
                {d.hasPlus && (
                  <span style={{ fontSize: 6, fontWeight: 600, color: colors.mauve, marginLeft: 1 }}>+</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>

    {/* Legend */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '8px 16px 12px',
      borderTop: '1px solid rgba(160,100,80,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: colors.stone }}>
        <span style={{ fontSize: 10 }}>&#x1F346;</span>
        <span>Logged</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: colors.stone }}>
        <span style={{ fontSize: 10, color: colors.terra, fontWeight: 600 }}>&#x1F346;+</span>
        <span>Multiple</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: colors.stone }}>
        <span style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
          display: 'inline-block',
        }} />
        <span>Today</span>
      </div>
    </div>

    {/* Hint */}
    <div style={{
      textAlign: 'center',
      fontSize: 9,
      fontWeight: 300,
      color: colors.muted,
      fontStyle: 'italic',
      padding: '0 16px 12px',
    }}>
      Tap a date to jump to that entry
    </div>
  </div>
)

/* ── Empty State ── */

const EmptyState: React.FC = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 36px',
    textAlign: 'center',
  }}>
    {/* Stacked blank journal cards */}
    <div style={{ position: 'relative', width: 240, height: 130, marginBottom: 28 }}>
      {/* Card 3 - furthest back */}
      <div style={{
        position: 'absolute',
        width: 200,
        height: 110,
        top: 20,
        left: '50%',
        transform: 'translateX(-50%) rotate(4deg)',
        opacity: 0.4,
        borderRadius: 16,
        overflow: 'hidden',
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.12)',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(
            to bottom, transparent, transparent 27px,
            rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px
          )`,
          backgroundPosition: '0 20px',
        }} />
      </div>
      {/* Card 2 */}
      <div style={{
        position: 'absolute',
        width: 220,
        height: 118,
        top: 10,
        left: '50%',
        transform: 'translateX(-50%) rotate(-2deg)',
        opacity: 0.65,
        borderRadius: 16,
        overflow: 'hidden',
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.12)',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(
            to bottom, transparent, transparent 27px,
            rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px
          )`,
          backgroundPosition: '0 20px',
        }} />
      </div>
      {/* Card 1 - front */}
      <div style={{
        position: 'absolute',
        width: 240,
        height: 130,
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 16,
        overflow: 'hidden',
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.12)',
        backgroundImage: `repeating-linear-gradient(
          to bottom, transparent, transparent 27px,
          rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px
        )`,
        backgroundPosition: '0 20px',
      }}>
        {/* Margin line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 40,
          width: 1,
          background: 'rgba(192,120,88,0.12)',
        }} />
        {/* Center icon */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          opacity: 0.3,
        }}>
          &#x1F319;
        </div>
      </div>
    </div>

    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 22,
      fontWeight: 700,
      color: colors.ink,
      marginBottom: 10,
      lineHeight: 1.3,
    }}>
      Your story starts here.
    </div>

    <div style={{
      fontFamily: webFonts.dmSans,
      fontSize: 13,
      fontWeight: 300,
      color: colors.stone,
      lineHeight: 1.7,
      marginBottom: 26,
    }}>
      As you log sessions, they'll appear here as private journal entries — yours to read, remember, and return to.
    </div>

    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 14,
      fontStyle: 'italic',
      color: colors.mauve,
      marginBottom: 28,
      lineHeight: 1.6,
    }}>
      "Feel seen, validated, and completely empowered."
    </div>

    <GradientButton
      label="Log your first session"
      fullWidth={false}
      letterSpacing={1.5}
      icon={<PlusIcon />}
    />
  </div>
)

/* ── Main Screen ── */

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  currentMonth = 'March 2026',
  entryCount = 8,
  calendarDays = [],
  showCalendar: showCalendarProp,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(showCalendarProp ?? false)
  const isEmpty = entries.length === 0

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
      <DecorativeGlow position="top-right" size={200} opacity={0.08} />
      <div style={{ height: 54 }} />

      {/* Screen header */}
      <div style={{
        padding: '4px 24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 28,
          fontWeight: 700,
          color: colors.ink,
        }}>
          Sessions Journal
        </div>
      </div>

      {/* Sticky month bar */}
      <div style={{
        flexShrink: 0,
        padding: '10px 24px 0',
        position: 'relative',
        zIndex: 50,
      }}>
        {isEmpty ? (
          /* Ghost pill for empty state */
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            background: colors.surface2,
            borderRadius: 9999,
            padding: '7px 12px 7px 16px',
          }}>
            <span style={{
              fontFamily: webFonts.playfair,
              fontSize: 14,
              fontWeight: 600,
              color: '#C4B0A0',
              letterSpacing: 0.3,
            }}>
              No entries yet
            </span>
            <ChevronDown color="#C4B0A0" size={13} />
          </div>
        ) : (
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
              border: 'none',
              borderRadius: 9999,
              padding: '7px 12px 7px 16px',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(124,74,90,0.3)',
            }}
          >
            <span style={{
              fontFamily: webFonts.playfair,
              fontSize: 15,
              fontWeight: 600,
              color: 'white',
              letterSpacing: 0.3,
            }}>
              {currentMonth}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 9999,
              padding: '1px 7px',
              fontSize: 9,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: 0.5,
            }}>
              {entryCount}
            </span>
            {calendarOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}

        {/* Calendar dropdown */}
        {calendarOpen && calendarDays.length > 0 && (
          <CalendarDropdown monthLabel={currentMonth} days={calendarDays} />
        )}
      </div>

      {/* Dim overlay */}
      {calendarOpen && (
        <div
          onClick={() => setCalendarOpen(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(30,18,12,0.22)',
            zIndex: 40,
          }}
        />
      )}

      {/* Content */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 20px 0',
          scrollbarWidth: 'none',
        }}>
          {entries.map((entry, idx) => (
            <React.Fragment key={entry.id}>
              {entry.monthSeparator && <MonthSeparator label={entry.monthSeparator} />}
              <EntryCard entry={entry} />
            </React.Fragment>
          ))}
          {/* Nav spacer */}
          <div style={{ height: 72 }} />
        </div>
      )}

      <BottomNav activeTab="journal" />
    </div>
  )
}
