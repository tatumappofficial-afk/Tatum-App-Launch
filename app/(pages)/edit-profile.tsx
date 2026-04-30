import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Polyline } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, gradientPoints, partnerGradients } from '@/lib/theme'
import { AvatarCircle } from '@/lib/components/AvatarCircle'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { activityTags, partners, userProfiles } from '@/src/db'
import { useUserProfile } from '@/src/hooks/useUserProfile'
import { deriveInitials } from '@/src/utils/initials'

const DEFAULT_GRADIENT = partnerGradients[0].gradient

export default function EditProfilePage() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { raw: profile } = useUserProfile()
  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )

  // Local form state — initialized from profile, kept in sync via useEffect
  // (live-query may hydrate after first render).
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [initials, setInitials] = useState(profile?.avatarValue ?? deriveInitials(profile?.displayName ?? ''))
  const [selectedGradient, setSelectedGradient] = useState(profile?.avatarGradient ?? DEFAULT_GRADIENT)
  // Latch — once user manually edits initials, stop re-deriving from name.
  const [manuallyEdited, setManuallyEdited] = useState(() =>
    profile ? (profile.avatarValue ?? '') !== deriveInitials(profile.displayName ?? '') : false,
  )

  // Hydrate state once when profile arrives via live query.
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current || !profile) return
    setDisplayName(profile.displayName ?? '')
    setInitials(profile.avatarValue ?? deriveInitials(profile.displayName ?? ''))
    setSelectedGradient(profile.avatarGradient ?? DEFAULT_GRADIENT)
    setManuallyEdited((profile.avatarValue ?? '') !== deriveInitials(profile.displayName ?? ''))
    hydratedRef.current = true
  }, [profile])

  const activeTags = allTags
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const activePartners = allPartners
    .filter(p => p.isActive)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))

  function commitProfile(patch: Partial<{ displayName: string | null; avatarValue: string; avatarGradient: string }>) {
    if (!profile) return
    userProfiles.update(profile.id, (draft) => {
      if ('displayName' in patch) draft.displayName = patch.displayName ?? null
      if (patch.avatarValue !== undefined) draft.avatarValue = patch.avatarValue
      if (patch.avatarGradient !== undefined) draft.avatarGradient = patch.avatarGradient
    })
  }

  function handleNameChange(text: string) {
    setDisplayName(text)
    if (!manuallyEdited) setInitials(deriveInitials(text))
  }

  function handleNameBlur() {
    const trimmed = displayName.trim()
    commitProfile({ displayName: trimmed || null })
    if (!manuallyEdited) {
      const derived = deriveInitials(trimmed)
      const finalInitials = derived || 'A'
      setInitials(finalInitials)
      commitProfile({ avatarValue: finalInitials })
    }
  }

  function handleInitialsChange(text: string) {
    const cleaned = text.toUpperCase().slice(0, 8)
    setInitials(cleaned)
    setManuallyEdited(cleaned.length > 0)
  }

  function handleInitialsBlur() {
    const finalInitials = initials.trim() || deriveInitials(displayName) || 'A'
    setInitials(finalInitials)
    commitProfile({ avatarValue: finalInitials })
  }

  function handleGradientPress(gradient: string) {
    setSelectedGradient(gradient)
    commitProfile({ avatarGradient: gradient })
  }

  function handleSavePress() {
    // Auto-save already runs on blur, but the user may tap Save without
    // blurring the focused input — commit current state explicitly.
    handleNameBlur()
    handleInitialsBlur()
    router.back()
  }

  function handleDeleteTag(tagId: string, label: string, emoji: string) {
    Alert.alert(
      'Delete tag',
      `Delete "${emoji} ${label}"? Past sessions will keep this tag in their record.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            activityTags.update(tagId, (draft) => {
              draft.isActive = false
            })
          },
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBarSpacer />

      {/* Sticky header — match PartnersScreen / Settings pattern */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={styles.backButton}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSavePress}
          accessibilityRole="button"
          accessibilityLabel="Save and close"
          hitSlop={12}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar preview */}
        <View style={styles.avatarPreview}>
          <AvatarCircle
            initials={initials || 'A'}
            gradient={selectedGradient}
            size={84}
            borderWidth={3}
          />
        </View>

        {/* Display Name */}
        <Text style={styles.sectionLabel}>Display Name</Text>
        <TextInput
          value={displayName}
          onChangeText={handleNameChange}
          onBlur={handleNameBlur}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          style={styles.textInput}
        />

        {/* Initials */}
        <Text style={styles.sectionLabel}>Initials</Text>
        <View style={styles.initialsRow}>
          <AvatarCircle
            initials={initials || 'A'}
            gradient={selectedGradient}
            size={56}
            borderWidth={2.5}
          />
          <TextInput
            value={initials}
            onChangeText={handleInitialsChange}
            onBlur={handleInitialsBlur}
            placeholder="—"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            style={styles.initialsInput}
          />
        </View>

        {/* Avatar Color */}
        <Text style={styles.sectionLabel}>Avatar Color</Text>
        <View style={styles.colorGrid}>
          {partnerGradients.map(opt => {
            const isSelected = selectedGradient === opt.gradient
            return (
              <Pressable
                key={opt.key}
                onPress={() => handleGradientPress(opt.gradient)}
                accessibilityRole="button"
                accessibilityLabel={`Color ${opt.key}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.colorSwatch,
                  isSelected && styles.colorSwatchSelected,
                ]}
              >
                <LinearGradient
                  colors={opt.colors}
                  start={gradientPoints.diagonal.start}
                  end={gradientPoints.diagonal.end}
                  style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
                />
                {isSelected && <Text style={styles.colorCheck}>{'✓'}</Text>}
              </Pressable>
            )
          })}
        </View>

        {/* Tags */}
        <Text style={styles.sectionLabel}>Your Tags</Text>
        <View style={styles.list}>
          {activeTags.map(tag => (
            <View key={tag.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                <Text style={styles.rowLabel}>{tag.label}</Text>
              </View>
              <Pressable
                onPress={() => handleDeleteTag(tag.id, tag.label, tag.emoji)}
                accessibilityRole="button"
                accessibilityLabel={`Delete tag ${tag.label}`}
                hitSlop={10}
                style={styles.removeButton}
              >
                <Ionicons name="remove-circle" size={26} color={colors.terra} />
              </Pressable>
            </View>
          ))}
          <Pressable
            onPress={() => router.push('/(sheets)/add-tag')}
            accessibilityRole="button"
            style={styles.addRow}
          >
            <Ionicons name="add-circle-outline" size={22} color={colors.terra} />
            <Text style={styles.addRowLabel}>Add a tag</Text>
          </Pressable>
        </View>

        {/* Partners */}
        <Text style={styles.sectionLabel}>Your Partners</Text>
        <View style={styles.list}>
          {activePartners.map(p => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/(sheets)/edit-partner?id=${p.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${p.displayName}`}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowLeft}>
                <AvatarCircle
                  initials={p.avatarValue}
                  gradient={p.avatarGradient}
                  size={36}
                  borderWidth={2}
                />
                <Text style={styles.rowLabel}>{p.displayName}</Text>
              </View>
              <View style={styles.editAffordance}>
                <Text style={styles.editAffordanceLabel}>Edit</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.stone} />
              </View>
            </Pressable>
          ))}
          <Pressable
            onPress={() => router.push('/(sheets)/edit-partner')}
            accessibilityRole="button"
            style={styles.addRow}
          >
            <Ionicons name="add-circle-outline" size={22} color={colors.terra} />
            <Text style={styles.addRowLabel}>Add a partner</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmSand,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingHorizontal: 20,
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: font('playfair', '700'),
    fontSize: 20,
    color: colors.ink,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
  },
  saveButton: {
    height: 34,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: {
    fontFamily: font('dmSans', '500'),
    fontSize: 16,
    color: colors.terra,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.stone,
    marginBottom: 10,
    marginTop: 8,
  },
  textInput: {
    fontFamily: font('dmSans', '400'),
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  initialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  initialsInput: {
    width: 120,
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
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 12,
    marginBottom: 24,
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  colorCheck: {
    color: colors.white,
    fontSize: 18,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160,100,80,0.08)',
  },
  rowPressed: {
    backgroundColor: colors.surface2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowLabel: {
    fontFamily: font('dmSans', '400'),
    fontSize: 16,
    color: colors.ink,
    flexShrink: 1,
  },
  tagEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  removeButton: {
    padding: 2,
  },
  editAffordance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editAffordanceLabel: {
    fontFamily: font('dmSans', '500'),
    fontSize: 14,
    color: colors.stone,
    letterSpacing: 0.4,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  addRowLabel: {
    fontFamily: font('dmSans', '500'),
    fontSize: 16,
    color: colors.terra,
  },
})
