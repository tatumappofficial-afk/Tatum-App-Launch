import React from 'react';
import { AffirmationBanner } from './AffirmationBanner';

export default {
  title: 'Components/AffirmationBanner',
  component: AffirmationBanner,
};

export const Default = () => (
  <AffirmationBanner
    text="You've always been enough. Your body knows it."
    onDismiss={() => {}}
  />
);

export const LongText = () => (
  <AffirmationBanner
    text="Showing up for yourself is the bravest thing you'll do today. And you're already doing it."
    onDismiss={() => {}}
  />
);
