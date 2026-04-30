import '@/src/utils/crypto-polyfill'
import * as Font from 'expo-font'
import { useKeepAwake } from 'expo-keep-awake'
import { Stack } from 'expo-router/stack'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display'
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans'
import { initDatabase } from '@/src/db'

SplashScreen.preventAutoHideAsync()

// Cap accessibility font scaling app-wide so layouts don't break at extreme sizes.
// See "Tori's Vault/Expo Best Practices/Typography.md".
;(Text as any).defaultProps = (Text as any).defaultProps || {}
;(Text as any).defaultProps.maxFontSizeMultiplier = 1.5

export default function RootLayout() {
  useKeepAwake()
  const [ready, setReady] = useState(false)

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
      } catch (e) {
        console.error('Init failed:', e)
      }
      setReady(true)
    }
    init()
  }, [])

  const onLayoutRootView = useCallback(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#F5EFE8' }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
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
                    animation: 'slide_from_bottom' as const,
                  },
                })}
              />
              <Stack.Screen name="(pages)" />
            </Stack>
          </KeyboardProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  )
}
