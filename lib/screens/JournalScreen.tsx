import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import Svg, { Line, Polyline } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, fontFamily, gradientPoints, gradients, shadows, typography } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarCircle } from '../components/AvatarCircle'
import { GradientButton } from '../components/GradientButton'

/* ── Types ── */

export interface JournalPartner {
  initials: string
  gradient: string // CSS linear-gradient value
}

export interface JournalEntry {
  id: string
  partners: JournalPartner[]
  partnerName: string
  date: string
  score: number
  maxScore?: number
  tags: string[] // emoji strings
  mood?: { emoji: string; label: string }
  note?: string
  monthSeparator?: string // rendered before this entry
}

export interface CalendarDay {
  day: number | null
  logged?: boolean
  emoji?: string
  hasPlus?: boolean
  isToday?: boolean
}

export interface JournalScreenProps {
  entries: JournalEntry[]
  currentMonth?: string
  entryCount?: number
  calendarDays?: CalendarDay[]
  showCalendar?: boolean
  onEntryPress?: (id: string) => void
  onLogFirstSession?: () => void
}

/* ── Sub-components ── */

const ChevronDown: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
)

const ChevronUp: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 15 12 9 18 15" />
  </Svg>
)

const ChevronBack: React.FC<{ color?: string; size?: number }> = ({ color = colors.stone, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
)

const ChevronForward: React.FC<{ color?: string; size?: number }> = ({ color = colors.stone, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 6 15 12 9 18" />
  </Svg>
)

const ArrowUpRight: React.FC<{ color?: string; size?: number }> = ({ color = colors.terra, size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={7} y1={17} x2={17} y2={7} />
    <Polyline points="7 7 17 7 17 17" />
  </Svg>
)

const PlusIcon: React.FC<{ color?: string; size?: number }> = ({ color = 'white', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
)

/* ── Month Separator ── */

const MonthSeparator: React.FC<{ label: string }> = ({ label }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  }}>
    <Text style={{
      fontSize: 8,
      fontFamily: font('dmSans', '500'),
      letterSpacing: 3.5,
      textTransform: 'uppercase',
      color: colors.terra,
    }}>
      {label}
    </Text>
    <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(160,100,80,0.18)' }} />
  </View>
)

/* ── Entry Card ── */

const EntryCard: React.FC<{ entry: JournalEntry; onPress?: () => void }> = ({ entry, onPress }) => {
  const isCompact = !entry.note
  const hasMultiplePartners = entry.partners.length > 1

  return (
    <View style={{
      position: 'relative',
      marginBottom: 14,
    }}>
      {/* Shadow stack behind (depth) */}
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

      {/* Main paper */}
      <View style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.14)',
        overflow: 'hidden',
        ...shadows.cardSubtle,
      }}>
        {/* Margin line */}
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 50,
          width: 1,
          backgroundColor: 'rgba(192,120,88,0.12)',
          zIndex: 0,
        }} />

        {/* Header band */}
        <View style={{
          position: 'relative',
          zIndex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 11,
          paddingBottom: 10,
          paddingLeft: 14,
          paddingRight: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(160,100,80,0.1)',
          backgroundColor: 'rgba(245,239,232,0.6)',
        }}>
          {/* Left side */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {hasMultiplePartners && entry.partners[0] && entry.partners[1] ? (
              <View style={{ position: 'relative', width: 46, height: 32, flexShrink: 0 }}>
                <View style={{ position: 'absolute', left: 0, zIndex: 2 }}>
                  <AvatarCircle
                    initials={entry.partners[0].initials}
                    gradient={entry.partners[0].gradient}
                    size={32}
                    borderWidth={2}
                  />
                </View>
                <View style={{ position: 'absolute', left: 14, zIndex: 1 }}>
                  <AvatarCircle
                    initials={entry.partners[1].initials}
                    gradient={entry.partners[1].gradient}
                    size={32}
                    borderWidth={2}
                  />
                </View>
              </View>
            ) : entry.partners[0] ? (
              <AvatarCircle
                initials={entry.partners[0].initials}
                gradient={entry.partners[0].gradient}
                size={32}
                borderWidth={2}
              />
            ) : (
              <AvatarCircle
                initials="✨"
                gradient="linear-gradient(135deg, #8BA888, #5A8060)"
                size={32}
                borderWidth={2}
              />
            )}
            <View style={hasMultiplePartners ? { marginLeft: 8 } : undefined}>
              <Text style={{
                fontFamily: font('playfair', '600'),
                fontSize: 13,
                color: colors.ink,
                lineHeight: 14,
              }}>
                {entry.partnerName}
              </Text>
              <Text style={{
                fontSize: 8.5,
                fontWeight: '300',
                color: colors.stone,
                marginTop: 1,
              }}>
                {entry.date}
              </Text>
            </View>
          </View>

          {/* Right side -- score + arrow */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
              <Text style={{
                fontFamily: font('playfair', '700'),
                fontSize: 22,
                color: colors.terra,
                lineHeight: 22,
              }}>
                {entry.score}
              </Text>
              <Text style={{
                fontSize: 13,
                fontWeight: '300',
                color: '#C4B0A0',
                marginHorizontal: 1,
              }}>/</Text>
              <Text style={{
                fontSize: 12,
                fontWeight: '300',
                color: '#C4B0A0',
              }}>
                {entry.maxScore ?? 10}
              </Text>
            </View>
            <Pressable
              onPress={onPress}
              style={{
              alignItems: 'center',
              padding: 2,
              opacity: 0.5,
            }}>
              <ArrowUpRight />
            </Pressable>
          </View>
        </View>

        {/* Tags row */}
        <View style={{
          position: 'relative',
          zIndex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          flexWrap: 'wrap',
          paddingTop: 7,
          paddingHorizontal: 14,
          paddingBottom: 5,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(160,100,80,0.07)',
        }}>
          {entry.tags.map((tag, i) => (
            <Text key={i} style={{
              fontSize: 14,
              backgroundColor: 'rgba(237,227,216,0.85)',
              borderRadius: 7,
              paddingVertical: 2,
              paddingHorizontal: 6,
            }}>
              {tag}
            </Text>
          ))}
          {entry.mood && (
            <Text style={{
              fontSize: 10,
              backgroundColor: 'rgba(192,120,88,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(192,120,88,0.2)',
              borderRadius: 9999,
              paddingVertical: 2,
              paddingHorizontal: 8,
              color: colors.terra,
            }}>
              {entry.mood.emoji} {entry.mood.label}
            </Text>
          )}
        </View>

        {/* Note body */}
        {!isCompact && (
          <View style={{
            position: 'relative',
            zIndex: 2,
            paddingTop: 10,
            paddingHorizontal: 16,
            paddingBottom: 14,
            minHeight: 56,
          }}>
            <Text style={{
              fontFamily: fontFamily.playfair,
              fontSize: 13,
              fontWeight: '400',
              fontStyle: 'italic',
              color: '#5A3E36',
              lineHeight: 27,
              letterSpacing: 0.1,
            }}>
              {entry.note}
            </Text>
          </View>
        )}

        {/* Compact cards: smaller bottom padding area */}
        {isCompact && (
          <View style={{
            position: 'relative',
            zIndex: 2,
            minHeight: 0,
            paddingTop: 7,
            paddingHorizontal: 16,
            paddingBottom: 10,
          }} />
        )}
      </View>
    </View>
  )
}

/* ── Calendar Dropdown ── */

const DOW_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const CalendarDropdown: React.FC<{
  monthLabel: string
  days: CalendarDay[]
}> = ({ monthLabel, days }) => (
  <View style={{
    position: 'absolute',
    top: 48,
    left: 24,
    width: 318,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.18)',
    borderRadius: 22,
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 14,
    zIndex: 200,
    overflow: 'hidden',
  }}>
    {/* Nav */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 14,
      paddingHorizontal: 16,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(160,100,80,0.1)',
    }}>
      <Pressable style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.surface2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ChevronBack />
      </Pressable>
      <Text style={{
        fontFamily: font('playfair', '600'),
        fontSize: 16,
        color: colors.ink,
      }}>
        {monthLabel}
      </Text>
      <Pressable style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.surface2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ChevronForward />
      </Pressable>
    </View>

    {/* Day-of-week header */}
    <View style={{
      flexDirection: 'row',
      paddingTop: 8,
      paddingHorizontal: 10,
      paddingBottom: 3,
    }}>
      {DOW_LABELS.map((d) => (
        <View key={d} style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontSize: 8,
            fontWeight: '500',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: colors.stone,
            paddingVertical: 3,
          }}>
            {d}
          </Text>
        </View>
      ))}
    </View>

    {/* Day grid */}
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 2,
      paddingHorizontal: 10,
      paddingBottom: 14,
    }}>
      {days.map((d, i) => {
        const isEmpty = d.day === null
        const isToday = d.isToday
        const cellSize = (318 - 20) / 7 // account for horizontal padding
        return (
          <View key={i} style={{
            width: cellSize,
            aspectRatio: 1,
            borderRadius: cellSize / 2,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {isToday && (
              <LinearGradient
                colors={gradients.primaryCta}
                start={gradientPoints.diagonal.start}
                end={gradientPoints.diagonal.end}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={{
              fontSize: 11,
              fontWeight: isToday ? '700' : d.logged ? '500' : '400',
              color: isToday ? 'white' : d.logged ? colors.terra : colors.ink,
              lineHeight: 11,
              opacity: isEmpty ? 0 : 1,
            }}>
              {d.day ?? ''}
            </Text>
            {d.logged && !isToday && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
                <Text style={{ fontSize: 7 }}>{d.emoji}</Text>
                {d.hasPlus && (
                  <Text style={{ fontSize: 6, fontWeight: '600', color: colors.mauve, marginLeft: 1 }}>+</Text>
                )}
              </View>
            )}
          </View>
        )
      })}
    </View>

    {/* Legend */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingTop: 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(160,100,80,0.1)',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={{ fontSize: 10 }}>&#x1F346;</Text>
        <Text style={{ fontSize: 9, color: colors.stone }}>Logged</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text style={{ fontSize: 10, color: colors.terra, fontWeight: '600' }}>&#x1F346;+</Text>
        <Text style={{ fontSize: 9, color: colors.stone }}>Multiple</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <LinearGradient
            colors={gradients.primaryCta}
            start={gradientPoints.diagonal.start}
            end={gradientPoints.diagonal.end}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <Text style={{ fontSize: 9, color: colors.stone }}>Today</Text>
      </View>
    </View>

    {/* Hint */}
    <View style={{
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
    }}>
      <Text style={{
        fontSize: 9,
        fontWeight: '300',
        color: colors.muted,
        fontStyle: 'italic',
      }}>
        Tap a date to jump to that entry
      </Text>
    </View>
  </View>
)

/* ── Empty State ── */

const EmptyState: React.FC<{ onLogSession?: () => void }> = ({ onLogSession }) => (
  <View style={{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  }}>
    {/* Stacked blank journal cards */}
    <View style={{ position: 'relative', width: 240, height: 130, marginBottom: 28 }}>
      {/* Card 3 - furthest back */}
      <View style={{
        position: 'absolute',
        width: 200,
        height: 110,
        top: 20,
        left: 20,
        opacity: 0.4,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.12)',
      }} />
      {/* Card 2 */}
      <View style={{
        position: 'absolute',
        width: 220,
        height: 118,
        top: 10,
        left: 10,
        opacity: 0.65,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.12)',
      }} />
      {/* Card 1 - front */}
      <View style={{
        position: 'absolute',
        width: 240,
        height: 130,
        top: 0,
        left: 0,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(160,100,80,0.12)',
      }}>
        {/* Margin line */}
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 40,
          width: 1,
          backgroundColor: 'rgba(192,120,88,0.12)',
        }} />
        {/* Center icon */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image source={require('@/assets/tatum-logo.png')} style={{ width: 80, height: 80, opacity: 0.3 }} />
        </View>
      </View>
    </View>

    <Text style={{
      fontFamily: font('playfair', '700'),
      fontSize: 22,
      color: colors.ink,
      marginBottom: 10,
      lineHeight: 29,
      textAlign: 'center',
    }}>
      Your story starts here.
    </Text>

    <Text style={{
      fontFamily: font('dmSans', '300'),
      fontSize: 13,
      color: colors.stone,
      lineHeight: 22,
      marginBottom: 26,
      textAlign: 'center',
    }}>
      As you log sessions, they'll appear here as private journal entries — yours to read, remember, and return to.
    </Text>

    <Text style={{
      fontFamily: fontFamily.playfair,
      fontSize: 14,
      fontStyle: 'italic',
      color: colors.mauve,
      marginBottom: 28,
      lineHeight: 22,
      textAlign: 'center',
    }}>
      "Feel seen, validated, and completely empowered."
    </Text>

    <GradientButton
      label="Log your first session"
      fullWidth={false}
      letterSpacing={1.5}
      icon={<PlusIcon />}
      onPress={onLogSession}
    />
  </View>
)

/* ── Main Screen ── */

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  currentMonth = 'March 2026',
  entryCount = 8,
  calendarDays = [],
  showCalendar: showCalendarProp,
  onEntryPress,
  onLogFirstSession,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(showCalendarProp ?? false)
  const isEmpty = entries.length === 0

  return (
    <View style={{
      width: '100%',
      flex: 1,
      overflow: 'hidden',
    }}>
      <DecorativeGlow position="top-right" size={200} opacity={0.08} />
      <StatusBarSpacer />

      {/* Screen header */}
      <View style={{
        paddingTop: 4,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <Text style={typography.screenTitle}>Sessions Journal</Text>
      </View>

      {/* Sticky month bar */}
      <View style={{
        flexShrink: 0,
        paddingTop: 10,
        paddingHorizontal: 24,
        position: 'relative',
        zIndex: 50,
      }}>
        {isEmpty ? (
          /* Ghost pill for empty state */
          <View style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 7,
            backgroundColor: colors.surface2,
            borderRadius: 9999,
            paddingVertical: 7,
            paddingLeft: 16,
            paddingRight: 12,
          }}>
            <Text style={{
              fontFamily: font('playfair', '600'),
              fontSize: 14,
              color: '#C4B0A0',
              letterSpacing: 0.3,
            }}>
              No entries yet
            </Text>
            <ChevronDown color="#C4B0A0" size={13} />
          </View>
        ) : (
          <Pressable
            onPress={() => setCalendarOpen(!calendarOpen)}
            accessibilityRole="button"
            accessibilityLabel={`Toggle calendar, ${currentMonth}`}
            accessibilityState={{ expanded: calendarOpen }}
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: 7,
              borderRadius: 9999,
              paddingVertical: 7,
              paddingLeft: 16,
              paddingRight: 12,
              overflow: 'hidden',
              ...shadows.pillSoft,
            }}
          >
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={StyleSheet.absoluteFill}
            />
            <Text style={{
              fontFamily: font('playfair', '600'),
              fontSize: 15,
              color: 'white',
              letterSpacing: 0.3,
            }}>
              {currentMonth}
            </Text>
            <Text style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 9999,
              paddingVertical: 1,
              paddingHorizontal: 7,
              fontSize: 9,
              fontWeight: '500',
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: 0.5,
              overflow: 'hidden',
            }}>
              {entryCount}
            </Text>
            {calendarOpen ? <ChevronUp /> : <ChevronDown />}
          </Pressable>
        )}

        {/* Calendar dropdown */}
        {calendarOpen && calendarDays.length > 0 && (
          <CalendarDropdown monthLabel={currentMonth} days={calendarDays} />
        )}
      </View>

      {/* Dim overlay */}
      {calendarOpen && (
        <Pressable
          onPress={() => setCalendarOpen(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30,18,12,0.22)',
            zIndex: 40,
          }}
        />
      )}

      {/* Content */}
      {isEmpty ? (
        <EmptyState onLogSession={onLogFirstSession} />
      ) : (
        <ScrollView style={{
          flex: 1,
          paddingTop: 12,
          paddingHorizontal: 20,
        }}>
          {entries.map((entry, idx) => (
            <React.Fragment key={entry.id}>
              {entry.monthSeparator && <MonthSeparator label={entry.monthSeparator} />}
              <EntryCard entry={entry} onPress={() => onEntryPress?.(entry.id)} />
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
