# Keyboard Handling in Modal Sheets — What We've Tried

## The problem

Three modals presented as iOS `formSheet` (Android `transparentModal`) all need usable keyboard avoidance:

- `lib/screens/AddTagModal.tsx` — TextInput for tag name
- `lib/screens/LogSessionScreen.tsx` — multiline TextInput for notes (at the bottom of a long form)
- `app/(sheets)/edit-partner.tsx` — TextInput for partner name + initials

iOS `formSheet` + React Native's built-in `KeyboardAvoidingView` does not work cleanly together. UISheetPresentationController has its own keyboard-avoidance logic that conflicts with KAV's transformations, and there's no documented opt-out.

## Sheet config (relevant context)

`app/_layout.tsx` configures `(sheets)` as:

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

Only one detent (0.85), expansion-on-scroll disabled. `app.json` has `"edgeToEdgeEnabled": true` for Android.

## Approaches tried

### 1. RN `KeyboardAvoidingView` with `behavior="padding"` on iOS

Original code. Adds keyboard-height of bottom padding when keyboard opens.

**Result:** Content shoved off the top of the sheet — iOS auto-lifts the formSheet *and* KAV adds padding, double-shift. Title and form fields disappear above the visible viewport.

### 2. RN `KeyboardAvoidingView` with `behavior={undefined}` on iOS

KAV becomes a no-op on iOS, `'height'` on Android.

**Result:**
- AddTagModal (short content) was usable.
- LogSession (long content with multiline notes) → completely blank sheet when notes focused.
- edit-partner → same blank-sheet issue.

### 3. `automaticallyAdjustKeyboardInsets={true}` on the master ScrollView

Tried adding to LogSession + edit-partner.

**Result:** Broke iOS sheet drag-to-dismiss gesture. Scrolling up dismissed the sheet instead of scrolling content. Reverted.

### 4. `scrollEnabled={false}` on the multiline notes TextInput

Multiline TextInput is a UITextView (which is a UIScrollView), so nesting one inside the master ScrollView confuses iOS's keyboard scroll-into-view. Disabled the inner scroll so the master ScrollView is the only scroll target.

**Result:** Kept this — it's still a correct change. Side benefit: notes field auto-grows with content. Did not fix the blank-screen issue alone.

### 5. Wrap AddTagModal body in a master ScrollView

Originally AddTagModal had no master ScrollView — content was a fixed vertical layout. The Tag Name TextInput had no ScrollView ancestor, so iOS picked the inner horizontal "Your current tags" ScrollView as the scroll target and translated it to the top of the screen.

**Result:** Fixed the "tags strip jumps to top" issue in AddTagModal. Kept this change.

### 6. Restructure: header outside ScrollView (sticky)

Moved the header (title + close X) out of the master ScrollView in LogSession + edit-partner so it would stay visible. Theory: iOS auto-scroll inside the ScrollView would scroll the header off the top if it was inside.

**Result:** "Worked" in the sense that the keyboard now made content visible — BUT the form content rendered *over* the header. The ScrollView's scroll-into-view appears to translate the ScrollView's frame upward (not just contentOffset), which extends past its layout bounds and overlaps the header sibling above it. After keyboard dismiss, content stayed in the overlapped position.

### 7. `contentInsetAdjustmentBehavior="never"` on master ScrollView

Tried to disable iOS automatic safe-area inset adjustment on the ScrollView.

**Result:** Made it worse. Couldn't see the textbox at all and overlap persisted. Reverted.

### 8. `react-native-keyboard-controller` library — `KeyboardAwareScrollView`

Installed `react-native-keyboard-controller@1.20.7`. Wrapped app in `KeyboardProvider`. Replaced master ScrollView with `KeyboardAwareScrollView`. Removed RN's KAV wrapper.

**⚠️ Requires custom dev build** — does not work in Expo Go. User must run `npx expo prebuild` + `npx expo run:ios`, or build via EAS.

**Result with header inside:** Form content disappears when keyboard opens — `KeyboardAwareScrollView` scrolls aggressively to bring the focused input above the keyboard, and since the input is at the bottom of long content, everything else (including the header) scrolls off the top.

**Result with header outside (sticky):** Content overlaps the sticky header — same root cause as #6, the library scrolls the ScrollView in a way that extends past its bounds.

### 9. `react-native-keyboard-controller` — `KeyboardAvoidingView` `behavior="padding"`

Switched from the library's `KeyboardAwareScrollView` to its `KeyboardAvoidingView` (sheet-aware, replaces RN's). Header back inside the regular `ScrollView`. KAV shrinks the available area above the keyboard; ScrollView reflows; iOS handles native scroll-into-view inside the smaller area.

**Pattern:**

```jsx
<KeyboardAvoidingView behavior="padding" style={{ flex: 1, ... }}>
  <ScrollView keyboardShouldPersistTaps="handled" ...>
    <Header />
    <body content with TextInput />
  </ScrollView>
  <Footer />
  <SuccessOverlay />
</KeyboardAvoidingView>
```

**Result:**
- LogSession: notes input still hidden behind keyboard. After dismiss, can't scroll to bottom (layout stuck).
- AddTagModal: tag name input still covered by keyboard.
- edit-partner: works — but only because the input is near the top of the form.

The KAV adds padding so the layout is shrunk, but plain RN `ScrollView` does NOT auto-scroll the focused input into view. Users would have to manually scroll, but the shrunk ScrollView area + iOS sheet auto-resize leaves them stuck.

### 10. KAV `behavior="translate-with-padding"`

The library's recommended behavior for sheets — translates the entire view up by keyboard height plus adds padding.

**Result:**
- LogSession & AddTagModal: untested with this approach (we moved on quickly).
- edit-partner: BROKE it. The display name input is at the top of the form. Translating up by keyboard height pushed the input *above* the visible sheet area.

**Insight:** `translate-with-padding` lifts everything by a fixed amount (keyboard height) regardless of input position. Wrong tool for our case where input position varies across modals.

### 11. `KeyboardAwareScrollView` with `bottomOffset={20}` (second attempt)

Reverting to the library's `KeyboardAwareScrollView`. This scrolls the *focused input* to be `bottomOffset` pixels above the keyboard — not the whole view.

**Result:** User reported "everything disappears" again. Same as approach #8. The library's scroll-into-view appears to over-scroll inside iOS formSheets — possibly because iOS is *also* auto-resizing the sheet for the keyboard, so the library's measurements of the available area are wrong.

### 12. `KeyboardAvoidingView` `behavior="padding"` (CURRENT — second attempt)

Back to the library's `KeyboardAvoidingView` with `behavior="padding"`. We now know this is "least bad":
- Form layout stays intact (no disappearing content).
- Inputs near the top (edit-partner display name) are visible above the keyboard.
- Inputs near the bottom (LogSession notes, AddTag tag name) end up *behind* the keyboard — user must dismiss + scroll to reach them.

**Pattern:**

```jsx
<KeyboardAvoidingView behavior="padding" style={{ flex: 1, ... }}>
  <ScrollView keyboardShouldPersistTaps="handled" ...>
    <Header />
    <body content with TextInput />
  </ScrollView>
  <Footer />
  <SuccessOverlay />
</KeyboardAvoidingView>
```

**Status:** Current state. The bottom-input problem (notes, tag name) is unsolved by tooling — the real fix is to **redesign the form** so the inputs aren't at the bottom of long content. Options:

1. Move notes input to a dedicated "Add notes" sheet (tap pill → opens single-input modal).
2. Reorder LogSession so notes is near the top.
3. Make AddTagModal's body shorter (fewer emoji rows).

## Conclusion

We've reached the limit of what tooling alone can fix for `formSheet` + long form + bottom input. The remaining options are structural (redesign form layout) or major (replace the sheet presentation entirely).

## Things that DID work and should be kept

- `KeyboardProvider` wrapping the Stack in `app/_layout.tsx`.
- `scrollEnabled={false}` on the multiline notes TextInput in LogSession.
- AddTagModal's body wrapped in a master ScrollView (fixes the inner horizontal ScrollView translation issue).
- Header inside the master ScrollView (so it scrolls naturally with content). Don't make it sticky again — it caused overlap issues with both RN's and the library's tools.

## Things to NOT try again

- RN's `KeyboardAvoidingView` with `behavior="padding"` on iOS sheets — double-shift bug.
- `automaticallyAdjustKeyboardInsets={true}` on a ScrollView inside a sheet — breaks drag-to-dismiss.
- `contentInsetAdjustmentBehavior="never"` on the master ScrollView — made things worse.
- Sticky header outside ScrollView — overlap with form content during keyboard open.
- `KeyboardAwareScrollView` from the library for our specific layout (long form + input near bottom) — over-scrolls and hides everything except the input.

## Open questions / potential next steps if the current approach fails

- Try `KeyboardAvoidingView` `behavior="height"` instead of `"padding"`.
- Try `KeyboardStickyView` from the library for the footer (Save button) only, with the header in the scroll.
- Add multiple `sheetAllowedDetents` (e.g. `[0.85, 0.99]`) so iOS can expand the sheet when keyboard opens.
- Use `useReanimatedKeyboardAnimation` from the library to manually drive layout.

## Library docs

- https://kirillzyusko.github.io/react-native-keyboard-controller/
