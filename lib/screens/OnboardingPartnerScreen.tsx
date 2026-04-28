import React from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, shadows } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StepDots } from '../components/StepDots'

const GradientButton: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={{
      width: '100%',
      height: 52,
      borderRadius: 9999,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      ...shadows.primaryButtonStrong,
    }}
  >
    <LinearGradient
      colors={gradients.primaryCta}
      start={gradientPoints.diagonal.start}
      end={gradientPoints.diagonal.end}
      style={StyleSheet.absoluteFill}
    />
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

const SWATCH_GRADIENTS: ReadonlyArray<readonly [string, string]> = [
  ['#C07858', '#7C4A5A'],
  ['#B07080', '#7C4A5A'],
  ['#8BA888', '#5A8060'],
  ['#C4993A', '#8A6A20'],
  ['#9A8878', '#6A5848'],
  ['#7C6090', '#4A3060'],
] as const

const ChevronRight: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#C4B0A0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
)

export const OnboardingPartnerScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      overflow: 'hidden',
      backgroundColor: colors.warmSand,
    }}
  >
    <DecorativeGlow position="top-right" size={240} opacity={0.1} />
    <View style={{ height: 54 }} />

    <ScrollView
      style={{ flex: 1, paddingHorizontal: 28 }}
      keyboardShouldPersistTaps="handled"
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
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: 'white',
            marginBottom: 10,
            overflow: 'hidden',
            shadowColor: '#3D2B25',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <LinearGradient
            colors={SWATCH_GRADIENTS[0]}
            start={gradientPoints.diagonal.start}
            end={gradientPoints.diagonal.end}
            style={StyleSheet.absoluteFill}
          />
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
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
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
        {SWATCH_GRADIENTS.map((cols, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Color option ${i + 1}`}
            accessibilityState={{ selected: i === 0 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 2.5,
              borderColor: i === 0 ? 'white' : 'transparent',
              ...(i === 0 ? {
                shadowColor: '#C07858',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 2.5,
                elevation: 2,
              } : null),
            }}
          >
            <LinearGradient
              colors={cols}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={StyleSheet.absoluteFill}
            />
          </Pressable>
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
        accessibilityRole="button"
        accessibilityLabel="Solo — track without a partner"
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
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'white',
            overflow: 'hidden',
            shadowColor: '#3D2B25',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <LinearGradient
            colors={['#9A8878', '#6A5848']}
            start={gradientPoints.diagonal.start}
            end={gradientPoints.diagonal.end}
            style={StyleSheet.absoluteFill}
          />
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
    <View style={{ paddingHorizontal: 28, paddingBottom: 32 }}>
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
