import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../theme'
import { AvatarCircle } from './AvatarCircle'

export interface AvatarStackPartner {
  initials: string
  gradient: string
}

export interface AvatarStackProps {
  partners: AvatarStackPartner[]
  size?: number
  borderWidth?: number
  /** How many avatars to render before the +N overflow. */
  max?: number
}

export const AvatarStack: React.FC<AvatarStackProps> = ({ partners, size = 32, borderWidth = 2, max = 3 }) => {
  // Partner-less session (most commonly a period log) — render nothing so the
  // activity emojis take centerstage. An avatar circle always means a partner;
  // the old stone placeholder read as a broken/blank avatar (TAT-7, TAT-13).
  if (partners.length === 0) return null

  const visible = partners.slice(0, max)
  const overflow = partners.length - visible.length
  // Each subsequent avatar slides over the previous by ~35% of width so the
  // initials of the leftmost are still readable.
  const overlap = Math.round(size * 0.35)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {visible.map((p, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -overlap }}>
          <AvatarCircle
            initials={p.initials}
            gradient={p.gradient}
            size={size}
            borderWidth={borderWidth}
            showShadow={false}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{
            marginLeft: -overlap,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.surface2,
            borderWidth,
            borderColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: Math.round(size * 0.32),
              color: colors.stone,
            }}
          >{`+${overflow}`}</Text>
        </View>
      )}
    </View>
  )
}
