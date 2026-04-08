import React from 'react';
import { Text } from 'react-native';
import { PremiumGate } from './PremiumGate';
import { StatCard } from './StatCard';

export default {
  title: 'Components/PremiumGate',
  component: PremiumGate,
};

export const Unlocked = () => (
  <PremiumGate isLocked={false}>
    <StatCard value={42} label="this year" />
  </PremiumGate>
);

export const Locked = () => (
  <PremiumGate isLocked onUpgrade={() => {}}>
    <StatCard value={42} label="this year" />
  </PremiumGate>
);
