# Tatum — Ship Plan

A step-by-step runbook from "code is clean" to "in Alanna's hands via Google Play Internal Testing + (later) TestFlight." Check off items as you go. Toggle a checkbox by changing `- [ ]` → `- [x]`.

## Context

- **Client:** Alanna (owns Apple Developer, Google Play Console, Expo, GitHub, and `tatumapp.com` Vercel DNS)
- **You:** admin on all four of Alanna's accounts
- **Devices:** Alanna uses Android; that's the priority platform for the first beta
- **Last code features before ship:** Apple Sign In + Google Sign In, then RevenueCat. Everything else is feature-complete.
- **Owner key:** **🧑 You** = Tori, **👩 Alanna** = client, **🤖 Claude** = code work

## Responsibility split — what Claude can and can't do

I can write code, run shell commands, configure `eas.json`, and trigger EAS builds and submits. I **cannot** fill out App Store Connect or Play Console listings — those have to be entered via Apple's/Google's web dashboards. EAS Submit uploads the build artifact, but you (or Alanna) have to log into the dashboards to enter app name, description, screenshots, category, content rating, data safety questionnaire, etc.

So for the store-side metadata Alanna prepared (descriptions, etc.): you don't need to share it with me. You take her doc into App Store Connect / Play Console and copy-paste. I'll help with:

- Writing the App Privacy disclosure responses (what data is collected, how, etc.) based on what the code actually does — those answers need to match reality
- Suggesting copy improvements if you ask
- Generating screenshots from a running build (I can drive the simulator/emulator to capture specific screens, but you have to upload them to the dashboards)
- Anything else that's *code or build* related

---

## Phase 0 — Repo, bundle, and naming

Foundational changes that affect everything downstream. Do these first because they cascade.

- [ ] **🧑 Transfer GitHub repo to Alanna's account.** GitHub → Repo Settings → Danger Zone → "Transfer ownership." Preserves history, issues, PRs. New URL: `https://github.com/<alanna's-handle>/tatum-app` (or whatever name she wants).
- [ ] **🧑 Add yourself back as admin** on the transferred repo.
- [ ] **🧑 Update local remote:** `git remote set-url origin <new-url>`, then `git fetch && git pull` to confirm.
- [ ] **🤖 Update `app.json`:**
  - `expo.ios.bundleIdentifier` → `com.tatumapp.tatum`
  - `expo.android.package` → `com.tatumapp.tatum`
  - `expo.name` → `Tatum` (capitalized — for icon label and store listings)
  - `expo.slug` stays `tatum` (internal Expo identifier, lowercase by convention)
- [ ] **🤖 Regenerate native projects:** `npx expo prebuild --clean`. This wipes and recreates `ios/` and `android/` from `app.json` + plugins.
- [ ] **🤖 Rebuild both platforms:** `npx expo run:ios` and `npx expo run:android` to confirm the new bundle ID installs cleanly side-by-side with the old `com.buildwithtori.tatumdev` build.
- [ ] **🧑 Delete the old `com.buildwithtori.tatumdev` app from your dev phones** once the new bundle is verified working.

---

## Phase 1 — EAS Build setup

EAS is Expo's cloud build + submit service. This is how we'll produce signed `.aab` (Android) and `.ipa` (iOS) files and upload them to the stores.

- [ ] **🧑 Sign in to EAS CLI under Alanna's Expo account:** `eas login` (use her credentials — you have admin).
- [ ] **🤖 Initialize EAS in the project:** `eas init` from the repo root. Creates `eas.json` and links the project to Alanna's Expo organization.
- [ ] **🤖 Configure `eas.json` build profiles** — `development` (dev client builds), `preview` (internal builds for testers without store submission), `production` (signed builds for store upload).
- [ ] **🤖 First EAS Android build:** `eas build --platform android --profile preview`. Verifies signing works. ~10-15 min cloud build.
- [ ] **🧑 Install the resulting APK on Alanna's Android phone** (EAS gives you a QR code/URL).
- [ ] **🤖 First EAS iOS build:** `eas build --platform ios --profile preview`. Will prompt for Apple credentials — use Alanna's. EAS auto-handles certs and provisioning.

---

## Phase 2 — Google OAuth setup (Android-first)

Pre-work in Google Cloud Console before any code goes in.

- [ ] **🧑 In Alanna's Google Cloud Console**, create a new project for Tatum (or use an existing one).
- [ ] **🧑 Configure the OAuth Consent Screen:**
  - App name: Tatum
  - User support email: (Alanna's)
  - App logo: 1024×1024 from `assets/icon.png` (resized)
  - Privacy Policy URL: `https://www.tatumapp.com/privacy` (must be live first — see Phase 3)
  - Terms of Service URL: `https://www.tatumapp.com/terms`
  - Authorized domains: `tatumapp.com`
- [ ] **🧑 Create three OAuth client IDs:**
  - **Android** — package name `com.tatumapp.tatum`, SHA-1 fingerprint (EAS gives you this after the first Android production build; until then use the debug fingerprint via `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`)
  - **iOS** — bundle identifier `com.tatumapp.tatum`
  - **Web** — needed by the Google Sign In library for token exchange. No redirect URI required for native flows, but you can add `https://www.tatumapp.com` for safety.
- [ ] **🧑 Save all three Client IDs somewhere safe** (1Password / vault). Document which is which.

---

## Phase 3 — Privacy policy + Terms (web-side prerequisites)

Both stores require these as live URLs before they'll accept submissions. Both OAuth consent screens require them too.

- [x] **🧑 Privacy Policy live at `https://www.tatumapp.com/privacy.html`** — already linked from settings (`app/(pages)/settings.tsx:10`).
- [x] **🧑 Terms of Service live at `https://www.tatumapp.com/terms.html`** — already linked from settings (`app/(pages)/settings.tsx:11`).
- [x] **🧑 Support contact email:** `tatum.app.official@gmail.com` (used in `SettingsScreen.tsx:250`).
- [ ] **🧑 Re-read the Privacy Policy** — once OAuth lands and we're collecting name+email server-side, confirm the existing policy text reflects that. If it says "everything stays on device" verbatim, it needs softening.

---

## Phase 4 — Implement Google OAuth + Identity screen

Code work, after Phases 0–3 are done. This is the "cherry on top" feature you mentioned.

- [ ] **🤖 Install native libs:**
  ```bash
  npx expo install @react-native-google-signin/google-signin
  npx expo install expo-apple-authentication   # required for iOS App Store equality
  ```
- [ ] **🤖 Add `usesAppleSignIn: true` to `app.json` iOS block.**
- [ ] **🤖 Run `npx expo prebuild --clean` and rebuild both platforms.**
- [ ] **🤖 Add `email: string | null` to `UserProfileSchema`** (`src/db/schema.ts`) + SQLite migration.
- [ ] **🤖 Create `app/(onboarding)/auth.tsx`** — Google button (both platforms), Apple button (iOS only). Handles sign-in, stores returned user data temporarily.
- [ ] **🤖 Create `app/(onboarding)/identity.tsx`** — pre-filled name + email form. Editable. Shows soft note if Apple returned a relay email.
- [ ] **🤖 Update onboarding flow order** in `app/(onboarding)/_layout.tsx` and `welcome.tsx`:
  ```
  welcome → auth → identity → protect → partner → tags → ready
  ```
- [ ] **🤖 Update `StepDots` count from 4 to 6** across onboarding screens.
- [ ] **🤖 Persist authenticated user identifier** (Apple `user` field, Google `sub`) to local SQLite so reinstalls can re-auth without re-entering.

---

## Phase 5 — Signup data destination

Where does the captured email/name go after Phase 4 captures it?

- [ ] **🧑 Decision: Mailchimp connected directly from Vercel proxy, or just Google Sheet for v1?** Currently leaning Sheet-only.
- [ ] **🧑 Create a Google Sheet** in Alanna's Workspace: columns = timestamp, name, email, platform, app_version.
- [ ] **🧑 Create a Vercel serverless function** under Alanna's Vercel account at `https://www.tatumapp.com/api/signup` — accepts POST `{name, email, platform}`, appends to the Sheet via Google Sheets API.
- [ ] **🤖 Wire `identity.tsx` to POST to `/api/signup`** after the user confirms their info.
- [ ] **🧑 Test end-to-end:** fresh install → onboarding → see row appear in the Sheet.

---

## Phase 6 — Android beta launch (Google Play Internal Testing)

The Android version goes out first since Alanna's on Android.

- [ ] **🧑 In Alanna's Google Play Console**, create the app listing:
  - App name: Tatum
  - Default language: English (US)
  - App or game: App
  - Free or paid: (decide — currently planned as one-time payment per memory note)
- [ ] **🧑 Fill out the Play Store listing fields:** short description, full description, screenshots (2–8 phone), feature graphic (1024×500), category (Health & Fitness / Lifestyle?), content rating questionnaire.
- [ ] **🧑 Complete the Data Safety questionnaire:** name + email collected, partner/activity data stored only on device.
- [ ] **🤖 Production EAS Android build:** `eas build --platform android --profile production`.
- [ ] **🤖 Submit to Internal Testing:** `eas submit --platform android --latest` (handles upload to Play Console).
- [ ] **🧑 Add Alanna + you as Internal Testers** in Play Console.
- [ ] **🧑 Send out the opt-in URL** to Alanna so she can install on her phone.

---

## Phase 7 — iOS TestFlight

Mirrors Phase 6 for iOS. Can happen in parallel once Phase 4 is done, but Android takes priority per scope.

- [ ] **🧑 In App Store Connect**, create the app record:
  - Bundle ID: `com.tatumapp.tatum`
  - Default language, SKU, category
- [ ] **🧑 Fill out App Store listing fields:** name, subtitle, description, keywords, screenshots (6.5" + 6.7" device classes minimum).
- [ ] **🧑 Complete App Privacy disclosure:** "Data Collected" — Name + Email, linked to user identity, used for "Developer Communications."
- [ ] **🧑 Enable "Sign in with Apple" capability** on the App ID in Apple Developer Console.
- [ ] **🤖 Production EAS iOS build:** `eas build --platform ios --profile production`.
- [ ] **🤖 Submit to TestFlight:** `eas submit --platform ios --latest`.
- [ ] **🧑 Wait for processing** (~5-15 min after upload), then add internal testers.
- [ ] **🧑 Send TestFlight invite to Alanna** (she can install if she ever has an iOS device, otherwise this is for external/future iOS testers).

---

## Phase 8 — RevenueCat (one-time payment paywall)

The very last feature before public launch. Out of scope for the initial beta; track here so it isn't forgotten.

- [ ] **🧑 Create RevenueCat account**, link it to Alanna's Apple + Google accounts.
- [ ] **🧑 Configure a single one-time in-app product** (per memory note: one-time payment, no freemium tiers) in both stores.
- [ ] **🤖 Install `react-native-purchases`** and wire the paywall into the `ready.tsx` onboarding step. (`ready.tsx` already has a placeholder comment for this.)
- [ ] **🤖 Block `hasOnboarded: true` until purchase succeeds or is restored.**
- [ ] **🧑 Test purchase flow** with sandbox accounts on both platforms.

---

## Decisions (locked)

- **Display name:** `Tatum` (capitalized) — applies to home screen icon label, store listings, OAuth consent screen.
- **Bundle ID:** `com.tatumapp.tatum` (single bundle, no `.dev` variant for now).
- **Auth: required, not skippable.** No "continue without signing in" option. Every user gets captured.
- **Captured at signup:** first name + email only. No extra fields (age, location, referral, etc.).
- **Reinstall behavior: standard re-auth on each install.** On reinstall, user taps Sign in with Apple/Google again. The OS handles credential lookup natively — no re-typing of email/password. Apple/Google return the same stable user identifier, so we can match the returning user. Since SQLite data lives in the app sandbox and is wiped on uninstall anyway, there's no benefit to "silent" re-auth — they're starting fresh inside the app regardless.
- **Email destination:** Google Sheet for v1 via Vercel proxy. Mailchimp added later when Alanna commits.
- **Paywall:** RevenueCat hard paywall at the end of the onboarding flow (`ready.tsx`). App is free to download, paywall blocks `hasOnboarded: true` until purchase succeeds or is restored.

## Out-of-scope notes

- **Welcome screen "No traces left behind" copy** — needs softening once server-side email exists. Suggested wording: "Uninstalling Tatum removes all of your activity. You can also delete your account in Settings to remove your name and email." (Update this when Phase 4 lands.)
- **Account deletion in Settings** — App Store requires apps that create server-side accounts to offer in-app account deletion. Need to wire a "Delete my account" entry that hits a Vercel endpoint to remove the user's row from the Sheet. Track this with the Phase 4 work.

---

## Reference commands

```bash
# Get Android debug SHA-1 (for Google OAuth Android client setup before first production build)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android

# Get Android production SHA-1 (after first EAS production build)
eas credentials --platform android   # navigate to the keystore info

# Local rebuild loop
npx expo prebuild --clean
npx expo run:android
npx expo run:ios --device

# EAS builds
eas build --platform android --profile preview
eas build --platform ios --profile preview
eas build --platform android --profile production
eas build --platform ios --profile production

# EAS store submission
eas submit --platform android --latest
eas submit --platform ios --latest
```
