import { useEffect, useRef, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { SettingsScreen } from '@/lib/screens/SettingsScreen'
import { SuccessOverlay } from '@/lib/components/SuccessOverlay'
import { useRouter } from 'expo-router'
import { useSettings, useUpdateSettings } from '@/src/hooks/useSettings'
import { authenticate } from '@/src/utils/biometrics'
import { exportData } from '@/src/utils/exportData'

const PRIVACY_POLICY_URL = 'https://www.tatumapp.com/privacy.html'
const TERMS_URL = 'https://www.tatumapp.com/terms.html'

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

  async function handleExportData() {
    try {
      await exportData()
    } catch (err) {
      console.error('Export failed:', err)
      Alert.alert('Export failed', err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <SettingsScreen
        biometricsEnabled={settings.biometricLock}
        onBack={() => router.back()}
        onToggleBiometrics={handleToggleBiometrics}
        onPrivacyPolicy={() => openExternal(PRIVACY_POLICY_URL)}
        onTerms={() => openExternal(TERMS_URL)}
        onExportData={handleExportData}
        onEraseEverything={() => {
          Alert.alert('Erase Everything', 'This will permanently delete all your data. This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Erase', style: 'destructive', onPress: () => console.log('Erase confirmed') },
          ])
        }}
      />
      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </>
  )
}
