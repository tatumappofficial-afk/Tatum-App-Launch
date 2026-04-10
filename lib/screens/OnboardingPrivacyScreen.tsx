import React from 'react'
import { colors, webFonts } from '../theme'
import { DynamicIsland } from './shared/DynamicIsland'
import { StatusBar } from './shared/StatusBar'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { HomeIndicator } from './shared/HomeIndicator'
import { GradientButton } from '../components/GradientButton'

/* ── Shared onboarding primitives ── */

const StepDots: React.FC<{ active: number; total?: number }> = ({ active, total = 4 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
    {Array.from({ length: total }, (_, i) => {
      const isDone = i < active
      const isActive = i === active
      return (
        <div
          key={i}
          style={{
            width: isActive ? 20 : 7,
            height: 7,
            borderRadius: isActive ? 4 : '50%',
            background: isActive
              ? colors.terra
              : isDone
                ? 'rgba(192,120,88,0.4)'
                : 'rgba(160,100,80,0.2)',
          }}
        />
      )
    })}
  </div>
)

/* ── Promise item ── */

const PromiseItem: React.FC<{ emoji: string; title: string; desc: string }> = ({ emoji, title, desc }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{emoji}</span>
    <div>
      <div style={{ fontFamily: webFonts.dmSans, fontSize: 13, fontWeight: 500, color: colors.ink, marginBottom: 2 }}>
        {title}
      </div>
      <div style={{ fontFamily: webFonts.dmSans, fontSize: 12, fontWeight: 300, color: colors.stone, lineHeight: '1.55' }}>
        {desc}
      </div>
    </div>
  </div>
)

/* ── Screen ── */

export const OnboardingPrivacyScreen: React.FC = () => (
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
    <DynamicIsland />
    <DecorativeGlow position="center" size={320} opacity={0.13} />
    <StatusBar />

    {/* Content */}
    <div
      style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* App icon */}
      <div style={{ marginTop: 18, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124,74,90,0.3)',
            fontSize: 32,
          }}
        >
          <span style={{ fontSize: 16, color: colors.white, lineHeight: 1 }}>&#10022;</span>
        </div>
      </div>

      {/* Letter-style headline */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div
          style={{
            fontFamily: webFonts.playfair,
            fontSize: 13,
            fontWeight: 400,
            fontStyle: 'italic',
            color: colors.stone,
            marginBottom: 6,
            letterSpacing: 0.3,
          }}
        >
          before we begin —
        </div>
        <div
          style={{
            fontFamily: webFonts.playfair,
            fontSize: 26,
            fontWeight: 700,
            color: colors.ink,
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          This is yours.
          <br />
          Only yours.
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: '#7A5A50',
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          Everything you log in Tatum lives on your device and nowhere else. That way your data stays yours.
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 40, height: 1, background: 'rgba(192,120,88,0.3)', margin: '16px auto' }} />

      {/* Promise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        <PromiseItem
          emoji="🔒"
          title="Stored only on your phone"
          desc="Your logs, notes, and ratings never leave your device without your permission."
        />
        <PromiseItem
          emoji="🗑️"
          title="Delete the app, delete everything"
          desc="Uninstalling Tatum permanently removes all of your data. No traces left behind."
        />
        <PromiseItem
          emoji="📱"
          title="Switch phones safely"
          desc="If you choose to turn it on, your data can move with you via iCloud or Google backup when you get a new device."
        />
      </div>

      {/* Signature */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 300, color: colors.stone, marginBottom: 3 }}>with love,</div>
        <div
          style={{
            fontFamily: webFonts.playfair,
            fontSize: 18,
            fontStyle: 'italic',
            fontWeight: 600,
            color: colors.terra,
          }}
        >
          Tatum
        </div>
      </div>
    </div>

    {/* Bottom area */}
    <div style={{ flexShrink: 0, padding: '0 28px 32px' }}>
      <div style={{ marginBottom: 14 }}>
        <GradientButton label="I Understand, Let's Begin" />
      </div>
      <StepDots active={0} />
    </div>
  </div>
)
