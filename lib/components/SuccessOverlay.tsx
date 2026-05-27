import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, gradientPoints, gradients } from '../theme'
import { AvatarCircle } from './AvatarCircle'

export interface SuccessOverlayDetails {
  partnerInitials: string
  partnerGradient: string
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
  const backdropOpacity = useSharedValue(0)
  const cardOpacity = useSharedValue(0)
  const cardScale = useSharedValue(0.85)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      backdropOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) })
      cardOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) })
      cardScale.value = withSpring(1, { damping: 16, stiffness: 180, mass: 0.6 })
    } else {
      backdropOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) })
      cardScale.value = withTiming(0.92, { duration: 150, easing: Easing.in(Easing.quad) })
      cardOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(setMounted)(false)
      })
    }
  }, [visible, backdropOpacity, cardOpacity, cardScale])

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }))

  if (!mounted) return null
  return (
    <Animated.View
      pointerEvents="auto"
      style={[{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(61,43,37,0.25)',
        zIndex: 1000,
        elevation: 1000,
      }, backdropStyle]}
    >
      <Animated.View style={[{
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
        elevation: 12,
      }, cardStyle]}>
        <View style={{
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
          elevation: 4,
        }}>
          <LinearGradient
            colors={gradients.positive}
            start={gradientPoints.diagonal.start}
            end={gradientPoints.diagonal.end}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          />
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="5 12 10 17 19 8" />
          </Svg>
        </View>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 16,
          color: colors.ink,
        }}>{label}</Text>
        {details && (
          <View style={{ alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AvatarCircle
                initials={details.partnerInitials}
                gradient={details.partnerGradient}
                size={40}
                borderWidth={2}
              />
              <Text style={{ fontSize: 28 }}>{details.emoji}</Text>
            </View>
            <Text style={{
              fontFamily: font('dmSans', '400'),
              fontSize: 13,
              color: colors.stone,
            }}>{details.dateLabel}</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  )
}
