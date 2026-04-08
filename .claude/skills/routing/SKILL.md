# Routing

The Expo Router file structure for Tatum. Route files in `app/` are thin — they import screen implementations from `src/screens/` and define no logic themselves. The routing shape is Layer 2 (Foundation) and survives regeneration of `src/`.

**Depends on:** All feature skills (determines which screens exist), `design-system` (bottom nav, navigation patterns)

---

## Tab Structure

Tatum uses a custom tab bar with 4 tab destinations and a center action button (FAB). The tab bar is built with `expo-router/ui` headless primitives (`Tabs`, `TabList`, `TabTrigger`, `TabSlot`) for full control over the UI while handling routing underneath.

| Position | Item | Icon (Ionicons) | Screen | Description |
|----------|------|-----------------|--------|-------------|
| 1 | Calendar | `calendar-outline` | Home/Calendar | Emoji calendar + emoji tray (Pillar 1) |
| 2 | Stats | `bar-chart-outline` | Stats | Daily/weekly/monthly/yearly stats |
| 3 | + (FAB) | ✦ (text) | — | Center action button, opens Quick Log sheet |
| 4 | Whisper | `chatbubble-outline` | Whisper | Tatum Whisper composition + history (Pillar 3) |
| 5 | Profile | `person-outline` | Profile | Settings, partner management, account |

The center FAB is not a tab destination — it's a `TouchableOpacity` that opens the Quick Log modal via `router.push`. The 4 actual tabs use `TabTrigger` with `asChild` to render custom styled buttons. A hidden `TabList` defines the route configuration.

### Tab Bar Styling

- Background: Surface (`#FBF7F2`)
- Border top: 1px Border
- Active icon color: Terra (`#C07858`)
- Active label: Terra
- Inactive icon/label: Stone (`#9A8878`)
- Labels: DM Sans 500, 8.5px, uppercase, letter-spacing 1.5px
- Icons: Ionicons from `@expo/vector-icons`, 22px
- FAB: 56px circle, Terra background, white "✦" icon, elevated shadow, positioned center between tabs, raised -12px above tab bar line
- Tab bar height: 60px + safe area bottom inset
- Consistent appearance on iOS and Android

---

## Route File Structure

```
app/
  _layout.tsx                    ← Root layout: font loading, theme provider, auth gate
  (tabs)/
    _layout.tsx                  ← Custom tab bar (expo-router/ui) with 4 tabs + center FAB
    index.tsx                    ← Calendar screen (tab 1)
    stats.tsx                    ← Stats screen (tab 2)
    whisper.tsx                  ← Whisper screen (tab 3)
    profile.tsx                  ← Profile screen (tab 4)
  (modals)/
    quick-log.tsx                ← Quick Log bottom sheet
    note-editor.tsx              ← Private note editor
    partner-create.tsx           ← Create/edit partner
    partner-detail.tsx           ← Partner detail view
    encounter-detail.tsx         ← Encounter detail/edit
    whisper-compose.tsx          ← Whisper composition flow
    safe-space.tsx               ← Safe Space entry + feed
    settings.tsx                 ← App settings
    my-affirmations.tsx          ← Custom affirmation library (premium)
  +not-found.tsx                 ← 404 fallback
```

### Route File Pattern

Every route file follows the same pattern — thin wrapper importing from `src/`:

```tsx
// app/(tabs)/index.tsx
import { CalendarScreen } from '@/src/screens/CalendarScreen';
export default CalendarScreen;
```

No logic, no state, no data fetching in route files. All of that lives in `src/screens/` and `src/store/`.

---

## Modal Presentation

Modals use Expo Router's modal presentation (`presentation: 'modal'` in the layout). On iOS this gives the native card-style bottom sheet. On Android, a slide-up animation.

### Bottom Sheet Pattern

Several screens use a bottom sheet rather than a full modal:

- **Quick Log** — half-screen sheet, appears over current tab
- **Note Editor** — expandable sheet, starts half-screen, drags to full
- **Partner Rating** — inline expansion (not a separate route, handled within the calendar/partner component)

Use `@gorhom/bottom-sheet` for sheet behavior within screens, Expo Router modals for full-screen flows.

---

## Navigation Flows

### Primary Flows

1. **Log an encounter:** Tab 1 (Calendar) → tap emoji / drag to date → Quick Log sheet → save
2. **Add a note:** Quick Log sheet → "Add a note" → Note Editor modal → save
3. **Rate a partner:** Tab 1 → tap partner bubble → rating panel (inline) → save
4. **Send a whisper:** Tab 4 (Whisper) → browse prompts / write own → select partner → preview → send
5. **View stats:** Tab 2 (Stats) → toggle daily/weekly/monthly/yearly
6. **Log desire:** FAB long-press or Safe Space entry (from Profile or dedicated entry point) → Safe Space modal → save

### Secondary Flows

7. **Create partner:** Partner row "+" → Partner Create modal → save → returns to previous context
8. **View partner detail:** Long-press partner → Partner Detail modal
9. **Edit encounter:** Calendar → tap logged day → Encounter Detail modal → edit → save
10. **Settings:** Profile tab → Settings modal

---

## Deep Linking

Not critical for v1, but the route structure should support it:

- `tatum://calendar` → Tab 1
- `tatum://calendar/2026-03-15` → Tab 1, scrolled to March 2026, day 15 selected
- `tatum://whisper` → Tab 4
- `tatum://safe-space` → Safe Space modal

---

## Auth / Onboarding Gate

The root `_layout.tsx` handles:

1. **Font loading** — show splash screen until Playfair Display + DM Sans are loaded
2. **Biometric gate** — if biometric lock is enabled, require auth before showing any content
3. **Onboarding** — first launch shows an onboarding flow (not specced in detail yet, will be its own skill)
4. **Main app** — the tab navigator

---

## Constraints

- Route files must stay thin — this is non-negotiable in the regenerative architecture
- The tab layout and route paths are stable — changing a route path is a breaking change
- Modal routes use the `(modals)` group so they can be presented over any tab
- The FAB's Quick Log sheet opens via `router.push('/(modals)/quick-log')` — the FAB is a plain `TouchableOpacity` in the custom tab bar, not a route
- The tab bar is built with `expo-router/ui` headless primitives for cross-platform consistency — not NativeTabs (which doesn't support embedded action buttons)
- Safe Space needs a prominent entry point that doesn't require navigating to a specific tab — consider a long-press on the FAB or a dedicated gesture
