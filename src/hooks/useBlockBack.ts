import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Blocks the Android hardware back button. iOS swipe-back should be killed at
// the Stack level via `gestureEnabled: false`. Used by the onboarding flow to
// keep users moving forward through the wizard.
//
// Replaces the old `usePreventRemove(true, () => {})` from
// `@react-navigation/native`, which expo-router 56 forbids.
export function useBlockBack() {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])
}
