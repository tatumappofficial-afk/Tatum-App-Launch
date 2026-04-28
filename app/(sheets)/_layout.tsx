import { Stack } from 'expo-router/stack'
import { Platform, Pressable, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { colors } from '@/lib/theme'

function AndroidSheetChrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions()
  const router = useRouter()
  const sheetHeight = height * 0.88

  return (
    <View style={{ flex: 1 }}>
      {/* Dimmed backdrop — tap to dismiss */}
      <Pressable
        onPress={() => router.dismiss()}
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
        {children}
      </View>
    </View>
  )
}

export default function SheetsLayout() {
  if (Platform.OS === 'ios') {
    return <Stack screenOptions={{ headerShown: false }} />
  }

  return (
    <AndroidSheetChrome>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }} />
    </AndroidSheetChrome>
  )
}
