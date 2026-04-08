import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, radii } from '@/lib/theme';

interface PremiumGateProps {
  children: React.ReactNode;
  isLocked: boolean;
  onUpgrade?: () => void;
}

export function PremiumGate({ children, isLocked, onUpgrade }: PremiumGateProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <TouchableOpacity style={styles.overlay} activeOpacity={0.9} onPress={onUpgrade}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PREMIUM</Text>
        </View>
        <Text style={styles.overlayText}>
          You've always been enough.{'\n'}Now see the full picture.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251,247,242,0.7)',
    borderRadius: radii.xl,
  },
  badge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  overlayText: {
    fontFamily: fonts.dmSans.light,
    fontSize: 11,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 16,
  },
});
