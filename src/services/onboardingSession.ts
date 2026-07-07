import { getDatabase } from '@/src/db/sqlite'
import { partners, userProfiles } from '@/src/db'
import { generateId } from '@/src/utils/uuid'
import { deriveInitials } from '@/src/utils/initials'
import type { AgeSignalVerdict } from '@/src/services/ageSignal'

type OnboardingProvider = 'apple' | 'google'

type PartnerDraft = {
  displayName: string
  avatarValue: string
  avatarGradient: string
}

export type OnboardingSession = {
  email: string
  fullName: string
  provider: OnboardingProvider
  providerUserId: string
  ageVerdict: AgeSignalVerdict
  displayName?: string
  attested18?: boolean
  biometricLock?: boolean
  partner?: PartnerDraft
}

let currentSession: OnboardingSession | null = null

export function startOnboardingSession(session: OnboardingSession) {
  currentSession = { ...session }
  return currentSession
}

export function updateOnboardingSession(patch: Partial<OnboardingSession>) {
  if (!currentSession) return null
  currentSession = { ...currentSession, ...patch }
  return currentSession
}

export function getOnboardingSession() {
  return currentSession
}

export function clearOnboardingSession() {
  currentSession = null
}

async function clearExistingMainPartner() {
  const db = await getDatabase()
  const rows = await db.getAllAsync<{ id: string }>('SELECT id FROM partners WHERE isMain = 1')
  const now = new Date().toISOString()

  for (const row of rows) {
    try {
      partners.update(row.id, (draft) => {
        draft.isMain = false
        draft.updatedAt = now
      })
    } catch {
      await db.runAsync('UPDATE partners SET isMain = 0, updatedAt = ? WHERE id = ?', [now, row.id])
    }
  }
}

export async function commitOnboardingSession() {
  const session = currentSession
  if (!session) throw new Error('No onboarding session to commit')

  const now = new Date().toISOString()
  const displayName = session.displayName?.trim() || session.fullName.trim()
  const avatarValue = deriveInitials(displayName) || 'A'
  const email = session.email.trim()

  userProfiles.update('default', (draft) => {
    draft.displayName = displayName
    draft.email = email.length > 0 ? email : null
    draft.authProvider = session.provider
    draft.providerUserId = session.providerUserId
    draft.avatarValue = avatarValue
    draft.tier = 'premium'
    draft.premiumExpiresAt = null
  })

  if (session.partner) {
    await clearExistingMainPartner()
    partners.insert({
      id: generateId(),
      displayName: session.partner.displayName,
      avatarType: 'initials',
      avatarValue: session.partner.avatarValue,
      avatarGradient: session.partner.avatarGradient,
      isActive: true,
      isMain: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  return session
}
