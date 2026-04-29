import React from 'react'
import { Text, View } from 'react-native'
import { colors, font } from '../../theme'

export const PlaceholderView: React.FC<{ label: string }> = ({ label }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  }}>
    <Text style={{ fontSize: 28, opacity: 0.4, marginBottom: 10 }}>✨</Text>
    <Text style={{
      fontSize: 12,
      color: colors.stone,
      lineHeight: 18,
      fontFamily: font('dmSans', '300'),
      textAlign: 'center',
    }}>
      {label}
    </Text>
  </View>
)
