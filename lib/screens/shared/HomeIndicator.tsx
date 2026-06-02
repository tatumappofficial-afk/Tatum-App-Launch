import React from 'react'
import { View } from 'react-native'

export const HomeIndicator: React.FC = () => (
  <View
    style={{
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 6,
    }}
  >
    <View
      style={{
        width: 120,
        height: 4,
        backgroundColor: 'rgba(61,43,37,0.15)',
        borderRadius: 2,
      }}
    />
  </View>
)
