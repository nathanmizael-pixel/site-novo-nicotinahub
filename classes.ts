export type GameClass = {
  id: string;
  name: string;
  title: string;
  description: string;
  identity: string;
  icon: string;
  accent: string;
  accentDim: string;
  traits: string[];
  stats: { power: number; agility: number; intellect: number; vitality: number };
};

export const CLASSES: GameClass[] = [
  {
    id: 'reaper',
    name: 'Reaper',
    title: 'The Soul Harvester',
    description: 'Masters of death who harvest souls from fallen enemies. High risk, high reward combatants that grow stronger with each kill.',
    identity: 'A cloaked figure wielding a massive scythe, surrounded by wisps of harvested souls.',
    icon: 'scythe',
    accent: '#A855F7',
    accentDim: '#4C1D95',
    traits: ['Lifesteal', 'Soul Harvest', 'Execute'],
    stats: { power: 9, agility: 5, intellect: 6, vitality: 7 },
  },
  {
    id: 'witch',
    name: 'Witch',
    title: 'The Veil Weaver',
    description: 'Mystics who bend reality through ancient pacts. Masters of curses, hexes, and forbidden knowledge from beyond the veil.',
    identity: 'A hooded sorceress with glowing violet eyes, trailing ethereal sigils.',
    icon: 'sparkles',
    accent: '#C084FC',
    accentDim: '#6B21A8',
    traits: ['Hex', 'Ritual', 'Forbidden Knowledge'],
    stats: { power: 5, agility: 4, intellect: 10, vitality: 6 },
  },
  {
    id: 'blade',
    name: 'Blade',
    title: 'The Crimson Dancer',
    description: 'Lethal duelists who turn combat into art. They move like smoke and strike like thunder, leaving only crimson trails behind.',
    identity: 'A lithe figure with twin daggers, moving in a deadly dance of steel.',
    icon: 'swords',
    accent: '#F43F5E',
    accentDim: '#881337',
    traits: ['Dual Strike', 'Evasion', 'Combo'],
    stats: { power: 7, agility: 10, intellect: 4, vitality: 5 },
  },
  {
    id: 'warden',
    name: 'Warden',
    title: 'The Iron Sentinel',
    description: 'Unbreakable guardians who stand between darkness and those they protect. Their shield has never fallen, their will never wavers.',
    identity: 'A towering figure in heavy plate armor, shield planted like a fortress wall.',
    icon: 'shield',
    accent: '#60A5FA',
    accentDim: '#1E3A8A',
    traits: ['Guard', 'Taunt', 'Fortress'],
    stats: { power: 6, agility: 3, intellect: 4, vitality: 10 },
  },
  {
    id: 'shadow',
    name: 'Shadow',
    title: 'The Night Whisper',
    description: 'Assassins born from darkness itself. They are the silence between heartbeats, the shadow that strikes before you know it is there.',
    identity: 'A barely visible silhouette, eyes glinting in the dark.',
    icon: 'eye',
    accent: '#64748B',
    accentDim: '#1E293B',
    traits: ['Stealth', 'Backstab', 'Vanish'],
    stats: { power: 8, agility: 9, intellect: 6, vitality: 4 },
  },
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'The Fate Reader',
    description: 'Seers who peer into the threads of destiny. They know what cards will be drawn before the deck is even shuffled.',
    icon: 'eye',
    accent: '#FBBF24',
    accentDim: '#78350F',
    identity: 'A blindfolded figure surrounded by floating tarot cards and glowing threads.',
    traits: ['Foresight', 'Card Manipulation', 'Destiny Bond'],
    stats: { power: 4, agility: 5, intellect: 9, vitality: 7 },
  },
];

export function getClass(id: string | null): GameClass | undefined {
  return CLASSES.find((c) => c.id === id);
}
