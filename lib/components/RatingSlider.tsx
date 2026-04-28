import React, { useRef, useState, useCallback } from 'react'
import { View, Text, PanResponder, type LayoutChangeEvent } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { colors, font, gradientPoints, gradients, shadows } from '../theme'

interface RatingSliderProps {
  value: number       // 0-10 (0 = no rating)
  onChange?: (value: number) => void
}

const THUMB_SIZE = 22
const TRACK_HEIGHT = 5
const STEPS = 10

export const RatingSlider: React.FC<RatingSliderProps> = ({
  value,
  onChange,
}) => {
  const trackLayout = useRef({ x: 0, width: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragValue, setDragValue] = useState(value)

  const displayValue = dragging ? dragValue : value
  const pct = (displayValue / STEPS) * 100

  function clampToStep(pageX: number): number {
    const { x, width } = trackLayout.current
    if (width <= 0) return value
    const localX = pageX - x
    const ratio = Math.max(0, Math.min(1, localX / width))
    return Math.round(ratio * STEPS)
  }

  const lastSteppedRef = useRef(value)

  const emitStep = (next: number) => {
    setDragValue(next)
    if (next !== lastSteppedRef.current) {
      Haptics.selectionAsync()
      lastSteppedRef.current = next
    }
    onChange?.(next)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setDragging(true)
        emitStep(clampToStep(evt.nativeEvent.pageX))
      },
      onPanResponderMove: (evt) => {
        emitStep(clampToStep(evt.nativeEvent.pageX))
      },
      onPanResponderRelease: () => {
        setDragging(false)
      },
      onPanResponderTerminate: () => {
        setDragging(false)
      },
    }),
  ).current

  const trackRef = useRef<View>(null)
  const handleLayout = useCallback((_e: LayoutChangeEvent) => {
    trackRef.current?.measureInWindow((x, _y, width) => {
      trackLayout.current = { x, width }
    })
  }, [])

  const isNone = displayValue === 0

  return (
    <View>
      {/* Value display */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        {isNone ? (
          <Text style={{
            fontFamily: font('dmSans', '400'),
            fontSize: 16,
            color: colors.stone,
            fontStyle: 'italic',
          }}>No rating</Text>
        ) : (
          <>
            <Text style={{
              fontFamily: font('playfair', '700'),
              fontSize: 22,
              color: colors.terra,
            }}>{displayValue}</Text>
            <Text style={{ fontSize: 11, fontWeight: '300', color: colors.stone }}> / 10</Text>
          </>
        )}
      </View>

      {/* Track + thumb */}
      <View
        ref={trackRef}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        style={{
          height: THUMB_SIZE,
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        {/* Background track */}
        <View style={{
          height: TRACK_HEIGHT,
          backgroundColor: colors.surface2,
          borderRadius: TRACK_HEIGHT / 2,
        }}>
          {/* Filled track */}
          {pct > 0 && (
            <LinearGradient
              colors={gradients.activityBar}
              start={gradientPoints.horizontal.start}
              end={gradientPoints.horizontal.end}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${pct}%`,
                borderRadius: TRACK_HEIGHT / 2,
              }}
            />
          )}
        </View>

        {/* Thumb — always visible */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: `${pct}%`,
          marginLeft: -(THUMB_SIZE / 2),
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: colors.white,
          borderWidth: 2.5,
          borderColor: isNone ? colors.stone : colors.terra,
          ...shadows.activeTag,
        }} />
      </View>

      {/* Step labels */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {['None', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((label, i) => (
          <Text
            key={label}
            onPress={() => onChange?.(i)}
            style={{
              fontSize: 8.5,
              fontWeight: displayValue === i ? '600' : '300',
              color: displayValue === i ? colors.terra : '#C4B0A0',
            }}
          >{label}</Text>
        ))}
      </View>
    </View>
  )
}
