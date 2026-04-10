import React from 'react'
import { colors, webFonts } from '../theme'
import { DynamicIsland } from './shared/DynamicIsland'
import { StatusBar } from './shared/StatusBar'
import { HomeIndicator } from './shared/HomeIndicator'
import { GradientButton } from '../components/GradientButton'

/* ── Feature icons (SVG) ── */

const CalendarIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const BookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
)

/* ── Feature pill ── */

const FeaturePill: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({ icon, text }) => (
  <div
    style={{
      background: 'rgba(251,247,242,0.8)',
      border: '1px solid rgba(160,100,80,0.15)',
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textAlign: 'left',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
    <div style={{ fontSize: 12.5, fontWeight: 300, color: '#6A4A40', lineHeight: 1.4 }}>{text}</div>
  </div>
)

/* ── Screen ── */

export const OnboardingReadyScreen: React.FC = () => (
  <div
    style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(165deg, #F5EFE8 0%, #EDE3D8 60%, #E0D0C0 100%)',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}
  >
    <DynamicIsland />

    {/* Large ambient glow — centered */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -58%)',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(192,120,88,0.18) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />

    {/* Decorative rings */}
    <div
      style={{
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: '50%',
        border: '1px solid rgba(192,120,88,0.12)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -58%)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 340,
        height: 340,
        borderRadius: '50%',
        border: '1px solid rgba(192,120,88,0.12)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -58%)',
        pointerEvents: 'none',
      }}
    />

    <StatusBar />

    {/* Main content — centered vertically */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 36px',
        zIndex: 1,
        textAlign: 'center',
      }}
    >
      {/* App icon — large */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          boxShadow: '0 16px 40px rgba(124,74,90,0.35)',
          marginBottom: 28,
        }}
      >
        <span style={{ fontSize: 22, color: colors.white, lineHeight: 1 }}>&#10022;</span>
      </div>

      {/* Headline */}
      <div
        style={{
          fontFamily: webFonts.playfair,
          fontSize: 36,
          fontWeight: 700,
          color: colors.ink,
          lineHeight: 1.15,
          marginBottom: 14,
        }}
      >
        You're all set,
        <br />
        Alanna.
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 300,
          color: colors.stone,
          textAlign: 'center',
          marginBottom: 18,
          letterSpacing: 0.3,
        }}
      >
        Here's what's waiting for you.
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginBottom: 32 }}>
        <FeaturePill
          icon={<CalendarIcon />}
          text={
            <>
              <strong style={{ fontWeight: 500, color: colors.ink }}>Calendar</strong> — every moment logged and mapped,
              month by month.
            </>
          }
        />
        <FeaturePill
          icon={<HomeIcon />}
          text={
            <>
              <strong style={{ fontWeight: 500, color: colors.ink }}>Home</strong> — your stats, your partners, your
              patterns at a glance.
            </>
          }
        />
        <FeaturePill
          icon={<BookIcon />}
          text={
            <>
              <strong style={{ fontWeight: 500, color: colors.ink }}>Journal</strong> — write notes on any session,
              private and encrypted.
            </>
          }
        />
      </div>
    </div>

    {/* Bottom area */}
    <div style={{ flexShrink: 0, padding: '0 28px 40px', zIndex: 2 }}>
      <div style={{ marginBottom: 12 }}>
        <GradientButton label="Start Logging" height={56} fontSize={14} />
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 300,
          color: colors.muted,
          lineHeight: 1.5,
        }}
      >
        Your data is private, encrypted, and yours alone.
      </div>
    </div>
  </div>
)
