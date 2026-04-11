import React from 'react'
import { colors, webFonts } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StepDots } from '../components/StepDots'

const GradientButton: React.FC<{ label: string }> = ({ label }) => (
  <button
    style={{
      width: '100%',
      height: 52,
      background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
      border: 'none',
      borderRadius: 9999,
      cursor: 'pointer',
      fontFamily: webFonts.dmSans,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: 'white',
      boxShadow: '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
      marginBottom: 12,
    }}
  >
    {label}
  </button>
)

/* ── Tag data ── */

const TAGS = [
  { emoji: '🍆', label: 'Penetration' },
  { emoji: '👉', label: 'Fingering' },
  { emoji: '🫱', label: 'Manual' },
  { emoji: '💋', label: 'Giving' },
  { emoji: '😛', label: 'Receiving' },
  { emoji: '🌬️', label: 'Blow Job' },
  { emoji: '🍑', label: 'Anal' },
  { emoji: '💦', label: 'Cumming' },
  { emoji: '✨', label: 'Solo' },
  { emoji: '💃', label: 'She Initiated' },
  { emoji: '🤝', label: 'Mutual' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '⌛️', label: 'Long' },
  { emoji: '🏁', label: 'Fast' },
  { emoji: '🌙', label: 'Night' },
  { emoji: '🌄', label: 'Morning' },
  { emoji: '🛁', label: 'Shower' },
  { emoji: '🏡', label: 'At Home' },
  { emoji: '🏖', label: 'Vacation' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🩸', label: 'Period' },
] as const

/* ── Tag chip ── */

const TagChip: React.FC<{ emoji: string; label: string; active?: boolean }> = ({ emoji, label, active = true }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        ...(active
          ? {
              background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
              boxShadow: '0 4px 14px rgba(124,74,90,0.32)',
            }
          : {
              background: colors.surface2,
              border: '1.5px solid rgba(160,100,80,0.2)',
            }),
      }}
    >
      {emoji}
    </div>
    <div
      style={{
        fontFamily: webFonts.dmSans,
        fontSize: 9,
        fontWeight: active ? 500 : 400,
        color: active ? colors.terra : colors.stone,
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </div>
  </div>
)

/* ── Add chip ── */

const AddChip: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: colors.terra,
        background: 'transparent',
        border: '1.5px dashed rgba(192,120,88,0.4)',
      }}
    >
      ＋
    </div>
    <div
      style={{
        fontFamily: webFonts.dmSans,
        fontSize: 9,
        fontWeight: 400,
        color: colors.terra,
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0.2,
      }}
    >
      Add yours
    </div>
  </div>
)

/* ── Hand icon ── */

const HandIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4B0A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 00-4 0v5" />
    <path d="M14 10V4a2 2 0 00-4 0v6" />
    <path d="M10 10.5V6a2 2 0 00-4 0v8" />
    <path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15" />
  </svg>
)

/* ── Screen ── */

export const OnboardingTagsScreen: React.FC = () => (
  <div
    style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}
  >
    <DecorativeGlow position="top-right" size={240} opacity={0.1} />
    <div style={{ height: 54 }} />

    {/* Content */}
    <div
      style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px',
        zIndex: 1,
      }}
    >
      {/* Title area */}
      <div style={{ marginTop: 22, marginBottom: 20 }}>
        <div
          style={{
            fontFamily: webFonts.dmSans,
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
            color: colors.terra,
            marginBottom: 8,
          }}
        >
          Step 4 of 4
        </div>
        <div
          style={{
            fontFamily: webFonts.playfair,
            fontSize: 30,
            fontWeight: 700,
            color: colors.ink,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Make it
          <br />
          yours
        </div>
        <div style={{ fontSize: 13, fontWeight: 300, color: colors.stone, lineHeight: 1.6 }}>
          These are your activity tags. Keep what fits, remove what doesn't, and add your own.
        </div>
      </div>

      {/* Explainer card */}
      <div
        style={{
          background: colors.surface,
          border: '1px solid rgba(160,100,80,0.15)',
          borderRadius: 14,
          padding: '13px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🏷️</span>
        <div style={{ fontSize: 12, fontWeight: 300, color: '#7A5A50', lineHeight: '1.55' }}>
          <strong style={{ fontWeight: 500, color: colors.ink }}>Activity tags</strong> are the emoji labels you tap
          when logging a session. They're completely private and fully customizable — you can rename, delete, or add new
          ones at any time.
        </div>
      </div>

      {/* Horizontally scrollable tag grid — 3 rows */}
      <div style={{ marginRight: -28, overflow: 'hidden', marginBottom: 14 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, auto)',
            gridAutoFlow: 'column',
            gridAutoColumns: 'calc((100% - 16px) / 3)',
            gap: '10px 8px',
            overflowX: 'auto',
            paddingRight: 40,
            scrollbarWidth: 'none',
          }}
        >
          <AddChip />
          {TAGS.map((tag, i) => (
            <TagChip key={i} emoji={tag.emoji} label={tag.label} active={true} />
          ))}
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          fontSize: 10,
          fontWeight: 300,
          color: '#C4B0A0',
          fontStyle: 'italic',
        }}
      >
        <HandIcon />
        Swipe to see more · Hold to rename or remove
      </div>
    </div>

    {/* Bottom area */}
    <div style={{ flexShrink: 0, padding: '0 28px 32px' }}>
      <GradientButton label="These Look Good" />
      <StepDots current={3} />
    </div>
  </div>
)
