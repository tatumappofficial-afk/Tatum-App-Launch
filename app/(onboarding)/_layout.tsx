import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
        // Onboarding is forward-only because some steps commit side effects.
        // iOS swipe-back is disabled here; Android hardware back is blocked by
        // each screen's useBlockBack call.
        gestureEnabled: false,
      }}
    />
  )
}
