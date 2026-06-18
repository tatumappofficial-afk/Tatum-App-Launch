# Tatum Onboarding — Implementation Plan

## Summary

Five-screen forward-only onboarding flow gated on a new `hasOnboarded` boolean in `user_settings`. Built fresh in `app/(onboarding)/`, with the cofounder's `lib/screens/Onboarding*Screen.tsx` files (and stories) deleted entirely. Reuses existing data paths for partners and tags — no parallel structures. Adds biometric lock-on-launch as a separate but related feature, since the current `biometricLock` setting toggle in Settings is inert. Designed to be auth-agnostic; when Apple/Google sign-up ships later, it slots in cleanly without restructuring.

> **Current status:** this is a historical implementation plan. Apple/Google auth, identity capture, 18+ attestation, platform age signal, and signup logging have shipped. Do not copy old privacy assumptions from this doc into user-facing copy; current wording should say that logged activity stays on-device, while signup/account metadata is collected for account and developer communication purposes.

---

## Architecture

**Gate.** `app/_layout.tsx` reads `hasOnboarded` during init (after `await initDatabase()`), wraps the Stack in two `<Stack.Protected>` blocks: one guarding `(onboarding)`, one guarding the rest. No `app/index.tsx` redirect — `Stack.Protected` is the canonical Expo Router pattern and avoids the one-frame "flash of wrong tree" bug.

**Splash.** `SplashScreen.preventAutoHideAsync()` called at **module scope** in `app/_layout.tsx` (outside the component — calling inside is too late and races). After init resolves with `hasOnboarded`, call `SplashScreen.hideAsync()`. The same splash visuals double as the lock screen.

**No back nav anywhere in the flow.** `usePreventRemove(true)` from React Navigation on all 5 onboarding screens. One hook covers iOS swipe-back, Android hardware back, header back, programmatic pops. Forward via `router.push()`.

**Persistence model: commit-on-action.** Each screen writes to the DB on its primary action, using the existing data paths (`partners.insert`, `activityTags.insert`, `updateSetting`). DB is the source of truth. Survives crash mid-onboarding.

**Schema delta.** Add `hasOnboarded: boolean` to `UserSettingsSchema` in `src/db/schema.ts` and `DEFAULT_SETTINGS`. **No schema version bump** — `getSettings()` falls back to `DEFAULT_SETTINGS` for missing keys, and `updateSetting('hasOnboarded', true)` writes via `INSERT OR REPLACE`. Existing dev DBs work uninterrupted.

---

## Per-screen specs

### Screen 1 — `app/(onboarding)/welcome.tsx`

- **Layout:** mock-faithful three-pillar layout
- **Pillar 1 rewrite:** title **"Stored on your phone"** / subtitle **"Your activity stays on your phone."**
- **Pillars 2 + 3:** unchanged from mock
- **CTA:** `I UNDERSTAND, LET'S BEGIN` → `router.push('/(onboarding)/protect')`
- **No Skip.** Hardware/swipe back blocked via `usePreventRemove(true)`.

### Screen 2 — `app/(onboarding)/protect.tsx`

- **Layout:** ONE card (collapsed from mock's two-card design — designs are aspirational, the OS biometric APIs make two cards a fake distinction)
- **Card label adapts dynamically** from `LocalAuthentication.supportedAuthenticationTypesAsync()`:
  - iOS Face ID → "Use Face ID & device passcode"
  - iOS Touch ID → "Use Touch ID & device passcode"
  - Android fingerprint → "Use fingerprint & device passcode"
  - Android face unlock → "Use face unlock & device passcode"
  - No biometric enrolled → "Use device passcode"
- **Continue:** calls `LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock Tatum', disableDeviceFallback: false })`
  - Success → `updateSetting('biometricLock', true)` → advance
  - Cancel/fail → `updateSetting('biometricLock', false)` → advance with subtle toast ("You can enable lock later in Settings")
- **Skip for now:** `updateSetting('biometricLock', false)` → advance, no auth prompt
- **iOS Info.plist** (via `app.json` plugin): `NSFaceIDUsageDescription` = `"Tatum uses Face ID so only you can open your logs."`

### Screen 3 — `app/(onboarding)/partner.tsx`

- **Reuse `app/(sheets)/edit-partner.tsx` patterns exactly:** avatar + initials TextInput side-by-side, `manuallyEdited` latch, 10-swatch `partnerGradients` palette from `lib/theme.ts`, horizontal-scroll color picker
- **"Alex" as `placeholder` only**, never committed. `defaultValue=""`. Add Partner button **disabled when name is empty**
- **Avatar size:** larger than `edit-partner.tsx`'s 56pt — mock's hero size, since this is the focal element on the screen
- **Solo widget:** render as `<View>` (not `<Pressable>`), drop the chevron, copy unchanged
- **CTA: `ADD PARTNER`** (not "Add Alex") — on tap: same `partners.insert(...)` shape as `edit-partner.tsx:98-107`. Then advance.
- **Skip for now:** advance with no insert. No partner row is created.

### Screen 4 — `app/(onboarding)/tags.tsx`

- **Tag grid:** live query of `activityTags` collection, filtered `isActive`, sorted by `sortOrder` — same pattern as `add-tag.tsx`
- **Default tags already seeded** by `src/db/index.ts` (21 tags from `DEFAULT_ACTIVITY_TAGS` in `src/db/schema.ts`). No new seed logic.
- **"Add yours +" tile** → `router.push('/(sheets)/add-tag')`. New tags appear at top (see file change below).
- **No edit/delete on this screen.** Hint text below grid: **"You can add or remove tags from your profile anytime."**
- **Layout:** mock's horizontally-scrolling 3-row grid
- **CTA: `THESE LOOK GOOD`** → advance. No Skip (matches mock).

### Screen 5 — `app/(onboarding)/ready.tsx`

- **Greeting:** `"You're all set."` (no name) for v1. When Apple/Google auth + backend ship, swap to `userProfiles.displayName`.
- **Three feature teasers** (Calendar / Home / Journal): unchanged from mock
- **Footer:** **"Your data is private and yours alone."** ("encrypted" dropped — `expo-sqlite` doesn't actually encrypt)
- **CTA: `START LOGGING`** → handler:
  ```ts
  // FUTURE: RevenueCat hard paywall here. If purchase succeeds → continue.
  // If cancelled → block here, don't set hasOnboarded.
  await updateSetting('hasOnboarded', true)
  router.replace('/(tabs)')
  ```
  Set the flag **before** replace; user has effectively completed onboarding by tapping the button.

---

## Lock-on-launch (separate but in-scope)

The `biometricLock` setting toggle at `app/(pages)/settings.tsx` is currently inert. We're wiring it up.

- **New: `lib/components/LockGate.tsx`** — wraps `<Stack>` in `app/_layout.tsx`. On mount AND on `AppState` change to `'background'` → `'active'`, if `biometricLock === true`, render lock overlay + trigger `authenticateAsync()`.
- **Re-lock policy:** on every `'background'` event (NOT `'inactive'` — avoids spurious locks during control center / app switcher).
- **Lock visuals:** splash-as-lock — splash screen extends through cold-start auth; on foreground we render a splash-lookalike component (`lib/components/LockOverlay.tsx`). If user dismisses the auth prompt, a small "Unlock" button on the overlay re-prompts.
- **Same auth call:** `authenticateAsync({ promptMessage: 'Unlock Tatum', disableDeviceFallback: false })` — device passcode is always the safety net; user can never be permanently locked out.

---

## File changes

| Action | Path | Why |
|---|---|---|
| Create | `app/(onboarding)/_layout.tsx` | Stack with `headerShown: false` |
| Create | `app/(onboarding)/welcome.tsx` | Screen 1 |
| Create | `app/(onboarding)/protect.tsx` | Screen 2 |
| Create | `app/(onboarding)/partner.tsx` | Screen 3 |
| Create | `app/(onboarding)/tags.tsx` | Screen 4 |
| Create | `app/(onboarding)/ready.tsx` | Screen 5 |
| Create | `lib/components/LockGate.tsx` | Wraps app, drives lock state |
| Create | `lib/components/LockOverlay.tsx` | Foreground lock visual |
| Create | `src/utils/biometrics.ts` | Label + hardware/enrollment helpers |
| Modify | `app/_layout.tsx` | Module-scope splash hide; read `hasOnboarded` in init; `Stack.Protected` blocks; wrap in `LockGate` |
| Modify | `app/(sheets)/add-tag.tsx` | `sortOrder = min(existing) - 1` (global change — new tags at top everywhere, not just onboarding) |
| Modify | `src/db/schema.ts` | Add `hasOnboarded` to `UserSettingsSchema` + `DEFAULT_SETTINGS` |
| Modify | `app.json` | Add `expo-local-authentication` plugin entry with `faceIDPermission` text |
| Delete | `lib/screens/Onboarding{Privacy,Security,Partner,Tags,Ready}Screen.tsx` | Cofounder static mockups; not used |
| Delete | `stories/Onboarding{Privacy,Security,Partner,Tags,Ready}Screen.stories.tsx` | Storybook not used |

---

## New dependencies

- `expo-local-authentication` — install via `npx expo install expo-local-authentication`
- That's it. No `expo-secure-store` (no in-app PIN). No `AsyncStorage` (using `user_settings` table). No `@gorhom/bottom-sheet`.

---

## Implementation order (suggested)

1. **Schema + persistence** (1h): add `hasOnboarded` to schema + defaults. Verify `getSettings()` works for the new key.
2. **Gate skeleton** (1h): `app/_layout.tsx` module-scope splash, init reads flag, `Stack.Protected` blocks. Empty `(onboarding)` routes that just say "step N." Verify routing, no flash of wrong tree.
3. **Screens 1, 5** (2h): static screens + `usePreventRemove`. Verify `hasOnboarded` writes correctly on completion, `Stack.Protected` swaps to tabs.
4. **Screen 3** (3h): clone `edit-partner.tsx` form patterns. Verify partner row is created and visible in tabs after completing onboarding.
5. **Screen 4** (1h): live query + Add Yours navigation. Modify `add-tag.tsx` sortOrder. Verify new tags appear at top.
6. **Screen 2 + biometric setup** (3h): install `expo-local-authentication`, `app.json` plugin, `src/utils/biometrics.ts`, dynamic label, Continue/Skip handlers.
7. **LockGate** (3h): foreground/background detection, splash-as-lock overlay, wires Settings toggle.
8. **Manual QA on iOS + Android dev clients** (2h): cold start, Skip path, biometric path, biometric denial, hardware back blocked, return from background re-locks.

**Total: ~16 hours implementation, plus design polish.**

---

## Open items deferred to future work

- **Auth flow** (Apple/Google sign-up): shipped. Apple "Hide My Email" can return a relay address; Apple name only appears on first auth, so identity capture happens immediately.
- **Signup metadata backend:** shipped as a webhook path. It stores limited signup/account metadata so Alanna can see who signed up. Privacy copy must distinguish this from local-only wellness logs: sessions, notes, tags, and partner records stay on-device; name, email, 18+ attestation, platform age-signal verdict, and platform can be sent server-side.
- **RevenueCat hard paywall** between Screen 4 and START LOGGING. Comment stub in place at `app/(onboarding)/ready.tsx`.
- **Display name population** on Screen 5: drop-in change once auth captures it.
- **Tag rename / tag soft-delete in Profile**: not built yet. The hint copy on Screen 4 only promises "Remove" (which `edit-profile.tsx` already supports). If you later want rename, extend `add-tag.tsx` to take an optional `id` for edit mode.
