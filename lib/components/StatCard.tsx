import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, fonts } from '@/lib/theme';

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  comparison?: { direction: 'up' | 'down' | 'same'; text: string };
}

export function StatCard({ value, label, subtitle, comparison }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {comparison && (
        <Text
          style={[
            styles.comparison,
            comparison.direction === 'up' && { color: colors.sage },
            comparison.direction === 'down' && { color: colors.mauve },
            comparison.direction === 'same' && { color: colors.stone },
          ]}
        >
          {comparison.direction === 'up' ? '↑' : comparison.direction === 'down' ? '↓' : '—'}{' '}
          {comparison.text}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 14,
  },
  value: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 36,
    color: colors.terra,
  },
  label: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.stone,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  comparison: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 9,
    marginTop: 4,
  },
});
