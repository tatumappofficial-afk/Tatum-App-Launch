import React from 'react';
import { BarChart } from './BarChart';

export default {
  title: 'Components/BarChart',
  component: BarChart,
};

export const DayOfWeek = () => (
  <BarChart
    data={[
      { label: 'Su', value: 2 },
      { label: 'Mo', value: 0 },
      { label: 'Tu', value: 3 },
      { label: 'We', value: 1 },
      { label: 'Th', value: 4 },
      { label: 'Fr', value: 2 },
      { label: 'Sa', value: 5 },
    ]}
  />
);

export const Empty = () => (
  <BarChart
    data={[
      { label: 'Su', value: 0 },
      { label: 'Mo', value: 0 },
      { label: 'Tu', value: 0 },
      { label: 'We', value: 0 },
      { label: 'Th', value: 0 },
      { label: 'Fr', value: 0 },
      { label: 'Sa', value: 0 },
    ]}
  />
);
