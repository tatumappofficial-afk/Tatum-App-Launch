import React from 'react'
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
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
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: 'white',
      }}
    >
      {label}
    </Text>
  </Pressable>
)

/* -- Color swatches data -- */

const SWATCH_GRADIENTS = [
  'linear-gradient(135deg, #C07858, #7C4A5A)',
  'linear-gradient(135deg, #B07080, #7C4A5A)',
  'linear-gradient(135deg, #8BA888, #5A8060)',
  'linear-gradient(135deg, #C4993A, #8A6A20)',
  'linear-gradient(135deg, #9A8878, #6A5848)',
  'linear-gradient(135deg, #7C6090, #4A3060)',
] as const

/* -- Chevron icon -- */

const ChevronRight: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#C4B0A0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
)

/* -- Screen -- */

export const OnboardingPartnerScreen: React.FC = () => (
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
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 28,
        zIndex: 1,
      }}
      contentContainerStyle={{ flexDirection: 'column' }}
    >
      {/* Title area */}
      <View style={{ marginTop: 24, marginBottom: 24 }}>
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
          Step 3 of 4
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
          Add a{'\n'}partner
        </Text>
        <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 13, color: colors.stone, lineHeight: 20.8 }}>
          Give them a name and a color. You can always add more from your profile later.
        </Text>
      </View>

      {/* Partner preview */}
      <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            ...gradientStyle(SWATCH_GRADIENTS[0]),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: 'white',
            boxShadow: '0 6px 20px rgba(61,43,37,0.15)',
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: font('playfair', '700'),
              fontSize: 28,
              color: 'white',
            }}
          >
            AL
          </Text>
        </View>
        <Text
          style={{
            fontFamily: font('playfair', '600'),
            fontSize: 18,
            fontStyle: 'italic',
            color: colors.ink,
            minHeight: 26,
          }}
        >
          Alex
        </Text>
      </View>

      {/* Name input */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          defaultValue="Alex"
          placeholder="Their name or nickname"
          maxLength={30}
          style={{
            width: '100%',
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: 'rgba(160,100,80,0.2)',
            borderRadius: 12,
            paddingVertical: 13,
            paddingHorizontal: 16,
            fontFamily: fontFamily.dmSans,
            fontSize: 14,
            color: colors.ink,
          }}
        />
      </View>

      {/* Color picker */}
      <Text
        style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 9,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.stone,
          marginBottom: 10,
        }}
      >
        Choose a color
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {SWATCH_GRADIENTS.map((grad, i) => (
          <Pressable
            key={i}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              ...gradientStyle(grad),
              borderWidth: 2.5,
              borderColor: i === 0 ? 'white' : 'transparent',
              boxShadow: i === 0 ? '0 0 0 2.5px #C07858' : 'none',
            }}
          />
        ))}
      </View>

      {/* Or divider */}
      <Text
        style={{
          fontFamily: fontFamily.dmSans,
          fontSize: 10,
          color: '#C4B0A0',
          textAlign: 'center',
          marginVertical: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        or
      </Text>

      {/* Solo row */}
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: 'rgba(160,100,80,0.15)',
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            ...gradientStyle('linear-gradient(135deg, #9A8878, #6A5848)'),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'white',
            boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
            flexShrink: 0,
          }}
        >
          <Text style={{ fontSize: 22 }}>✨</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 14, color: colors.ink }}>Solo ✨</Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 11, color: colors.stone }}>
            Track your own experiences without adding a partner
          </Text>
        </View>
        <ChevronRight />
      </Pressable>
    </ScrollView>

    {/* Bottom area */}
    <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: 32 }}>
      <GradientButton label="Add Alex" />
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
      <StepDots current={2} />
    </View>
  </View>
)
