import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, radii, shadows } from '@/lib/theme';

interface AffirmationBannerProps {
  text: string;
  onDismiss?: () => void;
}

export function AffirmationBanner({ text, onDismiss }: AffirmationBannerProps) {
  return (
    <TouchableOpacity onPress={onDismiss} activeOpacity={0.9} style={styles.banner}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.dismiss}>tap to dismiss</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.terra,
    borderRadius: radii.xl,
    padding: 20,
    marginHorizontal: 4,
    marginBottom: 16,
    ...shadows.card,
  },
  text: {
    fontFamily: fonts.playfair.semiBoldItalic,
    fontSize: 16,
    color: colors.white,
    lineHeight: 24,
    textAlign: 'center',
  },
  dismiss: {
    fontFamily: fonts.dmSans.light,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
