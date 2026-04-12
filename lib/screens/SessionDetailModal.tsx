import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import Svg, { Path, Polyline } from 'react-native-svg'
import { colors, font, fontFamily } from '../theme'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
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

export interface SessionDetailModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  backLabel: string        // e.g. "March 7"
  partnerName: string
  partnerInitials: string
  partnerGradient: string
  dateLabel: string        // e.g. "Saturday, March 7, 2026 · Evening"
  rating: number           // out of 10
  dayOfWeek: string        // e.g. "Sat"
  tags: ActivityTag[]
  noteText?: string
  onBack?: () => void
  onEdit?: () => void
  onEditNote?: () => void
  onDelete?: () => void
}

/* ── Main Component ── */

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  backLabel, partnerName, partnerInitials, partnerGradient,
  dateLabel, rating, dayOfWeek, tags, noteText,
  onBack, onEdit, onEditNote, onDelete,
}) => (
  <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
    {/* Header: back pill + edit */}
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 10, paddingHorizontal: 20, flexShrink: 0,
    }}>
      <Pressable
        onPress={onBack}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: colors.surface2, borderRadius: 9999,
          paddingVertical: 6, paddingLeft: 8, paddingRight: 12,
        }}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="15 18 9 12 15 6" />
        </Svg>
        <Text style={{
          fontFamily: fontFamily.dmSans, fontSize: 12, fontWeight: '400', color: colors.stone,
        }}>{backLabel}</Text>
      </Pressable>
      <Pressable
        onPress={onEdit}
        style={{
          backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(160,100,80,0.3)',
          borderRadius: 9999, paddingVertical: 5, paddingHorizontal: 14,
        }}
      >
        <Text style={{
          fontFamily: font('dmSans', '500'), fontSize: 11, color: colors.terra,
          letterSpacing: 0.5,
        }}>Edit</Text>
      </Pressable>
    </View>

    {/* Scrollable content */}
    <ScrollView style={{ flex: 1 }}>
      {/* Hero */}
      <View style={{
        flexDirection: 'column', alignItems: 'center',
        paddingTop: 16, paddingHorizontal: 24,
      }}>
        <View style={{ marginBottom: 10 }}>
          <AvatarCircle
            initials={partnerInitials}
            gradient={partnerGradient}
            size={68}
            borderWidth={3}
          />
        </View>
        <Text style={{
          fontFamily: font('playfair', '700'), fontSize: 22,
          color: colors.ink, marginBottom: 3,
        }}>{partnerName}</Text>
        <Text style={{
          fontFamily: font('dmSans', '300'), fontSize: 11, color: colors.stone,
        }}>{dateLabel}</Text>
      </View>

      {/* Stat strip */}
      <View style={{ marginTop: 14, marginHorizontal: 20 }}>
        <StatStrip stats={[
          { value: rating, unit: ' /10', label: 'Rating' },
          { value: dayOfWeek, label: 'Day' },
        ]} />
      </View>

      {/* What Happened */}
      <SectionLabel label="What Happened" />
      <View style={{
        flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginHorizontal: 20,
      }}>
        {tags.map((tag, i) => (
          <TagPill key={i} emoji={tag.emoji} label={tag.label} variant="display" />
        ))}
      </View>

      {/* Notes */}
      {noteText && (
        <>
          <SectionLabel label="Notes" />
          <View style={{
            marginHorizontal: 20, marginBottom: 14, borderRadius: 16, overflow: 'hidden',
            borderWidth: 1, borderColor: 'rgba(160,100,80,0.14)', position: 'relative',
            boxShadow: '3px 4px 0 0 #EDE3D8',
          }}>
            <View style={{
              position: 'relative', backgroundColor: colors.surface,
              borderRadius: 16, overflow: 'hidden',
            }}>
              {/* Note text */}
              <Text style={{
                position: 'relative', zIndex: 1,
                fontFamily: fontFamily.playfair, fontSize: 13, fontWeight: '400',
                fontStyle: 'italic', color: '#5A3E36',
                lineHeight: 27, paddingVertical: 12, paddingHorizontal: 16,
              }}>{noteText}</Text>
              {/* Edit note row */}
              <View style={{
                position: 'relative', zIndex: 1,
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingTop: 6, paddingHorizontal: 14, paddingBottom: 10,
                borderTopWidth: 1, borderTopColor: 'rgba(160,100,80,0.1)',
              }}>
                <Pressable
                  onPress={onEditNote}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 5,
                    padding: 0,
                  }}
                >
                  <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </Svg>
                  <Text style={{
                    fontFamily: fontFamily.dmSans, fontSize: 11, color: colors.terra,
                  }}>Edit note</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Delete */}
      <View style={{ alignItems: 'center', paddingTop: 4, paddingBottom: 24 }}>
        <Pressable onPress={onDelete}>
          <Text style={{
            fontFamily: font('dmSans', '300'), fontSize: 11,
            color: '#C4B0A0', letterSpacing: 0.5,
          }}>Delete this session</Text>
        </Pressable>
      </View>
    </ScrollView>
  </View>
)
