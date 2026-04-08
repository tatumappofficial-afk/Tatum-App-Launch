import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '@/lib/theme';

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  height?: number;
}

export function BarChart({ data, maxValue, height = 120 }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: height + 30 }]}>
      <View style={styles.bars}>
        {data.map((item, i) => {
          const barHeight = max > 0 ? (item.value / max) * height : 0;
          return (
            <View key={i} style={styles.barWrapper}>
              <View style={[styles.barTrack, { height }]}>
                <View style={[styles.bar, { height: barHeight }]} />
              </View>
              {item.value > 0 && (
                <Text style={styles.count}>{item.value}</Text>
              )}
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: 20,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 18,
    backgroundColor: colors.surface2,
    borderRadius: radii.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.terra,
    borderRadius: radii.sm,
  },
  count: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 9,
    color: colors.mauve,
    marginTop: 2,
  },
  barLabel: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 9,
    color: colors.stone,
    position: 'absolute',
    bottom: 0,
  },
});
