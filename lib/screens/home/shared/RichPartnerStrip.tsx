import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../../../theme'
import { AvatarCircle } from '../../../components/AvatarCircle'
import type { PartnerLifetimeStats } from '../../../stats'

const DEFAULT_MAX_VISIBLE = 20

export interface RichPartnerStripProps {
  partners: PartnerLifetimeStats[]
  onPress?: (partnerId: string) => void
  /** Shown as a "+N more" pill at the end when partners exceed maxVisible. */
  onViewAll?: () => void
  maxVisible?: number
}

export const RichPartnerStrip: React.FC<RichPartnerStripProps> = ({
  partners,
  onPress,
  onViewAll,
  maxVisible = DEFAULT_MAX_VISIBLE,
}) => {
  const visible = partners.slice(0, maxVisible)
  const overflow = partners.length - visible.length
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -24 }}>
      <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
        {visible.map(p => (
          <RichPartnerCard key={p.partner.id} stats={p} onPress={() => onPress?.(p.partner.id)} />
        ))}
        {overflow > 0 && onViewAll && (
          <ViewMoreCard count={overflow} onPress={onViewAll} />
        )}
      </View>
    </ScrollView>
  )
}

const ViewMoreCard: React.FC<{ count: number; onPress: () => void }> = ({ count, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`View ${count} more partners`}
    style={{
      flexShrink: 0,
      width: 126,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    }}
  >
    <Text style={{
      fontFamily: font('playfair', '600'),
      fontSize: 28,
      color: colors.terra,
      lineHeight: 30,
    }}>+{count}</Text>
    <Text
      numberOfLines={1}
      style={{
        fontSize: 10,
        color: colors.stone,
        fontFamily: font('dmSans', '500'),
        letterSpacing: 0.5,
      }}
    >View all partners</Text>
  </Pressable>
)

const RichPartnerCard: React.FC<{ stats: PartnerLifetimeStats; onPress?: () => void }> = ({ stats, onPress }) => {
  const { partner, sessionCount, averageStars, topActivityEmoji } = stats
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={partner.displayName}
      style={{
        flexShrink: 0,
        width: 126,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      <AvatarCircle
        initials={partner.avatarValue}
        gradient={partner.avatarGradient}
        size={52}
        borderWidth={2.5}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          color: colors.ink,
          fontFamily: font('dmSans', '500'),
        }}
      >
        {partner.displayName}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontFamily: font('playfair', '600'),
            fontSize: 17,
            color: colors.terra,
            lineHeight: 17,
          }}>{sessionCount}</Text>
          <Text style={{
            fontSize: 7,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginTop: 2,
            fontFamily: fontFamily.dmSans,
          }}>Sessions</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontFamily: font('playfair', '600'),
            fontSize: 17,
            color: colors.terra,
            lineHeight: 17,
          }}>{averageStars === null ? '—' : averageStars.toFixed(1)}</Text>
          <Text style={{
            fontSize: 7,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginTop: 2,
            fontFamily: fontFamily.dmSans,
          }}>Avg Rating</Text>
        </View>
      </View>
      {topActivityEmoji && (
        <Text style={{
          fontSize: 10,
          color: colors.muted,
          fontFamily: font('dmSans', '300'),
        }}>{topActivityEmoji} Most common</Text>
      )}
    </Pressable>
  )
}
