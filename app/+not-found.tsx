import { Link, Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { colors, fontFamily } from '@/lib/theme'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warmSand }}>
        <Text style={{ fontFamily: fontFamily.playfair, fontSize: 24, color: colors.ink }}>Page not found</Text>
        <Link href="/" style={{ marginTop: 16, color: colors.terra }}>
          Go home
        </Link>
      </View>
    </>
  )
}
