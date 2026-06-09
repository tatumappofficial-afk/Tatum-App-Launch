# Maestro flows

Android-only verification harness. iOS is covered by the iOS Simulator MCP — do not duplicate flows here for iOS.

## Run a flow

```bash
maestro test .maestro/home_screen.yaml
```

Requires the Tatum Android dev client installed on a booted arm64 emulator
(or a physical device with USB debugging). If the emulator's network is down,
run `adb reverse tcp:8081 tcp:8081` and launch via the deep link
`tatum://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`.
