export const VIBE_TAGS = [
  'Passionate',
  'Tender',
  'Playful',
  'Quickie',
  'Emotional',
  'Adventurous',
  'Routine',
  'Reconnecting',
] as const;

export type VibeTag = (typeof VIBE_TAGS)[number];
