import React from 'react'
import { Platform, Pressable, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { colors } from '../theme'

interface BottomSheetProps {
  /** Height as fraction of screen (0.0 - 1.0). Default 0.85 */
  heightFraction?: number
  children: React.ReactNode
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  heightFraction = 0.85,
  children,
}) => {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * heightFraction

  if (Platform.OS === 'ios') {
    return <View style={{ flex: 1, backgroundColor: colors.warmSand }}>{children}</View>
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop — tap to dismiss */}
      <Pressable
        onPress={() => router.back()}
        style={{
          flex: 1,
          backgroundColor: 'rgba(30,18,12,0.4)',
        }}
      />
      {/* Sheet card */}
      <View style={{
        height: sheetHeight,
        backgroundColor: colors.warmSand,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
      }}>
        {/* Grabber */}
        <View style={{
          width: 36,
          height: 4,
          backgroundColor: 'rgba(160,100,80,0.25)',
          borderRadius: 2,
          marginTop: 10,
          marginBottom: 6,
          alignSelf: 'center',
        }} />
        {children}
      </View>
    </View>
  )
}
