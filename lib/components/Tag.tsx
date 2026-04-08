import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii, shadows } from '@/lib/theme';

interface TagProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function Tag({ label, isActive, onPress }: TagProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tag, isActive && styles.active]}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
    marginBottom: 6,
  },
  active: {
    backgroundColor: colors.terra,
    borderColor: colors.terra,
    ...shadows.tagActive,
  },
  text: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 10,
    color: colors.stone,
  },
  activeText: {
    color: colors.white,
  },
});
