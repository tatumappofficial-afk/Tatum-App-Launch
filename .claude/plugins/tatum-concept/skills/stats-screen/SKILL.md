---
name: stats-screen
description: Home stats dashboard — session counts, ratings, activity charts
---

# Stats Screen

The Stats tab (Tab 2) — where she sees her patterns. How often she shows up. Which weeks were her best. How this month compares to last. The data that finally tells her the truth about herself.

**Depends on:** `data-model` (computed views: DailyStats, WeeklyStats, MonthlyStats, YearlyStats, PartnerStats), `design-system` (stat cards, bar charts, typography), `revenue-tiers` (free: daily/weekly only; premium: monthly/yearly/multi-year)

---

## Time Range Toggle

A segmented control at the top of the screen:

| Segment | Label | Tier |
|---------|-------|------|
| Day | "Today" | Free |
| Week | "This Week" | Free |
| Month | "This Month" | Premium (soft gate) |
| Year | "This Year" | Premium (soft gate) |

Free users see Day and Week fully. Month and Year segments are visible but tapping them opens the premium upsell sheet (see `revenue-tiers`).

Navigation arrows (or swipe) to move between periods: previous day, previous week, etc.

---

## Stat Cards

Stats are displayed as a grid of cards (see `design-system` card pattern).

### Daily View

- **Encounters today:** Playfair Display 600, 36px, Terra. Subtitle: activity emojis used.
- **Partner(s):** Avatar bubble(s) for partners involved today
- **Recent note indicator:** if a note was written today

### Weekly View

Two-column grid of stat cards:

| Card | Value | Subtitle |
|------|-------|----------|
| Total encounters | Number (Playfair 36px, Terra) | "this week" |
| Most active day | Day name | emoji of top activity |
| Top partner | Avatar + name | encounter count |
| Streak | Number of consecutive weeks with activity | "week streak" in Sage |

Below the grid: a **day-of-week bar chart**. Seven bars (Su–Sa), showing encounter count per day. Bars use the Terra→Mauve gradient. Labels: DM Sans 9px, Stone.

### Monthly View (Premium)

Everything in weekly view, plus:

| Card | Value | Subtitle |
|------|-------|----------|
| Monthly total | Number | vs. last month (Sage if up, Mauve if down) |
| Most common activity | Emoji | count |
| Average per week | Number | "per week" |
| New milestones | Count | milestone emojis |

A **week-of-month bar chart** showing weekly totals across the month.

A **partner breakdown** — horizontal stacked bar or pie showing encounter distribution by partner.

### Yearly View (Premium)

Everything in monthly view, plus:

| Card | Value | Subtitle |
|------|-------|----------|
| Year total | Number | vs. last year |
| Most active month | Month name | count |
| Total partners | Number | this year |
| Desire→Action ratio | Percentage | from Safe Space data |

A **month-of-year bar chart** (12 bars) showing monthly totals.

---

## Chart Styling

- Bar fills: `linear-gradient(to top, Terra, Mauve)` with 3px border-radius
- Bar track: Surface2, 5px height (horizontal) or flexible width (vertical)
- Bar labels: DM Sans 9px, Stone
- Count labels: DM Sans 9px, Mauve
- No heavy chart library — simple custom bar components in `lib/`

---

## Comparison Indicators

When comparing to the previous period:

- Up: Sage text, "↑ 3 more than last week"
- Down: Mauve text, "↓ 2 fewer than last month"
- Same: Stone text, "Same as last week"

Tone: never judgmental. "↓ 2 fewer" is observation, not criticism. The comparison is for her awareness. Consider adding a rotating brand-voice line below stats: "Whatever your number, it's yours. And it's enough."

---

## Empty States

If no data exists for a period:

- Warm illustration or emoji composition (🌙 + ✨)
- "Nothing logged yet — and that's okay."
- "When you're ready, your calendar is waiting." with a subtle CTA to go to the Calendar tab

---

## Constraints

- Stats must compute from the local SQLite data — no server dependency
- Charts should be lightweight — no heavy charting library. Build simple bar charts as `lib/` components with Storybook stories.
- Monthly and yearly stats are premium-gated with soft lock overlays
- Stats never compare the user to any external benchmark — there is no "average" or "normal"
- The stats screen must not feel clinical or dashboard-like — it should feel like reading her own journal summary
