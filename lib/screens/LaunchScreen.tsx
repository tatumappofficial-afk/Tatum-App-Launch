import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, gradientPoints, gradients } from '../theme'
import { RadialGlow } from './shared/DecorativeGlow'

const GLOW_SIZE = 280

export const LaunchScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: colors.warmSand,
    }}
  >
    {/* Ambient glow behind icon */}
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -GLOW_SIZE / 2,
        marginTop: -GLOW_SIZE / 2 - GLOW_SIZE * 0.08,
        width: GLOW_SIZE,
        height: GLOW_SIZE,
      }}
    >
      <RadialGlow size={GLOW_SIZE} color="rgb(192,120,88)" opacity={0.12} falloff={65} />
    </View>

    {/* App icon */}
    <View
      style={{
        width: 100,
        height: 100,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#7C4A5A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 36,
        elevation: 12,
      }}
    >
      <LinearGradient
        colors={gradients.primaryCta}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
      />
      <Text
        style={{
          fontSize: 24,
          color: colors.white,
          lineHeight: 24,
        }}
      >
        &#10022;
      </Text>
    </View>
  </View>
)
