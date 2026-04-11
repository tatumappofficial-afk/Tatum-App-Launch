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
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'white',
      boxShadow: '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
      marginBottom: 10,
    }}
  >
    {label}
  </button>
)

/* ── Security card icons (SVG) ── */

const FaceIdIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3H5a2 2 0 00-2 2v2" />
    <path d="M17 3h2a2 2 0 012 2v2" />
    <path d="M7 21H5a2 2 0 01-2-2v-2" />
    <path d="M17 21h2a2 2 0 002-2v-2" />
    <path d="M9 9v1" />
    <path d="M15 9v1" />
    <path d="M12 9v3" />
    <path d="M9 15c.6 1 1.5 1.5 3 1.5s2.4-.5 3-1.5" />
  </svg>
)

const KeypadIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="1.5" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="18" cy="6" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
    <circle cx="6" cy="18" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
  </svg>
)

const CheckIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ── Security card ── */

interface SecurityCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  selected: boolean
}

const SecurityCard: React.FC<SecurityCardProps> = ({ icon, title, desc, selected }) => (
  <div
    style={{
      background: colors.surface,
      border: `2px solid ${selected ? colors.terra : 'rgba(160,100,80,0.15)'}`,
      borderRadius: 16,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: selected ? '0 0 0 3px rgba(192,120,88,0.15)' : 'none',
    }}
  >
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 13,
        background: 'rgba(192,120,88,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: webFonts.dmSans, fontSize: 14, fontWeight: 500, color: colors.ink, marginBottom: 2 }}>
        {title}
      </div>
      <div style={{ fontFamily: webFonts.dmSans, fontSize: 11, fontWeight: 300, color: colors.stone, lineHeight: '1.4' }}>
        {desc}
      </div>
    </div>
    {selected ? (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckIcon />
      </div>
    ) : (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '2px solid rgba(160,100,80,0.25)',
          flexShrink: 0,
        }}
      />
    )}
  </div>
)

/* ── Screen ── */

export const OnboardingSecurityScreen: React.FC = () => (
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
      <div style={{ marginTop: 24, marginBottom: 28 }}>
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
          Step 2 of 4
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
          Protect
          <br />
          your space
        </div>
        <div style={{ fontSize: 13, fontWeight: 300, color: colors.stone, lineHeight: 1.6 }}>
          Choose how you want to lock Tatum. This keeps your data private even if someone picks up your phone.
        </div>
      </div>

      {/* Security cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <SecurityCard
          icon={<FaceIdIcon />}
          title="Use Face ID"
          desc="Unlock instantly with your face. Works on most iPhones and Android devices."
          selected={true}
        />
        <SecurityCard
          icon={<KeypadIcon />}
          title="Set a Passcode"
          desc="Create a 4 or 6-digit PIN. You'll enter it each time you open Tatum."
          selected={false}
        />
      </div>
    </div>

    {/* Bottom area */}
    <div style={{ flexShrink: 0, padding: '0 28px 32px' }}>
      <GradientButton label="Continue" />
      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 300,
          color: colors.muted,
          cursor: 'pointer',
          padding: '4px 0',
          marginBottom: 12,
        }}
      >
        Skip for now
      </div>
      <StepDots current={1} />
    </div>
  </div>
)
