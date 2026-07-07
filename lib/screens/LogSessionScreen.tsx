import React, { useEffect, useState } from 'react'
import { Keyboard, Platform, StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
// RNGH ScrollView so the activities strip coordinates with the Android sheet's pan.
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, parseGradientColors } from '../theme'
import { GradientButton } from '../components/GradientButton'
import { TagPill } from '../components/TagPill'
import { RatingSlider } from '../components/RatingSlider'
import { SuccessOverlay } from '../components/SuccessOverlay'
import { useSheetPanGesture } from '@/app/(sheets)/_layout'

/* ── Types ── */

export interface Partner {
  id: string
  initials: string
  name: string
  gradient: string
}

export interface ActivityTag {
  id: string
  // Stable unique row id, used as the React key. `id` is the emoji (used for
  // selection/storage) and can collide when two tags share an emoji, so it's
  // unsafe as a key on its own.
  tagId?: string
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
  { id: 'solo', initials: '✨', name: 'Solo', gradient: `linear-gradient(135deg, ${colors.stone}, #6A5848)` },
]

const defaultActivities: ActivityTag[] = [
  { id: 'penetration', emoji: '\u{1F346}', label: 'Penetration' },
  { id: 'oral', emoji: '\u{1F48B}', label: 'Oral' },
  { id: 'manual', emoji: '✋', label: 'Manual' },
  { id: 'solo', emoji: '✨', label: 'Solo' },
  { id: 'kissing', emoji: '\u{1F618}', label: 'Kissing' },
  { id: 'cuddle', emoji: '\u{1F319}', label: 'Cuddle' },
  { id: 'toys', emoji: '\u{1FA84}', label: 'Toys' },
  { id: 'period', emoji: '\u{1FA78}', label: 'Period' },
]

const ACTIVITY_ROWS = 4
const ACTIVITY_ROW_HEIGHT = 33
const ACTIVITY_GAP = 6

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
  onSave,
  onDelete,
  onClose,
  onDatePress,
  calendarOpen = false,
  calendarContent,
  showSuccess = false,
  successLabel = 'Session added',
}) => {
  const canSave = selectedActivityIds.length > 0
  const insets = useSafeAreaInsets()
  const sheetPanRef = useSheetPanGesture()
  const scrollProps = sheetPanRef ? { simultaneousHandlers: sheetPanRef as React.RefObject<any> } : {}

  // Hide the footer while the keyboard is up.
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
    const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
    const showAndroid = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    const hideAndroid = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
    return () => {
      show.remove()
      hide.remove()
      showAndroid.remove()
      hideAndroid.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        bounces={false}
      >
        {/* Header — scrolls with content */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={onDatePress}
              accessibilityRole="button"
              accessibilityLabel={`Date: ${date}`}
              style={styles.dateButton}
            >
              <LinearGradient
                colors={gradients.primaryCta}
                start={gradientPoints.diagonal.start}
                end={gradientPoints.diagonal.end}
                style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
              />
              <Text style={styles.dateText}>{date}</Text>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Polyline
                  points={calendarOpen ? '6 15 12 9 18 15' : '6 9 12 15 18 9'}
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              style={styles.closeButton}
            >
              <Svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.stone}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Line x1={18} y1={6} x2={6} y2={18} />
                <Line x1={6} y1={6} x2={18} y2={18} />
              </Svg>
            </Pressable>
          </View>
        </View>

        {/* ── Date picker dropdown ── */}
        {calendarOpen && calendarContent && <View style={styles.calendarDropdown}>{calendarContent}</View>}

        {/* ── WITH (partners) ── */}
        <FormLabel>With</FormLabel>
        <View style={styles.partnersRow}>
          {partners.map((p) => {
            const selected = selectedPartnerIds.includes(p.id)
            return (
              <Pressable key={p.id} style={styles.partnerItem} onPress={() => onPartnerToggle?.(p.id)}>
                <View style={styles.partnerAvatarWrapper}>
                  <View style={[styles.partnerAvatar, { borderColor: selected ? colors.terra : 'transparent' }]}>
                    <LinearGradient
                      colors={parseGradientColors(p.gradient)}
                      start={gradientPoints.diagonal.start}
                      end={gradientPoints.diagonal.end}
                      style={[StyleSheet.absoluteFill, { borderRadius: 23 }]}
                    />
                    <Text style={styles.partnerInitials}>{p.initials}</Text>
                  </View>
                  {selected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedCheck}>{'✓'}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>

        {/* ── WHAT HAPPENED (activity tags) ── */}
        <FormLabel>What happened</FormLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activitiesScroll}
          contentContainerStyle={styles.activitiesContent}
          {...scrollProps}
        >
          {activities.map((tag) => (
            <TagPill
              key={tag.tagId ?? tag.id}
              emoji={tag.emoji}
              label={tag.label}
              variant="selectable"
              selected={selectedActivityIds.includes(tag.id)}
              onPress={() => onActivityToggle?.(tag.id)}
            />
          ))}
        </ScrollView>

        {/* ── RATING ── */}
        <FormLabel>Rating</FormLabel>
        <View style={styles.ratingWrapper}>
          <RatingSlider value={rating} onChange={onRatingChange} />
        </View>

        {/* ── NOTES ── */}
        <FormLabel>Notes</FormLabel>
        <TextInput
          value={notes}
          onChangeText={(text) => onNotesChange?.(text)}
          placeholder={'How did it feel? What made this moment special…'}
          placeholderTextColor={colors.muted}
          multiline
          // On Fabric, numberOfLines hard-caps the iOS field height (and iOS
          // internal scroll must stay enabled so the caret/loupe can reach
          // overflowing text). Android keeps its native 3-line + caret-follow
          // behavior via numberOfLines; scrollEnabled is an iOS-only prop.
          numberOfLines={Platform.OS === 'android' ? 3 : undefined}
          maxLength={3000}
          autoCapitalize="sentences"
          autoCorrect
          style={styles.notesInput}
        />
        <Text style={[styles.charCount, { color: (notes?.length || 0) > 2800 ? colors.terra : colors.muted }]}>
          {notes?.length || 0} / 3,000
        </Text>
      </KeyboardAwareScrollView>

      {!keyboardVisible && (
        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) + (Platform.OS === 'android' ? 12 : 0) }]}
        >
          <GradientButton label={saveLabel} onPress={onSave} height={50} disabled={!canSave} />
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete Session</Text>
            </Pressable>
          )}
        </View>
      )}

      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </KeyboardAvoidingView>
  )
}

/* ── Helpers ── */

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.formLabel}>{children}</Text>
)

/* ── Styles ── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmSand,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 14,
  },
  title: {
    fontFamily: font('playfair', '700'),
    fontSize: 20,
    color: colors.ink,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
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
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDropdown: {
    zIndex: 100,
    marginBottom: 8,
  },
  partnersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  partnerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  partnerAvatarWrapper: {
    position: 'relative',
  },
  partnerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  partnerInitials: {
    fontFamily: font('playfair', '700'),
    fontSize: 15,
    color: colors.white,
  },
  selectedBadge: {
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
  },
  selectedCheck: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
  },
  activitiesScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
  },
  activitiesContent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: ACTIVITY_ROWS * ACTIVITY_ROW_HEIGHT + (ACTIVITY_ROWS - 1) * ACTIVITY_GAP,
    columnGap: ACTIVITY_GAP,
    rowGap: ACTIVITY_GAP,
    paddingHorizontal: 20,
  },
  ratingWrapper: {
    marginBottom: 16,
  },
  notesInput: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: fontFamily.playfair,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5A3E36',
    lineHeight: 21,
    marginBottom: 4,
    minHeight: 70,
    // iOS only: grow with content up to ~8 lines, then scroll internally.
    ...(Platform.OS === 'ios' ? { maxHeight: 192 } : null),
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: fontFamily.dmSans,
    marginBottom: 4,
  },
  footer: {
    flexShrink: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160,100,80,0.1)',
    backgroundColor: colors.warmSand,
  },
  deleteButton: {
    alignItems: 'center',
    paddingTop: 14,
  },
  deleteText: {
    fontSize: 14,
    fontFamily: font('dmSans', '500'),
    color: '#B04040',
    letterSpacing: 0.3,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.stone,
    marginBottom: 8,
  },
})
