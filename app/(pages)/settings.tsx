import { useEffect, useRef, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { SettingsScreen } from '@/lib/screens/SettingsScreen'
import { SuccessOverlay } from '@/lib/components/SuccessOverlay'
import { useRouter } from 'expo-router'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useSettings, useUpdateSettings } from '@/src/hooks/useSettings'
import { authenticate } from '@/src/utils/biometrics'
import { exportData } from '@/src/utils/exportData'
import { eraseAllUserData, signOutUser } from '@/src/db'
import { DEFAULT_SETTINGS } from '@/src/db/schema'
import { isRevenueCatPaywallConfigured, presentRevenueCatPaywallIfNeeded } from '@/src/services/revenueCat'
import { useUserProfile } from '@/src/hooks/useUserProfile'

const PRIVACY_POLICY_URL = 'https://www.tatumapp.com/privacy.html'
const TERMS_URL = 'https://www.tatumapp.com/terms.html'
// Opens the user's mail app with a pre-addressed draft — no backend needed.
const FEEDBACK_MAILTO = `mailto:tatum.app.official@gmail.com?subject=${encodeURIComponent('Tatum Feedback')}`

async function openExternal(url: string) {
  try {
    await Linking.openURL(url)
  } catch (err) {
    console.error('Failed to open URL', url, err)
    Alert.alert('Could not open link', 'Please try again.')
  }
}

export default function SettingsRoute() {
  const router = useRouter()
  const settings = useSettings()
  const updateSettings = useUpdateSettings()
  const { raw: profile } = useUserProfile()

  const [busy, setBusy] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successLabel, setSuccessLabel] = useState('')
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (successTimer.current) clearTimeout(successTimer.current)
    },
    [],
  )

  // Require biometric auth in both directions: prevents enabling without
  // enrollment (and locking the user out), and prevents a bystander with
  // momentary access from quietly disabling the lock.
  async function handleToggleBiometrics() {
    if (busy) return
    setBusy(true)
    const willEnable = !settings.biometricLock
    const promptMessage = willEnable ? 'Confirm to enable lock' : 'Confirm to disable lock'
    let ok = false
    try {
      ok = await authenticate(promptMessage)
    } catch (err) {
      console.error('Biometric auth failed:', err)
    }
    if (!ok) {
      setBusy(false)
      return
    }
    updateSettings({ biometricLock: willEnable })
    setSuccessLabel(willEnable ? 'Lock enabled' : 'Lock disabled')
    setShowSuccess(true)
    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setShowSuccess(false), 1400)
    setBusy(false)
  }

  async function handleOpenDeviceSettings() {
    try {
      await Linking.openSettings()
    } catch (err) {
      console.error('Failed to open device settings', err)
      Alert.alert('Could not open settings', 'Open your phone settings to manage device backup.')
    }
  }

  async function handleExportData() {
    try {
      await exportData()
    } catch (err) {
      console.error('Export failed:', err)
      Alert.alert('Export failed', err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  async function handleOpenPremium() {
    if (busy) return
    if (!isRevenueCatPaywallConfigured()) {
      Alert.alert('Purchases are not ready yet', 'Tatum Lifetime will be available once App Store setup is complete.')
      return
    }

    setBusy(true)
    try {
      const result = await presentRevenueCatPaywallIfNeeded(profile?.providerUserId ?? null)
      if (result === 'unlocked') {
        setSuccessLabel('Lifetime access active')
        setShowSuccess(true)
        if (successTimer.current) clearTimeout(successTimer.current)
        successTimer.current = setTimeout(() => setShowSuccess(false), 1400)
      } else if (result === 'error') {
        Alert.alert('Purchase unavailable', 'Please try again in a moment.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SettingsScreen
        biometricsEnabled={settings.biometricLock}
        onBack={() => router.back()}
        onToggleBiometrics={handleToggleBiometrics}
        onOpenBackupSettings={handleOpenDeviceSettings}
        onPrivacyPolicy={() => openExternal(PRIVACY_POLICY_URL)}
        onTerms={() => openExternal(TERMS_URL)}
        onExportData={handleExportData}
        onOpenPremium={handleOpenPremium}
        onSubmitFeedback={() => openExternal(FEEDBACK_MAILTO)}
        onSignOut={() => {
          Alert.alert(
            'Sign Out',
            'Your data stays on this device. Sign back in with the same account to come right back to it.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Out',
                onPress: async () => {
                  try {
                    await GoogleSignin.signOut().catch(() => {})
                    await signOutUser()
                    // The layout guard reactively detects no authProvider and
                    // routes to (onboarding), where welcome.tsx redirects to
                    // /auth — no manual navigation needed.
                  } catch (err) {
                    console.error('Sign out failed:', err)
                    Alert.alert('Sign out failed', 'Please try again.')
                  }
                },
              },
            ],
          )
        }}
        onEraseEverything={() => {
          Alert.alert('Erase Everything', 'This will permanently delete all your data. This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Erase',
              style: 'destructive',
              onPress: async () => {
                try {
                  await eraseAllUserData()
                  // Reset settings — flipping hasOnboarded false trips the
                  // _layout guard back to (onboarding) reactively, no manual
                  // navigation needed.
                  updateSettings({
                    notifications: DEFAULT_SETTINGS.notifications,
                    whisperDeliveryDefault: DEFAULT_SETTINGS.whisperDeliveryDefault,
                    calendarStartDay: DEFAULT_SETTINGS.calendarStartDay,
                    biometricLock: DEFAULT_SETTINGS.biometricLock,
                    backupEnabled: DEFAULT_SETTINGS.backupEnabled,
                    hasOnboarded: DEFAULT_SETTINGS.hasOnboarded,
                    theme: DEFAULT_SETTINGS.theme,
                  })
                } catch (err) {
                  console.error('Erase failed:', err)
                  Alert.alert('Erase failed', 'Something went wrong. Please try again.')
                }
              },
            },
          ])
        }}
      />
      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </>
  )
}
