import React, { useRef } from 'react'
import { View, Text, Pressable } from 'react-native'
import Slider from '@expo/ui/community/slider'
import * as Haptics from 'expo-haptics'
import { colors, font } from '../theme'

interface RatingSliderProps {
  value: number       // 0-10 (0 = no rating)
  onChange?: (value: number) => void
}

const STEPS = 10

export const RatingSlider: React.FC<RatingSliderProps> = ({
  value,
  onChange,
}) => {
  const lastSteppedRef = useRef(value)

  function emitStep(next: number) {
    const clamped = Math.max(0, Math.min(STEPS, Math.round(next)))
    if (clamped !== lastSteppedRef.current) {
      Haptics.selectionAsync()
      lastSteppedRef.current = clamped
      onChange?.(clamped)
    }
  }

  const isNone = value === 0

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
            }}>{value}</Text>
            <Text style={{ fontSize: 14, fontWeight: '300', color: colors.stone }}> / 10</Text>
          </>
        )}
      </View>

      {/* Native slider — owns its own gesture so parent scroll can't steal it */}
      <View style={{ marginBottom: 4 }}>
        <Slider
          value={value}
          minimumValue={0}
          maximumValue={STEPS}
          step={1}
          minimumTrackTintColor={colors.terra}
          onValueChange={emitStep}
        />
      </View>

      {/* Step labels — tap to jump */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {['None', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((label, i) => (
          <Pressable
            key={label}
            onPress={() => {
              lastSteppedRef.current = i
              onChange?.(i)
            }}
            hitSlop={6}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: value === i ? '600' : '300',
              color: value === i ? colors.terra : '#C4B0A0',
            }}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
