import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { HomeIndicator } from './shared/HomeIndicator'
import { SettingsRow } from '../components/SettingsRow'
import { ToggleSwitch } from '../components/ToggleSwitch'
import { BackButton } from '../components/BackButton'

/* ── Types ── */

export interface SettingsScreenProps {
  biometricsEnabled?: boolean
  onBack?: () => void
  onProTap?: () => void
  onChangePasscode?: () => void
  onToggleBiometrics?: () => void
  onSubmitFeedback?: () => void
  onPrivacyInfo?: () => void
  onEraseEverything?: () => void
}

/* ── Inline icon helpers ── */

const ChevronForwardIcon: React.FC<{ color?: string }> = ({ color = '#C4B0A0' }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const LockIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const FingerprintIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" />
    <path d="M5 12a7 7 0 0114 0" />
    <path d="M8 12a4 4 0 018 0" />
    <path d="M12 12v8" />
  </svg>
)

const ChatbubbleIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const ShieldIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const TrashIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.mauve} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

/* ── Shared sub-components ── */

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.terra,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '16px 24px 8px',
    flexShrink: 0,
    fontFamily: webFonts.dmSans,
  }}>
    <span>{label}</span>
    <div style={{ flex: 1, height: 1, background: 'rgba(160,100,80,0.15)' }} />
  </div>
)

/* ── Main component ── */

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  biometricsEnabled = true,
  onBack,
  onProTap,
  onChangePasscode,
  onToggleBiometrics,
  onSubmitFeedback,
  onPrivacyInfo,
  onEraseEverything,
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
      <DecorativeGlow position="top-right" size={220} opacity={0.07} />
      <DynamicIsland />
      <StatusBar />

      {/* ── Screen Header ── */}
      <div style={{
        padding: '6px 24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <BackButton onPress={onBack} />
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 20,
          fontWeight: 700,
          color: colors.ink,
        }}>Settings</div>
        <div style={{ width: 34 }} />
      </div>

      {/* ── Pro Membership Card ── */}
      <div style={{ marginTop: 14, flexShrink: 0 }}>
        <div
          onClick={onProTap}
          style={{
            margin: '0 20px',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #C07858 0%, #7C4A5A 100%)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          {/* Badge */}
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 9999,
            padding: '4px 10px',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: colors.white,
            flexShrink: 0,
          }}>{'\u2726'} Pro</div>
          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: webFonts.playfair,
              fontSize: 14,
              fontWeight: 600,
              color: colors.white,
              lineHeight: 1.2,
            }}>Tatum Premium</div>
            <div style={{
              fontSize: 10,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 2,
            }}>$4.99 / month {'\u00B7'} Renews Apr 18</div>
          </div>
          {/* Arrow */}
          <ChevronForwardIcon color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      {/* ── Security Section ── */}
      <SectionLabel label="Security" />
      <div style={{
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.15)',
        borderRadius: 16,
        margin: '0 20px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <SettingsRow
          icon={<LockIcon />}
          iconBg="rgba(192,120,88,0.1)"
          title="Change Passcode"
          subtitle="Confirm current, then set a new one"
          trailing={<ChevronForwardIcon />}
          onPress={onChangePasscode}
        />
        <SettingsRow
          icon={<FingerprintIcon />}
          iconBg="rgba(139,168,136,0.12)"
          title="Face ID / Touch ID"
          subtitle="Unlock Tatum with biometrics"
          trailing={<ToggleSwitch enabled={biometricsEnabled} onToggle={onToggleBiometrics} />}
          showBorder={false}
        />
      </div>

      {/* ── Support Section ── */}
      <SectionLabel label="Support" />
      <div style={{
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.15)',
        borderRadius: 16,
        margin: '0 20px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <SettingsRow
          icon={<ChatbubbleIcon />}
          iconBg="rgba(196,153,58,0.1)"
          title="Submit Feedback"
          subtitle="contact@tatumapp.com"
          trailing={<ChevronForwardIcon />}
          onPress={onSubmitFeedback}
          showBorder={false}
        />
      </div>

      {/* ── Privacy Section ── */}
      <SectionLabel label="Privacy" />

      {/* Privacy blurb */}
      <div style={{
        margin: '0 20px',
        background: colors.surface,
        border: '1px solid rgba(160,100,80,0.15)',
        borderRadius: 14,
        padding: '14px 16px',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 13,
          fontWeight: 600,
          color: colors.ink,
          marginBottom: 5,
        }}>Your data stays on your device.</div>
        <div style={{
          fontSize: 11,
          fontWeight: 300,
          color: colors.stone,
          lineHeight: 1.7,
        }}>
          Tatum never uploads your personal logs, notes, or session data to any server. Everything is stored locally and encrypted. You can export or permanently delete your data at any time.
        </div>
      </div>

      {/* Privacy rows */}
      <div style={{
        marginTop: 8,
        flexShrink: 0,
      }}>
        <div style={{
          background: colors.surface,
          border: '1px solid rgba(160,100,80,0.15)',
          borderRadius: 16,
          margin: '0 20px',
          overflow: 'hidden',
        }}>
          <SettingsRow
            icon={<ShieldIcon />}
            iconBg="rgba(160,100,80,0.08)"
            title="Privacy and Data Info"
            subtitle="How Tatum handles your information"
            trailing={<ChevronForwardIcon />}
            onPress={onPrivacyInfo}
          />
          <SettingsRow
            icon={<TrashIcon />}
            iconBg="rgba(176,112,128,0.1)"
            title="Erase Everything"
            subtitle="Permanently delete all data \u00B7 Cannot be undone"
            destructive
            trailing={
              <ChevronForwardIcon color={colors.mauve} />
            }
            onPress={onEraseEverything}
            showBorder={false}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 4,
      }}>
        <div style={{
          fontSize: 9,
          fontWeight: 300,
          color: 'rgba(154,136,120,0.4)',
          letterSpacing: 0.5,
          lineHeight: 2,
          textAlign: 'center',
        }}>
          Tatum v1.0.0 {'\u00B7'} {'\u00A9'} 2026 Tatum
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
