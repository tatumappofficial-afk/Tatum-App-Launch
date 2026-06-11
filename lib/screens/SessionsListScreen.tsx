import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { colors, font, fontFamily } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarStack } from '../components/AvatarStack'
import { BackButton } from '../components/BackButton'
import { StarRating } from '../components/StarRating'

export interface SessionsListPartner {
  initials: string
  gradient: string
}

export interface SessionsListEntry {
  id: string
  partners: SessionsListPartner[]
  /** Optional — when omitted, only the date is shown in the row's text column. */
  partnerName?: string
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

export const SessionsListScreen: React.FC<SessionsListScreenProps> = ({
  title,
  subtitle,
  entries,
  onBack,
  onEntryPress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.warmSand,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DecorativeGlow position="top-right" size={220} opacity={0.09} />
      <StatusBarSpacer />

      {/* Header */}
      <View
        style={{
          paddingTop: 4,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <BackButton onPress={onBack} accessibilityLabel="Back" />
      </View>

      {/* Title block */}
      <View style={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: 6 }}>
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 26,
            color: colors.ink,
            lineHeight: 30,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: fontFamily.dmSans,
              fontSize: 13,
              color: colors.stone,
              letterSpacing: 0.4,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* List — FlashList virtualizes rows so memory footprint stays flat
          regardless of how many sessions there are. */}
      {entries.length === 0 ? (
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 14,
              color: colors.muted,
              fontStyle: 'italic',
            }}
          >
            No sessions in this period.
          </Text>
        </View>
      ) : (
        <FlashList
          data={entries}
          keyExtractor={(entry) => entry.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 }}
          renderItem={({ item: entry }) => (
            <Pressable
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
                  {entry.partnerName && (
                    <Text
                      style={{
                        fontFamily: font('playfair', '600'),
                        fontSize: 16,
                        color: colors.ink,
                        lineHeight: 18,
                      }}
                    >
                      {entry.partnerName}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.stone,
                      fontFamily: font('dmSans', '300'),
                      marginTop: entry.partnerName ? 2 : 0,
                    }}
                  >
                    {entry.date}
                  </Text>
                </View>
                {entry.rating !== null && entry.rating > 0 && <StarRating rating={entry.rating} size={13} />}
              </View>
              {entry.tags.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                  {entry.tags.map((emoji, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: colors.surface2,
                        borderRadius: 6,
                        paddingVertical: 2,
                        paddingHorizontal: 6,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>{emoji}</Text>
                    </View>
                  ))}
                </View>
              )}
              {entry.note && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    color: colors.stone,
                    fontStyle: 'italic',
                    lineHeight: 17,
                    fontFamily: font('dmSans', '300'),
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(160,100,80,0.1)',
                    paddingTop: 8,
                  }}
                >
                  {entry.note}
                </Text>
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  )
}
