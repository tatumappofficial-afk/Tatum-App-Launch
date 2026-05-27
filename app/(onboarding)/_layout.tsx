import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
        // Onboarding is forward-only — no swipe-back, no header back, no
        // hardware back. Each screen also calls usePreventRemove(true) to
        // catch programmatic pops.
        gestureEnabled: false,
      }}
    />
  )
}
