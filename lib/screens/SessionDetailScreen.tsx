import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import Svg, { Path, Polyline } from 'react-native-svg'
import { colors, font, fontFamily } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface ActivityTag {
  emoji: string
  label: string
}

export interface SessionPartner {
  initials: string
  name: string
  gradient: string
  sessionCount: number
  avgSatisfaction: number
}

export interface SessionDetailScreenProps {
  partners: SessionPartner[]
  partnerNames: string            // e.g. "Alex + Jordan"
  date: string                    // e.g. "Saturday, March 14, 2026"
  rating: number
  ratingMax?: number
  dayOfWeek: string               // e.g. "Sat"
  activities: ActivityTag[]
  note?: string
  onBack?: () => void
  onEdit?: () => void
  onEditNote?: () => void
  onPartnerPress?: (partner: SessionPartner) => void
}

/* ── Sub-components ── */

const PencilIcon: React.FC = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </Svg>
)

const ChevronForwardIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <Polyline points="9 6 15 12 9 18" />
  </Svg>
)

const ScreenHeader: React.FC<{
  onBack?: () => void
  onEdit?: () => void
}> = ({ onBack, onEdit }) => (
  <View style={{
    paddingTop: 6,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <Pressable
      onPress={onBack}
      accessibilityLabel="Go back"
      style={({ pressed }) => ({
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: pressed ? 'rgba(160,100,80,0.18)' : colors.surface2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="15 18 9 12 15 6" />
      </Svg>
    </Pressable>
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => ({
        backgroundColor: pressed ? 'rgba(192,120,88,0.12)' : 'transparent',
        borderWidth: 1,
        borderColor: pressed ? colors.terra : 'rgba(160,100,80,0.3)',
        borderRadius: 9999,
        paddingVertical: 5,
        paddingHorizontal: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{
        fontSize: 11,
        fontFamily: font('dmSans', '500'),
        color: colors.terra,
        letterSpacing: 0.5,
      }}>Edit</Text>
    </Pressable>
  </View>
)

const HeroAvatars: React.FC<{ partners: SessionPartner[] }> = ({ partners }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
    {partners.map((p, i) => (
      <View key={p.initials} style={{ marginLeft: i > 0 ? -16 : 0 }}>
        <AvatarCircle
          initials={p.initials}
          gradient={p.gradient}
          size={68}
          borderWidth={3}
        />
      </View>
    ))}
  </View>
)

const Hero: React.FC<{
  partners: SessionPartner[]
  partnerNames: string
  date: string
}> = ({ partners, partnerNames, date }) => (
  <View style={{
    flexShrink: 0,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 1,
  }}>
    <HeroAvatars partners={partners} />
    <Text style={{
      fontFamily: font('playfair', '700'),
      fontSize: 22,
      color: colors.ink,
      marginBottom: 3,
    }}>
      {partnerNames}
    </Text>
    <Text style={{
      fontSize: 11,
      fontFamily: font('dmSans', '300'),
      color: colors.stone,
      letterSpacing: 0.3,
    }}>
      {date}
    </Text>
  </View>
)

const SessionStatStrip: React.FC<{
  rating: number
  ratingMax: number
  dayOfWeek: string
}> = ({ rating, ratingMax, dayOfWeek }) => (
  <View style={{ marginTop: 14, marginHorizontal: 24, flexShrink: 0 }}>
    <StatStrip stats={[
      { value: rating, unit: ` /${ratingMax}`, label: 'Rating' },
      { value: dayOfWeek, label: 'Day' },
    ]} />
  </View>
)

const ActivityTags: React.FC<{ activities: ActivityTag[] }> = ({ activities }) => (
  <View style={{
    marginHorizontal: 24,
    flexShrink: 0,
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
  }}>
    {activities.map((a) => (
      <TagPill key={a.label} emoji={a.emoji} label={a.label} variant="display" />
    ))}
  </View>
)

const NotesCard: React.FC<{
  note?: string
  onEditNote?: () => void
}> = ({ note, onEditNote }) => (
  <View style={{
    marginHorizontal: 24,
    marginBottom: 14,
    flexShrink: 0,
    position: 'relative',
  }}>
    {/* Stacked paper shadow */}
    <View style={{
      position: 'absolute',
      bottom: -4,
      left: 6,
      right: -6,
      top: 4,
      backgroundColor: colors.surface2,
      borderRadius: 16,
      zIndex: 0,
    }} />
    {/* Main card */}
    <View style={{
      position: 'relative',
      zIndex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.14)',
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#3D2B25',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 1,
    }}>
      {/* Note text */}
      {note ? (
        <Text style={{
          position: 'relative', zIndex: 1,
          fontFamily: fontFamily.playfair,
          fontSize: 13, fontWeight: '400', fontStyle: 'italic',
          color: '#5A3E36', lineHeight: 27,
          paddingVertical: 12, paddingHorizontal: 16,
        }}>{note}</Text>
      ) : (
        <Text style={{
          position: 'relative', zIndex: 1,
          paddingVertical: 14, paddingHorizontal: 16,
          fontSize: 12, fontFamily: font('dmSans', '300'),
          color: '#C4B0A0', fontStyle: 'italic',
          lineHeight: 27,
        }}>No notes yet...</Text>
      )}
      {/* Edit note row */}
      <View style={{
        position: 'relative', zIndex: 1,
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingTop: 8, paddingHorizontal: 14, paddingBottom: 12,
        borderTopWidth: 1, borderTopColor: 'rgba(160,100,80,0.1)',
      }}>
        <Pressable
          onPress={onEditNote}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingVertical: 4, paddingHorizontal: 8,
            marginVertical: -4, marginHorizontal: -8,
            borderRadius: 8,
            backgroundColor: pressed ? 'rgba(192,120,88,0.12)' : 'transparent',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <PencilIcon />
          <Text style={{
            fontSize: 11, fontWeight: '400',
            fontFamily: fontFamily.dmSans,
            color: colors.terra,
          }}>
            {note ? 'Edit note' : 'Add note'}
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
)

const PartnerRow: React.FC<{
  partner: SessionPartner
  onPress?: () => void
}> = ({ partner, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      backgroundColor: pressed ? 'rgba(192,120,88,0.08)' : colors.surface,
      borderWidth: 1,
      borderColor: pressed ? 'rgba(160,100,80,0.3)' : 'rgba(160,100,80,0.15)',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      transform: [{ scale: pressed ? 0.98 : 1 }],
    })}
  >
    {/* Avatar */}
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={42}
      borderWidth={2}
    />
    {/* Name + subtitle */}
    <View style={{ flex: 1 }}>
      <Text style={{
        fontFamily: font('playfair', '600'),
        fontSize: 14,
        color: colors.ink,
      }}>
        {partner.name}
      </Text>
      <Text style={{
        fontSize: 10,
        fontFamily: font('dmSans', '300'),
        color: colors.stone,
        marginTop: 1,
      }}>
        {partner.sessionCount} sessions together {'\u00B7'} {partner.avgSatisfaction} avg
      </Text>
    </View>
    {/* Avg stat */}
    <View style={{ alignItems: 'center' }}>
      <Text style={{
        fontFamily: font('playfair', '600'),
        fontSize: 16,
        color: colors.terra,
      }}>
        {partner.avgSatisfaction}
      </Text>
      <Text style={{
        fontSize: 7,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontFamily: fontFamily.dmSans,
        color: colors.stone,
      }}>
        Avg Sat
      </Text>
    </View>
    {/* Chevron */}
    <ChevronForwardIcon />
  </Pressable>
)

/* ── Main Screen ── */

export const SessionDetailScreen: React.FC<SessionDetailScreenProps> = ({
  partners,
  partnerNames,
  date,
  rating,
  ratingMax = 10,
  dayOfWeek,
  activities,
  note,
  onBack,
  onEdit,
  onEditNote,
  onPartnerPress,
}) => (
  <View style={{
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundColor: colors.warmSand,
  }}>
    <DecorativeGlow position="center" size={320} opacity={0.12} />
    <StatusBarSpacer />
    <ScreenHeader onBack={onBack} onEdit={onEdit} />

    <Hero partners={partners} partnerNames={partnerNames} date={date} />
    <SessionStatStrip rating={rating} ratingMax={ratingMax} dayOfWeek={dayOfWeek} />

    {/* Scrollable body */}
    <ScrollView style={{
      flex: 1,
    }} contentContainerStyle={{
      paddingBottom: 16,
    }}>
      <SectionLabel label="What Happened" />
      <ActivityTags activities={activities} />

      <SectionLabel label="Notes" />
      <NotesCard note={note} onEditNote={onEditNote} />

      <SectionLabel label="With" />
      <View style={{
        flexDirection: 'column',
        gap: 8,
        marginHorizontal: 24,
        marginBottom: 14,
      }}>
        {partners.map((p) => (
          <PartnerRow
            key={p.initials}
            partner={p}
            onPress={() => onPartnerPress?.(p)}
          />
        ))}
      </View>
    </ScrollView>

  </View>
)
