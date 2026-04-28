import { useState } from 'react'
import { Alert } from 'react-native'
import { SettingsScreen } from '@/lib/screens/SettingsScreen'
import { useRouter } from 'expo-router'
import { updateSetting } from '@/src/db'

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
