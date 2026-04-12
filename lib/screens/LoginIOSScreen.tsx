import React from 'react'
import { View, Text, Pressable } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'

const AppleLogo: React.FC = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24" fill="white">
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.33.07 2.26.78 3.05.8 1.17-.26 2.29-1 3.54-.87 1.5.19 2.63.79 3.37 2-3.31 1.97-2.52 5.83.43 7.06-.57 1.46-1.33 2.89-2.39 3.89zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="white" />
  </Svg>
)

const GoogleLogo: React.FC = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
)

export const LoginIOSScreen: React.FC = () => (
  <View style={{
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  }}>
    {/* Ambient glows */}
    <View style={{
      position: 'absolute',
      top: -60,
      left: '50%',
      transform: [{ translateX: '-50%' }],
      width: 320,
      height: 320,
      ...gradientStyle('radial-gradient(circle, rgba(192,120,88,0.13) 0%, transparent 65%)'),
      zIndex: 0,
    }} />
    <View style={{
      position: 'absolute',
      bottom: -40,
      right: -40,
      width: 200,
      height: 200,
      ...gradientStyle('radial-gradient(circle, rgba(124,74,90,0.09) 0%, transparent 70%)'),
      zIndex: 0,
    }} />

    <View style={{ height: 54 }} />

    {/* Main content */}
    <View style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 36,
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Logo group */}
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 48,
      }}>
        {/* App icon */}
        <View style={{
          width: 80,
          height: 80,
          ...gradientStyle('linear-gradient(145deg, #C98060, #7C4A5A)'),
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 16px 40px rgba(124,74,90,0.3), 0 4px 12px rgba(124,74,90,0.16), inset 0 1px 0 rgba(255,255,255,0.18)',
          position: 'relative',
          overflow: 'visible',
        }}>
          <Text style={{
            fontSize: 36,
            color: colors.white,
            lineHeight: 36,
            position: 'relative',
            zIndex: 1,
          }}>&#10022;</Text>
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

      {/* Buttons group */}
      <View style={{
        width: '100%',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Apple button */}
        <Pressable style={{
          width: '100%',
          height: 56,
          backgroundColor: '#1C1C1E',
          borderRadius: 9999,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 18px rgba(28,28,30,0.28), 0 1px 4px rgba(28,28,30,0.14)',
        }}>
          <AppleLogo />
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 15,
            color: colors.white,
            letterSpacing: 0.2,
          }}>Continue with Apple</Text>
        </Pressable>

        {/* Google button */}
        <Pressable style={{
          width: '100%',
          height: 56,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: 'rgba(160,100,80,0.2)',
          borderRadius: 9999,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 2px 8px rgba(61,43,37,0.06)',
        }}>
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
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 8,
      }}>
        <View style={{
          width: 28,
          height: 1,
          backgroundColor: 'rgba(160,100,80,0.2)',
        }} />
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

  </View>
)
