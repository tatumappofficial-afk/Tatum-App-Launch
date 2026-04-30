import { useLiveQuery } from '@tanstack/react-db'
import { userProfiles } from '@/src/db'
import { deriveInitials } from '@/src/utils/initials'

const DEFAULT_NAME = 'Alanna' // placeholder until onboarding flow lands
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #C07858, #7C4A5A)'
const DEFAULT_INITIAL = 'A'

export interface UseUserProfileResult {
  /** Display name with fallback applied. */
  displayName: string
  /** Avatar initial(s) with derive-from-name fallback. */
  initials: string
  /** Avatar gradient with terra fallback. */
  gradient: string
  /** Raw profile row; null until the live query hydrates. */
  raw: { id: string; displayName: string | null; avatarValue: string | null; avatarGradient: string | null } | null
}

/**
 * Reads the single `default` user profile row via TanStack DB live query and
 * applies fallbacks for the three display fields. Drop-in replacement for the
 * `userProfiles.find(p => p.id === 'default')` + `??` chain repeated across
 * `app/(tabs)/index.tsx`, `app/(tabs)/profile.tsx`, and `app/(pages)/edit-profile.tsx`.
 */
export function useUserProfile(): UseUserProfileResult {
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles }))
  )
  const profile = profiles.find(p => p.id === 'default') ?? null
  const displayName = profile?.displayName ?? DEFAULT_NAME
  const initials = profile?.avatarValue ?? deriveInitials(displayName) ?? DEFAULT_INITIAL
  const gradient = profile?.avatarGradient ?? DEFAULT_GRADIENT
  return {
    displayName,
    initials,
    gradient,
    raw: profile
      ? {
          id: profile.id,
          displayName: profile.displayName,
          avatarValue: profile.avatarValue,
          avatarGradient: profile.avatarGradient,
        }
      : null,
  }
}
