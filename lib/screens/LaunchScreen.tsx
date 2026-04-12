import React from 'react'
import { View, Text } from 'react-native'
import { colors, gradientStyle } from '../theme'

export const LaunchScreen: React.FC = () => (
  <View style={{
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  }}>
    {/* Ambient glow behind icon */}
    <View style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: '-50%' }, { translateY: '-58%' }],
      width: 280,
      height: 280,
      ...gradientStyle('radial-gradient(circle, rgba(192,120,88,0.12) 0%, transparent 65%)'),
    }} />

    {/* App icon */}
    <View style={{
      width: 100,
      height: 100,
      borderRadius: 24,
      ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 12px 36px rgba(124,74,90,0.3), 0 4px 12px rgba(61,43,37,0.15)',
    }}>
      <Text style={{
        fontSize: 24,
        color: colors.white,
        lineHeight: 24,
        position: 'relative',
        zIndex: 1,
      }}>&#10022;</Text>
    </View>
  </View>
)
