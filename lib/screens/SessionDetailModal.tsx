import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import Svg, { Line, Path, Polyline } from 'react-native-svg'
import { colors, font, fontFamily } from '../theme'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarStack } from '../components/AvatarStack'
import { StatStrip } from '../components/StatStrip'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface ActivityTag {
  emoji: string
  label: string
}

export interface ModalPartner {
  initials: string
  gradient: string
  name: string
}

export interface SessionDetailModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  backLabel: string // e.g. "March 7"
  partners: ModalPartner[]
  partnerName: string // formatted label e.g. "Jane & Alex"
  dateLabel: string // e.g. "Saturday, March 7, 2026 · Evening"
  rating: number // out of 10
  dayOfWeek: string // e.g. "Sat"
  tags: ActivityTag[]
  noteText?: string
  onBack?: () => void
  onEdit?: () => void
  onEditNote?: () => void
  onDelete?: () => void
  onClose?: () => void
}

/* ── Main Component ── */

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  backLabel,
  partners,
  partnerName,
  dateLabel,
  rating,
  dayOfWeek,
  tags,
  noteText,
  onBack,
  onEdit,
  onEditNote,
  onDelete,
  onClose,
}) => (
  <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
    {/* Header: back pill + edit */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingHorizontal: 20,
        flexShrink: 0,
      }}
    >
      <Pressable
        onPress={onBack}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: colors.surface2,
          borderRadius: 9999,
          paddingVertical: 6,
          paddingLeft: 8,
          paddingRight: 12,
        }}
      >
        <Svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.stone}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Polyline points="15 18 9 12 15 6" />
        </Svg>
        <Text
          style={{
            fontFamily: fontFamily.dmSans,
            fontSize: 14,
            fontWeight: '400',
            color: colors.stone,
          }}
        >
          {backLabel}
        </Text>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={onEdit}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.3)',
            borderRadius: 9999,
            paddingVertical: 5,
            paddingHorizontal: 14,
          }}
        >
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 14,
              color: colors.terra,
              letterSpacing: 0.5,
            }}
          >
            Edit
          </Text>
        </Pressable>
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
        </Pressable>
      </View>
    </View>

    {/* Scrollable content */}
    <ScrollView style={{ flex: 1 }}>
      {/* Hero */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 16,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <AvatarStack partners={partners} size={68} borderWidth={3} max={3} />
        </View>
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 22,
            color: colors.ink,
            marginBottom: 3,
          }}
        >
          {partnerName}
        </Text>
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 14,
            color: colors.stone,
          }}
        >
          {dateLabel}
        </Text>
      </View>

      {/* Stat strip */}
      <View style={{ marginTop: 14, marginHorizontal: 20 }}>
        <StatStrip
          stats={[
            { value: rating, unit: ' /10', label: 'Rating' },
            { value: dayOfWeek, label: 'Day' },
          ]}
        />
      </View>

      {/* What Happened */}
      <SectionLabel label="What Happened" />
      <View
        style={{
          flexDirection: 'row',
          gap: 7,
          flexWrap: 'wrap',
          marginHorizontal: 20,
        }}
      >
        {tags.map((tag, i) => (
          <TagPill key={i} emoji={tag.emoji} label={tag.label} variant="display" />
        ))}
      </View>

      {/* Notes */}
      {noteText && (
        <>
          <SectionLabel label="Notes" />
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 14,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(160,100,80,0.14)',
              shadowColor: '#EDE3D8',
              shadowOffset: { width: 3, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 2,
            }}
          >
            <View
              style={{
                position: 'relative',
                backgroundColor: colors.surface,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Note text */}
              <Text
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: fontFamily.playfair,
                  fontSize: 14,
                  fontWeight: '400',
                  fontStyle: 'italic',
                  color: '#5A3E36',
                  lineHeight: 27,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                }}
              >
                {noteText}
              </Text>
              {/* Edit note row */}
              <View
                style={{
                  position: 'relative',
                  zIndex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingTop: 6,
                  paddingHorizontal: 14,
                  paddingBottom: 10,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(160,100,80,0.1)',
                }}
              >
                <Pressable
                  onPress={onEditNote}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    padding: 0,
                  }}
                >
                  <Svg
                    width={13}
                    height={13}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.terra}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </Svg>
                  <Text
                    style={{
                      fontFamily: fontFamily.dmSans,
                      fontSize: 14,
                      color: colors.terra,
                    }}
                  >
                    Edit note
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Delete */}
      <View style={{ alignItems: 'center', paddingTop: 4, paddingBottom: 24 }}>
        <Pressable onPress={onDelete}>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 14,
              color: '#C4B0A0',
              letterSpacing: 0.5,
            }}
          >
            Delete this session
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  </View>
)
