import React from 'react';
import { View, Text } from 'react-native';
import { Button, IconButton } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => (
  <Button title="Log It" onPress={() => {}} />
);

export const Secondary = () => (
  <Button title="Cancel" variant="secondary" onPress={() => {}} />
);

export const Disabled = () => (
  <Button title="Disabled" onPress={() => {}} disabled />
);

export const Icon = () => (
  <IconButton icon={<Text>✕</Text>} onPress={() => {}} />
);
