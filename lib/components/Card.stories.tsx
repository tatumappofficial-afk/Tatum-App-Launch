import React from 'react';
import { Text } from 'react-native';
import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = () => (
  <Card>
    <Text>A warm, surface-colored card with subtle shadow.</Text>
  </Card>
);

export const CustomPadding = () => (
  <Card style={{ padding: 32 }}>
    <Text>Card with extra padding.</Text>
  </Card>
);
