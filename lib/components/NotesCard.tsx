import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { colors, font, fontFamily, shadows } from '../theme'

export interface NotesCardProps {
  note?: string
  onEditNote?: () => void
  showStackedShadow?: boolean
}

const PencilIcon: React.FC = () => (
  <Svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
)

// Notebook ruled lines: render fixed number of horizontal hairlines spaced 28px apart.
const RULED_LINE_COUNT = 14
const RULED_LINE_SPACING = 28
const RuledLines: React.FC = () => (
  <View
    pointerEvents="none"
    style={{ position: 'absolute', top: 14, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
  >
    {Array.from({ length: RULED_LINE_COUNT }).map((_, i) => (
      <View
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: i * RULED_LINE_SPACING + 27,
          height: 1,
          backgroundColor: 'rgba(160,100,80,0.08)',
        }}
      />
    ))}
  </View>
)

export const NotesCard: React.FC<NotesCardProps> = ({ note, onEditNote, showStackedShadow = false }) => (
  <View style={{ position: 'relative' }}>
    {/* Stacked paper shadow */}
    {showStackedShadow && (
      <View
        style={{
          position: 'absolute',
          bottom: -4,
          left: 6,
          right: -6,
          top: 4,
          backgroundColor: colors.surface2,
          borderRadius: 16,
        }}
      />
    )}
    {/* Main card */}
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.14)',
        borderRadius: 16,
        overflow: 'hidden',
        ...shadows.cardSubtle,
      }}
    >
      <RuledLines />
      {/* Margin line */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 46,
          width: 1,
          backgroundColor: 'rgba(192,120,88,0.12)',
        }}
      />
      {/* Text content */}
      {note ? (
        <Text
          style={{
            fontFamily: fontFamily.playfair,
            fontSize: 14,
            fontWeight: '400',
            fontStyle: 'italic',
            color: '#5A3E36',
            lineHeight: 27,
            padding: 12,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {note}
        </Text>
      ) : (
        <Text
          style={{
            padding: 14,
            paddingHorizontal: 16,
            fontSize: 14,
            fontFamily: font('dmSans', '300'),
            color: '#C4B0A0',
            fontStyle: 'italic',
            lineHeight: 27,
          }}
        >
          No notes yet...
        </Text>
      )}
      {/* Edit note row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 8,
          paddingHorizontal: 14,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
        }}
      >
        <Pressable
          onPress={onEditNote}
          accessibilityRole="button"
          accessibilityLabel={note ? 'Edit note' : 'Add note'}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
        >
          <PencilIcon />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              fontFamily: fontFamily.dmSans,
              color: colors.terra,
            }}
          >
            {note ? 'Edit note' : 'Add note'}
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
)
