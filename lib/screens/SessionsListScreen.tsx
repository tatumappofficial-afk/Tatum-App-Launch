import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarStack } from '../components/AvatarStack'
import { StarRating } from '../components/StarRating'

export interface SessionsListPartner {
  initials: string
  gradient: string
}

export interface SessionsListEntry {
  id: string
  partners: SessionsListPartner[]
  partnerName: string
  /** Display label, e.g. "Sat · Apr 25" */
  date: string
  rating: number | null
  tags: string[]
  note?: string
}

export interface SessionsListScreenProps {
  title: string
  subtitle?: string
  entries: SessionsListEntry[]
  onBack?: () => void
  onEntryPress?: (id: string) => void
}

const BackChevron: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
)

export const SessionsListScreen: React.FC<SessionsListScreenProps> = ({
  title,
  subtitle,
  entries,
  onBack,
  onEntryPress,
}) => {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.warmSand,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <DecorativeGlow position="top-right" size={220} opacity={0.09} />
      <StatusBarSpacer />

      {/* Header */}
      <View style={{
        paddingTop: 4,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => ({
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <BackChevron />
        </Pressable>
      </View>

      {/* Title block */}
      <View style={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: 6 }}>
        <Text style={{
          fontFamily: font('playfair', '700'),
          fontSize: 26,
          color: colors.ink,
          lineHeight: 30,
        }}>{title}</Text>
        {subtitle && (
          <Text style={{
            fontFamily: fontFamily.dmSans,
            fontSize: 13,
            color: colors.stone,
            letterSpacing: 0.4,
            marginTop: 4,
          }}>{subtitle}</Text>
        )}
      </View>

      {/* List */}
      {entries.length === 0 ? (
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 14,
            color: colors.muted,
            fontStyle: 'italic',
          }}>No sessions in this period.</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
        >
          {entries.map(entry => (
            <Pressable
              key={entry.id}
              onPress={() => onEntryPress?.(entry.id)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.surface2 : colors.surface,
                borderWidth: 1,
                borderColor: 'rgba(160,100,80,0.15)',
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 16,
                marginBottom: 10,
                gap: 10,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <AvatarStack partners={entry.partners} size={36} borderWidth={2} />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: font('playfair', '600'),
                    fontSize: 16,
                    color: colors.ink,
                    lineHeight: 18,
                  }}>{entry.partnerName}</Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.stone,
                    fontFamily: font('dmSans', '300'),
                    marginTop: 2,
                  }}>{entry.date}</Text>
                </View>
                {entry.rating !== null && entry.rating > 0 && (
                  <StarRating rating={entry.rating} size={13} />
                )}
              </View>
              {entry.tags.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                  {entry.tags.map((emoji, i) => (
                    <View key={i} style={{
                      backgroundColor: colors.surface2,
                      borderRadius: 6,
                      paddingVertical: 2,
                      paddingHorizontal: 6,
                    }}>
                      <Text style={{ fontSize: 14 }}>{emoji}</Text>
                    </View>
                  ))}
                </View>
              )}
              {entry.note && (
                <Text numberOfLines={2} style={{
                  fontSize: 13,
                  color: colors.stone,
                  fontStyle: 'italic',
                  lineHeight: 17,
                  fontFamily: font('dmSans', '300'),
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(160,100,80,0.1)',
                  paddingTop: 8,
                }}>{entry.note}</Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
