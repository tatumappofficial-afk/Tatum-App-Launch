---
name: reanimated
description: React Native Reanimated dual-write pattern — shared values + React state mirrors
---

# Reanimated Patterns

React Native Reanimated shared values do not trigger React re-renders. This is by design — they live on the UI thread. Reading `sharedValue.value` in a component gives the correct value at render time, but the component will never re-render when the value changes.

## The required pattern

For any state that:
1. Needs to drive animations or worklets → use a shared value
2. Needs to trigger component re-renders (update UI) → also use a React state mirror

```typescript
// Both are required. Neither alone is sufficient.
const isPlayingSV = useSharedValue(false)          // for worklets/animations
const [isPlaying, setIsPlaying] = useState(false)  // for re-renders

function play() {
  isPlayingSV.value = true   // worklet-readable
  setIsPlaying(true)         // triggers re-render
}
```

## Where each is read

- **In JSX/render expressions:** read the React state (`isPlaying`)
- **In worklets and animated styles:** read the shared value (`isPlayingSV.value`)
- **In `useAnimatedReaction`:** for worklet-to-JS bridges only (not for triggering renders)

## useAnimatedReaction is not a substitute

`useAnimatedReaction` runs on the UI thread and calls back to JS via `runOnJS`. It is async and adds bridge overhead. Use it only when you need to detect a UI-thread change and run JS in response — not as a way to keep React state in sync with a shared value.

## Never do this

```typescript
// WRONG — component will not re-render when isPlayingSV changes
const isPlaying = isPlayingSV.value  // stale after first render
```
