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
      marginBottom: 10,
    }}
  >
    {label}
  </button>
)

/* ── Color swatches data ── */

const SWATCH_GRADIENTS = [
  'linear-gradient(135deg, #C07858, #7C4A5A)',
  'linear-gradient(135deg, #B07080, #7C4A5A)',
  'linear-gradient(135deg, #8BA888, #5A8060)',
  'linear-gradient(135deg, #C4993A, #8A6A20)',
  'linear-gradient(135deg, #9A8878, #6A5848)',
  'linear-gradient(135deg, #7C6090, #4A3060)',
] as const

/* ── Chevron icon ── */

const ChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4B0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* ── Screen ── */

export const OnboardingPartnerScreen: React.FC = () => (
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
      <div style={{ marginTop: 24, marginBottom: 24 }}>
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
          Step 3 of 4
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
          Add a
          <br />
          partner
        </div>
        <div style={{ fontSize: 13, fontWeight: 300, color: colors.stone, lineHeight: 1.6 }}>
          Give them a name and a color. You can always add more from your profile later.
        </div>
      </div>

      {/* Partner preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: SWATCH_GRADIENTS[0],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: webFonts.playfair,
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
            border: '3px solid white',
            boxShadow: '0 6px 20px rgba(61,43,37,0.15)',
            marginBottom: 10,
          }}
        >
          AL
        </div>
        <div
          style={{
            fontFamily: webFonts.playfair,
            fontSize: 18,
            fontStyle: 'italic',
            fontWeight: 600,
            color: colors.ink,
            minHeight: 26,
          }}
        >
          Alex
        </div>
      </div>

      {/* Name input */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          defaultValue="Alex"
          placeholder="Their name or nickname"
          maxLength={30}
          style={{
            width: '100%',
            background: colors.surface,
            border: '1.5px solid rgba(160,100,80,0.2)',
            borderRadius: 12,
            padding: '13px 16px',
            fontFamily: webFonts.dmSans,
            fontSize: 14,
            color: colors.ink,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Color picker */}
      <div
        style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.stone,
          marginBottom: 10,
        }}
      >
        Choose a color
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {SWATCH_GRADIENTS.map((grad, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: grad,
              cursor: 'pointer',
              border: i === 0 ? '2.5px solid white' : '2.5px solid transparent',
              boxShadow: i === 0 ? '0 0 0 2.5px #C07858' : 'none',
            }}
          />
        ))}
      </div>

      {/* Or divider */}
      <div
        style={{
          fontSize: 10,
          color: '#C4B0A0',
          textAlign: 'center',
          margin: '12px 0',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        or
      </div>

      {/* Solo row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: colors.surface,
          border: '1.5px solid rgba(160,100,80,0.15)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 20,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9A8878, #6A5848)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
            flexShrink: 0,
          }}
        >
          ✨
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: colors.ink }}>Solo ✨</div>
          <div style={{ fontSize: 11, fontWeight: 300, color: colors.stone }}>
            Track your own experiences without adding a partner
          </div>
        </div>
        <ChevronRight />
      </div>
    </div>

    {/* Bottom area */}
    <div style={{ flexShrink: 0, padding: '0 28px 32px' }}>
      <GradientButton label="Add Alex" />
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
      <StepDots current={2} />
    </div>
  </div>
)
