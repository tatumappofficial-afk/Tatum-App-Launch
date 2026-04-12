import React from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { TagPill } from '../components/TagPill'
import { GradientButton } from '../components/GradientButton'

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

/* ── Emoji grid data ── */

const emojiRows = [
  // Row 1 - intimacy / activity
  ['\u{1F346}', '\u{1F48B}', '\u{270B}', '\u{1F449}', '\u{1F32C}\u{FE0F}', '\u{1F351}', '\u{1FA84}'],
  // Row 2 - mood / feeling
  ['\u{1F525}', '\u{1F4AB}', '\u{1F970}', '\u{1F60F}', '\u{1F319}', '\u{2728}', '\u{1F4A6}'],
  // Row 3 - emotional / milestone
  ['\u{1FA77}', '\u{2764}\u{FE0F}', '\u{1FAF6}', '\u{1F618}', '\u{1F942}', '\u{1F389}', '\u{1FA78}'],
  // Row 4 - body / health / other
  ['\u{1F48A}', '\u{1F33F}', '\u{1F6C1}', '\u{1F9D8}', '\u{1F4A4}', '\u{26A1}', '\u{1F3B5}'],
]

const EMOJI_CELL_BASIS = `${100 / 7}%` as unknown as number

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
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.surface,
    }}>
        {/* Header */}
        <View style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={{
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
          }}>Add a tag</Text>
          <Pressable
            onPress={onClose}
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
        <View style={{ paddingTop: 12, paddingHorizontal: 20 }}>
          <Text style={{
            fontSize: 8,
            fontWeight: '500',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Your current tags</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: 2 }}
            contentContainerStyle={{ gap: 6 }}
          >
            {existingTags.map((tag, i) => (
              <View key={i} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
                backgroundColor: colors.surface2,
                borderRadius: 9999,
                paddingVertical: 5,
                paddingRight: 10,
                paddingLeft: 7,
                borderWidth: 1,
                borderColor: 'rgba(160,100,80,0.18)',
              }}>
                <Text style={{ fontSize: 14, lineHeight: 14 }}>{tag.emoji}</Text>
                <Text style={{ fontSize: 11, fontWeight: '400', color: '#6A4A40' }}>{tag.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Divider */}
        <View style={{
          height: 1,
          backgroundColor: 'rgba(160,100,80,0.1)',
          marginTop: 12,
        }} />

        {/* ── Emoji picker ── */}
        <View style={{ paddingTop: 12, paddingHorizontal: 20 }}>
          <Text style={{
            fontSize: 8,
            fontWeight: '500',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Choose an emoji</Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginBottom: 8,
          }}>
            {emojiRows.flat().map((emoji, i) => {
              const isUsed = usedEmojis.includes(emoji)
              const isSelected = emoji === selectedEmoji && !isUsed
              return (
                <Pressable
                  key={i}
                  onPress={() => !isUsed && onEmojiSelect?.(emoji)}
                  disabled={isUsed}
                  style={{
                    flexBasis: EMOJI_CELL_BASIS,
                    aspectRatio: 1,
                    borderRadius: 10,
                    ...(isSelected
                      ? gradientStyle('linear-gradient(135deg, rgba(192,120,88,0.18), rgba(124,74,90,0.12))')
                      : { backgroundColor: colors.surface2 }),
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.terra : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isUsed ? 0.22 : 1,
                    boxShadow: isSelected ? '0 2px 8px rgba(124,74,90,0.2)' : 'none',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{emoji}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* ── Tag name input ── */}
        <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
          <Text style={{
            fontSize: 8,
            fontWeight: '500',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Tag name</Text>
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
              flexShrink: 0,
              ...gradientStyle('linear-gradient(135deg, rgba(192,120,88,0.15), rgba(124,74,90,0.1))'),
              borderWidth: 1.5,
              borderColor: 'rgba(192,120,88,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 26 }}>{selectedEmoji}</Text>
            </View>
            {/* Text input */}
            <TextInput
              value={tagName}
              onChangeText={(text) => onTagNameChange?.(text)}
              placeholder="e.g. Playful, Romantic..."
              placeholderTextColor={colors.muted}
              maxLength={20}
              style={{
                flex: 1,
                backgroundColor: colors.surface2,
                borderWidth: 1.5,
                borderColor: 'rgba(160,100,80,0.2)',
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
        </View>

        {/* ── Footer ── */}
        <View style={{
          flexDirection: 'row',
          gap: 8,
          paddingTop: 14,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
          <Pressable
            onPress={onCancel}
            style={{
              flex: 1,
              height: 46,
              borderWidth: 1.5,
              borderColor: 'rgba(160,100,80,0.25)',
              borderRadius: 9999,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 12,
              letterSpacing: 1,
              textTransform: 'uppercase',
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
            />
          </View>
        </View>
    </View>
  )
}
