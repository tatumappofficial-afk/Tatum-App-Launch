import React from 'react'
import { colors, webFonts } from '../theme'
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

/* ── Inline icon helpers ── */

const CloseIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
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
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}>
      {/* ── Blurred background content ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.warmSand,
        zIndex: 0,
      }}>
        <div style={{
          padding: '52px 24px 0',
          filter: 'blur(1px)',
        }}>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 28,
            fontWeight: 700,
            color: colors.ink,
            marginBottom: 16,
          }}>My Activity Tags</div>
          <div style={{
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.terra,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}>
            <span>Your Tags</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(160,100,80,0.15)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {existingTags.map((tag, i) => (
              <TagPill key={i} emoji={tag.emoji} label={tag.name} variant="display" />
            ))}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'transparent',
              border: '1.5px dashed rgba(192,120,88,0.4)',
              borderRadius: 9999,
              padding: '6px 12px 6px 9px',
            }}>
              <span style={{ fontSize: 14, color: colors.terra }}>{'\uFF0B'}</span>
              <span style={{ fontSize: 12, color: colors.terra }}>Add tag</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dim overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(30,18,12,0.45)',
          zIndex: 10,
        }}
      />

      {/* ── Modal bottom sheet ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.surface,
        borderRadius: '28px 28px 0 0',
        zIndex: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(61,43,37,0.22)',
      }}>
        {/* Sheet handle */}
        <div style={{
          width: 36,
          height: 4,
          background: 'rgba(160,100,80,0.25)',
          borderRadius: 2,
          margin: '12px auto 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 20,
            fontWeight: 700,
            color: colors.ink,
          }}>Add a tag</div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: colors.surface2,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Existing tags strip ── */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Your current tags</div>
          <div style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: 2,
          }}>
            {existingTags.map((tag, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
                background: colors.surface2,
                borderRadius: 9999,
                padding: '5px 10px 5px 7px',
                border: '1px solid rgba(160,100,80,0.18)',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{tag.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: '#6A4A40' }}>{tag.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(160,100,80,0.1)',
          margin: '12px 0 0',
        }} />

        {/* ── Emoji picker ── */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Choose an emoji</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            marginBottom: 8,
          }}>
            {emojiRows.flat().map((emoji, i) => {
              const isUsed = usedEmojis.includes(emoji)
              const isSelected = emoji === selectedEmoji && !isUsed
              return (
                <div
                  key={i}
                  onClick={() => !isUsed && onEmojiSelect?.(emoji)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(192,120,88,0.18), rgba(124,74,90,0.12))'
                      : colors.surface2,
                    border: isSelected
                      ? `1.5px solid ${colors.terra}`
                      : '1.5px solid transparent',
                    fontSize: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    opacity: isUsed ? 0.22 : 1,
                    pointerEvents: isUsed ? 'none' : 'auto',
                    boxShadow: isSelected ? '0 2px 8px rgba(124,74,90,0.2)' : 'none',
                    transition: 'all 0.12s',
                  }}
                >
                  {emoji}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Tag name input ── */}
        <div style={{ padding: '10px 20px 0' }}>
          <div style={{
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 8,
          }}>Tag name</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            {/* Emoji square */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(192,120,88,0.15), rgba(124,74,90,0.1))',
              border: '1.5px solid rgba(192,120,88,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}>
              {selectedEmoji}
            </div>
            {/* Text input */}
            <input
              type="text"
              value={tagName}
              onChange={(e) => onTagNameChange?.(e.target.value)}
              placeholder="e.g. Playful, Romantic..."
              maxLength={20}
              style={{
                flex: 1,
                background: colors.surface2,
                border: '1.5px solid rgba(160,100,80,0.2)',
                borderRadius: 12,
                padding: '12px 14px',
                fontFamily: webFonts.dmSans,
                fontSize: 15,
                fontWeight: 400,
                color: colors.ink,
                outline: 'none',
                caretColor: colors.terra,
                height: 52,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '14px 20px 20px',
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 46,
              background: 'transparent',
              border: '1.5px solid rgba(160,100,80,0.25)',
              borderRadius: 9999,
              cursor: 'pointer',
              fontFamily: webFonts.dmSans,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: colors.stone,
            }}
          >Cancel</button>
          <div style={{ flex: 2 }}>
            <GradientButton
              label="Add Tag"
              height={46}
              fontSize={12}
              letterSpacing={1.5}
              onPress={onAddTag}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
