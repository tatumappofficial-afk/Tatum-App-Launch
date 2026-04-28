import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, gradientPoints, gradients } from '../theme'

export interface SuccessOverlayProps {
  visible: boolean
  label: string
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ visible, label }) => {
  if (!visible) return null
  return (
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
        backgroundColor: 'rgba(61,43,37,0.25)',
      }}
    >
      <View style={{
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
      }}>
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
            style={StyleSheet.absoluteFill}
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
      </View>
    </View>
  )
}
