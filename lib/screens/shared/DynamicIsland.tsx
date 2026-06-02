import React from 'react'
import { View } from 'react-native'

export const DynamicIsland: React.FC = () => (
  <View
    style={{
      position: 'absolute',
      top: 10,
      alignSelf: 'center',
      width: 120,
      height: 34,
      backgroundColor: '#1C1C1E',
      borderRadius: 20,
      zIndex: 10,
    }}
  />
)
