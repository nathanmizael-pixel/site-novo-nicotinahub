// XP curve: floor(100 * 1.5^(level - 1))
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export type CardData = {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  type: 'creature' | 'spell' | 'artifact' | 'curse';
  description: string;
  attack?: number;
  defense?: number;
  cost: number;
  effect: string;
  classId?: string;
};

export const CARDS: CardData[] = [
  // Common
  { id: 'card_001', name: 'Lost Soul', rarity: 'common', type: 'creature', description: 'A wandering spirit, barely aware of its own existence.', attack: 1, defense: 2, cost: 1, effect: 'On death: gain 1 XP' },
  { id: 'card_002', name: 'Shadow Bat', rarity: 'common', type: 'creature', description: 'A creature of the night that feeds on fear.', attack: 2, defense: 1, cost: 1, effect: 'Flying. Evasive.' },
  { id: 'card_003', name: 'Rusted Blade', rarity: 'common', type: 'artifact', description: 'A forgotten weapon, still sharp enough to cut.', cost: 1, effect: '+1 Attack to equipped creature' },
  { id: 'card_004', name: 'Cursed Coin', rarity: 'common', type: 'artifact', description: 'It whispers promises of wealth to whoever holds it.', cost: 1, effect: 'Gain 5 gold when played' },
  { id: 'card_005', name: 'Dark Whisper', rarity: 'common', type: 'spell', description: 'A murmur from the void that unsettles the mind.', cost: 1, effect: 'Deal 1 damage to enemy' },
  { id: 'card_006', name: 'Grave Dust', rarity: 'common', type: 'spell', description: 'Remnants of the dead, scattered in the wind.', cost: 0, effect: 'Draw a card' },
  // Uncommon
  { id: 'card_007', name: 'Nightmare Steed', rarity: 'uncommon', type: 'creature', description: 'A horse born from a bad dream, galloping through the void.', attack: 3, defense: 3, cost: 3, effect: 'On play: enemy loses 1 card' },
  { id: 'card_008', name: 'Hex Bolt', rarity: 'uncommon', type: 'spell', description: 'A bolt of dark energy that corrupts what it touches.', cost: 2, effect: 'Deal 3 damage. Target loses 1 attack.' },
  { id: 'card_009', name: 'Soul Lantern', rarity: 'uncommon', type: 'artifact', description: 'It traps wandering souls and burns them for light.', cost: 2, effect: 'Gain 1 XP each turn' },
  { id: 'card_010', name: 'Veil Walker', rarity: 'uncommon', type: 'creature', description: 'A being that exists between worlds, half here, half elsewhere.', attack: 2, defense: 4, cost: 2, effect: 'Cannot be targeted by enemy spells' },
  { id: 'card_011', name: 'Bone Shield', rarity: 'uncommon', type: 'artifact', description: 'Fashioned from the remains of fallen warriors.', cost: 2, effect: '+3 Defense. Blocks first hit each round.' },
  { id: 'card_012', name: 'Frostbite', rarity: 'uncommon', type: 'curse', description: 'A chilling curse that slows the blood.', cost: 2, effect: 'Enemy loses 2 agility for 3 turns' },
  // Rare
  { id: 'card_013', name: 'Crimson Knight', rarity: 'rare', type: 'creature', description: 'An armored warrior who fights with the desperation of the damned.', attack: 5, defense: 5, cost: 4, effect: 'Lifesteal. Heals owner for damage dealt.' },
  { id: 'card_014', name: 'Void Rift', rarity: 'rare', type: 'spell', description: 'A tear in reality that swallows everything nearby.', cost: 4, effect: 'Destroy all enemy creatures with cost 3 or less' },
  { id: 'card_015', name: 'Soul Chain', rarity: 'rare', type: 'curse', description: 'Chains forged from regret that bind the soul.', cost: 3, effect: 'Enemy cannot play cards next turn' },
  { id: 'card_016', name: 'Phantom Mirror', rarity: 'rare', type: 'artifact', description: 'Reflects not light, but the soul of whoever gazes into it.', cost: 3, effect: 'Copy enemy creature\'s effect once' },
  { id: 'card_017', name: 'Death March', rarity: 'rare', type: 'spell', description: 'The rhythm of the end approaches.', cost: 3, effect: 'All creatures take 2 damage. Gain gold per kill.' },
  // Epic
  { id: 'card_018', name: 'The Pale Rider', rarity: 'epic', type: 'creature', description: 'One of four. Famine follows in its wake.', attack: 7, defense: 6, cost: 6, effect: 'On play: silence all enemy creatures. They lose effects.' },
  { id: 'card_019', name: 'Soul Reaver', rarity: 'epic', type: 'artifact', description: 'A scythe that grows sharper with every soul it reaps.', cost: 5, effect: 'Equipped creature gains +3/+3 and Lifesteal' },
  { id: 'card_020', name: 'Eternal Night', rarity: 'epic', type: 'spell', description: 'The sun forgets to rise. The world holds its breath.', cost: 5, effect: 'Skip enemy turn. Draw 2 cards.' },
  { id: 'card_021', name: 'Blood Pact', rarity: 'epic', type: 'curse', description: 'A deal struck in darkness, paid in blood.', cost: 4, effect: 'Sacrifice 5 health. Gain 50 gold and 20 XP.' },
  // Legendary
  { id: 'card_022', name: 'The Reaper King', rarity: 'legendary', type: 'creature', description: 'He does not rule the dead. He IS the dead.', attack: 10, defense: 10, cost: 8, effect: 'On play: destroy all other creatures. Gain XP per creature destroyed.' },
  { id: 'card_023', name: 'Crown of Thorns', rarity: 'legendary', type: 'artifact', description: 'A crown that draws power from suffering, both given and received.', cost: 6, effect: 'All your creatures gain +2/+2 and Taunt' },
  { id: 'card_024', name: 'Apocalypse', rarity: 'legendary', type: 'spell', description: 'The final card. It has always been the final card.', cost: 10, effect: 'Destroy everything. Both players lose all creatures and artifacts. You take no damage.' },
  // Mythic
  { id: 'card_025', name: 'nicotinacat', rarity: 'mythic', type: 'creature', description: 'The entity behind the Hub. Neither alive nor dead. Simply present.', attack: 13, defense: 13, cost: 7, effect: 'Unkillable. When destroyed, return with full stats. Once per game.' },
];

export function getCard(id: string): CardData | undefined {
  return CARDS.find((c) => c.id === id);
}

export const RARITY_COLORS: Record<string, string> = {
  common: '#9CA3AF',
  uncommon: '#4ADE80',
  rare: '#60A5FA',
  epic: '#C084FC',
  legendary: '#FBBF24',
  mythic: '#F43F5E',
};

export const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(156, 163, 175, 0.3)',
  uncommon: 'rgba(74, 222, 128, 0.3)',
  rare: 'rgba(96, 165, 250, 0.3)',
  epic: 'rgba(192, 132, 252, 0.4)',
  legendary: 'rgba(251, 191, 36, 0.4)',
  mythic: 'rgba(244, 63, 94, 0.5)',
};

export type ExpeditionData = {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  durationMinutes: number;
  xpReward: number;
  goldReward: number;
  chestChance: number;
  icon: string;
};

export const EXPEDITIONS: ExpeditionData[] = [
  { id: 'exp_001', name: 'Graveyard Patrol', description: 'A routine sweep of the old cemetery. The dead are restless tonight.', difficulty: 'easy', durationMinutes: 5, xpReward: 50, goldReward: 30, chestChance: 0.15, icon: 'skull' },
  { id: 'exp_002', name: 'Veil Expedition', description: 'Step through the veil and explore the space between worlds.', difficulty: 'normal', durationMinutes: 15, xpReward: 120, goldReward: 75, chestChance: 0.25, icon: 'sparkles' },
  { id: 'exp_003', name: 'Soul Hunt', description: 'Track and capture a powerful wandering soul. It will not go quietly.', difficulty: 'normal', durationMinutes: 30, xpReward: 200, goldReward: 120, chestChance: 0.3, icon: 'ghost' },
  { id: 'exp_004', name: 'Crimson Dungeon', description: 'Delve into the dungeon that bleeds. The walls are wet and warm.', difficulty: 'hard', durationMinutes: 60, xpReward: 400, goldReward: 250, chestChance: 0.45, icon: 'dungeon' },
  { id: 'exp_005', name: 'The Reaper\'s Trial', description: 'Face the Reaper himself in a trial by combat. Only the worthy return.', difficulty: 'extreme', durationMinutes: 120, xpReward: 800, goldReward: 500, chestChance: 0.6, icon: 'scythe' },
];

export type InventoryItemData = {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'material' | 'special' | 'chest';
  icon: string;
  rarity: string;
};

export const INVENTORY_ITEMS: InventoryItemData[] = [
  { id: 'item_001', name: 'Soul Shard', description: 'A fragment of a captured soul. Faintly glowing.', type: 'material', icon: 'gem', rarity: 'common' },
  { id: 'item_002', name: 'Health Potion', description: 'A vial of crimson liquid that restores vitality.', type: 'consumable', icon: 'flask-conical', rarity: 'common' },
  { id: 'item_003', name: 'Void Crystal', description: 'A crystal that contains a sliver of the void itself.', type: 'material', icon: 'diamond', rarity: 'rare' },
  { id: 'item_004', name: 'Cursed Amulet', description: 'An amulet that whispers. You probably shouldn\'t wear it.', type: 'special', icon: 'amulet', rarity: 'epic' },
  { id: 'item_005', name: 'Common Chest', description: 'A wooden chest with simple locks. Contains basic rewards.', type: 'chest', icon: 'package', rarity: 'common' },
  { id: 'item_006', name: 'Rare Chest', description: 'An ornate chest that pulses with energy. Better rewards inside.', type: 'chest', icon: 'package', rarity: 'rare' },
  { id: 'item_007', name: 'Legendary Chest', description: 'A chest that radiates power. The lock seems alive.', type: 'chest', icon: 'package', rarity: 'legendary' },
  { id: 'item_008', name: 'Reaper\'s Mark', description: 'A mark that grants favor with the Reaper. Extremely rare.', type: 'special', icon: 'skull', rarity: 'mythic' },
];

export function getItem(id: string): InventoryItemData | undefined {
  return INVENTORY_ITEMS.find((i) => i.id === id);
}

export type ClipData = {
  id: string;
  title: string;
  platform: 'twitch' | 'tiktok';
  thumbnail: string;
  author: string;
  date: string;
  views: number;
  category: string;
  duration: string;
  url: string;
  featured?: boolean;
};

export const CLIPS: ClipData[] = [
  { id: 'clip_001', title: 'The Play That Broke Chat', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-08', views: 24500, category: 'Gaming', duration: '0:47', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_002', title: 'Rage Quit Compilation', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-07', views: 18200, category: 'Highlights', duration: '2:13', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_003', title: 'When the Deck Draws Perfect', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-06', views: 31000, category: 'Arcade', duration: '1:05', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_004', title: 'Late Night Vibes', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-05', views: 89000, category: 'Chill', duration: '0:30', url: 'https://tiktok.com/@nicotinacat', featured: true },
  { id: 'clip_005', title: 'Speedrun Gone Wrong', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-04', views: 12700, category: 'Speedrun', duration: '3:22', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_006', title: 'TikTok Dance Challenge', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-03', views: 145000, category: 'Dance', duration: '0:15', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_007', title: 'Clutch 1v4 Play', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-02', views: 42100, category: 'Gaming', duration: '0:38', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_008', title: 'Reacting to Your Clips', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-01', views: 19800, category: 'Reaction', duration: '4:55', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_009', title: 'Best Moments This Week', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-31', views: 56300, category: 'Highlights', duration: '8:12', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_010', title: 'Short Compilation', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-30', views: 210000, category: 'Compilation', duration: '0:45', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_011', title: 'New Game First Impressions', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-29', views: 15400, category: 'First Look', duration: '12:30', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_012', title: 'Community Challenge Accepted', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-28', views: 78000, category: 'Challenge', duration: '0:22', url: 'https://tiktok.com/@nicotinacat' },
];

export const SOCIAL_LINKS = {
  twitch: 'https://twitch.tv/nicotinacat',
  tiktok: 'https://tiktok.com/@nicotinacat',
  discord: 'https://discord.gg/nicotinacat',
  amazon: 'https://www.amazon.com/hz/wishlist/ls/nicotinacat',
};

export const OFFLINE_PROGRESS_LIMIT_HOURS = 8;
