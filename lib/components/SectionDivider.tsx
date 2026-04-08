import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: colors.terra,
    marginRight: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
