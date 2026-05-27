import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Blocks the Android hardware back button. iOS swipe-back is killed at the
// Stack level via `gestureEnabled: false`. Used by onboarding to keep the user moving forward.
export function useBlockBack() {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])
}
