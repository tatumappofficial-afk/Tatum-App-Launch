---
name: expo-environment
description: Expo Go runtime environment facts — SDK version, font names, package compatibility, Metro config
---

# Expo Environment

Technical facts about Tatum's runtime environment that must be verified at the start of every session.

## Run Target: Expo Go

Tatum runs in **Expo Go**. Do not prebuild. Do not generate a dev client. Run with:
```bash
npx expo start
```
Then press `i` for iOS simulator or scan QR for device.

## SDK Version

Always check the latest SDK version before scaffolding:
```bash
npm info expo version
```
Do not assume the scaffolded version is current. As of this writing, `create-expo-app` scaffolds SDK 54 but SDK 55 is latest. Upgrade immediately after scaffolding with `npx expo install expo@latest` then `npx expo install --fix`.

## Simulator Target

Use the latest available iOS simulator. Check with:
```bash
xcrun simctl list devices available | grep "iPhone.*iOS"
```
Use the same device name throughout the session.

## Package Compatibility

These packages are confirmed Expo Go compatible:
- `expo-sqlite` — yes, including `expo-sqlite/kv-store`
- `expo-haptics` — yes
- `expo-local-authentication` — yes
- `@expo-google-fonts/*` — yes
- `react-native-reanimated` — yes (bundled in Expo Go SDK 50+)
- `@gorhom/bottom-sheet` — yes

These packages require a dev build (do not use in Tatum v1):
- `react-native-mmkv` — no, C++ JSI

## Font Names

Exact export names from `@expo-google-fonts/dm-sans`:
- `DMSans_300Light`
- `DMSans_400Regular`
- `DMSans_500Medium`

Exact export names from `@expo-google-fonts/playfair-display`:
- `PlayfairDisplay_400Regular`
- `PlayfairDisplay_400Regular_Italic`
- `PlayfairDisplay_600SemiBold`
- `PlayfairDisplay_700Bold`

Verify these before using — never assume a weight exists.

## Metro Package Resolution

If a package uses `exports` subpaths that Metro can't resolve, use `resolveRequest` in `metro.config.js`:
```js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const overrides = {
    // 'package/subpath': 'package/dist/subpath.cjs'
  }
  if (overrides[moduleName]) {
    return { filePath: require.resolve(overrides[moduleName]), type: 'sourceFile' }
  }
  return context.resolveRequest(context, moduleName, platform)
}
```
Add this to `metro.config.js` at scaffold time, before installing any dependencies.
