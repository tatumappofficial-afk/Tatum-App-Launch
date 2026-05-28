// Stubbed for v1.0 — auth is deferred to v1.1.
//
// The full Apple + Google sign-in implementation lives in git history; restore
// the file from there once Alanna's Google Cloud Console setup is done, the
// native pods are linked via `npx expo prebuild --clean`, and the three
// EXPO_PUBLIC_GOOGLE_*_CLIENT_ID values are present in `.env.local`.
//
// expo-router eagerly evaluates every file in `app/` at bundle load to register
// routes, so this file must have a valid default export even though nothing
// navigates to /auth in v1.0.

export default function AuthScreen() {
  return null
}
