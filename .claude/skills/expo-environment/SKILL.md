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

## Runtime Constraints (learned)

### crypto.randomUUID not available
Hermes (React Native's JS engine) does not implement `crypto.randomUUID()`. TanStack DB uses it internally. A global polyfill must be loaded at app startup — see `src/utils/crypto-polyfill.ts`.

### iOS 26 beta simulator missing emoji font
The iOS 26.3 beta simulator does not include the Apple Color Emoji font. All emoji render as boxes with question marks. This is a simulator-only issue — real devices and Android emulators render emoji correctly. **Test emoji rendering on Android emulator.**

### Font loading on Android
Use `Font.loadAsync()` explicitly instead of the `useFonts` hook. The hook approach is less reliable on Android for initial font loading.

Each font weight must be a separate registered font name:
```tsx
await Font.loadAsync({
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
})
```

### fontWeight conflict on Android (CRITICAL)
On Android, setting `fontWeight: '700'` alongside `fontFamily: 'PlayfairDisplay_700Bold'` causes Android to **ignore the custom font** and fall back to the system font. The weight is already baked into the font file.

Use the `font()` helper from `lib/theme.ts` which returns the correct weight-specific font name:
```tsx
// ✅ CORRECT
fontFamily: font('playfair', '700')
// No fontWeight needed — the font file IS the weight

// ❌ WRONG — Android ignores the custom font
fontFamily: font('playfair', '700'),
fontWeight: '700',
```

### Modal presentation differences
- iOS: `presentation: 'formSheet'` with `sheetGrabberVisible: true` and `sheetAllowedDetents`
- Android: `presentation: 'transparentModal'` with a custom `BottomSheet` wrapper component (`lib/components/BottomSheet.tsx`)
- Check `Platform.OS` in `app/(modals)/_layout.tsx` for the pattern
