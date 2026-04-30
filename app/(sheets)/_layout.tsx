import { Stack } from 'expo-router/stack'
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { colors } from '@/lib/theme'

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
}

const DRAG_DISMISS_RATIO = 0.3
const VELOCITY_DISMISS_THRESHOLD = 500

function AndroidSheetChrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * 0.88

  const translateY = useSharedValue(0)
  const dismissing = useSharedValue(false)

  const dismiss = () => {
    router.dismiss()
  }

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (dismissing.value) return
      if (event.translationY > 0) {
        translateY.value = event.translationY
      } else {
        translateY.value = 0
      }
    })
    .onEnd((event) => {
      if (dismissing.value) return
      const shouldDismiss =
        event.translationY > sheetHeight * DRAG_DISMISS_RATIO ||
        event.velocityY > VELOCITY_DISMISS_THRESHOLD
      if (shouldDismiss) {
        dismissing.value = true
        translateY.value = withSpring(sheetHeight, SPRING_CONFIG)
        runOnJS(dismiss)()
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG)
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={dismiss}
        style={{
          flex: 1,
          backgroundColor: 'rgba(30,18,12,0.4)',
        }}
      />
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
  )
}

const styles = StyleSheet.create({
  handleArea: {
    paddingTop: 8,
    paddingBottom: 8,
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
