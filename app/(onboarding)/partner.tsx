import { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, gradientPoints, partnerGradients } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StepDots } from '@/lib/components/StepDots'
import { AvatarCircle } from '@/lib/components/AvatarCircle'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { generateId } from '@/src/utils/uuid'
import { deriveInitials } from '@/src/utils/initials'
import { partners } from '@/src/db'

export default function PartnerScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  useBlockBack()

  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )

  const [displayName, setDisplayName] = useState('')
  const [initials, setInitials] = useState('')
  // Latch: once user types initials manually, name changes don't re-derive them.
  const [manuallyEdited, setManuallyEdited] = useState(false)
  const [selectedGradient, setSelectedGradient] = useState<string>(partnerGradients[0].gradient)

  function handleNameChange(text: string) {
    setDisplayName(text)
    if (!manuallyEdited) setInitials(deriveInitials(text))
  }

  function handleInitialsChange(text: string) {
    const cleaned = text.toUpperCase().slice(0, 8)
    setInitials(cleaned)
    setManuallyEdited(cleaned.length > 0)
  }

  function handleAdd() {
    const name = displayName.trim()
    if (!name) return

    const finalInitials = initials.trim() || deriveInitials(name)
    const now = new Date().toISOString()

    const collision = allPartners.find((p) => p.avatarValue === finalInitials && p.avatarGradient === selectedGradient)
    if (collision) {
      Alert.alert(
        'Already taken',
        'Another partner already uses this initial and color combination. Pick a different color or change the initial.',
      )
      return
    }

    try {
      // First real partner added in onboarding always becomes main. The seeded
      // Solo row was auto-promoted to main by the initDatabase backfill (so the
      // profile badge isn't empty on first launch), but a user-created partner
      // should supersede that placeholder.
      const previousMain = allPartners.find((p) => p.isMain)
      if (previousMain) {
        partners.update(previousMain.id, (draft) => {
          draft.isMain = false
          draft.updatedAt = now
        })
      }
      partners.insert({
        id: generateId(),
        displayName: name,
        avatarType: 'initials',
        avatarValue: finalInitials,
        avatarGradient: selectedGradient,
        isActive: true,
        isMain: true,
        createdAt: now,
        updatedAt: now,
      })
    } catch (err) {
      console.error('Failed to insert partner:', err)
      return
    }
    router.push('/(onboarding)/tags')
  }

  function handleSkip() {
    router.push('/(onboarding)/tags')
  }

  const sectionLabelStyle = {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: colors.stone,
    marginBottom: 8,
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
      <DecorativeGlow position="top-right" size={240} opacity={0.1} />
      <StatusBarSpacer />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        bounces={false}
      >
        {/* Header */}
        <View style={{ marginTop: 36, marginBottom: 24 }}>
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
            Step 5 of 6
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
            Add a partner
          </Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
            Give them a name, initials, and a color. You can always add more from your profile later.
          </Text>
        </View>

        {/* Display Name */}
        <Text style={sectionLabelStyle}>Display Name</Text>
        <TextInput
          value={displayName}
          onChangeText={handleNameChange}
          placeholder="Alex"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={30}
          returnKeyType="done"
          style={{
            fontFamily: font('dmSans', '400'),
            fontSize: 15,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: colors.border,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 24,
          }}
        />

        {/* Initials with hero-sized live preview */}
        <Text style={sectionLabelStyle}>Initials</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <AvatarCircle initials={initials || '—'} gradient={selectedGradient} size={80} borderWidth={3} />
          <TextInput
            value={initials}
            onChangeText={handleInitialsChange}
            placeholder="—"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: font('playfair', '700'),
              fontSize: 22,
              letterSpacing: 2,
              color: colors.ink,
              backgroundColor: colors.surface,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.border,
              paddingHorizontal: 14,
              paddingVertical: 16,
            }}
          />
        </View>

        {/* Avatar Color */}
        <Text style={sectionLabelStyle}>Avatar Color</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: 14,
            rowGap: 12,
            marginBottom: 16,
          }}
        >
          {partnerGradients.map((opt) => {
            const isSelected = selectedGradient === opt.gradient
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSelectedGradient(opt.gradient)}
                accessibilityRole="button"
                accessibilityLabel={`Color ${opt.key}`}
                accessibilityState={{ selected: isSelected }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  overflow: 'hidden',
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: isSelected ? colors.ink : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LinearGradient
                  colors={opt.colors}
                  start={gradientPoints.diagonal.start}
                  end={gradientPoints.diagonal.end}
                  style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
                />
                {isSelected && <Text style={{ color: colors.white, fontSize: 18 }}>{'✓'}</Text>}
              </Pressable>
            )
          })}
        </View>

        {/* OR divider */}
        <Text
          style={{
            fontFamily: font('dmSans', '400'),
            fontSize: 12,
            color: '#C4B0A0',
            textAlign: 'center',
            marginVertical: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          or
        </Text>

        {/* Solo widget — informational only, not pressable */}
        <View
          accessibilityRole="text"
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
            marginBottom: 8,
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
              style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
            />
            <Text style={{ fontSize: 22 }}>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink }}>Solo ✨</Text>
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone }}>
              Track your own experiences without adding a partner
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Bottom area */}
      <View style={{ paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32), paddingTop: 8 }}>
        <View style={{ marginBottom: 8 }}>
          <GradientButton label="Add Partner" onPress={handleAdd} disabled={!displayName.trim()} />
        </View>
        <Pressable onPress={handleSkip} style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 8 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 14,
              color: colors.muted,
            }}
          >
            Skip for now
          </Text>
        </Pressable>
        <StepDots current={4} />
      </View>
    </View>
  )
}
