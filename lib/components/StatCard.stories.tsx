import React from 'react';
import { View } from 'react-native';
import { StatCard } from './StatCard';

export default {
  title: 'Components/StatCard',
  component: StatCard,
};

export const Default = () => (
  <StatCard value={12} label="this week" />
);

export const WithComparison = () => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <StatCard value={12} label="this week" comparison={{ direction: 'up', text: '3 more' }} />
    <StatCard value={8} label="last week" comparison={{ direction: 'down', text: '2 fewer' }} />
  </View>
);

export const WithSubtitle = () => (
  <StatCard value="💋" label="top activity" subtitle="Oral (received)" />
);
