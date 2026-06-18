import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { Stack } from 'expo-router/stack'
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { colors, SCRIM_COLOR, SCRIM_OPACITY } from '@/lib/theme'

// Dismiss after the sheet has been pulled down past this fraction of its own height.
const DISMISS_DISTANCE_RATIO = 1 / 4
const SNAP_BACK_DURATION_MS = 100
// Settled dim level for the sheet backdrop — shared with the success overlay
// (see lib/theme SCRIM_*) so the two dimmed layers match exactly.
const MAX_BACKDROP_OPACITY = SCRIM_OPACITY
const OPEN_DURATION_MS = 250
const DISMISS_DURATION_MS = 200
// Direction thresholds for the manual-activation pan.
const VERTICAL_DOMINANCE_RATIO = 1.5
const HORIZONTAL_LOCKIN_PX = 6
const ACTIVATION_OFFSET_PX = 12

// Nested horizontal ScrollViews attach this ref to their `simultaneousHandlers`
// prop so the scroll and the sheet's pan can both track touches from pixel
// zero. iOS uses a native sheet and never sets this — context returns null.
const SheetPanGestureContext = createContext<React.MutableRefObject<unknown> | null>(null)

// Animated dismiss that runs the slide-out + backdrop fade-out before calling
// router.dismiss. Close buttons inside sheets use this hook instead of calling
// router.dismiss directly so they get the same exit animation as the pan.
const SheetDismissContext = createContext<(() => void) | null>(null)

export function useSheetPanGesture() {
  return useContext(SheetPanGestureContext)
}

export function useSheetDismiss() {
  const dismissFn = useContext(SheetDismissContext)
  const router = useRouter()
  return dismissFn ?? (() => router.dismiss())
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function AndroidSheetChrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * 0.88
  const dismissDistance = sheetHeight * DISMISS_DISTANCE_RATIO

  const translateY = useSharedValue(sheetHeight)
  const startTranslateY = useSharedValue(0)
  const activationTranslationY = useSharedValue(0)
  const touchStartX = useSharedValue(0)
  const touchStartY = useSharedValue(0)
  // Set true once vertical commits, so horizontal drift can't fail the gesture mid-pull.
  const verticalLocked = useSharedValue(false)
  const panRef = useRef<unknown>(null)
  const dismissing = useSharedValue(false)

  useEffect(() => {
    translateY.value = withTiming(0, { duration: OPEN_DURATION_MS })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const callRouterDismiss = useCallback(() => {
    router.dismiss()
  }, [router])

  const dismissWithAnimation = useCallback(() => {
    if (dismissing.value) return
    dismissing.value = true
    translateY.value = withTiming(sheetHeight, { duration: DISMISS_DURATION_MS }, (finished) => {
      if (finished) runOnJS(callRouterDismiss)()
    })
  }, [callRouterDismiss, dismissing, sheetHeight, translateY])

  // Manual activation lets us inspect dx vs dy directly and decide per-touch
  // whether to activate (vertical dominates) or fail (horizontal commits first).
  // `failOffsetX` on a standard pan wasn't enough on Android — the parent pan
  // would still claim mid-gesture during diagonal swipes.
  const panGesture = Gesture.Pan()
    .withRef(panRef as React.MutableRefObject<any>)
    .manualActivation(true)
    .shouldCancelWhenOutside(false)
    .onTouchesDown((event) => {
      'worklet'
      const touch = event.allTouches[0]
      if (!touch) return
      touchStartX.value = touch.x
      touchStartY.value = touch.y
      verticalLocked.value = false
    })
    .onTouchesMove((event, state) => {
      'worklet'
      if (verticalLocked.value) return
      const touch = event.allTouches[0]
      if (!touch) return
      const dx = touch.x - touchStartX.value
      const dy = touch.y - touchStartY.value
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (absDx > HORIZONTAL_LOCKIN_PX && absDx > absDy) {
        state.fail()
        return
      }
      if (dy > ACTIVATION_OFFSET_PX && dy > absDx * VERTICAL_DOMINANCE_RATIO) {
        verticalLocked.value = true
        state.activate()
      }
    })
    .onStart((event) => {
      'worklet'
      if (dismissing.value) return
      startTranslateY.value = translateY.value
      activationTranslationY.value = event.translationY
    })
    .onUpdate((event) => {
      'worklet'
      if (dismissing.value) return
      const delta = event.translationY - activationTranslationY.value
      const next = startTranslateY.value + delta
      translateY.value = next > 0 ? next : 0
    })
    .onEnd((event) => {
      'worklet'
      if (dismissing.value) return
      const delta = event.translationY - activationTranslationY.value
      // Upward velocity at release means the user reversed mid-pull — respect that and snap back.
      const movingUp = event.velocityY < 0
      const shouldDismiss = !movingUp && delta > dismissDistance
      if (shouldDismiss) {
        dismissing.value = true
        translateY.value = withTiming(sheetHeight, { duration: DISMISS_DURATION_MS }, (finished) => {
          if (finished) runOnJS(callRouterDismiss)()
        })
      } else {
        translateY.value = withTiming(0, { duration: SNAP_BACK_DURATION_MS })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  // Backdrop fades with the sheet's position — covers open, drag, snap-back, and dismiss in one expression.
  const backdropStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.max(0, translateY.value / sheetHeight))
    return { opacity: MAX_BACKDROP_OPACITY * (1 - progress) }
  })

  return (
    <SheetPanGestureContext.Provider value={panRef}>
      <SheetDismissContext.Provider value={dismissWithAnimation}>
        <View style={{ flex: 1 }}>
          <AnimatedPressable
            onPress={dismissWithAnimation}
            style={[StyleSheet.absoluteFill, { backgroundColor: SCRIM_COLOR }, backdropStyle]}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  {
                    height: sheetHeight,
                    backgroundColor: colors.warmSand,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    overflow: 'hidden',
                  },
                  sheetStyle,
                ]}
              >
                <View style={styles.handleArea}>
                  <View style={styles.handle} />
                </View>
                <View style={{ flex: 1 }}>{children}</View>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>
      </SheetDismissContext.Provider>
    </SheetPanGestureContext.Provider>
  )
}

const styles = StyleSheet.create({
  handleArea: {
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(30,18,12,0.25)',
  },
})

export default function SheetsLayout() {
  if (Platform.OS === 'ios') {
    return <Stack screenOptions={{ headerShown: false }} />
  }

  return (
    <AndroidSheetChrome>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </AndroidSheetChrome>
  )
}
