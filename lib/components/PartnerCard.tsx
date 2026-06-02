import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../theme'
import { AvatarCircle } from './AvatarCircle'

export interface PartnerCardProps {
  initials: string
  gradient: string
  name?: string
  sessions?: number
  avgSatisfaction?: number
  topActivityEmoji?: string
  emptyText?: string
  onPress?: () => void
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  initials,
  gradient,
  name,
  sessions,
  avgSatisfaction,
  topActivityEmoji,
  emptyText,
  onPress,
}) => {
  const hasStats = sessions !== undefined && avgSatisfaction !== undefined

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexShrink: 0,
        width: hasStats ? 126 : 110,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: hasStats ? 16 : 14,
        paddingHorizontal: hasStats ? 12 : 10,
        alignItems: 'center',
        gap: hasStats ? 8 : 6,
        overflow: 'hidden',
      }}
    >
      <AvatarCircle
        initials={initials}
        gradient={gradient}
        size={hasStats ? 52 : 44}
        borderWidth={hasStats ? 2.5 : 2}
      />

      {name && (
        <Text
          style={{
            fontSize: 14,
            color: colors.ink,
            fontFamily: font('dmSans', '500'),
          }}
        >
          {name}
        </Text>
      )}

      {hasStats && (
        <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: font('playfair', '600'),
                fontSize: 17,
                color: colors.terra,
                lineHeight: 17,
              }}
            >
              {sessions}
            </Text>
            <Text
              style={{
                fontSize: 12,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: colors.stone,
                marginTop: 2,
                fontFamily: fontFamily.dmSans,
              }}
            >
              Sessions
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: font('playfair', '600'),
                fontSize: 17,
                color: colors.terra,
                lineHeight: 17,
              }}
            >
              {avgSatisfaction!.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: 12,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: colors.stone,
                marginTop: 2,
                fontFamily: fontFamily.dmSans,
              }}
            >
              Avg Sat.
            </Text>
          </View>
        </View>
      )}

      {topActivityEmoji && (
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            fontFamily: font('dmSans', '300'),
          }}
        >
          {topActivityEmoji} Most common
        </Text>
      )}

      {emptyText && (
        <Text
          style={{
            fontSize: 12,
            color: '#C4B0A0',
            fontStyle: 'italic',
            fontFamily: font('dmSans', '300'),
          }}
        >
          {emptyText}
        </Text>
      )}
    </Pressable>
  )
}
