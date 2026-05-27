import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../../../theme'
import { AvatarStack } from '../../../components/AvatarStack'
import { StarRating } from '../../../components/StarRating'
import type { Encounter, Partner } from '@/src/db/schema'

export interface StandoutSessionsProps {
  sessions: Encounter[]
  partners: Partner[]
  onPress?: (encounter: Encounter) => void
}

export const StandoutSessions: React.FC<StandoutSessionsProps> = ({ sessions, partners, onPress }) => {
  const partnerById = new Map(partners.map(p => [p.id, p]))
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -24 }}>
      <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
        {sessions.map(s => {
          const sessionPartners = s.partnerIds
            .map(id => partnerById.get(id))
            .filter((p): p is Partner => p !== undefined)
            .map(p => ({ initials: p.avatarValue, gradient: p.avatarGradient }))
          return (
            <Pressable
              key={s.id}
              onPress={() => onPress?.(s)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexShrink: 0,
                width: 158,
                backgroundColor: pressed ? colors.surface2 : colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 16,
                padding: 14,
                gap: 8,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <AvatarStack partners={sessionPartners} size={32} borderWidth={2} />
                <Text style={{
                  fontSize: 12,
                  color: colors.stone,
                  fontFamily: font('dmSans', '300'),
                }}>{formatDateShort(s.date)}</Text>
              </View>
              <StarRating rating={s.stars ?? 0} size={12} />
              <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                {s.activities.map((e, i) => (
                  <View key={i} style={{
                    backgroundColor: colors.surface2,
                    borderRadius: 6,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}>
                    <Text style={{ fontSize: 14 }}>{e}</Text>
                  </View>
                ))}
              </View>
              {s.notes && (
                <Text numberOfLines={2} style={{
                  fontSize: 12,
                  color: colors.stone,
                  fontStyle: 'italic',
                  lineHeight: 13,
                  fontFamily: font('dmSans', '300'),
                }}>{s.notes}</Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </ScrollView>
  )
}

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
