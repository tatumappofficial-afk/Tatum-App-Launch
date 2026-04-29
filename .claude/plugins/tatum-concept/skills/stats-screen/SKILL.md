---
name: stats-screen
description: Home tab stats — Week / Month / Year / All Time period views revealing patterns without optimization
---

# Stats — the Home tab

The Home tab is where she sees her patterns. Not a dashboard. Not a scorecard. A place to read her own life back to herself with care.

The data is hers. The framing is hers. The point is self-understanding, not optimization.

**Depends on:** `data-model` (Encounter, Partner, ActivityTag, DesireEntry, UserSettings.calendarStartDay), `design-system` (cards, gradients, typography, AvatarStack)

---

## Anti-frequency-goal principle (governing constraint)

This is the one rule the rest of the spec serves.

Stats reveal patterns; they never imply "more is better." Specifically:

- **No period-vs-period count comparisons.** No "↑ 3 more than last week." No streaks. No deltas.
- **No goal language.** No "you're on track." No "keep it up."
- **No leaderboards of partners.** Activities can be ranked by self-rated quality (≥3 sample). People cannot.
- **Counts appear as neutral facts.** "12 sessions this month" — descriptive, not graded.
- **Visual language must read as observation, not scorecard.** Bar gradients are warmth, not heat.

Tone-line per view (rotating, brand-voice): something like *"Your patterns, not a performance."* / *"Whatever shows up here is yours."*

---

## Period tabs

Four tabs across the top of the Home screen, all unconditionally available (no premium gating — the app is one-time purchase):

| Tab | Window |
|---|---|
| Week | Sunday → Saturday (or Monday-start per `UserSettings.calendarStartDay`) of the picked week |
| Month | 1st → last day of the picked calendar month |
| Year | Current year: **YTD** (Jan 1 → today). Past year: **full** Jan 1 → Dec 31. |
| All Time | First-encounter date → today |

**Switching tabs resets the anchor to today.** If she was on March 2025 in Month view and taps Year, she lands on the current YTD year. The picker is the way to navigate to past periods.

**App open also resets to Week + today.** Period state is pure `useState`, not persisted.

---

## Caption row

Beneath the tabs, a single row:

- **Date caption** flush-left — "Apr 26 – May 2", "April 2026", "Jan 1 – Apr 28, 2026" (current YTD), "2025" (past full year), "Since Mar 4, 2025" (All Time).
- **Picker pill** flush-right — "Pick a week ▾", "Pick a month ▾", "Pick a year ▾". Tapping opens the dropdown. **All Time** renders a static, muted caption pill (the "Since X" date) that doesn't open anything.

Layout stability matters more than minimalism: the row is always present so content below doesn't shift on tab switches.

---

## Picker dropdowns

Opened from the picker pill, rendered inline in the document flow (same pattern as the log-session calendar dropdown). Three flavors share the outer shell (border-radius, surface, shadow):

| Period | Picker | Behavior |
|---|---|---|
| Week | Day calendar grid (`DatePickerDropdown` with `mode="week"`) | Tapping any day picks that day's full week. The row containing the selected day highlights. Header chevrons step by month. |
| Month | 4×3 month-chip grid + year-nav header (`MonthYearDropdown`) | Tap a chip to pick that month. Year chevrons step by ±1 year, bounded. |
| Year | Vertical year list (`YearDropdown`) | Tap a year. Newest at top, scrollable to first-encounter year. |

**Bounds:**
- Forward: capped at the current period (cannot pick future months/years; future months in the year-pick chips are disabled).
- Backward: capped at the **year of the user's first encounter**. If she has no encounters yet, the bound collapses to the current year only.

Step arrows on the row itself were considered and rejected — pill-only matches the rest of the app, and the dropdowns provide one-tap navigation to any past period.

---

## Per-period stat menus

Each tab has a different layout. The stats below are the locked menu — additions or removals must satisfy the anti-frequency-goal principle.

### Week — *what just happened*

- **Sessions** (count, no comparison)
- **Days this week** (weekday names, e.g. "Tue, Thu, Sat") — never as "X of 7"
- **Top activity** (singular emoji + label + count, full-width callout card)
- **What you've explored** (emoji inventory, no number)
- **Partners** (avatar strip; null partner-id encounters absent; inactive partners muted ~0.6)
- **Average rating** (only if ≥1 rated; hidden otherwise)
- **Recent reflections** (notes preview, 0–2 items)

### Month — *find rhythm*

- **Sessions** (count, no comparison)
- **Your weekly rhythm** (7-bar chart Sun→Sat, no winner caption)
- **Top activities** (top 3, list with bars)
- **Most enjoyed activity** (highest-rated, ≥3 sample required; hidden otherwise)
- **What you've explored** (emoji inventory)
- **Partners** (avatar strip)
- **What stood out** (★≥8 sessions, horizontal scroller; hidden when zero)
- **Recent reflections**

### Year — *see seasons* (YTD on current year, full Jan–Dec on past years)

- **Sessions** (count alone)
- **Your year, by month** (12-bar chart; on YTD, future months render muted)
- **Your weekly rhythm** (7-bar across the year)
- **Top activities** (top 5)
- **Most enjoyed activity**
- **What you've explored**
- **Partners this year** (avatar strip)
- **What stood out** (★≥8 sessions)
- **Desire → action** (count of `DesireEntry.actedOn === true` vs total desires logged in window — framed as connection, not conversion rate; hidden when no desires logged)

### All Time — *the long view*

- **Total sessions**
- **Logging since** — rendered in the static caption pill, not duplicated as a card
- **Your weekly rhythm**
- **The seasons of you** (12-bar month-of-year aggregated across all years)
- **Top activities**
- **Most enjoyed activity**
- **What you've explored** (full lifetime emoji inventory)
- **Your partner history** (avatars, active + inactive)
- **What stood out**

---

## Empty states

Three distinct scenarios.

### Scenario A — zero encounters anywhere
The existing global Home empty state fires (HeroEmpty + EmptyStatsStrip + empty partner cards + EmptySessionsPlaceholder). The period tabs render but in `inert` mode (no selected pill).

### Scenario B — current period is empty (data exists elsewhere)
A soft empty card replaces the view content:
- Week: *"A fresh week — nothing logged yet."* with **[Look back at last week]** CTA
- Month: *"Nothing in this month yet."* / **[Look back at last month]**
- Year: *"No sessions logged this year yet."* / **[Look back at last year]**

The CTA steps the anchor one period back without opening the picker.

### Scenario C — picked past period is empty
- *"Nothing logged this [week/month/year]."* with **[Jump to nearest activity]** CTA
- The CTA scans encounters and sets the anchor to the date closest (in absolute days) to the current anchor.

---

## Visual rules

- **Card surface:** `colors.surface`, 1px border `colors.border`, 12–16px radius, 12–16px padding.
- **Stat numbers:** Playfair 600, 28–36px, terra.
- **Stat labels:** DM Sans 500, 7.5–8px uppercase, stone, letterSpacing 1.5.
- **Bar charts:** terra→mauve vertical gradient, 3px border-radius, 2px baseline track for zero values. Future-month bars on YTD render at 40% opacity. **No "winner" highlights.** No heat-map style coloring.
- **Captions:** DM Sans 400/500, 9–11px.
- **No heavy chart library.** Charts are simple custom `BarChart` components in `lib/screens/home/shared/`.
- **Solo Partner** is a regular Partner row, default-seeded. Treat it like any other partner. Encounters with `partnerId === null` (no partner picked) are excluded from partner stats but counted in everything else.

---

## Architecture

```
lib/screens/home/
  WeekView.tsx              ← per-period view; renders EmptyPeriod when sessionsCount === 0
  MonthView.tsx
  YearView.tsx
  AllTimeView.tsx
  PlaceholderView.tsx       ← used pre-data and as a defensive fallback
  shared/
    PeriodTabs.tsx
    PeriodCaptionRow.tsx
    PeriodPicker.tsx        ← dispatches to the right dropdown per period
    EmptyPeriod.tsx
    SessionsCountCard.tsx
    BarChart.tsx
    TopActivitiesList.tsx
    MostEnjoyedActivityCard.tsx
    EmojiInventoryGrid.tsx
    PartnerStrip.tsx
    StandoutSessions.tsx
    RecentReflections.tsx

lib/components/
  DatePickerDropdown.tsx    ← shared with log-session; gained `mode: 'day' | 'week'`
  MonthYearDropdown.tsx     ← Home-specific
  YearDropdown.tsx          ← Home-specific

lib/stats/
  windows.ts                ← getWeekWindow, getMonthWindow, getYearWindow, getAllTimeWindow + caption + bound helpers
  shared.ts                 ← topActivities, topPartners, dayOfWeekHistogram, monthOfYearHistogram, mostEnjoyedActivity, standoutSessions, emojiInventory, partnersInWindow, recentNotes, distinctWeekdays, findNearestEncounterDate, lookupTagLabel
  weekStats.ts / monthStats.ts / yearStats.ts / allTimeStats.ts  ← (encounters, partners, tags, [desires,] window, calendarStartDay) → typed stats
  types.ts
  index.ts                  ← barrel
```

`app/(tabs)/index.tsx` is the only route consumer: holds `period`, `anchor`, `pickerOpen` state, runs the four `useLiveQuery` collections, dispatches to the right `compute*Stats` function, renders the matching view.

---

## Constraints

- Stats compute from local SQLite encounter data — no server dependency
- No premium gating (one-time purchase model)
- Multi-partner encounters supported — each partner in `partnerIds` counts toward partner stats
- Inactive partners still appear in stats (visually muted) — history honors what was real
- Activity-tag rename/deletion: stats look up labels by emoji from active or inactive tags; falls back to the emoji itself if no match
