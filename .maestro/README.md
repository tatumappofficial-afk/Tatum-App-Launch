# Maestro E2E suite

Android-only verification harness. iOS is covered by the iOS Simulator MCP —
do not duplicate flows here for iOS.

## One-call full sweep

```bash
npm run test:e2e
```

Starts Metro with the dev seed (`EXPO_PUBLIC_DEV_SEED=1`, cache cleared) and
runs every flow tagged `sweep` in `config.yaml`'s `flowsOrder` (~15 min). The
dev seed is deterministic and marks the user onboarded/authed, bypassing
OAuth, biometrics, and the paywall. The final flow (erase-all-data) wipes the
account and asserts the signed-out sign-in screen — which doubles as the
fresh-install OAuth wall, the furthest point onboarding automation can reach.

Run a single flow while iterating:

```bash
maestro test .maestro/flows/14-tag-lifecycle-history.yaml
```

Requires the Tatum Android dev client installed on a booted arm64 emulator
(`npx expo run:android`). If the emulator's network is down, run
`adb reverse tcp:8081 tcp:8081` and launch via the deep link
`tatum://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`.

## Layout

- `config.yaml` — workspace: flow glob, execution order, `continueOnFailure`.
- `flows/` — one flow per user journey, numbered by execution order:
  - `10–19` read-mostly / self-contained flows (each starts from a clean
    re-seeded state via the `launch-seeded` subflow)
  - `90+` destructive flows (erase-all-data) — always last in the sweep
- `subflows/` — shared steps (`launch-seeded`, `goto-tab`, …). Not matched by
  the workspace glob; only reachable via `runFlow`.

## Tags

- `sweep` — part of the one-call sweep
- `destructive` — wipes user data; keep ordered after everything else
- `regression` — flows pinning a specific fixed bug (e.g. tag-name history)
- `android`, `smoke` — legacy/marker tags

## Conventions

- Prefer `text:` selectors; `assertVisible` before interacting; `id:` only
  when text is ambiguous or missing (then add a `testID` in the app).
- Each `sweep` flow starts with `runFlow: ../subflows/launch-seeded.yaml` —
  `clearState` + deep-link into Metro — so flows are order-independent and
  always see the same deterministic seed data.
- Copy in flows follows the project wording rule: sessions/intimacy/wellness
  vocabulary only, and never restate default tag labels that violate it —
  assert on safe labels (Quickie, Manual, Period, custom fixture tags).
- The tab bar is matched via its `", SESSIONS"`-style accessibility labels —
  use the `goto-tab` subflow rather than bare tab words (screen content
  often contains the same word, e.g. Home's "SESSIONS" stat card).

## Known gaps

- **Onboarding.** There is no dev bypass for Apple/Google OAuth
  (`app/(onboarding)/auth.tsx`), and `.env.local`'s `EXPO_PUBLIC_DEV_SEED=1`
  is loaded by Expo regardless of the shell env, so a truly-unseeded bundle
  is impractical to automate. The erase-all flow asserts the sign-in screen
  (same OAuth wall); the welcome/identity/partner/tags/ready walk needs a
  manual pass or real test credentials.
- **"Set as main partner" switch.** The toggle is a label-less custom
  switch with no matchable text — automating it needs a `testID` in
  `lib/components/ToggleSwitch.tsx`. Main-partner *behavior* is asserted by
  flow 11 (TAT-7 partner preselect).
- **Transient success overlays** (`Session added` etc.) are not reliably in
  the accessibility tree — flows assert durable outcomes (sheet closed,
  data visible) instead.
- **Journal cards** collapse to a single `Session on {date}` accessibility
  label; their note/emoji children are unmatchable. Use the calendar
  day-section cards (`{partner}, {note}` labels) to target a specific
  same-day session.
