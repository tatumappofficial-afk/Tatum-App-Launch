import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, gradientPoints, gradients } from '../theme'

export interface ToggleSwitchProps {
  enabled: boolean
  onToggle?: () => void
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <Pressable
    onPress={onToggle}
    accessibilityRole="switch"
    accessibilityState={{ checked: enabled }}
    style={{
      width: 44,
      height: 26,
      borderRadius: 13,
      overflow: 'hidden',
      backgroundColor: enabled ? undefined : colors.surface2,
      shadowColor: '#7C4A5A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: enabled ? 0.3 : 0,
      shadowRadius: 4,
      elevation: enabled ? 2 : 0,
    }}
  >
    {enabled && (
      <LinearGradient
        colors={gradients.primaryCta}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={[StyleSheet.absoluteFill, { borderRadius: 13 }]}
      />
    )}
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.white,
        position: 'absolute',
        top: 3,
        ...(enabled ? { right: 3 } : { left: 3 }),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      }}
    />
  </Pressable>
)
