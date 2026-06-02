import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { colors, font } from '../../../theme'
import { AvatarCircle } from '../../../components/AvatarCircle'
import type { Partner } from '@/src/db/schema'

const DEFAULT_MAX_VISIBLE = 20

export interface PartnerStripProps {
  partners: Partner[]
  onPress?: (partner: Partner) => void
  /** Shown as a "+N more" pill at the end when partners exceed maxVisible. */
  onViewAll?: () => void
  maxVisible?: number
}

export const PartnerStrip: React.FC<PartnerStripProps> = ({
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
        {visible.map((p) => (
          <PartnerChip key={p.id} partner={p} onPress={() => onPress?.(p)} />
        ))}
        {overflow > 0 && onViewAll && <ViewMoreChip count={overflow} onPress={onViewAll} />}
      </View>
    </ScrollView>
  )
}

const ViewMoreChip: React.FC<{ count: number; onPress: () => void }> = ({ count, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`View ${count} more partners`}
    style={({ pressed }) => ({
      flexShrink: 0,
      width: 96,
      backgroundColor: pressed ? colors.surface2 : colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      opacity: pressed ? 0.85 : 1,
    })}
  >
    <Text
      style={{
        fontFamily: font('playfair', '600'),
        fontSize: 16,
        color: colors.terra,
      }}
    >
      +{count}
    </Text>
    <Text
      numberOfLines={1}
      style={{
        fontSize: 12,
        color: colors.stone,
        fontFamily: font('dmSans', '500'),
        letterSpacing: 0.5,
      }}
    >
      View all
    </Text>
  </Pressable>
)

const PartnerChip: React.FC<{ partner: Partner; onPress?: () => void }> = ({ partner, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={partner.displayName}
    style={({ pressed }) => {
      const baseOpacity = partner.isActive ? 1 : 0.6
      return {
        flexShrink: 0,
        width: 96,
        backgroundColor: pressed ? colors.surface2 : colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        gap: 6,
        opacity: pressed ? baseOpacity * 0.85 : baseOpacity,
      }
    }}
  >
    <AvatarCircle initials={partner.avatarValue} gradient={partner.avatarGradient} size={40} borderWidth={2} />
    {!partner.isActive && (
      <Text
        style={{
          fontSize: 12,
          color: colors.muted,
          fontFamily: font('dmSans', '300'),
          fontStyle: 'italic',
        }}
      >
        past
      </Text>
    )}
  </Pressable>
)
