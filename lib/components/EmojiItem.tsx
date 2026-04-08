import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii } from '@/lib/theme';

interface EmojiItemProps {
  emoji: string;
  isSelected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
}

export function EmojiItem({ emoji, isSelected, onPress, onLongPress, size = 38 }: EmojiItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[
        styles.item,
        { width: size, height: size },
        isSelected && styles.selected,
      ]}
    >
      <Text style={{ fontSize: size * 0.52 }}>{emoji}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: radii.sm,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  selected: {
    backgroundColor: colors.terra,
    borderColor: colors.terra,
  },
});
