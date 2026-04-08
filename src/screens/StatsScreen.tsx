import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '@/lib/theme';
import { StatCard, BarChart, PremiumGate, EmptyState, SectionDivider } from '@/lib/components';
import { useEncountersByDateRange, useUserProfile } from '@/src/store';
import { isPremium } from '@/src/utils/premium';
import type { Encounter } from '@/client/schemas';

type TimeRange = 'day' | 'week' | 'month' | 'year';

const RANGE_LABELS: Record<TimeRange, string> = {
  day: 'Today',
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
};

function getDateRange(range: TimeRange): { start: string; end: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const fmt = (dt: Date) => dt.toISOString().split('T')[0];

  switch (range) {
    case 'day':
      return { start: fmt(now), end: fmt(now) };
    case 'week': {
      const dayOfWeek = now.getDay();
      const start = new Date(y, m, d - dayOfWeek);
      const end = new Date(y, m, d + (6 - dayOfWeek));
      return { start: fmt(start), end: fmt(end) };
    }
    case 'month':
      return { start: `${y}-${String(m + 1).padStart(2, '0')}-01`, end: fmt(now) };
    case 'year':
      return { start: `${y}-01-01`, end: fmt(now) };
  }
}

function getDayOfWeekCounts(encounters: Encounter[]): { label: string; value: number }[] {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const counts = new Array(7).fill(0);
  encounters.forEach((e) => {
    const day = new Date(e.date + 'T12:00:00').getDay();
    counts[day]++;
  });
  return days.map((label, i) => ({ label, value: counts[i] }));
}

function getMostCommonActivity(encounters: Encounter[]): string {
  const counts: Record<string, number> = {};
  encounters.forEach((e) => e.activities.forEach((a) => { counts[a] = (counts[a] || 0) + 1; }));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? '—';
}

export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<TimeRange>('week');
  const { start, end } = useMemo(() => getDateRange(range), [range]);
  const encounters = useEncountersByDateRange(start, end);
  const profile = useUserProfile();
  const premium = isPremium(profile);

  const topActivity = getMostCommonActivity(encounters);
  const dayOfWeekData = getDayOfWeekCounts(encounters);
  const uniquePartners = new Set(encounters.map((e) => e.partnerId).filter(Boolean)).size;

  const isLocked = (r: TimeRange) => !premium && (r === 'month' || r === 'year');

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Your Stats</Text>

      <View style={styles.rangeToggle}>
        {(['day', 'week', 'month', 'year'] as TimeRange[]).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => { if (!isLocked(r)) setRange(r); }}
            style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
          >
            <Text style={[styles.rangeBtnText, range === r && styles.rangeBtnTextActive]}>
              {RANGE_LABELS[r]}
            </Text>
            {isLocked(r) && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {encounters.length === 0 ? (
        <EmptyState
          title="Nothing logged yet — and that's okay."
          subtitle="When you're ready, your calendar is waiting."
        />
      ) : (
        <>
          <PremiumGate isLocked={isLocked(range)}>
            <View style={styles.statGrid}>
              <StatCard value={encounters.length} label={range === 'day' ? 'today' : `this ${range}`} />
              <StatCard value={topActivity} label="top activity" />
              <StatCard value={uniquePartners || 'Solo'} label="partners" />
              <StatCard value={dayOfWeekData.reduce((max, d) => d.value > max.value ? d : max, dayOfWeekData[0]).label} label="most active" />
            </View>

            <SectionDivider label="By Day" />
            <BarChart data={dayOfWeekData} />
          </PremiumGate>

          <Text style={styles.encouragement}>
            Whatever your number, it's yours. And it's enough.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  title: {
    fontFamily: fonts.playfair.bold,
    fontSize: 28,
    color: colors.ink,
    marginBottom: 16,
  },
  rangeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  rangeBtnActive: {
    backgroundColor: colors.surface,
  },
  rangeBtnText: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 10,
    color: colors.stone,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rangeBtnTextActive: {
    color: colors.terra,
  },
  lockIcon: {
    fontSize: 8,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  encouragement: {
    fontFamily: fonts.dmSans.light,
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
  },
});
