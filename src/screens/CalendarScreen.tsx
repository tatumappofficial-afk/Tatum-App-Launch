import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '@/lib/theme';
import { EmojiItem, AffirmationBanner, EmptyState } from '@/lib/components';
import { useEncountersByMonth, useLastAffirmation } from '@/src/store';
import { setLastAffirmation } from '@/src/store';
import { ACTIVITIES } from '@/src/data/activities';
import { CURATED_AFFIRMATIONS } from '@/src/data/affirmations';
import type { Encounter } from '@/client/schemas';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function formatMonthYear(year: number, month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[month - 1]} ${year}`;
}

function pickTodayAffirmation(lastDate: string | null, lastId: string | null): string {
  const today = new Date().toISOString().split('T')[0];
  if (lastDate === today && lastId) {
    const idx = CURATED_AFFIRMATIONS.indexOf(lastId);
    if (idx >= 0) return CURATED_AFFIRMATIONS[idx];
  }
  const idx = Math.floor(Math.random() * CURATED_AFFIRMATIONS.length);
  const affirmation = CURATED_AFFIRMATIONS[idx];
  setLastAffirmation(today, affirmation);
  return affirmation;
}

export function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const encounters = useEncountersByMonth(year, month);
  const [showAffirmation, setShowAffirmation] = useState(true);
  const lastAffirmation = useLastAffirmation();
  const [affirmationText] = useState(() => pickTodayAffirmation(lastAffirmation.date, lastAffirmation.id));

  const encountersByDate = new Map<string, Encounter[]>();
  encounters.forEach((e) => {
    const list = encountersByDate.get(e.date) || [];
    list.push(e);
    encountersByDate.set(e.date, list);
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const onEmojiTap = (emoji: string) => {
    router.push({ pathname: '/(modals)/quick-log', params: { emoji, date: todayStr } });
  };

  const onDayPress = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEncounters = encountersByDate.get(dateStr);
    if (!dayEncounters || dayEncounters.length === 0) {
      router.push({ pathname: '/(modals)/quick-log', params: { date: dateStr } });
    } else if (dayEncounters.length === 1) {
      router.push({ pathname: '/(modals)/quick-log', params: { id: dayEncounters[0].id, date: dateStr } });
    } else {
      router.push({ pathname: '/(modals)/encounter-detail', params: { date: dateStr } });
    }
  };

  const renderDayCell = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const dayEnc = encountersByDate.get(dateStr);
    const hasEncounters = dayEnc && dayEnc.length > 0;
    const isHighActivity = dayEnc && dayEnc.length > 2;

    return (
      <TouchableOpacity
        key={day}
        onPress={() => onDayPress(day)}
        style={[
          styles.dayCell,
          isToday && styles.todayCell,
          hasEncounters && !isToday && styles.loggedCell,
          isHighActivity && !isToday && styles.highActivityCell,
        ]}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          hasEncounters && !isToday && styles.loggedText,
          isHighActivity && !isToday && styles.todayText,
        ]}>
          {day}
        </Text>
        {hasEncounters && (
          <Text style={styles.dayEmoji}>{dayEnc[0].activities[0]}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const calendarCells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(renderDayCell(d));
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {showAffirmation && (
        <AffirmationBanner
          text={affirmationText}
          onDismiss={() => setShowAffirmation(false)}
        />
      )}

      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={prevMonth} hitSlop={16}>
          <Text style={styles.navArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{formatMonthYear(year, month)}</Text>
        <TouchableOpacity onPress={nextMonth} hitSlop={16}>
          <Text style={styles.navArrow}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map((d) => (
          <Text key={d} style={styles.weekDay}>{d}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarCells}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.sage }]} />
          <Text style={styles.legendLabel}>Logged</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.terra }]} />
          <Text style={styles.legendLabel}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.mauve }]} />
          <Text style={styles.legendLabel}>Active</Text>
        </View>
      </View>

      <View style={styles.emojiTray}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
          {ACTIVITIES.map((a) => (
            <EmojiItem key={a.code} emoji={a.code} onPress={() => onEmojiTap(a.code)} />
          ))}
        </ScrollView>
        <Text style={styles.hint}>Tap to log today</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthTitle: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 19,
    color: colors.ink,
  },
  navArrow: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 28,
    color: colors.terra,
    paddingHorizontal: 8,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.dmSans.medium,
    fontSize: 9,
    color: colors.stone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  todayCell: {
    backgroundColor: colors.terra,
    borderRadius: 50,
  },
  loggedCell: {
    backgroundColor: colors.surface2,
    borderRadius: 50,
  },
  highActivityCell: {
    backgroundColor: colors.mauve,
    borderRadius: 50,
  },
  dayText: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 11,
    color: colors.ink,
  },
  todayText: {
    color: colors.white,
  },
  loggedText: {
    color: colors.terra,
  },
  dayEmoji: {
    fontSize: 7,
    position: 'absolute',
    bottom: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 9,
    color: colors.stone,
  },
  emojiTray: {
    marginTop: 8,
  },
  emojiRow: {
    paddingHorizontal: 4,
    gap: 2,
  },
  hint: {
    fontFamily: fonts.dmSans.light,
    fontSize: 10,
    fontStyle: 'italic',
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
