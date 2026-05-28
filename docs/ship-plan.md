# Tatum — Ship Plan

A step-by-step runbook from "code is clean" to "in Alanna's hands via Google Play Internal Testing + TestFlight." Check off items as you go. Toggle a checkbox by changing `- [ ]` → `- [x]`.

> **Strategy update (2026-05-27):** auth is deferred to v1.1 so we can get builds into Alanna's hands by EOD. A parallel Claude session is building the OAuth UI shells (no wiring). After she's played with the app and finishes the Google Cloud Console setup on her end (instructions sent via email), we ship v1.1 with real auth wired through. Current build ships with the existing pre-auth onboarding flow.

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

- [x] **🧑 Transfer GitHub repo to Alanna's account.** _Done via orphan-commit push to her new repo `tatumappofficial-afk/Tatum-App-Launch` (not GitHub's Transfer feature) so she got a clean single-commit history with no AI/Claude mentions._
- [x] **🧑 Add yourself back as admin** on the transferred repo.
- [x] **🧑 Update local remote:** `origin` → Alanna's repo, `personal` → Tori's archive (`torij2294/tatum-app`). Local `main` tracks `personal/main`.
- [x] **🤖 Update `app.json`:**
  - `expo.ios.bundleIdentifier` → `com.tatumapp.tatum`
  - `expo.android.package` → `com.tatumapp.tatum`
  - `expo.name` → `Tatum` (capitalized — for icon label and store listings)
  - `expo.slug` stays `tatum` (internal Expo identifier, lowercase by convention)
- [x] **🤖 Regenerate native projects:** `npx expo prebuild --clean`. Verified `com.tatumapp.tatum` in `ios/*.xcodeproj/project.pbxproj` and `android/app/build.gradle`; no `buildwithtori` references remain.
- [x] **🤖 Rebuild both platforms:** `npx expo run:ios` and `npx expo run:android` confirmed the new bundle installs and launches. Required clearing stale DerivedData from the pre-rename folder path (in `node_modules/expo-modules-jsi/apple/.DerivedData` and `~/Library/Developer/Xcode/DerivedData/tatum-*`) — flag if seen again on another machine.
- [ ] **🧑 Delete the old `com.buildwithtori.tatumdev` app from your dev phones** once you've confirmed the new bundle works as expected.

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

## Phase 2 — OAuth dashboard setup (Tori's browser work) — **DEFERRED to v1.1**

> Skipped for the EOD beta ship. Alanna will do this on her end after she gets the app — instructions sent via email. When her three Google client IDs land in `.env.local` + the Apple App ID has Sign In with Apple enabled, we wire OAuth into the UI shells the parallel Claude is building and ship v1.1.


Two systems, do them in order. Total time estimate: 30–45 min if nothing weird happens.

- **2A** — Apple Developer Portal (enable Sign In with Apple capability) — ~5 min
- **2B** — Google Cloud Console (consent screen + 3 OAuth client IDs) — ~30–40 min

Run these in parallel with Phase 4 code work. When you finish 2B, paste the three client IDs into `.env.local` (I'll create the template) and I'll do the final wiring.

---

### 2A — Apple Developer Portal: enable Sign In with Apple

1. Go to [developer.apple.com/account](https://developer.apple.com/account) and sign in as Alanna.
2. Left nav → **Certificates, IDs & Profiles** → **Identifiers**.
3. Look for an App ID with bundle ID `com.tatumapp.tatum`.
   - **If it exists:** click into it.
   - **If it doesn't exist:** click the blue **+** at the top → select **App IDs** → **Continue** → select **App** → **Continue**. Description: `Tatum`. Bundle ID: **Explicit**, value `com.tatumapp.tatum`.
4. In the **Capabilities** list, find **Sign In with Apple**. Check the box on the left.
5. **Don't** click the "Configure" button next to it — the default settings are fine for a primary App ID.
6. Click **Save** (top right). Confirm the dialog if it asks "modifying this App ID may affect provisioning profiles."

- [ ] **🧑 Success check:** the App ID's detail page shows "Sign In with Apple" with a green checkmark. Tell me when this is done — I'll add the entitlement on the code side via the `expo-apple-authentication` plugin.

---

### 2B — Google Cloud Console: consent screen + 3 client IDs

You'll do these in order. The prerequisite step gets a string you'll need in step (iv).

#### Prerequisite — get your Android debug SHA-1 fingerprint

You'll need this when creating the Android OAuth client. Run in any terminal:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android | grep SHA1
```

You should see a line like:

```
SHA1: A1:B2:C3:D4:E5:F6:...:99:00
```

Copy the whole `A1:B2:...:99:00` string (without the `SHA1:` prefix or leading space). Save it somewhere — you'll paste it in step (iv).

> If `keytool` isn't found, install the JDK: `brew install openjdk` and retry. If `~/.android/debug.keystore` doesn't exist yet, just run `npx expo run:android` once and it'll be auto-created.

#### (i) Create the Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in as Alanna.
2. Top bar, project dropdown (left of the search bar) → **New Project**.
3. Project name: `Tatum`. Location: leave default. Click **Create**.
4. Wait ~30s, then make sure the top bar dropdown now shows **Tatum** as the active project before continuing.

#### (ii) Set up the OAuth Consent Screen

1. Left nav (☰ hamburger) → **APIs & Services** → **OAuth consent screen**. (Newer Cloud Console UI may label this **Branding** under "Google Auth Platform" — same thing.)
2. User Type: select **External**. Click **Create**.
3. Fill in the form:
   - App name: `Tatum`
   - User support email: Alanna's email
   - App logo: upload `assets/icon.png` from the repo (must be 1024×1024 PNG, ≤1MB — if it errors on size, downsize first)
   - App domain → Application home page: `https://www.tatumapp.com`
   - Application privacy policy link: `https://www.tatumapp.com/privacy.html`
   - Application terms of service link: `https://www.tatumapp.com/terms.html`
   - Authorized domains: `tatumapp.com` (just the bare domain — no `www`, no `https://`, no trailing slash)
   - Developer contact information: Alanna's email
4. **Save and continue**.
5. **Scopes** screen: click **Add or remove scopes**. Check **only these two**:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - Do **not** add anything else. Any other scope is "sensitive" and triggers Google's verification process (multi-week ordeal we don't need).
   - Click **Update** → **Save and continue**.
6. **Test users** screen: click **Add users** and add Alanna's Gmail + your Gmail. While the app is in "Testing" mode (default for External apps), only listed test users can sign in. Up to 100 testers allowed. Click **Save and continue**.
7. **Summary** screen: review, then **Back to Dashboard**.

You can leave the app in "Testing" mode for now. We'll publish it (one click, no review needed since we only use non-sensitive scopes) before the Play Store / App Store goes live.

#### (iii) Create the **iOS** OAuth client ID

1. Left nav → **APIs & Services** → **Credentials**.
2. Top → **+ Create Credentials** → **OAuth client ID**.
3. Application type: **iOS**.
4. Name: `Tatum iOS`.
5. Bundle ID: `com.tatumapp.tatum`. (App Store ID and Team ID are optional, skip them.)
6. Click **Create**.
7. A dialog shows the **Client ID** (looks like `123456789-abcdef.apps.googleusercontent.com`). **Copy it** to a temporary doc. You can also download the `.plist` if offered; we don't strictly need it but no harm.

#### (iv) Create the **Android** OAuth client ID

1. Same page → **+ Create Credentials** → **OAuth client ID**.
2. Application type: **Android**.
3. Name: `Tatum Android (debug)`.
4. Package name: `com.tatumapp.tatum`.
5. SHA-1 certificate fingerprint: paste the `A1:B2:...:99:00` string from the prerequisite step above.
6. Click **Create** and copy the resulting **Client ID** to your temp doc.

> **Note:** this client is tied to your *debug* signing key, which works for `npx expo run:android` on your machine. Production EAS Android builds use a different signing key with a different SHA-1 — we'll create a second Android client ID for the EAS key during Phase 6. For now, debug is enough to test the flow.

#### (v) Create the **Web** OAuth client ID

Counterintuitive but **required** — the `@react-native-google-signin` library uses a Web client ID to exchange tokens, even though our app isn't a website.

1. Same page → **+ Create Credentials** → **OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Tatum Web (token exchange)`.
4. Authorized JavaScript origins: leave empty.
5. Authorized redirect URIs: leave empty.
6. Click **Create** and copy the resulting **Client ID** to your temp doc.

#### (vi) Hand off the three client IDs

Open the repo's `.env.local` file (I'll create the template — it'll have empty value slots waiting for you). Paste each ID into its slot:

```
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

Save the file. **Tell me when done** and I'll do the final wiring + test on simulator/emulator.

> **Important:** `.env.local` is gitignored — your client IDs stay on your machine and never get committed. Do **not** paste them into `.env` (which would commit them).

- [ ] **🧑 Phase 2A done** (Sign In with Apple capability enabled)
- [ ] **🧑 Phase 2B done** (3 Google client IDs in `.env.local`)

---

## Phase 3 — Privacy policy + Terms (web-side prerequisites)

Both stores require these as live URLs before they'll accept submissions. Both OAuth consent screens require them too.

- [x] **🧑 Privacy Policy live at `https://www.tatumapp.com/privacy.html`** — already linked from settings (`app/(pages)/settings.tsx:10`).
- [x] **🧑 Terms of Service live at `https://www.tatumapp.com/terms.html`** — already linked from settings (`app/(pages)/settings.tsx:11`).
- [x] **🧑 Support contact email:** `tatum.app.official@gmail.com` (used in `SettingsScreen.tsx:250`).
- [ ] **🧑 Re-read the Privacy Policy** — once OAuth lands and we're collecting name+email server-side, confirm the existing policy text reflects that. If it says "everything stays on device" verbatim, it needs softening.

---

## Phase 4 — Implement Google OAuth + Identity screen — **DEFERRED to v1.1**

UI shells built in parallel by a separate Claude session. Wiring (this list) happens after Phase 2 completes on Alanna's end.


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

## Phase 5 — Signup data destination — **DEFERRED to v1.1**

Blocked on Phase 4. Tackle when auth lands.


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
- [ ] **🧑 Complete the Data Safety questionnaire:** for v1.0 (no auth) — **"No data collected."** All wellness data is local-only SQLite. Update to "Name + Email collected, used for account / developer communications" when v1.1 ships with auth.
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
- [ ] **🧑 Complete App Privacy disclosure:** for v1.0 (no auth) — **"Data Not Collected."** Update to "Name + Email, linked to user identity, for Developer Communications" when v1.1 ships with auth.
- [ ] **🧑 Enable "Sign in with Apple" capability** on the App ID in Apple Developer Console — **DEFERRED to v1.1** (only required when the app actually offers third-party sign-in).
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
