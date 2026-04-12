import React from 'react'
import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { colors, font, fontFamily } from '../../theme'

export const StatusBar: React.FC = () => (
  <View style={{
    height: 50,
    paddingTop: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 11,
  }}>
    <Text style={{
      fontFamily: font('dmSans', '600'),
      fontSize: 15,
      color: colors.stone,
    }}>9:41</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {/* Signal bars */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 1.5 }}>
        {[4, 6, 9, 12].map((h, i) => (
          <View key={i} style={{
            width: 3,
            height: h,
            borderRadius: 1,
            backgroundColor: colors.stone,
          }} />
        ))}
      </View>
      {/* WiFi */}
      <Svg width={15} height={12} viewBox="0 0 15 12" fill="none">
        <Path d="M7.5 10.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM3.75 8.1a5.25 5.25 0 017.5 0" stroke={colors.stone} strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M1.5 5.4a9 9 0 0112 0" stroke={colors.stone} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      {/* Battery */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 25,
          height: 12,
          borderWidth: 1.5,
          borderColor: colors.stone,
          borderRadius: 3,
          padding: 1.5,
        }}>
          <View style={{
            width: '72%',
            height: '100%',
            backgroundColor: colors.stone,
            borderRadius: 1,
          }} />
        </View>
        <View style={{
          width: 2,
          height: 5,
          backgroundColor: colors.stone,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
          marginLeft: 0.5,
        }} />
      </View>
    </View>
  </View>
)
