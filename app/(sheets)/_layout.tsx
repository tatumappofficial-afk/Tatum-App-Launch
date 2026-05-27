import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { Stack } from 'expo-router/stack'
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { colors } from '@/lib/theme'

// Dismiss is purely position-based: you must pull the sheet down past
// `DISMISS_DISTANCE_RATIO` of its own height before release commits. No
// velocity-based shortcut — a fast flick alone won't dismiss because users
// were finding it too sensitive. The threshold scales with sheet size so it
// feels consistent across phones.
const DISMISS_DISTANCE_RATIO = 1 / 3
const SNAP_BACK_DURATION_MS = 100
// Backdrop dim level when the sheet is fully open. Animated via opacity, never
// via translate — see SheetDismissContext docs.
const MAX_BACKDROP_OPACITY = 0.4
// Sheet slide-in / slide-out timing.
const OPEN_DURATION_MS = 250
const DISMISS_DURATION_MS = 200

// Ref to the Android sheet's drag-to-dismiss pan gesture. Horizontal ScrollViews
// inside a sheet attach this ref to their `simultaneousHandlers` prop so the
// scroll's native horizontal pan and the dismiss gesture can both track touches
// from the first pixel — without the parent pan claiming the touch exclusively
// during its activation window. iOS uses a native UIKit sheet and never creates
// this ref, so the context returns `null` and child ScrollViews skip the prop.
const SheetPanGestureContext = createContext<React.MutableRefObject<unknown> | null>(null)

// Programmatic dismiss that runs the chrome's slide-out + backdrop-fade-out
// animation, then calls `router.dismiss`. Close buttons inside sheets must use
// this hook instead of `router.dismiss` directly, otherwise the sheet vanishes
// instantly (because we set `animation: 'none'` at the screen level so the
// backdrop doesn't slide). iOS doesn't render the chrome — the context is null
// there, and the hook falls back to native `router.dismiss`.
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

// How dominant the vertical drag has to be over horizontal to count as a dismiss.
// Higher = more deliberate vertical swipe required.
const VERTICAL_DOMINANCE_RATIO = 1.5
// How much horizontal motion locks us into "definitely horizontal scroll" mode.
const HORIZONTAL_LOCKIN_PX = 6
// Minimum downward motion before activating dismiss.
const ACTIVATION_OFFSET_PX_LOCAL = 12

function AndroidSheetChrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * 0.88
  const dismissDistance = sheetHeight * DISMISS_DISTANCE_RATIO

  // Sheet starts off-screen below. useEffect below animates it in. Backdrop
  // opacity is derived from translateY so it fades in/out automatically.
  const translateY = useSharedValue(sheetHeight)
  const startTranslateY = useSharedValue(0)
  const activationTranslationY = useSharedValue(0)
  // Touch start coords for direction inspection in onTouchesMove.
  const touchStartX = useSharedValue(0)
  const touchStartY = useSharedValue(0)
  // Once activated (vertical commits), suppress the horizontal-fail check so
  // sideways drift during a pull-down doesn't kill the gesture mid-drag.
  // Mirrors the symmetric lock-in we use for horizontal scrolls.
  const verticalLocked = useSharedValue(false)
  const panRef = useRef<unknown>(null)
  const dismissing = useSharedValue(false)

  // Mount: slide the sheet up; backdrop fades in automatically via its
  // translateY-derived opacity.
  useEffect(() => {
    translateY.value = withTiming(0, { duration: OPEN_DURATION_MS })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stable JS-thread function for runOnJS from worklet callbacks.
  const callRouterDismiss = useCallback(() => {
    router.dismiss()
  }, [router])

  // Programmatic dismiss: run the slide-out + fade-out, then unmount. Shared
  // between the backdrop tap and any child component that calls useSheetDismiss().
  const dismissWithAnimation = useCallback(() => {
    if (dismissing.value) return
    dismissing.value = true
    translateY.value = withTiming(
      sheetHeight,
      { duration: DISMISS_DURATION_MS },
      (finished) => {
        if (finished) runOnJS(callRouterDismiss)()
      },
    )
  }, [callRouterDismiss, dismissing, sheetHeight, translateY])

  // Manual activation: we don't use `activeOffsetY`/`failOffsetX`. Instead we
  // inspect direction in `onTouchesMove` and explicitly activate/fail. This is
  // the only way to (a) lock in horizontal scroll once it's started, and
  // (b) require vertical to clearly dominate over horizontal before triggering
  // the dismiss. `failOffsetX` alone wasn't enough on Android — the parent pan
  // would still claim touches mid-gesture during diagonal swipes.
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
      // Once we've committed to vertical, stop inspecting direction — horizontal
      // drift mid-pull shouldn't fail the gesture and snap the sheet back.
      if (verticalLocked.value) return
      const touch = event.allTouches[0]
      if (!touch) return
      const dx = touch.x - touchStartX.value
      const dy = touch.y - touchStartY.value
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      // Horizontal motion has committed first: fail permanently for this touch.
      // Once failed, the gesture cannot reactivate until the finger lifts — so
      // any vertical drift mid-scroll won't trigger the dismiss.
      if (absDx > HORIZONTAL_LOCKIN_PX && absDx > absDy) {
        state.fail()
        return
      }
      // Downward motion clearly dominates over horizontal: activate dismiss and
      // lock the gesture so subsequent horizontal drift doesn't fail it.
      if (dy > ACTIVATION_OFFSET_PX_LOCAL && dy > absDx * VERTICAL_DOMINANCE_RATIO) {
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
      // Pure position dismiss. If the user is actively pulling back up at
      // release, respect that intent and snap back; otherwise check whether
      // they pulled past the sheet-relative threshold.
      const movingUp = event.velocityY < 0
      const shouldDismiss = !movingUp && delta > dismissDistance
      if (shouldDismiss) {
        dismissing.value = true
        translateY.value = withTiming(
          sheetHeight,
          { duration: DISMISS_DURATION_MS },
          (finished) => {
            if (finished) runOnJS(callRouterDismiss)()
          },
        )
      } else {
        translateY.value = withTiming(0, { duration: SNAP_BACK_DURATION_MS })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  // Backdrop opacity is derived from translateY: fully opaque (MAX_BACKDROP_OPACITY)
  // when the sheet is at its open position, fully transparent when off-screen.
  // This handles the open animation, the live drag, the snap-back, AND the
  // programmatic dismiss in one declarative expression.
  const backdropStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.max(0, translateY.value / sheetHeight))
    return { opacity: MAX_BACKDROP_OPACITY * (1 - progress) }
  })

  return (
    <SheetPanGestureContext.Provider value={panRef}>
      <SheetDismissContext.Provider value={dismissWithAnimation}>
        <View style={{ flex: 1 }}>
          {/* Backdrop: stationary, opacity driven by sheet position. Tap to
              dismiss runs the same animation as the pan-down. */}
          <AnimatedPressable
            onPress={dismissWithAnimation}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(30,18,12,1)' },
              backdropStyle,
            ]}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
            {/* Body-wide drag-to-dismiss. The pan's ref is exposed via
                SheetPanGestureContext so nested horizontal ScrollViews can mark
                themselves simultaneous with this gesture — both track touches
                from the first pixel and direction-priority resolves naturally. */}
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
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }} />
    </AndroidSheetChrome>
  )
}
