import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { Button } from './Button';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  ctaTitle?: string;
  onCta?: () => void;
}

export function EmptyState({ emoji = '🌙✨', title, subtitle, ctaTitle, onCta }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {ctaTitle && onCta && (
        <Button title={ctaTitle} onPress={onCta} style={{ marginTop: 16 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 28,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 18,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.dmSans.light,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
