import React from 'react';
import { SectionDivider } from './SectionDivider';

export default {
  title: 'Components/SectionDivider',
  component: SectionDivider,
};

export const Default = () => <SectionDivider label="Activities" />;

export const WithDifferentLabel = () => <SectionDivider label="Your Space" />;
