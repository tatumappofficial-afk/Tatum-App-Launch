---
name: maestro
description: Maestro E2E testing requirements — flow writing, accessibility tree discovery, completion criteria
---

# Maestro

Maestro is mandatory. A screen is not done until it has a passing Maestro flow.

## Non-negotiables

- Write flows alongside screens, not after the build is complete
- Do not declare the project done until all flows pass
- `tsc --noEmit` passing is not a completion signal — a running, tested app is

## Discovering the accessibility tree

Before writing any flow, dump the real hierarchy:
```bash
maestro hierarchy
```

On iOS, tab bar items are exposed as: `"Calendar, tab, 1 of 5"` — not `"Calendar"`.
Use `assertVisible` with the exact label from the hierarchy dump.

## Flow template

```yaml
appId: com.skylightsocial.tatum
---
- launchApp
- assertVisible:
    text: "Calendar, tab, 1 of 5"
    enabled: true
```

## Running flows

```bash
# single flow
maestro test .maestro/01-launch.yaml

# full suite
maestro test .maestro/
```

## When flows fail

If a flow fails because accessibility text doesn't match, dump the hierarchy again and use the exact text found there. Never guess — always verify.

## Learned Patterns (from real testing)

### App ID
- Android emulator: `host.exp.exponent` (lowercase, not `host.exp.Exponent`)
- This is the Expo Go package name on Android

### Expo Go Tools Button
The floating "Tools" button in Expo Go sits on top of the app UI and intercepts Maestro taps. **Disable it** via the dev menu (shake or `adb shell input keyevent 82`) → toggle "Tools button" OFF before running tests.

### Maestro Driver Connection
After Metro restart, the Maestro gRPC driver loses connection. Fix with:
```bash
adb forward tcp:7001 tcp:7001
adb shell am force-stop dev.mobile.maestro.test
adb shell am instrument -w dev.mobile.maestro.test/androidx.test.runner.AndroidJUnitRunner &
```

### Opening the App Reliably
Use `openLink` with the Android emulator's host alias:
```yaml
- openLink: "exp://10.0.2.2:8082"
```
`10.0.2.2` is Android emulator's alias for the host machine. `localhost` refers to the emulator itself.

### Avoid clearState
`clearState` on `host.exp.exponent` wipes the Maestro driver APK along with app data. Instead, use the Dev Tools screen to reset data:
```yaml
- tapOn: "PROFILE"
- swipe:
    direction: UP
- tapOn: "🔧 Dev Tools"
- tapOn: "Clear & Reseed"
```

### Shared Setup Flow
Use `runFlow: seed-data.yaml` at the start of each test to ensure known data state. The seed-data flow:
1. Opens the app via `openLink`
2. Navigates to Profile → Dev Tools
3. Taps "Clear & Reseed"
4. Returns to HOME

### Accessibility Labels
Use `accessibilityLabel` on Pressable components for reliable Maestro targeting. Maestro matches `label:` against accessibility labels, which is more reliable than text matching (which can match multiple elements).

### Text Matching Ambiguity
Tab bar labels and screen content may share text (e.g., "SESSIONS" in tab bar AND as a section header). Use coordinate taps (`point: "70%,96%"`) for tab bar navigation when text is ambiguous.
