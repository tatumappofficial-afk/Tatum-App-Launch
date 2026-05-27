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
  existingTags: ExistingTag[]
  /** All emojis that are already used (will appear grayed out) */
  usedEmojis: string[]
  /** Currently selected emoji in the picker */
  selectedEmoji: string
  /** Current value of the tag name input */
  tagName: string
  onClose?: () => void
  onCancel?: () => void
  onAddTag?: () => void
  onEmojiSelect?: (emoji: string) => void
  onTagNameChange?: (name: string) => void
}

const EMOJI_CELL_SIZE = 46
const EMOJI_GAP = 6
const EMOJI_ROWS = 5

/* ── Inline icon helpers ── */

const CloseIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
)

/* ── Main component ── */

export const AddTagModal: React.FC<AddTagModalProps> = ({
  existingTags,
  usedEmojis,
  selectedEmoji,
  tagName,
  onClose,
  onCancel,
  onAddTag,
  onEmojiSelect,
  onTagNameChange,
}) => {
  const trimmedName = tagName.trim()
  const isDuplicate = trimmedName.length > 0
    && existingTags.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())
  const addTagDisabled = trimmedName.length === 0 || isDuplicate
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
          <View style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={typography.screenTitle}>Add a tag</Text>
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

        {/* ── Existing tags strip ── */}
        {existingTags.length > 0 && (
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

        {/* Divider */}
        <View style={{
          height: 1,
          backgroundColor: colors.border,
          marginTop: 12,
        }} />

        {/* ── Emoji picker ── */}
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

        {/* ── Tag name input ── */}
        <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
          <Text style={[typography.sectionLabel, { marginBottom: 8 }]}>Tag name</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
            {/* Emoji square */}
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: 'rgba(192,120,88,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <LinearGradient
                colors={['rgba(192,120,88,0.15)', 'rgba(124,74,90,0.1)']}
                start={gradientPoints.diagonal.start}
                end={gradientPoints.diagonal.end}
                style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
              />
              <Text style={{ fontSize: 26 }}>{selectedEmoji}</Text>
            </View>
            {/* Text input */}
            <TextInput
              value={tagName}
              onChangeText={(text) => onTagNameChange?.(text)}
              placeholder="e.g. Playful, Romantic..."
              placeholderTextColor={colors.muted}
              maxLength={20}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
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
                color: colors.ink,
                height: 52,
              }}
            />
          </View>
          {isDuplicate && (
            <Text style={{
              ...typography.hint,
              color: colors.fig,
              marginTop: 6,
              fontStyle: 'normal',
            }}>
              A tag with this name already exists.
            </Text>
          )}
        </View>
        </KeyboardAwareScrollView>

        {/* ── Footer — hidden while keyboard is up ── */}
        {!keyboardVisible && (
        <View style={{
          flexShrink: 0,
          flexDirection: 'row',
          gap: 8,
          paddingTop: 14,
          paddingHorizontal: 20,
          // Extra Android padding: the system-nav inset is the nav bar's size, not a margin above it.
          paddingBottom: Math.max(insets.bottom, 10) + (Platform.OS === 'android' ? 12 : 0),
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
        }}>
          <Pressable
            onPress={onCancel}
            style={{
              flex: 1,
              height: 46,
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: 9999,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              ...typography.tagLabel,
              fontSize: 14,
              letterSpacing: 1,
              color: colors.stone,
            }}>Cancel</Text>
          </Pressable>
          <View style={{ flex: 2 }}>
            <GradientButton
              label="Add Tag"
              height={46}
              fontSize={12}
              letterSpacing={1.5}
              onPress={onAddTag}
              disabled={addTagDisabled}
            />
          </View>
        </View>
        )}
    </KeyboardAvoidingView>
  )
}
