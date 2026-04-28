import React, { useRef, useState, useCallback } from 'react'
import { View, Text, PanResponder, type LayoutChangeEvent } from 'react-native'
import { colors, font, gradientStyle } from '../theme'

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setDragging(true)
        const stepped = clampToStep(evt.nativeEvent.pageX)
        setDragValue(stepped)
        onChange?.(stepped)
      },
      onPanResponderMove: (evt) => {
        const stepped = clampToStep(evt.nativeEvent.pageX)
        setDragValue(stepped)
        onChange?.(stepped)
      },
      onPanResponderRelease: () => {
        setDragging(false)
      },
      onPanResponderTerminate: () => {
        setDragging(false)
      },
    }),
  ).current

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout
    // Measure absolute position on screen for accurate pageX calculation
    e.target && (e.target as any).measureInWindow?.((x: number) => {
      trackLayout.current = { x, width }
    })
    // Fallback if measureInWindow isn't available
    trackLayout.current = { ...trackLayout.current, width }
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
        onLayout={handleLayout}
        {...panResponder.panHandlers}
        style={{
          position: 'relative',
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
            <View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct}%`,
              ...gradientStyle('linear-gradient(to right, #C07858, #B07080)'),
              borderRadius: TRACK_HEIGHT / 2,
            }} />
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
          boxShadow: '0 2px 8px rgba(124,74,90,0.3)',
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
