import '@/src/utils/crypto-polyfill'
import * as Font from 'expo-font'
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
import { initDatabase, getSettings } from '@/src/db'
import { LockGate } from '@/lib/components/LockGate'

const __bootT0 = Date.now()
console.log(`[boot] _layout.tsx module evaluated (t=0ms)`)

SplashScreen.preventAutoHideAsync()

// Cap accessibility font scaling app-wide so layouts don't break at extreme sizes.
// See "Tori's Vault/Expo Best Practices/Typography.md".
;(Text as any).defaultProps = (Text as any).defaultProps || {}
;(Text as any).defaultProps.maxFontSizeMultiplier = 1.5

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [biometricLock, setBiometricLock] = useState(false)

  console.log(`[boot] RootLayout render (t=${Date.now() - __bootT0}ms, ready=${ready}, hasOnboarded=${hasOnboarded}, biometricLock=${biometricLock})`)

  useEffect(() => {
    async function init() {
      try {
        // Load fonts explicitly with Font.loadAsync
        await Font.loadAsync({
          'PlayfairDisplay_400Regular': PlayfairDisplay_400Regular,
          'PlayfairDisplay_400Regular_Italic': PlayfairDisplay_400Regular_Italic,
          'PlayfairDisplay_600SemiBold': PlayfairDisplay_600SemiBold,
          'PlayfairDisplay_700Bold': PlayfairDisplay_700Bold,
          'DMSans_300Light': DMSans_300Light,
          'DMSans_400Regular': DMSans_400Regular,
          'DMSans_500Medium': DMSans_500Medium,
        })
        console.log('Fonts loaded. Testing: PlayfairDisplay_700Bold loaded =', Font.isLoaded('PlayfairDisplay_700Bold'))

        await initDatabase()
        const settings = await getSettings()
        console.log('[layout] init read settings:', { hasOnboarded: settings.hasOnboarded, biometricLock: settings.biometricLock })
        setHasOnboarded(settings.hasOnboarded)
        setBiometricLock(settings.biometricLock)
      } catch (e) {
        console.error('Init failed:', e)
      }
      setReady(true)
    }
    init()
  }, [])

  const onLayoutRootView = useCallback(() => {
    if (ready) {
      console.log(`[boot] hiding splash (t=${Date.now() - __bootT0}ms)`)
      SplashScreen.hideAsync()
    }
  }, [ready])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#F5EFE8' }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <DropProvider>
            <LockGate initialLocked={biometricLock}>
            <Stack screenOptions={{ headerShown: false }}>
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
            </DropProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  )
}
