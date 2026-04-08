import React from 'react';
import { View } from 'react-native';
import { EmojiItem } from './EmojiItem';

export default {
  title: 'Components/EmojiItem',
  component: EmojiItem,
};

export const Default = () => <EmojiItem emoji="🍆" />;

export const Selected = () => <EmojiItem emoji="💋" isSelected />;

export const EmojiTray = () => (
  <View style={{ flexDirection: 'row' }}>
    <EmojiItem emoji="🍆" isSelected />
    <EmojiItem emoji="✋" />
    <EmojiItem emoji="👉" />
    <EmojiItem emoji="💋" />
    <EmojiItem emoji="🌬️" />
    <EmojiItem emoji="😘" />
    <EmojiItem emoji="🍑" />
    <EmojiItem emoji="✨" isSelected />
    <EmojiItem emoji="🌙" />
  </View>
);
