import { useEffect, useRef, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { Alert, StyleSheet, View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { KeyboardAvoidingView, KeyboardStickyView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Line } from 'react-native-svg'
import { generateId } from '@/src/utils/uuid'
import { deriveInitials } from '@/src/utils/initials'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, fontFamily, gradientPoints, partnerGradients } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { SuccessOverlay } from '@/lib/components/SuccessOverlay'
import { AvatarCircle } from '@/lib/components/AvatarCircle'
import { encounters, partners } from '@/src/db'

export default function EditPartnerSheet() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )

  const existing = id ? allPartners.find(p => p.id === id) : undefined
  const isEdit = Boolean(existing)
  const partnerEncounters = id ? allEncounters.filter(e => e.partnerIds.includes(id)) : []

  const [displayName, setDisplayName] = useState(existing?.displayName ?? '')
  const [initials, setInitials] = useState(
    existing?.avatarValue ?? deriveInitials(existing?.displayName ?? '')
  )
  // If the saved initials don't match what we'd derive from the name, treat as
  // user-customized so we don't clobber them when the name is edited.
  const [manuallyEdited, setManuallyEdited] = useState(() =>
    existing ? existing.avatarValue !== deriveInitials(existing.displayName) : false,
  )
  const [selectedGradient, setSelectedGradient] = useState(
    existing?.avatarGradient || partnerGradients[0].gradient,
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const [successLabel, setSuccessLabel] = useState('')

  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
  }, [])

  function handleBack() {
    if (router.canGoBack()) router.back()
    else router.dismiss()
  }

  function handleNameChange(text: string) {
    setDisplayName(text)
    if (!manuallyEdited) setInitials(deriveInitials(text))
  }

  function handleInitialsChange(text: string) {
    // Letters get uppercased for visual consistency; emojis pass through unchanged.
    const cleaned = text.toUpperCase().slice(0, 8)
    setInitials(cleaned)
    // Clearing the field releases the latch so future name edits re-derive.
    setManuallyEdited(cleaned.length > 0)
  }

  function handleSave() {
    const name = displayName.trim()
    if (!name) return

    const finalInitials = initials.trim() || deriveInitials(name)
    const now = new Date().toISOString()

    const collision = allPartners.find(p =>
      p.id !== existing?.id &&
      p.avatarValue === finalInitials &&
      p.avatarGradient === selectedGradient
    )
    if (collision) {
      Alert.alert(
        'Already taken',
        `Another partner already uses this initial and color combination. Pick a different color or change the initial.`,
      )
      return
    }

    try {
      if (isEdit && existing) {
        partners.update(existing.id, (draft) => {
          draft.displayName = name
          draft.avatarValue = finalInitials
          draft.avatarGradient = selectedGradient
          draft.updatedAt = now
        })
      } else {
        partners.insert({
          id: generateId(),
          displayName: name,
          avatarType: 'initials',
          avatarValue: finalInitials,
          avatarGradient: selectedGradient,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        })
      }
      setSuccessLabel(isEdit ? 'Partner updated' : 'Partner added')
      setShowSuccess(true)
      dismissTimer.current = setTimeout(handleBack, 900)
    } catch (err) {
      console.error('Failed to save partner:', err)
      handleBack()
    }
  }

  function handleDelete() {
    if (!existing) return
    // Split affected sessions: those where this partner is the sole entry
    // get deleted entirely; those with multiple partners just lose this id.
    const soleEncounters = partnerEncounters.filter(e => e.partnerIds.length === 1)
    const sharedEncounters = partnerEncounters.filter(e => e.partnerIds.length > 1)
    const noteParts: string[] = []
    if (sharedEncounters.length > 0) {
      noteParts.push(`${sharedEncounters.length} ${sharedEncounters.length === 1 ? 'session' : 'sessions'} will keep their other partners`)
    }
    if (soleEncounters.length > 0) {
      noteParts.push(`${soleEncounters.length} ${soleEncounters.length === 1 ? 'session' : 'sessions'} where they were the only partner will be permanently deleted`)
    }
    const sessionNote = noteParts.length > 0 ? ` ${noteParts.join(' and ')}.` : ''
    Alert.alert(
      'Delete Partner',
      `Are you sure you want to delete ${existing.displayName}?${sessionNote} This can’t be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              for (const enc of soleEncounters) {
                encounters.delete(enc.id)
              }
              for (const enc of sharedEncounters) {
                encounters.update(enc.id, (draft) => {
                  draft.partnerIds = draft.partnerIds.filter(pid => pid !== existing.id)
                  draft.updatedAt = new Date().toISOString()
                })
              }
              partners.delete(existing.id)
            } catch (err) {
              console.error('Failed to delete partner:', err)
              handleBack()
              return
            }
            setSuccessLabel('Partner deleted')
            setShowSuccess(true)
            dismissTimer.current = setTimeout(handleBack, 900)
          },
        },
      ],
    )
  }

  const insets = useSafeAreaInsets()

  const sectionLabelStyle = {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: colors.stone,
    marginBottom: 8,
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.warmSand }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — scrolls with content */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 12,
          marginBottom: 18,
        }}>
          <View style={{ width: 30 }} />
          <Text style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
          }}>{isEdit ? 'Edit Partner' : 'New Partner'}</Text>
          <Pressable
            onPress={() => router.dismiss()}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            style={{
              width: 30, height: 30, borderRadius: 15,
              backgroundColor: colors.surface2,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Line x1={18} y1={6} x2={6} y2={18} />
              <Line x1={6} y1={6} x2={18} y2={18} />
            </Svg>
          </Pressable>
        </View>

        {/* Existing partners strip — create mode only, hidden when empty */}
        {!isEdit && allPartners.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={sectionLabelStyle}>Your Partners</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingRight: 4 }}
            >
              {allPartners.map((p) => (
                <View key={p.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                  backgroundColor: colors.surface2,
                  borderRadius: 9999,
                  paddingVertical: 4,
                  paddingRight: 12,
                  paddingLeft: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(160,100,80,0.18)',
                }}>
                  <AvatarCircle
                    initials={p.avatarValue}
                    gradient={p.avatarGradient}
                    size={28}
                    borderWidth={1.5}
                    showShadow={false}
                  />
                  <Text style={{
                    fontFamily: font('dmSans', '400'),
                    fontSize: 14,
                    color: colors.ink,
                  }}>{p.displayName}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Display Name */}
        <Text style={sectionLabelStyle}>Display Name</Text>

        <TextInput
          value={displayName}
          onChangeText={handleNameChange}
          placeholder="Partner name"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
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
            marginBottom: 20,
          }}
        />

        {/* Initials with live preview */}
        <Text style={sectionLabelStyle}>Initials</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}>
          <AvatarCircle
            initials={initials}
            gradient={selectedGradient}
            size={56}
            borderWidth={2.5}
          />
          <TextInput
            value={initials}
            onChangeText={handleInitialsChange}
            placeholder="—"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            style={{
              width: 96,
              textAlign: 'center',
              fontFamily: font('playfair', '700'),
              fontSize: 18,
              letterSpacing: 2,
              color: colors.ink,
              backgroundColor: colors.surface,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.border,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </View>

        {/* Avatar Color */}
        <Text style={sectionLabelStyle}>Avatar Color</Text>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: 14,
          rowGap: 12,
          marginBottom: 8,
        }}>
          {partnerGradients.map(opt => {
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
                {isSelected && (
                  <Text style={{ color: colors.white, fontSize: 18 }}>{'✓'}</Text>
                )}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      {/* Footer — slides up above the keyboard when typing */}
      <KeyboardStickyView offset={{ closed: 0, opened: -Math.max(insets.bottom - 10, 0) }}>
        <View style={{
          flexShrink: 0,
          paddingTop: 10,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
          backgroundColor: colors.warmSand,
        }}>
          <GradientButton
            label={isEdit ? 'Save Changes' : 'Save Partner'}
            onPress={handleSave}
            height={50}
            disabled={!displayName.trim()}
          />
          {isEdit && (
            <Pressable
              onPress={handleDelete}
              style={{
                alignItems: 'center',
                paddingTop: 14,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontFamily: font('dmSans', '500'),
                color: '#B04040',
                letterSpacing: 0.3,
              }}>Delete Partner</Text>
            </Pressable>
          )}
        </View>
      </KeyboardStickyView>

      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </KeyboardAvoidingView>
  )
}
