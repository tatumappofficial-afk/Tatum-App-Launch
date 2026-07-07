import React from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Path, Polyline } from 'react-native-svg'
import { colors, font, gradientPoints, gradients } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { SectionLabel } from './shared/SectionLabel'
import { SettingsRow } from '../components/SettingsRow'
import { ToggleSwitch } from '../components/ToggleSwitch'
import { BackButton } from '../components/BackButton'

/* ── Types ── */

export interface SettingsScreenProps {
  biometricsEnabled?: boolean
  onBack?: () => void
  onToggleBiometrics?: () => void
  onOpenBackupSettings?: () => void
  onSubmitFeedback?: () => void
  onPrivacyPolicy?: () => void
  onTerms?: () => void
  onExportData?: () => void
  onSignOut?: () => void
  onDeleteAccount?: () => void
}

/* ── Inline icon helpers ── */

const ChevronForwardIcon: React.FC<{ color?: string }> = ({ color = '#C4B0A0' }) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
)

const FingerprintIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.sage}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" />
    <Path d="M5 12a7 7 0 0114 0" />
    <Path d="M8 12a4 4 0 018 0" />
    <Path d="M12 12v8" />
  </Svg>
)

const CloudIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.sage}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
  </Svg>
)

const ChatbubbleIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.gold}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Svg>
)

const TrashIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.mauve}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </Svg>
)

const SignOutIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
)

/** Outward-arrow / "share out" icon used for the Export Data row. */
const ExportIcon: React.FC = () => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" />
    <Polyline points="16 6 12 2 8 6" />
    <Line x1="12" y1="2" x2="12" y2="15" />
  </Svg>
)

const DocumentIcon: React.FC<{ stroke?: string }> = ({ stroke = colors.terra }) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="9" y1="13" x2="15" y2="13" />
    <Line x1="9" y1="17" x2="13" y2="17" />
  </Svg>
)

/** "Open in new" / external-link icon — signals that tapping leaves the app. */
const ExternalLinkIcon: React.FC<{ color?: string }> = ({ color = '#C4B0A0' }) => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <Polyline points="15 3 21 3 21 9" />
    <Line x1="10" y1="14" x2="21" y2="3" />
  </Svg>
)

const PremiumCardContent: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <>
    <LinearGradient
      colors={gradients.primaryCta}
      start={gradientPoints.diagonal.start}
      end={gradientPoints.diagonal.end}
      style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
    />
    <View
      style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 50,
      }}
    />
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        borderRadius: 9999,
        paddingVertical: 4,
        paddingHorizontal: 10,
        flexShrink: 0,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.white,
        }}
      >
        {'\u2726'} Pro
      </Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: font('playfair', '600'),
          fontSize: 16,
          color: colors.white,
          lineHeight: 17,
        }}
      >
        Tatum Premium
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '300',
          color: 'rgba(255,255,255,0.7)',
          marginTop: 2,
        }}
      >
        {subtitle}
      </Text>
    </View>
  </>
)

/* ── Main component ── */

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  biometricsEnabled = true,
  onBack,
  onToggleBiometrics,
  onOpenBackupSettings,
  onSubmitFeedback,
  onPrivacyPolicy,
  onTerms,
  onExportData,
  onSignOut,
  onDeleteAccount,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.warmSand,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DecorativeGlow position="top-right" size={220} opacity={0.07} />
      <StatusBarSpacer />

      {/* ── Screen Header ── */}
      <View
        style={{
          paddingTop: 6,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <BackButton onPress={onBack} />
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
          }}
        >
          Settings
        </Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Pro Membership Card ── */}
        <View style={{ marginTop: 14, flexShrink: 0 }}>
          <View
            accessible
            accessibilityLabel="Tatum Premium active"
            style={{
              marginHorizontal: 20,
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              overflow: 'hidden',
            }}
          >
            <PremiumCardContent subtitle="Premium access active" />
          </View>
        </View>

        {/* ── Security Section ── */}
        <SectionLabel label="Security" />
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 16,
            marginHorizontal: 20,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <SettingsRow
            icon={<FingerprintIcon />}
            iconBg="rgba(139,168,136,0.12)"
            title="Face ID / Touch ID"
            subtitle="Unlock Tatum with biometrics"
            trailing={<ToggleSwitch enabled={biometricsEnabled} onToggle={onToggleBiometrics} />}
          />
          <SettingsRow
            icon={<SignOutIcon />}
            iconBg="rgba(192,120,88,0.1)"
            title="Sign Out"
            subtitle="Your data stays on this device"
            trailing={<ChevronForwardIcon />}
            onPress={onSignOut}
            showBorder={false}
          />
        </View>

        {/* ── Support Section ── */}
        <SectionLabel label="Support" />
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 16,
            marginHorizontal: 20,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <SettingsRow
            icon={<ChatbubbleIcon />}
            iconBg="rgba(196,153,58,0.1)"
            title="Submit Feedback"
            subtitle="tatum.app.official@gmail.com"
            trailing={<ChevronForwardIcon />}
            onPress={onSubmitFeedback}
            showBorder={false}
          />
        </View>

        {/* ── Privacy Section ── */}
        <SectionLabel label="Privacy" />

        {/* Privacy blurb */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexShrink: 0,
          }}
        >
          <Text
            style={{
              fontFamily: font('playfair', '600'),
              fontSize: 14,
              color: colors.ink,
              marginBottom: 5,
            }}
          >
            Yours, not ours.
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '300',
              color: colors.stone,
              lineHeight: 19,
            }}
          >
            Everything you log stays in your hands — on your phone. Your device backup settings control whether app data
            is included in iCloud or Google backup. Our servers never see your data.
          </Text>
        </View>

        {/* Privacy rows */}
        <View
          style={{
            marginTop: 8,
            flexShrink: 0,
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: 'rgba(160,100,80,0.15)',
              borderRadius: 16,
              marginHorizontal: 20,
              overflow: 'hidden',
            }}
          >
            <SettingsRow
              icon={<CloudIcon />}
              iconBg="rgba(139,168,136,0.12)"
              title="Device Backup"
              subtitle="Manage app backup in your phone settings"
              trailing={<ExternalLinkIcon color={colors.sage} />}
              onPress={onOpenBackupSettings}
            />
            <SettingsRow
              icon={<ExportIcon />}
              iconBg="rgba(192,120,88,0.1)"
              title="Export Data"
              subtitle="Save a copy to email, iCloud, Google Drive, or Files"
              trailing={<ChevronForwardIcon />}
              onPress={onExportData}
            />
            <SettingsRow
              icon={<TrashIcon />}
              iconBg="rgba(176,112,128,0.1)"
              title="Delete Account & Data"
              subtitle="Permanently delete your account and all data · Cannot be undone"
              destructive
              trailing={<ChevronForwardIcon color={colors.mauve} />}
              onPress={onDeleteAccount}
              showBorder={false}
            />
          </View>
        </View>

        {/* ── Legal Section ── */}
        <SectionLabel label="Legal" />
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 16,
            marginHorizontal: 20,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <SettingsRow
            icon={<DocumentIcon stroke={colors.terra} />}
            iconBg="rgba(192,120,88,0.1)"
            title="Privacy Policy"
            subtitle="How Tatum handles your information"
            trailing={<ExternalLinkIcon />}
            onPress={onPrivacyPolicy}
          />
          <SettingsRow
            icon={<DocumentIcon stroke={colors.stone} />}
            iconBg="rgba(154,136,120,0.12)"
            title="Terms & Conditions"
            subtitle="Opens in your browser"
            trailing={<ExternalLinkIcon />}
            onPress={onTerms}
            showBorder={false}
          />
        </View>

        {/* ── Footer ── pushes to bottom on short content via flexGrow, scrolls with content on overflow */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: 24,
            paddingBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '300',
              color: 'rgba(154,136,120,0.4)',
              letterSpacing: 0.5,
              lineHeight: 18,
              textAlign: 'center',
            }}
          >
            Tatum v1.0.0 {'\u00B7'} {'\u00A9'} 2026 Tatum
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
