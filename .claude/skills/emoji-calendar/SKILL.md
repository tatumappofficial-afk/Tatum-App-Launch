# Emoji Calendar

The primary interaction surface of Tatum — Pillar 1 (The Tracker). A monthly calendar where users log intimate encounters by dragging emojis onto dates. No forms, no medical language. Just her emojis, her dates, her truth.

**Depends on:** `data-model` (Encounter, ActivityEmoji), `design-system` (colors, component patterns), `partner-profiles` (linking encounters to partners)

---

## Core Interaction: Drag and Drop

The emoji tray sits above the calendar. Each emoji represents an activity type (see `data-model` for the full set). The user drags an emoji from the tray onto a calendar date to create an encounter.

### Emoji Tray

- Horizontal scrollable row of emoji items (38px squares, see `design-system` for styling)
- Each item shows the emoji centered, Surface2 background
- On press-and-hold: the emoji lifts (scale 1.15) and becomes draggable
- On tap (without hold): opens a quick-log sheet for today's date with that emoji pre-selected
- Below the tray: hint text "Tap to log · Hold & drag to a specific date" in Muted italic

### Calendar Grid

- Standard month view, 7-column grid (Su Mo Tu We Th Fr Sa, configurable start day via UserSettings)
- Month/year header in Playfair Display 600, 19px with nav arrows
- Day cells are circular (aspect-ratio 1:1)
- Day number: DM Sans 400, 11px, Ink

### Day States

| State | Visual | Description |
|-------|--------|-------------|
| Empty | Default, no background | No encounters logged |
| Logged | Surface2 background, Terra day number | Has one or more encounters |
| Today | Terra→Fig gradient, white day number | Current date |
| High activity | Mauve→Fig gradient, white day number | Multiple encounters or notable day |
| Drop target | `rgba(192,120,88,0.15)` background, 2px dashed Terra border | Currently being dragged over |

### Logged Day Indicator

When a day has logged encounters, a small emoji dot (7px) appears below the day number showing the most recent activity emoji. If multiple activities, show the first one — tapping the day reveals all.

---

## Quick Log Flow

Tapping an emoji (without dragging) or tapping a logged day opens the Quick Log sheet.

### Quick Log Sheet (Bottom Sheet)

1. **Date display** — Playfair Display, the selected date
2. **Activity picker** — the emoji tray, horizontally scrollable, with current selection(s) highlighted (active tag style)
3. **Partner selector** — row of partner avatar bubbles (see `partner-profiles`), plus "Solo" option (✨)
4. **Save button** — primary CTA "Log It"
5. **Optional expansion** — "Add a note" link (opens Private Notes, see `private-notes`), "Rate it" link (opens thumbs/stars)

The sheet should feel fast and minimal. Most logs should complete in under 3 seconds: tap emoji → confirm partner → done.

---

## Calendar Navigation

- Left/right arrows to change month
- Swipe gesture to change month (horizontal swipe on calendar area)
- Tapping month/year header opens a month picker for faster navigation
- No infinite scroll — months load one at a time

---

## Legend

Below the calendar, a small legend row:

- Sage dot + "Logged" label
- Terra→Fig dot + "Today" label
- Mauve→Fig dot + "Active day" label

---

## Multi-Activity Days

A single date can have multiple encounters (different times, different partners, or just multiple logs). When a day is tapped:

- If one encounter: opens that encounter's detail/edit view
- If multiple encounters: opens a list showing each encounter with its emoji, time (if logged), and partner name, tappable to edit individually

---

## Data Flow

- **Read:** Query `Encounter` table by month/year range to populate the calendar grid
- **Write:** Creating a new encounter inserts into the `Encounter` table in `client/schemas/`
- **State:** Calendar view state (current month, selected day, drag state) lives in `src/store/` — this is ephemeral and regenerable

---

## Constraints

- The calendar must render performantly with months containing 30+ encounters
- Drag-and-drop must work on both iOS and Android — use `react-native-gesture-handler` and `react-native-reanimated` for gesture handling
- The emoji tray is not user-customizable in v1 — the activity set is fixed
- Calendar start day (Sunday vs Monday) is user-configurable via settings
