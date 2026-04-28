import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import Svg, { Path, Polyline, Rect } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { SectionLabel } from './shared/SectionLabel'
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
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
)

const LockIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0110 0v4" />
  </Svg>
)

const FingerprintIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.sage} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" />
    <Path d="M5 12a7 7 0 0114 0" />
    <Path d="M8 12a4 4 0 018 0" />
    <Path d="M12 12v8" />
  </Svg>
)

const ChatbubbleIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Svg>
)

const ShieldIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
)

const TrashIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.mauve} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </Svg>
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
    <View style={{
      flex: 1,
      backgroundColor: colors.warmSand,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <DecorativeGlow position="top-right" size={220} opacity={0.07} />
      <View style={{ height: 54 }} />

      {/* ── Screen Header ── */}
      <View style={{
        paddingTop: 6,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <BackButton onPress={onBack} />
        <Text style={{
          fontFamily: font('playfair', '700'),
          fontSize: 20,
          color: colors.ink,
        }}>Settings</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* ── Pro Membership Card ── */}
      <View style={{ marginTop: 14, flexShrink: 0 }}>
        <Pressable
          onPress={onProTap}
          style={{
            marginHorizontal: 20,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            ...gradientStyle('linear-gradient(135deg, #C07858 0%, #7C4A5A 100%)'),
          }}
        >
          {/* Decorative circle */}
          <View style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 50,
          }} />
          {/* Badge */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.35)',
            borderRadius: 9999,
            paddingVertical: 4,
            paddingHorizontal: 10,
            flexShrink: 0,
          }}>
            <Text style={{
              fontSize: 9,
              fontWeight: '600',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: colors.white,
            }}>{'\u2726'} Pro</Text>
          </View>
          {/* Text */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: font('playfair', '600'),
              fontSize: 14,
              color: colors.white,
              lineHeight: 17,
            }}>Tatum Premium</Text>
            <Text style={{
              fontSize: 10,
              fontWeight: '300',
              color: 'rgba(255,255,255,0.7)',
              marginTop: 2,
            }}>$4.99 / month {'\u00B7'} Renews Apr 18</Text>
          </View>
          {/* Arrow */}
          <ChevronForwardIcon color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>

      {/* ── Security Section ── */}
      <SectionLabel label="Security" />
      <View style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.15)',
        borderRadius: 16,
        marginHorizontal: 20,
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
      </View>

      {/* ── Support Section ── */}
      <SectionLabel label="Support" />
      <View style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.15)',
        borderRadius: 16,
        marginHorizontal: 20,
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
      </View>

      {/* ── Privacy Section ── */}
      <SectionLabel label="Privacy" />

      {/* Privacy blurb */}
      <View style={{
        marginHorizontal: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.15)',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexShrink: 0,
      }}>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 13,
          color: colors.ink,
          marginBottom: 5,
        }}>Your data stays on your device.</Text>
        <Text style={{
          fontSize: 11,
          fontWeight: '300',
          color: colors.stone,
          lineHeight: 19,
        }}>
          Tatum never uploads your personal logs, notes, or session data to any server. Everything is stored locally and encrypted. You can export or permanently delete your data at any time.
        </Text>
      </View>

      {/* Privacy rows */}
      <View style={{
        marginTop: 8,
        flexShrink: 0,
      }}>
        <View style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.15)',
          borderRadius: 16,
          marginHorizontal: 20,
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
        </View>
      </View>


      {/* ── Footer ── */}
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 4,
      }}>
        <Text style={{
          fontSize: 9,
          fontWeight: '300',
          color: 'rgba(154,136,120,0.4)',
          letterSpacing: 0.5,
          lineHeight: 18,
          textAlign: 'center',
        }}>
          Tatum v1.0.0 {'\u00B7'} {'\u00A9'} 2026 Tatum
        </Text>
      </View>

    </View>
  )
}
