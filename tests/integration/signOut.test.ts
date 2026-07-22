/**
 * signOutUser(): clears the active auth gate (email + authProvider) on the
 * profile while preserving displayName, the owning providerUserId, tier, and
 * all user data — wrong-account sign-in must stay non-destructive.
 */
import { loadFreshDb } from '../support/dbHarness'
import { makeEncounter } from '../support/factories'
import { countRows, flush } from './_support'

describe('signOutUser', () => {
  it('clears email/authProvider but keeps displayName, providerUserId, tier, and data', async () => {
    const { mod, db } = await loadFreshDb()

    await mod.userProfiles.preload()
    await mod.userProfiles.update('default', (d) => {
      d.displayName = 'Alex'
      d.email = 'alex@example.com'
      d.authProvider = 'google'
      d.providerUserId = 'provider-abc'
      d.tier = 'premium'
    }).isPersisted.promise

    // Seed a data row to prove sign-out never touches user data.
    await mod.encounters.insert(makeEncounter()).isPersisted.promise

    await mod.signOutUser()
    await flush(db)

    const [profile] = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM user_profile WHERE id = 'default'")
    // Cleared:
    expect(profile.email).toBeNull()
    expect(profile.authProvider).toBeNull()
    // Preserved:
    expect(profile.displayName).toBe('Alex')
    expect(profile.providerUserId).toBe('provider-abc')
    expect(profile.tier).toBe('premium')

    // Data untouched.
    expect(await countRows(db, 'encounters')).toBe(1)
  })
})
