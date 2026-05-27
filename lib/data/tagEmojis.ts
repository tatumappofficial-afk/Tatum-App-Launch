// Curated emoji palette for activity tags. ~100 emojis grouped by theme.
// Order matters: it controls the picker layout and the default-selection fallback
// (first unused wins). Strings must byte-match DEFAULT_ACTIVITY_TAGS in src/db/schema.ts
// so the "already used" gray-out logic compares correctly.

export const TAG_EMOJIS: readonly string[] = [
  // Hearts
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '❤️‍🔥', '💖', '💕', '💞', '💗', '💓', '💝',
  // Faces & moods
  '😘', '🥰', '😍', '🤩', '😏', '😈', '🥵', '😌', '😋', '🤤', '🫦', '😉', '😜', '🤭', '🥺', '🤗', '😴', '🥱', '😛', '😡',
  // Bodies & gestures
  '💋', '👅', '✋', '🫱', '👉', '✊', '🤞', '🫰', '🦵', '🍑', '💃', '🤝',
  // Spice / energy
  '🍆', '💦', '🌶️', '🔥', '⚡', '✨', '💫', '🌙', '🌚', '🫧', '🌬️', '🪄',
  // Objects
  '🛏️', '🛁', '🚿', '🌹', '🌺', '🌸', '🍓', '🍒', '🍌', '🍷', '🍾', '🥂', '🕯️', '🎀',
  // Setting / time
  '☀️', '🌅', '🌄', '🌈', '☁️', '🏡', '🏖', '🏨', '🚗', '✈️',
  // Care / health
  '💊', '🩸', '🌿', '💧', '🧴', '🛌',
  // Pace & celebration
  '⌛️', '🏁', '🎉', '🎊', '🎁', '💌', '💐', '📸', '⭐', '💎',
]
