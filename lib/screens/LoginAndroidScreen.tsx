import React from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Rect } from 'react-native-svg'
import { colors, font, gradientPoints } from '../theme'
import { RadialGlow } from './shared/DecorativeGlow'

const GoogleLogo: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
)

export const LoginAndroidScreen: React.FC = () => (
  <View style={{
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  }}>
    {/* Ambient glows */}
    <View pointerEvents="none" style={{ position: 'absolute', top: -60, left: '50%', marginLeft: -160, width: 320, height: 320 }}>
      <RadialGlow size={320} color="rgb(192,120,88)" opacity={0.13} falloff={65} />
    </View>
    <View pointerEvents="none" style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200 }}>
      <RadialGlow size={200} color="rgb(124,74,90)" opacity={0.09} falloff={70} />
    </View>

    {/* Android punch-hole camera */}
    <View style={{
      width: 12,
      height: 12,
      backgroundColor: 'rgba(61,43,37,0.12)',
      borderRadius: 6,
      position: 'absolute',
      top: 14,
      left: '50%',
      marginLeft: -6,
    }} />

    {/* Android status bar */}
    <View style={{
      height: 44,
      paddingTop: 12,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Text style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 13,
        color: colors.stone,
      }}>9:41</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
          <Path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill={colors.stone} />
          <Path d="M4.5 7.5C5.6 6.4 6.7 5.8 8 5.8s2.4.6 3.5 1.7" stroke={colors.stone} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          <Path d="M2 5C3.8 3.2 5.8 2.2 8 2.2s4.2 1 6 2.8" stroke={colors.stone} strokeWidth={1.4} strokeLinecap="round" fill="none" />
        </Svg>
        <Svg width={16} height={12} viewBox="0 0 16 12" fill={colors.stone}>
          <Rect x={0} y={8} width={3} height={4} rx={0.5} fill={colors.stone} />
          <Rect x={4.5} y={5} width={3} height={7} rx={0.5} fill={colors.stone} />
          <Rect x={9} y={2} width={3} height={10} rx={0.5} fill={colors.stone} />
          <Rect x={13.5} y={0} width={3} height={12} rx={0.5} fill={colors.stone} />
        </Svg>
      </View>
    </View>

    {/* Main content */}
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 36,
    }}>
      {/* Logo group */}
      <View style={{ alignItems: 'center', marginTop: 48 }}>
        {/* App icon */}
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          overflow: 'hidden',
          shadowColor: '#7C4A5A',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.3,
          shadowRadius: 40,
          elevation: 12,
        }}>
          <LinearGradient
            colors={['#C98060', '#7C4A5A']}
            start={gradientPoints.steepDiagonal.start}
            end={gradientPoints.steepDiagonal.end}
            style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
          />
          <Text style={{ fontSize: 36, color: colors.white, lineHeight: 36 }}>&#10022;</Text>
        </View>

        {/* Wordmark */}
        <Text style={{
          fontFamily: font('playfair', '700'),
          fontSize: 54,
          letterSpacing: 18,
          color: colors.terra,
          lineHeight: 54,
          marginBottom: 10,
        }}>
          TATUM
        </Text>

        {/* Tagline */}
        <Text style={{
          fontSize: 8,
          fontWeight: '400',
          letterSpacing: 2.5,
          color: colors.muted,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 14.4,
        }}>
          Feel seen, validated,{'\n'}and completely empowered
        </Text>
      </View>

      {/* Buttons group — Google only */}
      <View style={{ width: '100%', gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          style={{
            width: '100%',
            height: 58,
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: 'rgba(160,100,80,0.2)',
            borderRadius: 9999,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#3D2B25',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <GoogleLogo />
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 15,
            color: colors.ink,
            letterSpacing: 0.2,
          }}>Continue with Google</Text>
        </Pressable>
      </View>

      {/* Privacy footer */}
      <View style={{ alignItems: 'center', gap: 8, paddingBottom: 8 }}>
        <View style={{ width: 28, height: 1, backgroundColor: 'rgba(160,100,80,0.2)' }} />
        <Text style={{
          fontSize: 11,
          fontWeight: '300',
          color: colors.muted,
          textAlign: 'center',
          lineHeight: 17.6,
        }}>
          Your data never leaves your device.
        </Text>
      </View>
    </View>

    {/* Android gesture bar */}
    <View style={{
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: 120,
        height: 4,
        backgroundColor: 'rgba(61,43,37,0.15)',
        borderRadius: 2,
      }} />
    </View>
  </View>
)
