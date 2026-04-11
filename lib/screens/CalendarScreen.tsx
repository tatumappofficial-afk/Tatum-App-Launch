import React from 'react'
import { colors, webFonts } from '../theme'
import { BottomNav } from './shared/BottomNav'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { CalendarGrid } from '../components/CalendarGrid'
import { EmojiChip } from '../components/EmojiChip'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface CalendarScreenProps {
  month: number       // 1-12
  year: number
  today?: number      // day number to highlight as today
  loggedDays?: LoggedDay[]
  selectedDay?: number | null
  onPrevMonth?: () => void
  onNextMonth?: () => void
  onDayPress?: (day: number) => void
}

/* ── Helpers ── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const QUICK_LOG_EMOJIS = ['🍆', '✋', '👉', '💋', '🌬️', '😘', '🍑', '✨', '🌙', '🩷', '🩸']

/* ── Sub-components ── */

const NavHeader: React.FC = () => (
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
      letterSpacing: 5,
      color: colors.terra,
    }}>TATUM</div>
  </div>
)

const ChevronIcon: React.FC<{ direction: 'back' | 'forward' }> = ({ direction }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {direction === 'back'
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 6 15 12 9 18" />
    }
  </svg>
)

const CalendarHeader: React.FC<{
  month: number
  year: number
  onPrev?: () => void
  onNext?: () => void
}> = ({ month, year, onPrev, onNext }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 22px 8px',
  }}>
    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 22,
      fontWeight: 600,
      color: colors.ink,
    }}>
      {MONTH_NAMES[month - 1]} {year}
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      <button
        onClick={onPrev}
        aria-label="Previous month"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: colors.surface,
          border: `1px solid rgba(160,100,80,0.18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <ChevronIcon direction="back" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next month"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: colors.surface,
          border: `1px solid rgba(160,100,80,0.18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <ChevronIcon direction="forward" />
      </button>
    </div>
  </div>
)

const Legend: React.FC = () => (
  <div style={{
    display: 'flex',
    gap: 14,
    padding: '7px 22px 0',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
      }} />
      <span style={{ fontFamily: webFonts.dmSans, fontSize: 8.5, color: colors.stone }}>Today</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 10 }}>🍆</span>
      <span style={{ fontFamily: webFonts.dmSans, fontSize: 8.5, color: colors.stone }}>Logged</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 10, color: colors.terra, fontWeight: 600 }}>🍆+</span>
      <span style={{ fontFamily: webFonts.dmSans, fontSize: 8.5, color: colors.stone }}>Multiple</span>
    </div>
  </div>
)

const QuickLogWidget: React.FC = () => (
  <div style={{
    flexShrink: 0,
    background: colors.surface,
    borderRadius: 18,
    border: '1px solid rgba(160,100,80,0.16)',
    margin: '10px 16px 0',
    padding: '14px 14px 12px',
  }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{
        fontFamily: webFonts.dmSans,
        fontSize: 8,
        fontWeight: 500,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: colors.terra,
        marginBottom: 2,
      }}>Quick Log</div>
      <div style={{
        fontFamily: webFonts.dmSans,
        fontSize: 9,
        fontWeight: 300,
        color: colors.muted,
        fontStyle: 'italic',
      }}>Drag to a date &middot; Tap to log today</div>
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      overflowX: 'auto',
      overflowY: 'hidden',
      paddingBottom: 2,
    }}>
      {QUICK_LOG_EMOJIS.map((emoji, i) => (
        <EmojiChip key={i} emoji={emoji} size={46} borderRadius={12} />
      ))}
    </div>
  </div>
)

/* ── Main Screen ── */

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  month,
  year,
  today,
  loggedDays = [],
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onDayPress,
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
      <div style={{ height: 54 }} />
      <NavHeader />

      {/* Calendar section */}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <CalendarHeader
          month={month}
          year={year}
          onPrev={onPrevMonth}
          onNext={onNextMonth}
        />
        <div style={{ padding: '0 18px' }}>
          <CalendarGrid
            month={month - 1}
            year={year}
            today={today}
            selectedDay={selectedDay ?? undefined}
            loggedDays={loggedDays}
            onDayPress={onDayPress}
          />
        </div>
        <Legend />
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'rgba(160,100,80,0.12)',
        margin: '10px 22px 0',
        flexShrink: 0,
      }} />

      {/* Quick Log Widget */}
      <QuickLogWidget />

      {/* Nav spacer */}
      <div style={{ height: 72, flexShrink: 0 }} />

      <BottomNav activeTab="calendar" />
    </div>
  )
}
