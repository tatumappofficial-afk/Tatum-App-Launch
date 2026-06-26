import { useEffect } from 'react'
import { BackHandler } from 'react-native'

// Blocks Android hardware back during onboarding. Several onboarding screens
// commit side effects (signup logging, auth stamping, partner creation), so
// setup stays forward-only and each screen explains what can be changed later.
export function useBlockBack() {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [])
}
