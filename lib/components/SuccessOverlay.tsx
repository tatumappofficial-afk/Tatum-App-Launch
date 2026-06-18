import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { colors, font, gradientPoints, gradients, SCRIM_COLOR, SCRIM_OPACITY } from '../theme'
import { AvatarCircle } from './AvatarCircle'

const AnimatedPath = Animated.createAnimatedComponent(Path)

// The check path "M5 12 L10 17 L19 8" measures ~19.8 units; round up so the
// dash fully hides the stroke at the start and reveals it cleanly at the end.
const CHECK_PATH = 'M5 12 L10 17 L19 8'
const CHECK_LENGTH = 22

export interface SuccessOverlayDetails {
  // Optional so partner-less logs (e.g. Period) can show emoji + date without
  // a partner avatar.
  partnerInitials?: string
  partnerGradient?: string
  partnerName?: string
  emoji: string
  dateLabel: string
}

export interface SuccessOverlayProps {
  visible: boolean
  label: string
  details?: SuccessOverlayDetails
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ visible, label, details }) => {
  // Keep the component mounted across the exit so the fade/scale animates out.
  const [mounted, setMounted] = useState(visible)
  // Hold the displayed content steady through the exit animation. If we read
  // `label` / `details` directly from props, the parent typically clears them
  // at the same moment it flips `visible` to false — the card would lose its
  // details for the ~150ms the exit is animating, visually flickering from
  // "rich" to "label only" before fading out.
  const [displayedLabel, setDisplayedLabel] = useState(label)
  const [displayedDetails, setDisplayedDetails] = useState(details)
  const backdropOpacity = useSharedValue(0)
  const cardOpacity = useSharedValue(0)
  const cardScale = useSharedValue(0.85)
  // Checkmark: the green disc pops in (scale), then the tick strokes itself on
  // (dash offset runs CHECK_LENGTH → 0). Both reset on each show so it replays.
  const circleScale = useSharedValue(0.6)
  const checkDraw = useSharedValue(CHECK_LENGTH)

  useEffect(() => {
    if (visible) {
      // Refresh content only when becoming visible (or when it changes while
      // already visible). Never refresh while exiting — that's where the flicker
      // came from.
      setDisplayedLabel(label)
      setDisplayedDetails(details)
      setMounted(true)
      // Ramp the scrim straight to its settled dim level (SCRIM_OPACITY) so the
      // darkness only ever increases — no overshoot, no second layer.
      backdropOpacity.value = withTiming(SCRIM_OPACITY, { duration: 180, easing: Easing.out(Easing.quad) })
      cardOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) })
      cardScale.value = withSpring(1, { damping: 16, stiffness: 180, mass: 0.6 })
      // Reset the check to its undrawn state, then play: disc pop, then tick.
      circleScale.value = 0.6
      checkDraw.value = CHECK_LENGTH
      circleScale.value = withSpring(1, { damping: 11, stiffness: 220, mass: 0.5 })
      checkDraw.value = withDelay(150, withTiming(0, { duration: 340, easing: Easing.out(Easing.cubic) }))
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) })
      cardScale.value = withTiming(0.92, { duration: 150, easing: Easing.in(Easing.quad) })
      cardOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(setMounted)(false)
      })
    }
  }, [visible, label, details, backdropOpacity, cardOpacity, cardScale, circleScale, checkDraw])

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }))
  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: circleScale.value }] }))
  const checkProps = useAnimatedProps(() => ({ strokeDashoffset: checkDraw.value }))

  if (!mounted) return null
  return (
    // Static wrapper: it carries the zIndex + elevation that keep the overlay
    // above the calendar's elevated cells on Android. Because its opacity never
    // animates, that elevation can't trigger the Android "animate opacity from 0
    // on an elevated view" flash. The animated backdrop and card below therefore
    // carry NO elevation — that flash was the dark "pop" before the scrim
    // settled. Backdrop + card are siblings (not parent→child) so the scrim can
    // dim to SCRIM_OPACITY without also fading the card.
    <View
      pointerEvents="auto"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        elevation: 1000,
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: SCRIM_COLOR }, backdropStyle]}
      />
      <Animated.View
        style={[
          {
            minWidth: 200,
            paddingVertical: 22,
            paddingHorizontal: 28,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: 'center',
            gap: 12,
            shadowColor: '#3D2B25',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 32,
          },
          cardStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              shadowColor: '#5A8060',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
            },
            circleStyle,
          ]}
        >
          <LinearGradient
            colors={gradients.positive}
            start={gradientPoints.diagonal.start}
            end={gradientPoints.diagonal.end}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          />
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <AnimatedPath
              d={CHECK_PATH}
              stroke={colors.white}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={CHECK_LENGTH}
              animatedProps={checkProps}
            />
          </Svg>
        </Animated.View>
        <Text
          style={{
            fontFamily: font('playfair', '600'),
            fontSize: 16,
            color: colors.ink,
          }}
        >
          {displayedLabel}
        </Text>
        {displayedDetails && (
          <View style={{ alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {displayedDetails.partnerInitials && displayedDetails.partnerGradient && (
                <AvatarCircle
                  initials={displayedDetails.partnerInitials}
                  gradient={displayedDetails.partnerGradient}
                  size={40}
                  borderWidth={2}
                />
              )}
              <Text style={{ fontSize: 28 }}>{displayedDetails.emoji}</Text>
            </View>
            <Text
              style={{
                fontFamily: font('dmSans', '400'),
                fontSize: 13,
                color: colors.stone,
              }}
            >
              {displayedDetails.dateLabel}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  )
}
