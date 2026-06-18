import '@/src/utils/crypto-polyfill'
import * as Font from 'expo-font'
import { useKeepAwake } from 'expo-keep-awake'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DropProvider } from 'react-native-reanimated-dnd'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display'
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans'
import { useLiveQuery } from '@tanstack/react-db'
import { initDatabase, userProfiles } from '@/src/db'
import { SettingsProvider, useSettings, useSettingsReady } from '@/src/hooks/useSettings'
import { LockGate } from '@/lib/components/LockGate'

SplashScreen.preventAutoHideAsync()

// Cap accessibility font scaling so layouts don't break at extreme sizes.
;(Text as any).defaultProps = (Text as any).defaultProps || {}
;(Text as any).defaultProps.maxFontSizeMultiplier = 1.5

export default function RootLayout() {
  useKeepAwake()
  const [initReady, setInitReady] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        await Font.loadAsync({
          PlayfairDisplay_400Regular: PlayfairDisplay_400Regular,
          PlayfairDisplay_400Regular_Italic: PlayfairDisplay_400Regular_Italic,
          PlayfairDisplay_600SemiBold: PlayfairDisplay_600SemiBold,
          PlayfairDisplay_700Bold: PlayfairDisplay_700Bold,
          DMSans_300Light: DMSans_300Light,
          DMSans_400Regular: DMSans_400Regular,
          DMSans_500Medium: DMSans_500Medium,
        })
        await initDatabase()
      } catch (e) {
        console.error('Init failed:', e)
      }
      setInitReady(true)
    }
    init()
  }, [])

  if (!initReady) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#F5EFE8' }}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <DropProvider>
              <SettingsProvider>
                <AuthedTree />
              </SettingsProvider>
            </DropProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  )
}

function AuthedTree() {
  const settingsReady = useSettingsReady()
  const settings = useSettings()
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )

  const onLayoutRootView = useCallback(() => {
    if (settingsReady) SplashScreen.hideAsync()
  }, [settingsReady])

  if (!settingsReady) return null

  const { hasOnboarded, biometricLock } = settings
  const isAuthed = profiles.some((p) => p.authProvider !== null)

  return (
    <View style={{ flex: 1, backgroundColor: '#F5EFE8' }} onLayout={onLayoutRootView}>
      {/* Only lock a fully onboarded, signed-in user. Otherwise the biometric
          prompt could fire on cold start over the sign-in/onboarding screens —
          before the user has even reached the /protect step where they opt in. */}
      <LockGate initialLocked={biometricLock && hasOnboarded && isAuthed}>
        <Stack
          screenOptions={{
            headerShown: false,
            // Pin to the splash color so a routed screen mid-mount can't flash black on Android.
            contentStyle: { backgroundColor: '#F5EFE8' },
          }}
        >
          <Stack.Protected guard={!hasOnboarded || !isAuthed}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={hasOnboarded && isAuthed}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(pages)" />
          </Stack.Protected>
          {/* Sheets stay reachable from both onboarding and the main app. */}
          <Stack.Screen
            name="(sheets)"
            options={Platform.select({
              ios: {
                presentation: 'formSheet' as const,
                sheetAllowedDetents: [0.85],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
                sheetCornerRadius: 24,
                sheetExpandsWhenScrolledToEdge: false,
              },
              default: {
                presentation: 'transparentModal' as const,
                // AndroidSheetChrome runs the slide + backdrop fade; the screen transition stays out of the way.
                animation: 'none' as const,
                // Override the parent Stack's opaque #F5EFE8 — otherwise the sheet container
                // covers the underlying tab/page, and the AndroidSheetChrome backdrop fade
                // reveals warm sand instead of the actual app on dismiss.
                contentStyle: { backgroundColor: 'transparent' },
              },
            })}
          />
        </Stack>
      </LockGate>
    </View>
  )
}
