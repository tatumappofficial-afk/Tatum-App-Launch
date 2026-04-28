import React from 'react'
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, parseGradientColors } from '../theme'
import { GradientButton } from '../components/GradientButton'
import { TagPill } from '../components/TagPill'
import { RatingSlider } from '../components/RatingSlider'
import { SuccessOverlay } from '../components/SuccessOverlay'

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
  title?: string
  saveLabel?: string
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
  onDelete?: () => void
  onClose?: () => void
  onDatePress?: () => void
  calendarOpen?: boolean
  calendarContent?: React.ReactNode
  showSuccess?: boolean
  successLabel?: string
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
  title = 'Log a Session',
  saveLabel = 'Save Session',
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
  onDelete,
  onClose,
  onDatePress,
  calendarOpen = false,
  calendarContent,
  showSuccess = false,
  successLabel = 'Session added',
}) => {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.warmSand,
      }}
    >
        {/* Scrollable form body — header scrolls with content */}
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: 8,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            marginBottom: 14,
          }}>
            <Text style={{
              fontFamily: font('playfair', '700'),
              fontSize: 20,
              color: colors.ink,
            }}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable
                onPress={onDatePress}
                accessibilityRole="button"
                accessibilityLabel={`Date: ${date}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderRadius: 9999,
                  paddingVertical: 6,
                  paddingLeft: 12,
                  paddingRight: 10,
                  overflow: 'hidden',
                  shadowColor: '#7C4A5A',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.28,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <LinearGradient
                  colors={gradients.primaryCta}
                  start={gradientPoints.diagonal.start}
                  end={gradientPoints.diagonal.end}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={{ fontSize: 12, fontWeight: '500', color: colors.white }}>{date}</Text>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Polyline points={calendarOpen ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
              <Pressable
                onPress={onClose}
                style={{
                  width: 30, height: 30, borderRadius: 15,
                  backgroundColor: colors.surface2,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <Line x1={18} y1={6} x2={6} y2={18} />
                  <Line x1={6} y1={6} x2={18} y2={18} />
                </Svg>
              </Pressable>
            </View>
          </View>

          {/* ── Date picker dropdown ── */}
          {calendarOpen && calendarContent && (
            <View style={{ zIndex: 100, marginBottom: 8 }}>
              {calendarContent}
            </View>
          )}

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
                      borderWidth: 2.5,
                      borderColor: selected ? colors.terra : 'transparent',
                      overflow: 'hidden',
                      shadowColor: '#3D2B25',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.12,
                      shadowRadius: 8,
                      elevation: 2,
                    }}>
                      <LinearGradient
                        colors={parseGradientColors(p.gradient)}
                        start={gradientPoints.diagonal.start}
                        end={gradientPoints.diagonal.end}
                        style={StyleSheet.absoluteFill}
                      />
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
          <View style={{ marginBottom: 16 }}>
            <RatingSlider value={rating} onChange={onRatingChange} />
          </View>

          {/* ── NOTES ── */}
          <FormLabel>Notes</FormLabel>
          <TextInput
            value={notes}
            onChangeText={(text) => onNotesChange?.(text)}
            placeholder={"How did it feel? What made this moment special\u2026"}
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            maxLength={3000}
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
          <Text style={{
            fontSize: 10,
            color: (notes?.length || 0) > 2800 ? colors.terra : colors.muted,
            textAlign: 'right',
            fontFamily: fontFamily.dmSans,
            marginBottom: 4,
          }}>{notes?.length || 0} / 3,000</Text>
        </ScrollView>

        {/* ── Footer ── */}
        <View style={{
          flexShrink: 0,
          paddingVertical: 10,
          paddingHorizontal: 20,
          paddingBottom: 34,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.1)',
          backgroundColor: colors.warmSand,
        }}>
          <GradientButton label={saveLabel} onPress={onSave} height={50} />
          {onDelete && (
            <Pressable
              onPress={onDelete}
              style={{
                alignItems: 'center',
                paddingTop: 14,
              }}
            >
              <Text style={{
                fontSize: 13,
                fontFamily: font('dmSans', '500'),
                color: '#B04040',
                letterSpacing: 0.3,
              }}>Delete Session</Text>
            </Pressable>
          )}
        </View>

        <SuccessOverlay visible={showSuccess} label={successLabel} />
    </KeyboardAvoidingView>
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
