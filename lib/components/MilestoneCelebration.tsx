import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fonts, radii, shadows } from '@/lib/theme';
import type { MilestoneDefinition } from '@/src/data/milestones';

interface MilestoneCelebrationProps {
  milestone: MilestoneDefinition;
  onDismiss: () => void;
}

export function MilestoneCelebration({ milestone, onDismiss }: MilestoneCelebrationProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 300 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.emoji}>{milestone.emoji}</Text>
        <Text style={styles.title}>{milestone.title}</Text>
        <Text style={styles.copy}>{milestone.copy}</Text>
        <View style={styles.sparkles}>
          {['✨', '✨', '✨'].map((s, i) => (
            <Text key={i} style={[styles.sparkle, { left: `${20 + i * 25}%` }]}>{s}</Text>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61,43,37,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: colors.terra,
    borderRadius: radii.xl,
    padding: 32,
    marginHorizontal: 28,
    alignItems: 'center',
    ...shadows.button,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.playfair.semiBoldItalic,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
  },
  copy: {
    fontFamily: fonts.dmSans.light,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  sparkles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
    top: '10%',
    fontSize: 16,
    opacity: 0.6,
  },
});
