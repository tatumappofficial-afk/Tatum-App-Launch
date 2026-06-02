import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints, gradients } from '../theme'

export interface YearDropdownProps {
  selectedYear: number
  /** Inclusive minimum year (first-encounter year). */
  minYear: number
  /** Inclusive maximum year (current year). */
  maxYear: number
  onSelect: (year: number) => void
}

export const YearDropdown: React.FC<YearDropdownProps> = ({ selectedYear, minYear, maxYear, onSelect }) => {
  const years: number[] = []
  for (let y = maxYear; y >= minYear; y--) years.push(y)

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.18)',
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#3D2B25',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 48,
        elevation: 14,
        maxHeight: 280,
      }}
    >
      <View
        style={{
          paddingTop: 14,
          paddingHorizontal: 16,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(160,100,80,0.1)',
        }}
      >
        <Text
          style={{
            fontFamily: font('playfair', '600'),
            fontSize: 16,
            color: colors.ink,
            textAlign: 'center',
          }}
        >
          Pick a year
        </Text>
      </View>

      <ScrollView style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        {years.map((y) => {
          const isSelected = y === selectedYear
          return (
            <Pressable
              key={y}
              onPress={() => onSelect(y)}
              accessibilityRole="button"
              accessibilityLabel={String(y)}
              accessibilityState={{ selected: isSelected }}
              style={{
                height: 38,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginVertical: 2,
                backgroundColor: isSelected ? undefined : 'transparent',
              }}
            >
              {isSelected && (
                <LinearGradient
                  colors={gradients.primaryCta}
                  start={gradientPoints.diagonal.start}
                  end={gradientPoints.diagonal.end}
                  style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                />
              )}
              <Text
                style={{
                  fontFamily: font('dmSans', isSelected ? '500' : '400'),
                  fontSize: 16,
                  color: isSelected ? colors.white : colors.ink,
                  letterSpacing: 0.5,
                }}
              >
                {y}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
