export interface MilestoneDefinition {
  key: string;
  title: string;
  copy: string;
  emoji: string;
}

export const MILESTONES: MilestoneDefinition[] = [
  {
    key: 'first_log',
    title: 'First Log',
    copy: "Welcome to your truth. This is where it begins.",
    emoji: '🌟',
  },
  {
    key: 'week_streak_2',
    title: 'Week Streak',
    copy: "Two weeks of showing up. That's a pattern worth noticing.",
    emoji: '🔥',
  },
  {
    key: 'month_streak_2',
    title: 'Month Streak',
    copy: "Another month of knowing yourself.",
    emoji: '✨',
  },
  {
    key: 'encounters_10',
    title: 'Ten Moments',
    copy: "Ten moments. Ten truths. All yours.",
    emoji: '💫',
  },
  {
    key: 'encounters_50',
    title: 'Fifty',
    copy: "Fifty. Not that anyone's counting. (Okay, Tatum is.)",
    emoji: '🎉',
  },
  {
    key: 'solo_5',
    title: 'Solo Celebration',
    copy: "Taking care of yourself is its own celebration.",
    emoji: '✨',
  },
];

export function getMilestoneByKey(key: string): MilestoneDefinition | undefined {
  return MILESTONES.find((m) => m.key === key);
}
