import React from 'react';
import { MilestoneCelebration } from './MilestoneCelebration';

export default {
  title: 'Components/MilestoneCelebration',
  component: MilestoneCelebration,
};

export const FirstLog = () => (
  <MilestoneCelebration
    milestone={{
      key: 'first_log',
      title: 'First Log',
      copy: "Welcome to your truth. This is where it begins.",
      emoji: '🌟',
    }}
    onDismiss={() => {}}
  />
);

export const TenEncounters = () => (
  <MilestoneCelebration
    milestone={{
      key: 'encounters_10',
      title: 'Ten Moments',
      copy: "Ten moments. Ten truths. All yours.",
      emoji: '💫',
    }}
    onDismiss={() => {}}
  />
);
