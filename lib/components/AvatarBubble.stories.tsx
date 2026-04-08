import React from 'react';
import { View } from 'react-native';
import { AvatarBubble, SoloAvatar } from './AvatarBubble';
import type { Partner } from '@/client/schemas';

export default {
  title: 'Components/AvatarBubble',
  component: AvatarBubble,
};

const mockPartner: Partner = {
  id: '1',
  displayName: 'James',
  avatarType: 'initials',
  avatarValue: 'JM',
  avatarGradient: ['#C07858', '#7C4A5A'],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const emojiPartner: Partner = {
  ...mockPartner,
  id: '2',
  displayName: 'Coffee Date',
  avatarType: 'emoji',
  avatarValue: '☕',
  avatarGradient: ['#B07080', '#7C4A5A'],
};

export const Initials = () => (
  <View style={{ flexDirection: 'row', gap: 12 }}>
    <AvatarBubble partner={mockPartner} showLabel />
    <AvatarBubble partner={emojiPartner} showLabel />
  </View>
);

export const Selected = () => (
  <AvatarBubble partner={mockPartner} showLabel isSelected />
);

export const AddButton = () => (
  <AvatarBubble isAdd showLabel onPress={() => {}} />
);

export const Solo = () => (
  <SoloAvatar onPress={() => {}} />
);
