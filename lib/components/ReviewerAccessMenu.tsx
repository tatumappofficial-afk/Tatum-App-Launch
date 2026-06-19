import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useLiveQuery } from '@tanstack/react-db'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font } from '@/lib/theme'
import { userProfiles } from '@/src/db'
import { useUpdateSettings } from '@/src/hooks/useSettings'
import { REVIEWER_ACCESS_ENABLED, isReviewerCredential } from '@/src/config/reviewerAccess'

const FEEDBACK_MAILTO = `mailto:tatum.app.official@gmail.com?subject=${encodeURIComponent('Tatum Feedback')}`

export function ReviewerAccessMenu() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const updateSettings = useUpdateSettings()
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMode, setMenuMode] = useState<'menu' | 'devLogin'>('menu')
  const [reviewerEmail, setReviewerEmail] = useState('')
  const [reviewerPassword, setReviewerPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [reviewerBusy, setReviewerBusy] = useState(false)

  if (!REVIEWER_ACCESS_ENABLED) return null

  const closeMenu = () => setMenuOpen(false)
  const openMenu = () => {
    setMenuMode('menu')
    setMenuOpen(true)
  }
  const openFeedback = () => {
    closeMenu()
    Linking.openURL(FEEDBACK_MAILTO).catch(() => {})
  }

  async function handleReviewerSignIn() {
    if (reviewerBusy) return
    if (!isReviewerCredential(reviewerEmail, reviewerPassword)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Sign in failed', "That email and password don't match. Please check and try again.")
      return
    }

    const profile = profiles[0]
    if (!profile) {
      Alert.alert('Setup still loading', 'Please wait a moment and try again.')
      return
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setReviewerBusy(true)
    try {
      userProfiles.update(profile.id, (draft) => {
        draft.displayName = draft.displayName ?? 'App Reviewer'
        draft.email = reviewerEmail.trim()
        draft.authProvider = 'reviewer'
        draft.providerUserId = 'reviewer-demo'
      })
      setMenuOpen(false)
      updateSettings({ hasOnboarded: true })
      router.replace('/(tabs)')
    } catch (err) {
      console.error('Reviewer sign-in failed:', err)
      setReviewerBusy(false)
      Alert.alert('Sign in failed', 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <Pressable
        onPress={openMenu}
        accessibilityRole="button"
        accessibilityLabel="More options"
        hitSlop={12}
        style={{
          position: 'absolute',
          top: insets.top + 8,
          right: 12,
          zIndex: 10,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="settings-outline" size={22} color={colors.stone} />
      </Pressable>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <Pressable
            onPress={closeMenu}
            style={{
              flex: 1,
              backgroundColor: 'rgba(40,28,24,0.35)',
              justifyContent: 'center',
              paddingHorizontal: 28,
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                shadowColor: '#7C4A5A',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.2,
                shadowRadius: 28,
                elevation: 12,
              }}
            >
              {menuMode === 'menu' ? (
                <View style={{ gap: 2 }}>
                  <Pressable
                    onPress={openFeedback}
                    accessibilityRole="button"
                    accessibilityLabel="Give feedback"
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.stone} />
                    <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink }}>
                      Give feedback
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setMenuMode('devLogin')}
                    accessibilityRole="button"
                    accessibilityLabel="Sign in with dev mode"
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Ionicons name="construct-outline" size={20} color={colors.stone} />
                    <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink }}>
                      Sign in with dev mode
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ gap: 12 }}>
                  <Text
                    style={{ fontFamily: font('playfair', '700'), fontSize: 20, color: colors.ink, marginBottom: 2 }}
                  >
                    Dev mode sign in
                  </Text>
                  <TextInput
                    value={reviewerEmail}
                    onChangeText={setReviewerEmail}
                    placeholder="Email"
                    placeholderTextColor="rgba(154,136,120,0.5)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    style={{
                      backgroundColor: colors.warmSand,
                      borderWidth: 1.5,
                      borderColor: 'rgba(160,100,80,0.18)',
                      borderRadius: 14,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      fontFamily: font('dmSans', '400'),
                      color: colors.ink,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.warmSand,
                      borderWidth: 1.5,
                      borderColor: 'rgba(160,100,80,0.18)',
                      borderRadius: 14,
                    }}
                  >
                    <TextInput
                      value={reviewerPassword}
                      onChangeText={setReviewerPassword}
                      placeholder="Password"
                      placeholderTextColor="rgba(154,136,120,0.5)"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={!passwordVisible}
                      textContentType="password"
                      returnKeyType="go"
                      onSubmitEditing={handleReviewerSignIn}
                      style={{
                        flex: 1,
                        minHeight: 52,
                        paddingLeft: 16,
                        paddingRight: 8,
                        paddingVertical: 14,
                        fontSize: 16,
                        fontFamily: font('dmSans', '400'),
                        color: colors.ink,
                      }}
                    />
                    <Pressable
                      onPress={() => setPasswordVisible((visible) => !visible)}
                      accessibilityRole="button"
                      accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                      accessibilityState={{ expanded: passwordVisible }}
                      hitSlop={8}
                      style={({ pressed }) => ({
                        width: 48,
                        height: 52,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: pressed ? 0.6 : 1,
                      })}
                    >
                      <Ionicons
                        name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={21}
                        color={colors.stone}
                      />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={handleReviewerSignIn}
                    disabled={reviewerBusy}
                    accessibilityRole="button"
                    accessibilityLabel="Sign in"
                    style={({ pressed }) => ({
                      height: 52,
                      borderRadius: 9999,
                      backgroundColor: colors.terra,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: reviewerBusy ? 0.6 : pressed ? 0.85 : 1,
                    })}
                  >
                    {reviewerBusy ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: '#fff' }}>Sign In</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}
