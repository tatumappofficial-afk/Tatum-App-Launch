import React from 'react';
import { EmptyState } from './EmptyState';

export default {
  title: 'Components/EmptyState',
  component: EmptyState,
};

export const Default = () => (
  <EmptyState
    title="Nothing logged yet — and that's okay."
    subtitle="When you're ready, your calendar is waiting."
  />
);

export const WithCta = () => (
  <EmptyState
    title="No whispers yet"
    subtitle="When you're ready to say something, Tatum will help you find the words."
    ctaTitle="Send a Whisper"
    onCta={() => {}}
    emoji="💬"
  />
);
