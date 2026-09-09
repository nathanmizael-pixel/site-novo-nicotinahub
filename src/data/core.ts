export const SOCIAL_LINKS = {
  twitch: 'https://twitch.tv/nicotinacat',
  tiktok: 'https://tiktok.com/@nicotinacat',
  discord: 'https://discord.gg/nicotinacat',
  amazon: 'https://www.amazon.com/hz/wishlist/ls/nicotinacat',
};

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}