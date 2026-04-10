---
name: revenue-tiers
description: Free vs Premium tier feature gates and pricing
---

# Revenue Tiers

Tatum uses a freemium model. The free tier is generous — it must be a complete, valuable experience on its own. Premium unlocks depth, history, and advanced features. The upgrade should feel like a natural "I want more of this" rather than hitting a wall.

**Depends on:** `data-model` (UserProfile.tier), all feature skills (determines gating)

---

## Free Tier — Forever Free

The free experience must be good enough that she tells her friends about Tatum before she ever pays.

### Included Features

| Feature | Scope |
|---------|-------|
| Emoji calendar logging | Full — unlimited encounters, all emoji types |
| Partner profiles | Up to 3 active partners |
| Thumbs up / thumbs down rating | Full |
| Private notes | Unlimited |
| Daily and weekly stats | Full |
| Daily affirmations | Full |
| Milestone celebrations | Full (🩷 First I Love You, etc.) |
| Tatum Whisper — basic | Browse prompts (curated ~20), send via SMS/copy |
| Safe Space — basic | Desire logging (timestamp + intensity + partner) |

### What Free Does NOT Include

- Star ratings (1–5)
- Vibe tags
- Monthly and yearly stats
- Multi-year history views
- Annual Tatum Recap
- Advanced Whisper (custom message library, scheduling)
- Pattern recognition insights (Safe Space)
- Cycle correlation
- Data export
- Custom affirmation library
- Couples mode
- Unlimited partner profiles (free: 3 max)

---

## Tatum Premium — $4.99/month or $39.99/year

### Premium Features

| Feature | Description |
|---------|-------------|
| Full yearly stats | Monthly and yearly aggregations, multi-year history |
| Annual Tatum Recap | "Her year in intimacy" — beautifully visualized summary, released every January |
| Advanced Tatum Whisper | Custom message library (save her own), scheduling, full template library (50+) |
| Unlimited partner profiles | No cap on active partners |
| Star ratings + vibe tags | Deeper encounter rating |
| Pattern recognition | Safe Space insights — time patterns, cycle correlation, partner patterns |
| Data export | Export encounters, notes (opt-in), stats for personal records or medical appointments |
| Custom affirmation library | Her words, her voice — save and curate her own affirmations |
| Couples mode | Shared insights with a chosen partner (requires both to have accounts, future feature) |

---

## Gating UX

### Soft Gates

Premium features that appear in the free experience should be visible but gently locked. The user sees the feature exists, understands what it does, and can tap to learn more / upgrade.

**Pattern:** The feature UI renders normally but with a subtle lock overlay:
- Semi-transparent overlay on the locked area
- Small Gold lock icon or "Premium" badge pill (Gold background, white text, DM Sans 8px uppercase)
- Tapping opens a premium upsell sheet — not a full-screen paywall

### Upsell Sheet

A bottom sheet (not a full interruption) with:
1. Feature name + brief description of what she'll unlock
2. "You've always been enough. Now see the full picture." — brand-aligned copy
3. Price: $4.99/month or $39.99/year (with annual savings highlighted)
4. "Start Free Trial" CTA (if offering a trial) or "Upgrade" CTA
5. "Not now" dismiss link

### Hard Gates

Some features simply don't appear in the free tier:
- Annual Tatum Recap (appears as a promotional card in January for free users)
- Couples mode
- Data export button

---

## Annual Tatum Recap

The single most powerful marketing tool. A personalized, beautiful summary of her year in intimacy — similar to Spotify Wrapped.

- Released every January
- Shows: total encounters, top partner, most active month, most common activity, desire patterns, milestone moments
- Beautifully animated, shareable screens (with privacy controls — she chooses exactly what to share)
- Free users see a teaser (1–2 screens) with premium upgrade to see the full recap
- Designed to be shared on social media, driving organic downloads

---

## Implementation

### Tier Check

A simple utility that checks `UserProfile.tier` and `premiumExpiresAt`:

```
function isPremium(user: UserProfile): boolean {
  return user.tier === 'premium' &&
    (user.premiumExpiresAt === null || user.premiumExpiresAt > now())
}
```

### In-App Purchases

- Use `expo-in-app-purchases` or `react-native-iap`
- Two products: monthly subscription, annual subscription
- Apple App Store and Google Play Store IAP
- Restore purchases flow in Settings

### Feature Flags

Each premium feature has a feature flag that checks the tier. This allows:
- Easy A/B testing of what's free vs premium
- Promotional unlocks (e.g., free premium week for new users)
- Graceful degradation if IAP fails

---

## Constraints

- The free tier must NEVER feel punishing or broken
- Upgrade prompts must be warm and brand-aligned, never aggressive
- No ads — ever. Tatum's revenue comes from subscriptions only.
- Premium features degrade gracefully — if a premium user's subscription lapses, her data is preserved, she just loses access to premium views. Nothing is deleted.
- The 3-partner limit on free tier is the most visible gate — it's natural ("you've added 3 partners, upgrade for unlimited") without blocking core functionality
