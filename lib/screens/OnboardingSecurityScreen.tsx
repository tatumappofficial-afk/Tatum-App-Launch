import React from 'react'
import { View, Text, Pressable } from 'react-native'
import Svg, { Path, Circle, Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StepDots } from '../components/StepDots'

const GradientButton: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      width: '100%',
      height: 52,
      ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 20px rgba(124,74,90,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
      marginBottom: 10,
    }}
  >
    <Text
      style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 13,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: 'white',
      }}
    >
      {label}
    </Text>
  </Pressable>
)

/* -- Security card icons (SVG) -- */

const FaceIdIcon: React.FC = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 3H5a2 2 0 00-2 2v2" />
    <Path d="M17 3h2a2 2 0 012 2v2" />
    <Path d="M7 21H5a2 2 0 01-2-2v-2" />
    <Path d="M17 21h2a2 2 0 002-2v-2" />
    <Path d="M9 9v1" />
    <Path d="M15 9v1" />
    <Path d="M12 9v3" />
    <Path d="M9 15c.6 1 1.5 1.5 3 1.5s2.4-.5 3-1.5" />
  </Svg>
)

const KeypadIcon: React.FC = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={6} cy={6} r={1.5} />
    <Circle cx={12} cy={6} r={1.5} />
    <Circle cx={18} cy={6} r={1.5} />
    <Circle cx={6} cy={12} r={1.5} />
    <Circle cx={12} cy={12} r={1.5} />
    <Circle cx={18} cy={12} r={1.5} />
    <Circle cx={6} cy={18} r={1.5} />
    <Circle cx={12} cy={18} r={1.5} />
    <Circle cx={18} cy={18} r={1.5} />
  </Svg>
)

const CheckIcon: React.FC = () => (
  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
)

/* -- Security card -- */

interface SecurityCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  selected: boolean
}

const SecurityCard: React.FC<SecurityCardProps> = ({ icon, title, desc, selected }) => (
  <Pressable
    style={{
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: selected ? colors.terra : 'rgba(160,100,80,0.15)',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: selected ? '0 0 0 3px rgba(192,120,88,0.15)' : 'none',
    }}
  >
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: 'rgba(192,120,88,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 14, color: colors.ink, marginBottom: 2 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 11, color: colors.stone, lineHeight: 15.4 }}>
        {desc}
      </Text>
    </View>
    {selected ? (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckIcon />
      </View>
    ) : (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: 'rgba(160,100,80,0.25)',
          flexShrink: 0,
        }}
      />
    )}
  </Pressable>
)

/* -- Screen -- */

export const OnboardingSecurityScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
      backgroundColor: colors.warmSand,
    }}
  >
    <DecorativeGlow position="top-right" size={240} opacity={0.1} />
    <View style={{ height: 54 }} />

    {/* Content */}
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'column',
        paddingHorizontal: 28,
        zIndex: 1,
      }}
    >
      {/* Title area */}
      <View style={{ marginTop: 24, marginBottom: 28 }}>
        <Text
          style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 9,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
            color: colors.terra,
            marginBottom: 8,
          }}
        >
          Step 2 of 4
        </Text>
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 30,
            color: colors.ink,
            lineHeight: 36,
            marginBottom: 8,
          }}
        >
          Protect{'\n'}your space
        </Text>
        <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 13, color: colors.stone, lineHeight: 20.8 }}>
          Choose how you want to lock Tatum. This keeps your data private even if someone picks up your phone.
        </Text>
      </View>

      {/* Security cards */}
      <View style={{ flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <SecurityCard
          icon={<FaceIdIcon />}
          title="Use Face ID"
          desc="Unlock instantly with your face. Works on most iPhones and Android devices."
          selected={true}
        />
        <SecurityCard
          icon={<KeypadIcon />}
          title="Set a Passcode"
          desc="Create a 4 or 6-digit PIN. You'll enter it each time you open Tatum."
          selected={false}
        />
      </View>
    </View>

    {/* Bottom area */}
    <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: 32 }}>
      <GradientButton label="Continue" />
      <Pressable style={{ alignItems: 'center', paddingVertical: 4, marginBottom: 12 }}>
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 12,
            color: colors.muted,
          }}
        >
          Skip for now
        </Text>
      </Pressable>
      <StepDots current={1} />
    </View>
  </View>
)
