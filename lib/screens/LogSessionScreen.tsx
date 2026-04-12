import React, { useRef } from 'react'
import { View, Text, Pressable, ScrollView, TextInput, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradients, gradientStyle } from '../theme'
import { GradientButton } from '../components/GradientButton'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface Partner {
  id: string
  initials: string
  name: string
  gradient: string
  isSolo?: boolean
}

export interface ActivityTag {
  id: string
  emoji: string
  label: string
}

export interface LogSessionScreenProps {
  date?: string
  partners?: Partner[]
  selectedPartnerIds?: string[]
  activities?: ActivityTag[]
  selectedActivityIds?: string[]
  rating?: number
  notes?: string
  onPartnerToggle?: (id: string) => void
  onActivityToggle?: (id: string) => void
  onRatingChange?: (value: number) => void
  onNotesChange?: (value: string) => void
  onAddPartner?: () => void
  onSave?: () => void
}

/* ── Default data ── */

const defaultPartners: Partner[] = [
  { id: 'alex', initials: 'AL', name: 'Alex', gradient: `linear-gradient(135deg, ${colors.terra}, ${colors.fig})` },
  { id: 'jordan', initials: 'JO', name: 'Jordan', gradient: `linear-gradient(135deg, ${colors.mauve}, ${colors.fig})` },
  { id: 'solo', initials: '', name: 'Solo', gradient: `linear-gradient(135deg, ${colors.stone}, #6A5848)`, isSolo: true },
]

const defaultActivities: ActivityTag[] = [
  { id: 'penetration', emoji: '\u{1F346}', label: 'Penetration' },
  { id: 'oral', emoji: '\u{1F48B}', label: 'Oral' },
  { id: 'manual', emoji: '\u270B', label: 'Manual' },
  { id: 'solo', emoji: '\u2728', label: 'Solo' },
  { id: 'kissing', emoji: '\u{1F618}', label: 'Kissing' },
  { id: 'cuddle', emoji: '\u{1F319}', label: 'Cuddle' },
  { id: 'toys', emoji: '\u{1FA84}', label: 'Toys' },
  { id: 'period', emoji: '\u{1FA78}', label: 'Period' },
]

/* ── Component ── */

export const LogSessionScreen: React.FC<LogSessionScreenProps> = ({
  date = 'Tue, Mar 25',
  partners = defaultPartners,
  selectedPartnerIds = ['alex'],
  activities = defaultActivities,
  selectedActivityIds = ['penetration', 'manual'],
  rating = 8.5,
  notes = '',
  onPartnerToggle,
  onActivityToggle,
  onRatingChange,
  onNotesChange,
  onAddPartner,
  onSave,
}) => {
  const ratingPct = (rating / 10) * 100
  const trackWidthRef = useRef(0)

  function handleTrackLayout(e: LayoutChangeEvent) {
    trackWidthRef.current = e.nativeEvent.layout.width
  }

  function handleTrackPress(e: GestureResponderEvent) {
    if (trackWidthRef.current <= 0) return
    const x = e.nativeEvent.locationX
    const value = Math.round((x / trackWidthRef.current) * 10)
    onRatingChange?.(Math.max(0, Math.min(10, value)))
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.warmSand,
    }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          paddingHorizontal: 20,
          flexShrink: 0,
        }}>
          <Text style={{
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
          }}>Log a Session</Text>
          <Pressable style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            ...gradientStyle(`linear-gradient(135deg, ${gradients.primaryCta[0]}, ${gradients.primaryCta[1]})`),
            borderRadius: 9999,
            paddingVertical: 6,
            paddingLeft: 12,
            paddingRight: 10,
            boxShadow: '0 2px 10px rgba(124,74,90,0.28)',
          }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.white }}>{date}</Text>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Polyline points="6 9 12 15 18 9" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        </View>

        {/* Scrollable form body */}
        <ScrollView style={{
          flex: 1,
          paddingTop: 14,
          paddingHorizontal: 20,
        }}>
          {/* ── WITH (partners) ── */}
          <FormLabel>With</FormLabel>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            {partners.map((p) => {
              const selected = selectedPartnerIds.includes(p.id)
              return (
                <Pressable
                  key={p.id}
                  style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  onPress={() => onPartnerToggle?.(p.id)}
                >
                  <View style={{ position: 'relative' }}>
                    <View style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...gradientStyle(p.gradient),
                      borderWidth: 2.5,
                      borderColor: selected ? colors.terra : 'transparent',
                      boxShadow: selected
                        ? '0 0 0 3px rgba(192,120,88,0.18), 0 2px 8px rgba(61,43,37,0.12)'
                        : '0 2px 8px rgba(61,43,37,0.12)',
                    }}>
                      <Text style={{
                        fontFamily: font('playfair', '700'),
                        fontSize: p.isSolo ? 20 : 15,
                        color: colors.white,
                      }}>{p.isSolo ? '\u2728' : p.initials}</Text>
                    </View>
                    {selected && (
                      <View style={{
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: colors.terra,
                        borderWidth: 2,
                        borderColor: colors.warmSand,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 8, color: colors.white, fontWeight: '700' }}>{'\u2713'}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{
                    fontSize: 9,
                    fontWeight: selected ? '500' : '400',
                    color: selected ? colors.terra : colors.stone,
                  }}>{p.name}</Text>
                </Pressable>
              )
            })}
            {/* Add button */}
            <Pressable onPress={() => onAddPartner?.()} style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <View style={{ position: 'relative' }}>
                <View style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: 'rgba(192,120,88,0.35)',
                }}>
                  <Text style={{
                    color: colors.terra,
                    fontFamily: fontFamily.dmSans,
                    fontSize: 20,
                  }}>{'\uFF0B'}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 9, fontWeight: '400', color: colors.terra }}>Add</Text>
            </Pressable>
          </View>

          {/* ── WHAT HAPPENED (activity tags) ── */}
          <FormLabel>What happened</FormLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {activities.map((tag) => (
              <TagPill
                key={tag.id}
                emoji={tag.emoji}
                label={tag.label}
                variant="selectable"
                selected={selectedActivityIds.includes(tag.id)}
                onPress={() => onActivityToggle?.(tag.id)}
              />
            ))}
          </View>

          {/* ── RATING ── */}
          <FormLabel>Rating</FormLabel>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
            <Text style={{
              fontFamily: font('playfair', '700'),
              fontSize: 22,
              color: colors.terra,
            }}>{rating}</Text>
            <Text style={{ fontSize: 11, fontWeight: '300', color: colors.stone }}> / 10</Text>
          </View>
          <Pressable
            onLayout={handleTrackLayout}
            onPress={handleTrackPress}
            style={{
              position: 'relative',
              height: 20,
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <View style={{
              height: 4,
              backgroundColor: colors.surface2,
              borderRadius: 2,
            }}>
              <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${ratingPct}%`,
                ...gradientStyle(`linear-gradient(to right, ${colors.terra}, ${colors.mauve})`),
                borderRadius: 2,
              }} />
            </View>
            <View style={{
              position: 'absolute',
              top: 0,
              left: `${ratingPct}%`,
              marginLeft: -10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.white,
              borderWidth: 2.5,
              borderColor: colors.terra,
              boxShadow: '0 2px 8px rgba(124,74,90,0.3)',
            }} />
          </Pressable>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            {['None', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((l, i) => (
              <Pressable key={l} onPress={() => onRatingChange?.(i)} hitSlop={4}>
                <Text style={{ fontSize: 8.5, fontWeight: rating === i ? '600' : '300', color: rating === i ? colors.terra : '#C4B0A0' }}>{l}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── NOTES ── */}
          <FormLabel>Notes</FormLabel>
          <TextInput
            value={notes}
            onChangeText={(text) => onNotesChange?.(text)}
            placeholder="How did it feel? What made tonight special\u2026"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            style={{
              width: '100%',
              backgroundColor: colors.surface,
              borderWidth: 1.5,
              borderColor: colors.border,
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
              fontFamily: fontFamily.playfair,
              fontSize: 13,
              fontStyle: 'italic',
              color: '#5A3E36',
              lineHeight: 21,
              marginBottom: 4,
              minHeight: 70,
              textAlignVertical: 'top',
            }}
          />
        </ScrollView>

        {/* ── Footer ── */}
        <View style={{
          flexShrink: 0,
          paddingVertical: 10,
          paddingHorizontal: 20,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
          backgroundColor: colors.warmSand,
        }}>
          <GradientButton label="Save Session" onPress={onSave} height={50} />
        </View>
    </View>
  )
}

/* ── Helpers ── */

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.stone,
    marginBottom: 8,
  }}>{children}</Text>
)
