import type { UserProfile } from '@/client/schemas';

export function isPremium(user: UserProfile): boolean {
  if (user.tier !== 'premium') return false;
  if (!user.premiumExpiresAt) return true;
  return new Date(user.premiumExpiresAt) > new Date();
}
