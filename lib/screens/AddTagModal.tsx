import React, { useEffect, useState } from 'react'
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
// RNGH ScrollView so nested horizontal scrollers coordinate with the Android sheet's pan.
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Line } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, fontFamily, gradientPoints, typography } from '../theme'
import { TagPill } from '../components/TagPill'
import { EmojiChip } from '../components/EmojiChip'
import { GradientButton } from '../components/GradientButton'
import { TAG_EMOJIS } from '../data/tagEmojis'
import { useSheetPanGesture } from '@/app/(sheets)/_layout'

/* ── Types ── */

export interface ExistingTag {
  emoji: string
  name: string
}

export interface AddTagModalProps {
  /** 'add' (default) shows the existing-tags strip and an "Add Tag" CTA.
   *  'edit' hides the strip, shows "Save Tag" + a "Delete Tag" link. */
  mode?: 'add' | 'edit'
  existingTags: ExistingTag[]
  /** All emojis that are already used (will appear grayed out).
   *  In edit mode, callers should exclude the tag being edited so its own
   *  emoji stays selectable. */
  usedEmojis: string[]
  /** Currently selected emoji in the picker */
  selectedEmoji: string
  /** Current value of the tag name input */
  tagName: string
  onClose?: () => void
  onCancel?: () => void
  /** Fires when the primary CTA is tapped (Add or Save, depending on mode). */
  onAddTag?: () => void
  onEmojiSelect?: (emoji: string) => void
  onTagNameChange?: (name: string) => void
  /** Edit-mode only. When provided, renders a red "Delete Tag" link below the
   *  primary CTA. The caller is responsible for confirmation + the delete write. */
  onDelete?: () => void
  /** When true, the modal renders as a protected tag view: no emoji picker, no
   *  name editing, no Save, no Delete. Tapping the emoji surfaces `lockedHint`
   *  inline. Period uses this so the canonical wellness-tracking tag can't be
   *  renamed, re-emojied, or deleted. */
  locked?: boolean
  /** Banner text shown at the top of the locked view, and surfaced inline when
   *  the user taps the locked emoji. Should be one short sentence. */
  lockedHint?: string
}

const EMOJI_CELL_SIZE = 46
const EMOJI_GAP = 6
const EMOJI_ROWS = 5

/* ── Inline icon helpers ── */

const CloseIcon: React.FC = () => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.stone}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
)

/* ── Main component ── */

export const AddTagModal: React.FC<AddTagModalProps> = ({
  mode = 'add',
  existingTags,
  usedEmojis,
  selectedEmoji,
  tagName,
  onClose,
  onCancel,
  onAddTag,
  onEmojiSelect,
  onTagNameChange,
  onDelete,
  locked = false,
  lockedHint,
}) => {
  const isEdit = mode === 'edit'
  const trimmedName = tagName.trim()
  const isDuplicate =
    trimmedName.length > 0 && existingTags.some((t) => t.name.toLowerCase() === trimmedName.toLowerCase())
  const addTagDisabled = trimmedName.length === 0 || isDuplicate
  // Lock view shows the hint persistently as a banner; tapping the emoji re-
  // surfaces it briefly as a tooltip below the row, so the gesture has visible
  // feedback even when the banner has scrolled offscreen.
  const [showEmojiTip, setShowEmojiTip] = useState(false)
  useEffect(() => {
    if (!showEmojiTip) return
    const t = setTimeout(() => setShowEmojiTip(false), 2500)
    return () => clearTimeout(t)
  }, [showEmojiTip])
  const insets = useSafeAreaInsets()
  const sheetPanRef = useSheetPanGesture()
  const scrollProps = sheetPanRef ? { simultaneousHandlers: sheetPanRef as React.RefObject<any> } : {}

  // Hide the footer while the keyboard is up; iOS formSheet keyboard handling is unreliable otherwise.
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
    const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
    // Android only fires the Did events; listen to both pairs.
    const showAndroid = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    const hideAndroid = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
    return () => {
      show.remove()
      hide.remove()
      showAndroid.remove()
      hideAndroid.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        bounces={false}
      >
        {/* Header — scrolls with content */}
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={typography.screenTitle}>{isEdit ? 'Edit tag' : 'Add a tag'}</Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: colors.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon />
          </Pressable>
        </View>

        {/* ── Lock banner ── shown only when the tag is protected (Period).
            Explains up front why the inputs below don't accept changes. */}
        {locked && lockedHint && (
          <View
            style={{
              marginTop: 14,
              marginHorizontal: 20,
              backgroundColor: 'rgba(192,120,88,0.08)',
              borderWidth: 1,
              borderColor: 'rgba(192,120,88,0.25)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14 }}>🔒</Text>
            <Text
              style={{
                flex: 1,
                fontFamily: fontFamily.dmSans,
                fontSize: 13,
                lineHeight: 17.5,
                color: colors.ink,
              }}
            >
              {lockedHint}
            </Text>
          </View>
        )}

        {/* ── Existing tags strip ── add-mode only; hidden in edit mode since
            the user is focused on one tag, not browsing the set. */}
        {!isEdit && existingTags.length > 0 && (
          <View style={{ paddingTop: 12, paddingHorizontal: 20 }}>
            <Text style={[typography.sectionLabel, { marginBottom: 8 }]}>Your current tags</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingBottom: 2 }}
              contentContainerStyle={{ gap: 6 }}
              {...scrollProps}
            >
              {existingTags.map((tag, i) => (
                <TagPill key={i} emoji={tag.emoji} label={tag.name} variant="display" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Divider — also hidden in locked mode, since there's no emoji picker
            below it to separate. */}
        {!locked && (
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginTop: 12,
            }}
          />
        )}

        {/* ── Emoji picker ── hidden when locked (the emoji can't be swapped). */}
        {!locked && (
          <View style={{ paddingTop: 12 }}>
            <Text style={[typography.sectionLabel, { marginBottom: 8, paddingHorizontal: 20 }]}>Choose an emoji</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
              contentContainerStyle={{
                flexDirection: 'column',
                flexWrap: 'wrap',
                height: EMOJI_ROWS * EMOJI_CELL_SIZE + (EMOJI_ROWS - 1) * EMOJI_GAP,
                gap: EMOJI_GAP,
                paddingHorizontal: 20,
                paddingBottom: 4,
              }}
              {...scrollProps}
            >
              {TAG_EMOJIS.map((emoji, i) => {
                const isUsed = usedEmojis.includes(emoji)
                const isSelected = emoji === selectedEmoji && !isUsed
                return (
                  <EmojiChip
                    key={i}
                    emoji={emoji}
                    size={EMOJI_CELL_SIZE}
                    borderRadius={10}
                    selected={isSelected}
                    disabled={isUsed}
                    onPress={() => onEmojiSelect?.(emoji)}
                  />
                )
              })}
            </ScrollView>
          </View>
        )}

        {/* ── Tag name input ── */}
        <View style={{ paddingTop: locked ? 18 : 10, paddingHorizontal: 20 }}>
          <Text style={[typography.sectionLabel, { marginBottom: 8 }]}>Tag name</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Emoji square — pressable in locked mode so a tap surfaces the
                hint inline; in normal modes it's a static preview because the
                emoji is chosen via the picker above. */}
            <Pressable
              onPress={locked ? () => setShowEmojiTip(true) : undefined}
              accessibilityRole={locked ? 'button' : undefined}
              accessibilityLabel={locked ? 'Locked emoji — tap for details' : undefined}
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: 'rgba(192,120,88,0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={['rgba(192,120,88,0.15)', 'rgba(124,74,90,0.1)']}
                start={gradientPoints.diagonal.start}
                end={gradientPoints.diagonal.end}
                style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
              />
              <Text style={{ fontSize: 26 }}>{selectedEmoji}</Text>
            </Pressable>
            {/* Text input — read-only when locked (no rename either). */}
            <TextInput
              value={tagName}
              onChangeText={(text) => onTagNameChange?.(text)}
              placeholder="e.g. Playful, Romantic..."
              placeholderTextColor={colors.muted}
              maxLength={20}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              editable={!locked}
              style={{
                flex: 1,
                backgroundColor: colors.surface2,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                fontFamily: fontFamily.dmSans,
                fontSize: 15,
                fontWeight: '400',
                color: locked ? colors.stone : colors.ink,
                height: 52,
                opacity: locked ? 0.75 : 1,
              }}
            />
          </View>
          {locked && showEmojiTip && lockedHint && (
            <Text
              style={{
                ...typography.hint,
                color: colors.stone,
                marginTop: 8,
                fontStyle: 'normal',
              }}
            >
              {lockedHint}
            </Text>
          )}
          {isDuplicate && (
            <Text
              style={{
                ...typography.hint,
                color: colors.fig,
                marginTop: 6,
                fontStyle: 'normal',
              }}
            >
              A tag with this name already exists.
            </Text>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* ── Footer — hidden while keyboard is up ──
            Same Cancel + primary-CTA row in both modes; the CTA label swaps
            ("Add Tag" / "Save Tag"). Edit mode additionally renders a red
            "Delete Tag" link below the button row, mirroring edit-partner.tsx. */}
      {!keyboardVisible && (
        <View
          style={{
            flexShrink: 0,
            paddingTop: 14,
            paddingHorizontal: 20,
            // Extra Android padding: the system-nav inset is the nav bar's size, not a margin above it.
            paddingBottom: Math.max(insets.bottom, 10) + (Platform.OS === 'android' ? 12 : 0),
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: 'rgba(160,100,80,0.1)',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={onCancel}
              style={{
                flex: locked ? 1 : 1,
                height: 46,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 9999,
                alignItems: 'center',
                justifyContent: 'center',
                // When locked there's no save CTA next to us, so span the row.
                ...(locked ? { width: '100%' } : null),
              }}
            >
              <Text
                style={{
                  ...typography.tagLabel,
                  fontSize: 14,
                  letterSpacing: 1,
                  color: colors.stone,
                }}
              >
                {locked ? 'Close' : 'Cancel'}
              </Text>
            </Pressable>
            {!locked && (
              <View style={{ flex: 2 }}>
                <GradientButton
                  label={isEdit ? 'Save Tag' : 'Add Tag'}
                  height={46}
                  fontSize={12}
                  letterSpacing={1.5}
                  onPress={onAddTag}
                  disabled={addTagDisabled}
                />
              </View>
            )}
          </View>
          {!locked && isEdit && onDelete && (
            <Pressable onPress={onDelete} accessibilityRole="button" style={{ alignItems: 'center', paddingTop: 14 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamily.dmSans,
                  fontWeight: '500',
                  color: '#B04040',
                  letterSpacing: 0.3,
                }}
              >
                Delete Tag
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  )
}
