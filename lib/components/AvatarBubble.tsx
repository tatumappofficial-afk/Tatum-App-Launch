import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import type { Partner } from '@/client/schemas';

interface AvatarBubbleProps {
  partner?: Partner;
  size?: number;
  isAdd?: boolean;
  showLabel?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

export function AvatarBubble({ partner, size = 54, isAdd, showLabel, isSelected, onPress }: AvatarBubbleProps) {
  const bubbleSize = { width: size, height: size, borderRadius: size / 2 };

  if (isAdd) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <View style={[styles.addBubble, bubbleSize]}>
          <Text style={styles.addText}>+</Text>
        </View>
        {showLabel && <Text style={styles.label}>Add</Text>}
      </TouchableOpacity>
    );
  }

  if (!partner) return null;

  const [g0, g1] = partner.avatarGradient;

  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.7}>
      <View
        style={[
          bubbleSize,
          styles.bubble,
          { backgroundColor: g0 },
          isSelected && styles.selected,
        ]}
      >
        {partner.avatarType === 'emoji' ? (
          <Text style={{ fontSize: size * 0.48 }}>{partner.avatarValue}</Text>
        ) : partner.avatarType === 'initials' ? (
          <Text style={[styles.initials, { fontSize: size * 0.33 }]}>
            {partner.avatarValue}
          </Text>
        ) : null}
      </View>
      {showLabel && (
        <Text style={styles.label} numberOfLines={1}>
          {partner.displayName}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function SoloAvatar({ size = 54, isSelected, onPress }: { size?: number; isSelected?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.7}>
      <View
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          styles.bubble,
          { backgroundColor: colors.blush },
          isSelected && styles.selected,
        ]}
      >
        <Text style={{ fontSize: size * 0.48 }}>✨</Text>
      </View>
      <Text style={styles.label}>Solo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginRight: 12,
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  selected: {
    borderColor: colors.terra,
    borderWidth: 3,
  },
  addBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface2,
  },
  addText: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 22,
    color: colors.muted,
  },
  initials: {
    fontFamily: fonts.playfair.semiBold,
    color: colors.white,
  },
  label: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 9,
    textTransform: 'uppercase',
    color: colors.stone,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
});
