# Partner Profiles

Partner management within Tatum — creating, viewing, rating, and tracking encounters per partner. Partners are identified by nicknames, initials, or emoji avatars. No real names required. Privacy is foundational.

**Depends on:** `data-model` (Partner, Encounter), `design-system` (avatar bubbles, tags, cards)

---

## Creating a Partner

Tapped from the "+" avatar bubble in the partner row or from the Quick Log partner selector.

### Creation Flow

1. **Display name** — text input, placeholder "Nickname or initials" (DM Sans, 14px). Examples: "James", "JM", "Him", "Coffee Date Guy"
2. **Avatar picker** — three options:
   - **Initials:** auto-generated from display name, shown in Playfair Display on a gradient circle
   - **Emoji:** pick from a curated set of people/face emojis
   - **Color only:** pick a gradient pair, no text/emoji overlay
3. **Gradient selector** — a row of preset gradient pairs from the palette (Terra→Fig, Blush→Terra, Mauve→Fig, Sage→darker-Sage, etc.)
4. **Save** — primary CTA

The creation sheet should feel playful and quick. No required fields beyond display name.

---

## Partner Row

The horizontal row of partner avatar bubbles appears in multiple contexts:

- **Calendar Quick Log** — to link an encounter to a partner
- **Partner section** on the main tracker screen
- **Notes** — to tag a note with a partner

### Layout

- Horizontal scroll if more than 4 partners
- Each bubble: 54px avatar circle + 9px name label below (DM Sans uppercase)
- Active partner: Sage dot indicator (14px, bottom-right of avatar)
- Last item is always the "+" add bubble (dashed border, Surface2, Muted "+" text)

### Tapping a Partner

Opens the **Partner Detail / Rating Panel** below the row (slides in with fadeIn animation).

---

## Rating Panel

Appears inline when a partner is selected. Used to rate the most recent encounter with that partner, or accessed from the Quick Log sheet.

### Rating Elements

1. **Header:** "Rate with [Partner Name]" — Playfair Display 600, 15px
2. **Thumbs:** "How was it?" label + two thumb buttons (👍 👎), 44px circles
   - Selected up: Sage gradient, elevated shadow, scale 1.1
   - Selected down: Mauve→Fig gradient, elevated shadow, scale 1.1
   - Unselected: Surface background, 2px Border
3. **Stars** (premium): "Overall" label + 5 star buttons (★), 22px
   - Active: Gold color
   - Inactive: Surface fill with Blush stroke
4. **Vibe tags:** "Vibe" label + pill tags that can be toggled on/off
   - v1 vibes: Passionate, Tender, Playful, Quickie, Emotional, Adventurous, Routine, Reconnecting
   - Active: Terra→Fig gradient pill, white text
   - Inactive: Surface pill, Stone text, Border

### Partner Stats (below rating)

A 4-column grid showing computed stats for this partner:

| Stat | Label |
|------|-------|
| Total encounters | "Times" |
| Thumbs up ratio | "👍 Rate" |
| Most common activity emoji | "Top" |
| Current streak (consecutive weeks with encounters) | "Streak" |

Stats use Playfair Display 600, 16px, Terra for the number and DM Sans 8px uppercase for the label.

---

## Partner Detail Screen

Accessed by long-pressing a partner bubble or from a dedicated "View all" link. Full-screen view with:

1. Large avatar (80px) + display name
2. Full stats grid (expanded version of the inline stats)
3. Encounter history — scrollable list of all encounters with this partner, grouped by month
4. Rating history — thumbs and vibe distribution over time
5. **Edit** button (pencil icon) to change name/avatar
6. **Archive** button (soft delete — encounters are preserved, partner is hidden from active list)

---

## Constraints

- Free tier: up to 3 active partner profiles
- Premium: unlimited partner profiles
- Archived partners don't count toward the free tier limit
- Partner data never leaves the device
- Deleting a partner is a soft archive — encounter data is preserved, the partner reference becomes "Archived Partner"
- The rating panel should feel optional, not mandatory — many users will just log the emoji and move on
