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
import { PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display'
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans'
import { initDatabase } from '@/src/db'
import { SettingsProvider, useSettings, useSettingsReady } from '@/src/hooks/useSettings'
import { LockGate } from '@/lib/components/LockGate'

SplashScreen.preventAutoHideAsync()

// Boot-timing anchor for diagnosing the splash → black-flash → app sequence
// we hit on Android. Every [boot] log includes ms-since-module-load so we can
// see exactly where time goes between splash hiding and first paint.
const __bootT0 = Date.now()
console.log(`[boot] _layout.tsx module evaluated (t=0ms)`)

// Cap accessibility font scaling app-wide so layouts don't break at extreme sizes.
// See "Tori's Vault/Expo Best Practices/Typography.md".
;(Text as any).defaultProps = (Text as any).defaultProps || {}
;(Text as any).defaultProps.maxFontSizeMultiplier = 1.5

/**
 * Outer shell. Owns fonts + DB init. Once both resolve, mounts SettingsProvider
 * which loads the settings row from SQLite. The actual routed tree (AuthedTree)
 * only mounts after the settings provider is ready.
 */
export default function RootLayout() {
  useKeepAwake()
  const [initReady, setInitReady] = useState(false)

  console.log(`[boot] RootLayout render (t=${Date.now() - __bootT0}ms, initReady=${initReady})`)

  useEffect(() => {
    async function init() {
      console.log(`[boot] init effect start (t=${Date.now() - __bootT0}ms)`)
      try {
        await Font.loadAsync({
          'PlayfairDisplay_400Regular': PlayfairDisplay_400Regular,
          'PlayfairDisplay_400Regular_Italic': PlayfairDisplay_400Regular_Italic,
          'PlayfairDisplay_600SemiBold': PlayfairDisplay_600SemiBold,
          'PlayfairDisplay_700Bold': PlayfairDisplay_700Bold,
          'DMSans_300Light': DMSans_300Light,
          'DMSans_400Regular': DMSans_400Regular,
          'DMSans_500Medium': DMSans_500Medium,
        })
        console.log(`[boot] fonts loaded (t=${Date.now() - __bootT0}ms)`)
        await initDatabase()
        console.log(`[boot] db initialized (t=${Date.now() - __bootT0}ms)`)
      } catch (e) {
        console.error('Init failed:', e)
      }
      console.log(`[boot] setInitReady(true) (t=${Date.now() - __bootT0}ms)`)
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

/**
 * Mounted under SettingsProvider. Waits for the initial settings load before
 * rendering the routed stack, then drives Stack.Protected guards off the
 * synchronously-readable settings object.
 */
function AuthedTree() {
  const settingsReady = useSettingsReady()
  const settings = useSettings()

  console.log(`[boot] AuthedTree render (t=${Date.now() - __bootT0}ms, settingsReady=${settingsReady})`)

  const onLayoutRootView = useCallback(() => {
    console.log(`[boot] AuthedTree onLayout fired (t=${Date.now() - __bootT0}ms, settingsReady=${settingsReady})`)
    if (settingsReady) {
      console.log(`[boot] hiding splash (t=${Date.now() - __bootT0}ms)`)
      SplashScreen.hideAsync()
    }
  }, [settingsReady])

  if (!settingsReady) return null

  const { hasOnboarded, biometricLock } = settings

  return (
    // backgroundColor here matches the native splash + activity windowBackground
    // so the View paints the same color the moment React first lays it out —
    // closes any black flash gap between splash hide and Stack content paint.
    <View style={{ flex: 1, backgroundColor: '#F5EFE8' }} onLayout={onLayoutRootView}>
      <LockGate initialLocked={biometricLock}>
        <Stack screenOptions={{
          headerShown: false,
          // Defensive: expo-router's native-stack content area defaults to a
          // system color on Android that can render black. Pinning it to our
          // splash color eliminates any flash if the routed screen takes a
          // frame to paint its own background.
          contentStyle: { backgroundColor: '#F5EFE8' },
        }}>
          <Stack.Protected guard={!hasOnboarded}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={hasOnboarded}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(pages)" />
          </Stack.Protected>
          {/* Sheets stay accessible in any state so onboarding can open
              add-tag and friends without flipping hasOnboarded. */}
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
                // 'none' so the screen-level transition doesn't slide the
                // backdrop. AndroidSheetChrome drives the sheet's slide +
                // backdrop fade itself, matching iOS's stationary-backdrop feel.
                animation: 'none' as const,
              },
            })}
          />
        </Stack>
      </LockGate>
    </View>
  )
}
