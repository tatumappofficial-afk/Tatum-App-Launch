# Keyboard Handling in Modal Sheets

The pattern we landed on for the three sheet modals — `edit-partner`, `LogSessionScreen`, `AddTagModal` — and the dead ends we ruled out getting there.

> Cross-reference: this is the project-specific resolution. The general guidance lives in `Tori's Vault/Expo Best Practices/Keyboard Handling.md` ("Pattern 2 — Form-style modal").

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

Single detent (0.85), no scroll-expansion. `app.json` has `"edgeToEdgeEnabled": true` for Android, which gives Android the resize-on-keyboard behavior automatically.

## Library docs

- https://kirillzyusko.github.io/react-native-keyboard-controller/
