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
    title: 'O Ceifador de Almas',
    description: 'Mestres da morte que ceifam almas de inimigos derrotados. Combatentes de alto risco e alta recompensa, ficam mais fortes a cada abatimento.',
    identity: 'Uma figura encapuzada empunhando uma foice imensa, cercada por espirais de almas ceifadas.',
    icon: 'scythe',
    accent: '#A855F7',
    accentDim: '#4C1D95',
    traits: ['Roubo de Vida', 'Ceifa de Almas', 'Executar'],
    stats: { power: 9, agility: 5, intellect: 6, vitality: 7 },
  },
  {
    id: 'witch',
    name: 'Witch',
    title: 'A Tecelã do Véu',
    description: 'Místicas que dobram a realidade por meio de pactos antigos. Mestras de maldições, feitiços e conhecimento proibido além do véu.',
    identity: 'Uma feiticeira encapuzada de olhos violetas brilhantes, deixando sigilos etéreos pelo caminho.',
    icon: 'sparkles',
    accent: '#C084FC',
    accentDim: '#6B21A8',
    traits: ['Maldição', 'Ritual', 'Conhecimento Proibido'],
    stats: { power: 5, agility: 4, intellect: 10, vitality: 6 },
  },
  {
    id: 'blade',
    name: 'Blade',
    title: 'A Dançarina Carmesim',
    description: 'Duelistas letais que transformam combate em arte. Movem-se como fumaça e golpeiam como trovão, deixando apenas rastros carmesim.',
    identity: 'Uma figura ágil com adagas gêmeas, movendo-se em uma dança mortal de aço.',
    icon: 'swords',
    accent: '#F43F5E',
    accentDim: '#881337',
    traits: ['Golpe Duplo', 'Evasão', 'Combo'],
    stats: { power: 7, agility: 10, intellect: 4, vitality: 5 },
  },
  {
    id: 'warden',
    name: 'Warden',
    title: 'A Sentinela de Ferro',
    description: 'Guardiões inquebráveis que ficam entre a escuridão e aqueles que protegem. Seu escudo nunca caiu; sua vontade nunca vacilou.',
    identity: 'Uma figura imponente em armadura pesada, com o escudo firmado como uma muralha de fortaleza.',
    icon: 'shield',
    accent: '#60A5FA',
    accentDim: '#1E3A8A',
    traits: ['Guarda', 'Provocar', 'Fortaleza'],
    stats: { power: 6, agility: 3, intellect: 4, vitality: 10 },
  },
  {
    id: 'shadow',
    name: 'Shadow',
    title: 'O Sussurro da Noite',
    description: 'Assassinos nascidos da própria escuridão. São o silêncio entre as batidas do coração, a sombra que ataca antes de você perceber sua presença.',
    identity: 'Uma silhueta quase invisível, com os olhos brilhando no escuro.',
    icon: 'eye',
    accent: '#64748B',
    accentDim: '#1E293B',
    traits: ['Furtividade', 'Ataque pelas Costas', 'Desaparecer'],
    stats: { power: 8, agility: 9, intellect: 6, vitality: 4 },
  },
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'A Leitora do Destino',
    description: 'Videntes que observam os fios do destino. Sabem quais cards serão comprados antes mesmo de o baralho ser embaralhado.',
    icon: 'eye',
    accent: '#FBBF24',
    accentDim: '#78350F',
    identity: 'Uma figura vendada cercada por cards de tarô flutuantes e fios luminosos.',
    traits: ['Premonição', 'Manipulação de Cards', 'Vínculo do Destino'],
    stats: { power: 4, agility: 5, intellect: 9, vitality: 7 },
  },
];

export function getClass(id: string | null): GameClass | undefined {
  return CLASSES.find((c) => c.id === id);
}
