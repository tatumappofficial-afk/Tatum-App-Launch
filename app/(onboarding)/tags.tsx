import React from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, fontFamily, gradientPoints, gradients } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StepDots } from '@/lib/components/StepDots'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { activityTags } from '@/src/db'

const TagChip: React.FC<{ emoji: string; label: string; onPress: () => void }> = ({ emoji, label, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Edit tag ${label}`}
    hitSlop={6}
    style={({ pressed }) => ({
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
      width: 72,
      opacity: pressed ? 0.85 : 1,
      transform: [{ scale: pressed ? 0.96 : 1 }],
    })}
  >
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#7C4A5A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 14,
        elevation: 5,
      }}
    >
      <LinearGradient
        colors={gradients.primaryCta}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
      />
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
    </View>
    <Text
      style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 12,
        color: colors.terra,
        textAlign: 'center',
        lineHeight: 14,
        letterSpacing: 0.2,
      }}
      numberOfLines={1}
    >
      {label}
    </Text>
  </Pressable>
)

const AddChip: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Add a custom tag"
      hitSlop={8}
      style={({ pressed }) => ({
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        width: 72,
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      {({ pressed }) => (
        <>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? 'rgba(192,120,88,0.12)' : 'transparent',
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: pressed ? colors.terra : 'rgba(192,120,88,0.4)',
            }}
          >
            <Text style={{ fontSize: 22, color: colors.terra }}>＋</Text>
          </View>
          <Text
            style={{
              fontFamily: fontFamily.dmSans,
              fontSize: 12,
              fontWeight: '400',
              color: colors.terra,
              textAlign: 'center',
              lineHeight: 14,
              letterSpacing: 0.2,
            }}
          >
            Add yours
          </Text>
        </>
      )}
    </Pressable>
  )
}

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default function TagsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  useBlockBack()

  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const activeTags = allTags.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder)

  // Add tile leads; live tags follow (newly added ones appear right after the add tile
  // because their sortOrder is less than the defaults).
  type GridItem = { kind: 'add' } | { kind: 'tag'; id: string; emoji: string; label: string }
  const items: GridItem[] = [
    { kind: 'add' },
    ...activeTags.map((t) => ({ kind: 'tag' as const, id: t.id, emoji: t.emoji, label: t.label })),
  ]
  const columns = chunkArray(items, 3)

  function handleEditTag(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(`/(sheets)/edit-tag?id=${id}`)
  }

  return (
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
      <StatusBarSpacer />

      <View
        style={{
          flex: 1,
          overflow: 'hidden',
          flexDirection: 'column',
          paddingLeft: 28,
          zIndex: 1,
        }}
      >
        {/* Header */}
        <View style={{ marginTop: 34, marginBottom: 20, paddingRight: 28 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 12,
              letterSpacing: 3.5,
              textTransform: 'uppercase',
              color: colors.terra,
              marginBottom: 8,
            }}
          >
            Step 7 of 7
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
            Make it yours
          </Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
            These are your activity tags. Tap any tag to edit or delete it, or add your own to make Tatum feel like
            yours.
          </Text>
        </View>

        {/* Explainer card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 14,
            paddingVertical: 13,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            marginRight: 28,
          }}
        >
          <Text style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🏷️</Text>
          <Text
            style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: '#7A5A50', lineHeight: 18.6, flex: 1 }}
          >
            <Text style={{ fontWeight: '500', color: colors.ink }}>Activity tags</Text> are the emoji labels you tap
            when logging a session. They're completely private — tap any tag to make changes.
          </Text>
        </View>

        {/* Horizontally scrollable 3-row tag grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
          contentContainerStyle={{ gap: 8, paddingRight: 40 }}
        >
          {columns.map((col, ci) => (
            <View key={ci} style={{ flexDirection: 'column', gap: 10 }}>
              {col.map((item, ri) =>
                item.kind === 'add' ? (
                  <AddChip key={`add-${ri}`} onPress={() => router.push('/(sheets)/add-tag')} />
                ) : (
                  <TagChip key={item.id} emoji={item.emoji} label={item.label} onPress={() => handleEditTag(item.id)} />
                ),
              )}
            </View>
          ))}
        </ScrollView>

        {/* Hint */}
        <View style={{ paddingRight: 28 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 12,
              color: '#C4B0A0',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            You can keep editing these from your profile anytime.
          </Text>
        </View>
      </View>

      {/* Bottom area */}
      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
        <View style={{ marginBottom: 12 }}>
          <GradientButton label="Continue" onPress={() => router.push('/(onboarding)/ready')} />
        </View>
        <StepDots current={6} total={7} />
      </View>
    </View>
  )
}
