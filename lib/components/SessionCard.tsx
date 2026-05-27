import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../theme'
import { StarRating } from './StarRating'
import { AvatarCircle } from './AvatarCircle'

export interface SessionCardProps {
  partnerInitials: string
  partnerGradient: string
  date: string
  rating: number
  activityEmojis: string[]
  note?: string
  width?: number
  onPress?: () => void
}

export const SessionCard: React.FC<SessionCardProps> = ({
  partnerInitials,
  partnerGradient,
  date,
  rating,
  activityEmojis,
  note,
  width = 158,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flexShrink: 0,
      width,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      paddingHorizontal: 14,
      gap: 10,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <AvatarCircle
        initials={partnerInitials}
        gradient={partnerGradient}
        size={36}
        borderWidth={2}
      />
      <Text style={{
        fontSize: 12,
        color: colors.stone,
        fontFamily: font('dmSans', '300'),
      }}>{date}</Text>
    </View>
    <StarRating rating={rating} size={13} />
    <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
      {activityEmojis.map((e, i) => (
        <View key={i} style={{
          backgroundColor: colors.surface2,
          borderRadius: 6,
          paddingVertical: 3,
          paddingHorizontal: 6,
        }}>
          <Text style={{ fontSize: 16 }}>{e}</Text>
        </View>
      ))}
    </View>
    {note !== undefined && (
      <Text
        numberOfLines={2}
        style={{
          fontSize: 12,
          color: colors.stone,
          fontStyle: 'italic',
          lineHeight: 14.5,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
          paddingTop: 6,
          marginTop: 2,
          fontFamily: font('dmSans', '300'),
        }}
      >{note}</Text>
    )}
  </Pressable>
)
