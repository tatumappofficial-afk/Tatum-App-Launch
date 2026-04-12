import React from 'react'
import { Pressable, View } from 'react-native'
import { colors, gradientStyle } from '../theme'

export interface ToggleSwitchProps {
  enabled: boolean
  onToggle?: () => void
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <Pressable
    onPress={onToggle}
    style={{
      width: 44,
      height: 26,
      borderRadius: 13,
      ...(enabled
        ? gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)')
        : { backgroundColor: colors.surface2 }),
      flexShrink: 0,
      boxShadow: enabled ? '0 1px 4px rgba(124,74,90,0.3)' : undefined,
    }}
  >
    <View style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.white,
      position: 'absolute',
      top: 3,
      ...(enabled ? { right: 3 } : { left: 3 }),
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }} />
  </Pressable>
)
