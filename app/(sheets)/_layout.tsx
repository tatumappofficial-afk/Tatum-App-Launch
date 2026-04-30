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

const DISMISS_DISTANCE_PX = 50
const DISMISS_VELOCITY_PX_PER_S = 500
const SNAP_BACK_DURATION_MS = 100

function AndroidSheetChrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * 0.88

  const translateY = useSharedValue(0)
  const startTranslateY = useSharedValue(0)
  const dismissing = useSharedValue(false)

  const dismiss = () => {
    router.dismiss()
  }

  const panGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .onBegin(() => {
      'worklet'
      if (dismissing.value) return
      startTranslateY.value = translateY.value
    })
    .onUpdate((event) => {
      'worklet'
      if (dismissing.value) return
      const next = startTranslateY.value + event.translationY
      translateY.value = next > 0 ? next : 0
    })
    .onEnd((event) => {
      'worklet'
      if (dismissing.value) return
      const shouldDismiss =
        event.translationY > DISMISS_DISTANCE_PX ||
        event.velocityY > DISMISS_VELOCITY_PX_PER_S
      if (shouldDismiss) {
        dismissing.value = true
        translateY.value = withTiming(sheetHeight, { duration: SNAP_BACK_DURATION_MS })
        runOnJS(dismiss)()
      } else {
        translateY.value = withTiming(0, { duration: SNAP_BACK_DURATION_MS })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={dismiss}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(30,18,12,0.4)' },
        ]}
      />
      <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
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
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>
          <View style={{ flex: 1 }}>{children}</View>
        </Animated.View>
      </View>
    </View>
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
