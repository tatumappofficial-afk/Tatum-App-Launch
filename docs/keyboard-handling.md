# Keyboard Handling in Modal Sheets

The pattern we landed on for the three sheet modals — `edit-partner`, `LogSessionScreen`, `AddTagModal` — and the dead ends we ruled out getting there.

> Cross-reference: this is the project-specific resolution. The general guidance lives in `Tori's Vault/Expo Best Practices/Keyboard Handling.md` ("Pattern 2 — Form-style modal").

## Footer rule — hide it while the keyboard is up

After months of fighting `KeyboardAvoidingView`'s `behavior="padding"` to lift the footer above the iOS keyboard inside a `formSheet`, we gave up trying to lift it and started hiding it instead. iOS just refuses to make consistent room: the footer kept sitting under the keyboard regardless of KAV config, detents, or scroll-content padding.

```tsx
const [keyboardVisible, setKeyboardVisible] = useState(false)
useEffect(() => {
  const show = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
  const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
  // Android only fires the Did events, so listen to both pairs.
  const showAndroid = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
  const hideAndroid = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
  return () => { show.remove(); hide.remove(); showAndroid.remove(); hideAndroid.remove() }
}, [])

// ...
{!keyboardVisible && <Footer />}
```

Trade-off: the user has to dismiss the keyboard (tap outside, hit Return on a single-line input) before they can reach the Save button. This matches Android's default behavior anyway, and the inputs are above the keyboard via KASV auto-scroll, so the experience is consistent.

**Submit on Return is forbidden project-wide.** Never wire `onSubmitEditing` to a save handler. Return = blur = keyboard dismiss = footer reappears. Same rule for every TextInput in every modal.

## The pattern (current)

```jsx
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const insets = useSafeAreaInsets()

<KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: ... }}>
  <KeyboardAwareScrollView
    style={{ flex: 1 }}
    keyboardShouldPersistTaps="handled"
    bottomOffset={20}
    bounces={false}
  >
    <Header />          {/* scrolls with content; do NOT make sticky */}
    <FormFields />
  </KeyboardAwareScrollView>

  <View style={{ paddingBottom: Math.max(insets.bottom, 10), ... }}>
    <SaveButton />
  </View>
</KeyboardAvoidingView>
```

Why this combination:

- The library's `KeyboardAvoidingView` shrinks the available area for the keyboard *first*, so the inner `KeyboardAwareScrollView` is measuring against a correct (shrunken) frame instead of fighting iOS's sheet auto-resize.
- `KeyboardAwareScrollView` then auto-scrolls the focused input to `bottomOffset` above the keyboard, on both iOS and Android. Without the outer KAV, this over-scrolls inside iOS `formSheet` and pushes everything else off the top.
- `bounces={false}` prevents overscroll-to-top from triggering the sheet's drag-to-dismiss gesture.
- The footer is a plain `<View>` *outside* the scroll view but *inside* the KAV — so KAV's padding lifts it above the keyboard, and it sits flush above without any extra `KeyboardStickyView` lift.
- `paddingBottom: Math.max(insets.bottom, 10)` covers iOS home-indicator (~34) and Android nav bar; the floor handles devices that report 0.
- `KeyboardAwareScrollView` needs `contentContainerStyle={{ paddingBottom: 16 }}` (or similar) so the scroller has somewhere to *scroll into* when the keyboard opens. Without it, an input at the very bottom of the content has zero scroll room and the keyboard ends up overlapping the field. Symptom: input partly hidden by keyboard, footer also covered — looks like the KAV isn't lifting anything (it is; there's just no scroll headroom). AddTagModal hit this for months until we added the contentContainerStyle.
- The footer needs `flexShrink: 0` + a solid `backgroundColor` so it isn't squeezed and so keyboard-area content doesn't bleed through it.
- Android footer padding: use `Math.max(insets.bottom, 10) + (Platform.OS === 'android' ? 12 : 0)`. The Android system-nav inset is the *size of the nav bar*, not a margin above it, so without the extra bump the buttons sit flush against the back/home bar. iOS doesn't need the bump — the home indicator inset already includes breathing room.

## Horizontal scrollers inside Android sheets

The Android sheet chrome (`app/(sheets)/_layout.tsx`) is a custom JS implementation — iOS uses native UIKit `formSheet`, Android doesn't have an equivalent surfaced through `react-native-screens`, so we hand-rolled one with `react-native-gesture-handler` + Reanimated.

The full story of how this evolved is in the Obsidian vault: `Expo Best Practices/Android Modal Sheet — Direction-Locked Gestures and Fade Backdrop.md`. Quick summary of what's in the codebase now:

- **Body-wide pan gesture** wraps the whole `Animated.View` so swipe-down from anywhere dismisses
- **`manualActivation(true)` + direction comparison** in `onTouchesMove` activates only when downward motion dominates over horizontal (`dy > 1.5 × |dx|` and `dy > 12`)
- **Direction lock-in** via shared values: once the gesture commits to vertical, horizontal drift can't fail it; once horizontal motion takes the lead, the pan permanently fails for that touch
- **`simultaneousHandlers={panRef}` on nested horizontal `ScrollView`s** (`AddTagModal`, `LogSessionScreen`, `edit-partner`) — exposed via `SheetPanGestureContext`. Lets the parent pan and child scroll both track touches from pixel zero
- **Backdrop opacity** is derived from sheet `translateY` so it fades in/out without sliding (screen-level `animation: 'none'` to opt out of the slide-everything transition)
- **`useSheetDismiss()` hook** from `SheetDismissContext` — close-X / Cancel / save-success use this instead of `router.dismiss()` directly so they run the same fade-out animation. iOS falls back to native dismiss.

Multiline `TextInput` (only `LogSessionScreen` notes) keeps `scrollEnabled={false}` so it grows to fit content and the master scroll view is the only scroll target. iOS gets confused if a `UITextView` (multiline TextInput) is nested inside another `UIScrollView`.

## Things that did NOT work — do not retry

1. **RN's `KeyboardAvoidingView behavior="padding"` on iOS.** Double-shifts with iOS sheet auto-resize — content scrolls off the top.
2. **`automaticallyAdjustKeyboardInsets={true}` on the master ScrollView.** Breaks the sheet's drag-to-dismiss gesture (overscroll dismisses instead of scrolls).
3. **`contentInsetAdjustmentBehavior="never"` on the master ScrollView.** Made everything worse.
4. **Sticky header (header outside the ScrollView).** Form content rendered *over* the header during keyboard scroll-into-view because the library translates the ScrollView's frame past its layout bounds.
5. **`KeyboardAwareScrollView` without an outer `KeyboardAvoidingView`.** Library over-scrolls in iOS `formSheet`; bottom inputs come into view but everything else (header, other fields) gets pushed off the top — the symptom looks like the modal "going blank."
6. **`KeyboardAvoidingView behavior="translate-with-padding"`.** Lifts everything by a fixed amount regardless of input position; pushed top-of-form inputs (edit-partner display name) above the visible sheet.
7. **`KeyboardStickyView` for the footer.** Initially looked great (footer sat above the keyboard) but combined with the iOS sheet auto-shift it caused content to "slide down" and disappear because the available area was being shrunk by both iOS *and* the sticky lift. The plain-View footer inside KAV gives the same visual result without the conflict.
8. **`flexGrow: 1` on the `KeyboardAwareScrollView`'s `contentContainerStyle`.** Pins content to fill the area — when the keyboard shrinks the scroll frame, the content has nowhere to overflow into and the scroll-to-input stays at offset 0.

## Sheet config (relevant context)

`app/_layout.tsx`:

```ts
ios: {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.85],
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  sheetCornerRadius: 24,
  sheetExpandsWhenScrolledToEdge: false,
}
```

Single detent (0.85), no scroll-expansion. We tried adding a 0.99 second detent thinking iOS would auto-expand for the keyboard — it doesn't. Detents are user-driven only (drag-up), so adding a taller detent doesn't help keyboard avoidance and just makes the sheet draggable for no reason. Keep it single-detent.

`app.json` has `"edgeToEdgeEnabled": true` for Android, which gives Android the resize-on-keyboard behavior automatically.

## Library docs

- https://kirillzyusko.github.io/react-native-keyboard-controller/
