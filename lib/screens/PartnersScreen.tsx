import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg'
import { colors, font } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarCircle } from '../components/AvatarCircle'
import { BackButton } from '../components/BackButton'

/* ── Types ── */

export interface PartnerData {
  name: string
  initials: string
  gradient: string
  since: string
  sessions: number
  avgSat: number | string
  tags: string[]
  /** If true, renders emoji-style avatar instead of initials */
  isSolo?: boolean
}

export interface PartnersScreenProps {
  partners: PartnerData[]
  /** Optional heading shown in the header row (defaults to "Partners"). */
  title?: string
  onBack?: () => void
  onPartnerTap?: (index: number) => void
  /** When provided, renders an "Add partner" row beneath the list. */
  onAddPartner?: () => void
}

/* ── Inline icon helpers ── */

const ChevronForwardIcon: React.FC<{ color?: string; opacity?: number }> = ({
  color = colors.terra,
  opacity = 0.35,
}) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={opacity}
  >
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
)

/* ── Main component ── */

export const PartnersScreen: React.FC<PartnersScreenProps> = ({
  partners,
  title = 'Partners',
  onBack,
  onPartnerTap,
  onAddPartner,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.warmSand,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <DecorativeGlow position="top-right" size={240} opacity={0.09} />
      <StatusBarSpacer />

      {/* ── Screen Header ── */}
      <View
        style={{
          paddingTop: 4,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <BackButton onPress={onBack} />
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
            position: 'absolute',
            left: '50%',
            transform: [{ translateX: '-50%' }],
          }}
        >
          {title}
        </Text>
        <View style={{ width: 34 }} />
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 14,
          paddingHorizontal: 20,
        }}
      >
        {partners.map((partner, i) => (
          <Pressable
            key={i}
            onPress={() => onPartnerTap?.(i)}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: partner.isSolo ? 'rgba(160,100,80,0.1)' : 'rgba(160,100,80,0.14)',
              borderRadius: 20,
              paddingVertical: 16,
              paddingHorizontal: 18,
              marginBottom: 10,
              overflow: 'hidden',
              shadowColor: '#3D2B25',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 1,
            }}
          >
            {/* Header row: avatar + name (header) + chevron */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <AvatarCircle initials={partner.initials} gradient={partner.gradient} size={52} borderWidth={2.5} />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: font('playfair', '700'),
                    fontSize: 20,
                    lineHeight: 24,
                    color: colors.ink,
                    marginBottom: 2,
                  }}
                >
                  {partner.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '300',
                    color: colors.stone,
                  }}
                >
                  {partner.since}
                </Text>
              </View>

              <View style={{ marginLeft: 6 }}>
                <ChevronForwardIcon />
              </View>
            </View>

            {/* Stats row — full width below the header */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: 'rgba(160,100,80,0.08)',
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderRightWidth: 1,
                  borderRightColor: 'rgba(160,100,80,0.12)',
                }}
              >
                <Text
                  style={{
                    fontFamily: font('playfair', '600'),
                    fontSize: 17,
                    color: colors.terra,
                    lineHeight: 17,
                  }}
                >
                  {partner.sessions}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: colors.stone,
                    marginTop: 2,
                  }}
                >
                  Sessions
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: font('playfair', '600'),
                    fontSize: 17,
                    color: colors.terra,
                    lineHeight: 17,
                  }}
                >
                  {partner.avgSat}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: colors.stone,
                    marginTop: 2,
                  }}
                >
                  Avg Sat
                </Text>
              </View>
            </View>

            {/* Tags row */}
            {partner.tags.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  flexWrap: 'wrap',
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(160,100,80,0.08)',
                  alignItems: 'center',
                }}
              >
                {partner.tags.map((tag, j) => (
                  <Text
                    key={j}
                    style={{
                      fontSize: 14,
                      backgroundColor: colors.surface2,
                      borderRadius: 6,
                      paddingVertical: 2,
                      paddingHorizontal: 6,
                    }}
                  >
                    {tag}
                  </Text>
                ))}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '300',
                    color: colors.stone,
                    paddingVertical: 2,
                  }}
                >
                  Most common
                </Text>
              </View>
            )}
          </Pressable>
        ))}

        {onAddPartner && (
          <Pressable
            onPress={onAddPartner}
            accessibilityRole="button"
            accessibilityLabel="Add partner"
            style={({ pressed }) => ({
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: 'rgba(192,120,88,0.3)',
              borderRadius: 20,
              paddingVertical: 16,
              paddingHorizontal: 18,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: pressed ? 'rgba(192,120,88,0.06)' : 'transparent',
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: 'rgba(192,120,88,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg
                width={22}
                height={22}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.terra}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.75}
              >
                <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <Circle cx={8.5} cy={7} r={4} />
                <Line x1={20} y1={8} x2={20} y2={14} />
                <Line x1={23} y1={11} x2={17} y2={11} />
              </Svg>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: colors.terra,
                fontFamily: font('dmSans', '500'),
              }}
            >
              Add partner
            </Text>
          </Pressable>
        )}

        <View style={{ height: 12, flexShrink: 0 }} />
      </ScrollView>
    </View>
  )
}
