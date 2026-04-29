import { useState } from 'react'
import { Alert, Linking } from 'react-native'
import { SettingsScreen } from '@/lib/screens/SettingsScreen'
import { useRouter } from 'expo-router'
import { updateSetting } from '@/src/db'

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
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)

  return (
    <SettingsScreen
      biometricsEnabled={biometricsEnabled}
      onBack={() => router.back()}
      onToggleBiometrics={() => {
        const next = !biometricsEnabled
        setBiometricsEnabled(next)
        updateSetting('biometricLock', next)
      }}
      onPrivacyPolicy={() => openExternal(PRIVACY_POLICY_URL)}
      onTerms={() => openExternal(TERMS_URL)}
      onEraseEverything={() => {
        Alert.alert(
          'Erase Everything',
          'This will permanently delete all your data. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Erase', style: 'destructive', onPress: () => console.log('Erase confirmed') },
          ],
        )
      }}
    />
  )
}
