import { Stack } from 'expo-router/stack'
import { Platform } from 'react-native'

const isIOS = Platform.OS === 'ios'

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="log-session"
        options={isIOS ? {
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.85, 1.0],
          contentStyle: { backgroundColor: 'transparent' },
        } : {
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen name="session-detail" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="dev-tools" options={{ presentation: 'modal' }} />
      <Stack.Screen name="partners" options={{ presentation: 'modal' }} />
      <Stack.Screen name="partner-profile" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
      <Stack.Screen name="edit-partner" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="calendar-day"
        options={isIOS ? {
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.85, 1.0],
          contentStyle: { backgroundColor: 'transparent' },
        } : {
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen
        name="add-tag"
        options={isIOS ? {
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.75, 1.0],
          contentStyle: { backgroundColor: 'transparent' },
        } : {
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  )
}
