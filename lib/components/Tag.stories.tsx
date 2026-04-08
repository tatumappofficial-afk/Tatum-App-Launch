import React from 'react';
import { View } from 'react-native';
import { Tag } from './Tag';

export default {
  title: 'Components/Tag',
  component: Tag,
};

export const Inactive = () => <Tag label="Playful" />;

export const Active = () => <Tag label="Passionate" isActive />;

export const TagRow = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    <Tag label="Passionate" isActive />
    <Tag label="Tender" />
    <Tag label="Playful" />
    <Tag label="Quickie" />
    <Tag label="Emotional" isActive />
    <Tag label="Adventurous" />
  </View>
);
