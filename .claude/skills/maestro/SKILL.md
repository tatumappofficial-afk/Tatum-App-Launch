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
