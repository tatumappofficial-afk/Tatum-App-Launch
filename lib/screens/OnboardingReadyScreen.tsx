import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Rect, Line, Path, Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { GradientButton } from '../components/GradientButton'

/* -- Feature icons (SVG) -- */

const CalendarIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
)

const HomeIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
)

const BookIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </Svg>
)

/* -- Feature pill -- */

const FeaturePill: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({ icon, text }) => (
  <View
    style={{
      backgroundColor: 'rgba(251,247,242,0.8)',
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.15)',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <View style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</View>
    <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12.5, color: '#6A4A40', lineHeight: 17.5, flex: 1 }}>{text}</Text>
  </View>
)

/* -- Screen -- */

export const OnboardingReadyScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
      ...gradientStyle('linear-gradient(165deg, #F5EFE8 0%, #EDE3D8 60%, #E0D0C0 100%)'),
    }}
  >
    {/* Large ambient glow -- centered */}
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: '42%',
        alignSelf: 'center',
        width: 400,
        height: 400,
        ...gradientStyle('radial-gradient(circle, rgba(192,120,88,0.18) 0%, transparent 65%)'),
        zIndex: 0,
      }}
    />

    {/* Decorative rings */}
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 1,
        borderColor: 'rgba(192,120,88,0.12)',
        top: '42%',
        alignSelf: 'center',
      }}
    />
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 340,
        height: 340,
        borderRadius: 170,
        borderWidth: 1,
        borderColor: 'rgba(192,120,88,0.12)',
        top: '42%',
        alignSelf: 'center',
      }}
    />

    <View style={{ height: 54 }} />

    {/* Main content -- centered vertically */}
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 36,
        zIndex: 1,
      }}
    >
      {/* App icon -- large */}
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 24,
          ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(124,74,90,0.35)',
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 22, color: colors.white, lineHeight: 22 }}>&#10022;</Text>
      </View>

      {/* Headline */}
      <Text
        style={{
          fontFamily: font('playfair', '700'),
          fontSize: 36,
          color: colors.ink,
          lineHeight: 41.4,
          marginBottom: 14,
          textAlign: 'center',
        }}
      >
        You're all set,{'\n'}Alanna.
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontFamily: font('dmSans', '300'),
          fontSize: 13,
          color: colors.stone,
          textAlign: 'center',
          marginBottom: 18,
          letterSpacing: 0.3,
        }}
      >
        Here's what's waiting for you.
      </Text>

      {/* Feature pills */}
      <View style={{ flexDirection: 'column', gap: 8, width: '100%', marginBottom: 32 }}>
        <FeaturePill
          icon={<CalendarIcon />}
          text={
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12.5, color: '#6A4A40', lineHeight: 17.5 }}>
              <Text style={{ fontWeight: '500', color: colors.ink }}>Calendar</Text> — every moment logged and mapped,
              month by month.
            </Text>
          }
        />
        <FeaturePill
          icon={<HomeIcon />}
          text={
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12.5, color: '#6A4A40', lineHeight: 17.5 }}>
              <Text style={{ fontWeight: '500', color: colors.ink }}>Home</Text> — your stats, your partners, your
              patterns at a glance.
            </Text>
          }
        />
        <FeaturePill
          icon={<BookIcon />}
          text={
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12.5, color: '#6A4A40', lineHeight: 17.5 }}>
              <Text style={{ fontWeight: '500', color: colors.ink }}>Journal</Text> — write notes on any session,
              private and encrypted.
            </Text>
          }
        />
      </View>
    </View>

    {/* Bottom area */}
    <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: 40, zIndex: 2 }}>
      <View style={{ marginBottom: 12 }}>
        <GradientButton label="Start Logging" height={56} fontSize={14} />
      </View>
      <Text
        style={{
          fontFamily: font('dmSans', '300'),
          textAlign: 'center',
          fontSize: 11,
          color: colors.muted,
          lineHeight: 16.5,
        }}
      >
        Your data is private, encrypted, and yours alone.
      </Text>
    </View>
  </View>
)
