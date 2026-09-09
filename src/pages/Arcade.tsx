import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, type UserCard, type UserDeck, type UserInventory, type Expedition as ExpeditionType } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SkullLogo } from '@/components/SkullLogo';
import { CLASSES, getClass } from '@/data/classes';
import { CARDS, EXPEDITIONS, INVENTORY_ITEMS, getCard, getItem, RARITY_COLORS, RARITY_GLOW, xpForLevel, type CardData, type ExpeditionData } from '@/data/arcade';
import { xpProgress, timeRemaining, formatNumber } from '@/lib/utils';
import { Skull, Swords, Shield, Eye, Sparkles, Zap, Coins, Package, Gamepad2, Map as MapIcon, Layers, Backpack, ChevronRight, Clock, Star, Gift, Play, Plus, Minus } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <Gamepad2 size={14} /> },
  { id: 'collection', label: 'Collection', icon: <Layers size={14} /> },
  { id: 'deck', label: 'Deck', icon: <Swords size={14} /> },
  { id: 'inventory', label: 'Inventory', icon: <Backpack size={14} /> },
  { id: 'expeditions', label: 'Expeditions', icon: <MapIcon size={14} /> },
];

export function Arcade() {
  const { session, profile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [userDeck, setUserDeck] = useState<UserDeck[]>([]);
  const [userInventory, setUserInventory] = useState<UserInventory[]>([]);
  const [expeditions, setExpeditions] = useState<ExpeditionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chestModal, setChestModal] = useState<{ rewards: { gold?: number; xp?: number; card?: string; item?: string } } | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const loadData = useCallback(async () => {
    if (!session) { setLoading(false); return; }
    setLoading(true);
    const [cards, deck, inv, exps] = await Promise.all([
      supabase.from('user_cards').select('*').eq('user_id', session.user.id),
      supabase.from('user_decks').select('*').eq('user_id', session.user.id),
      supabase.from('user_inventory').select('*').eq('user_id', session.user.id),
      supabase.from('expeditions').select('*').eq('user_id', session.user.id),
    ]);
    setUserCards(cards.data as UserCard[] || []);
    setUserDeck(deck.data as UserDeck[] || []);
    setUserInventory(inv.data as UserInventory[] || []);
    setExpeditions(exps.data as ExpeditionType[] || []);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Class selection screen
  if (session && profile && !profile.class_id) {
    return <ClassSelection onSelected={() => loadData()} />;
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="The Arcade Awaits"
          description="Sign in to choose your class and begin your journey through the dark."
          icon={<Gamepad2 size={48} />}
          action={<Link to="/auth"><Button variant="primary" size="lg">Sign In to Play</Button></Link>}
        />
      </div>
    );
  }

  if (loading || !profile) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><div className="shimmer-bg h-64 rounded-xl" /></div>;
  }

  const cls = getClass(profile.class_id);
  const { pct, intoLevel, span } = xpProgress(profile.xp, profile.level);

  async function addXp(amount: number) {
    if (!profile) return;
    const newXp = profile.xp + amount;
    let newLevel = profile.level;
    while (newXp >= xpForLevel(newLevel + 1)) newLevel++;
    await updateProfile({ xp: newXp, level: newLevel });
    if (newLevel > profile.level) {
      addToast('success', `Level up! You are now level ${newLevel}.`);
    }
  }

  async function addGold(amount: number) {
    if (!profile) return;
    await updateProfile({ gold: profile.gold + amount });
  }

  async function startExpedition(exp: ExpeditionData) {
    if (!session || !profile) return;
    const existing = expeditions.find((e) => e.expedition_id === exp.id);
    if (existing && existing.status === 'active') {
      addToast('error', 'This expedition is already in progress.');
      return;
    }
    const completesAt = new Date(Date.now() + exp.durationMinutes * 60 * 1000).toISOString();
    const { error } = await supabase.from('expeditions').insert({
      user_id: session.user.id,
      expedition_id: exp.id,
      completes_at: completesAt,
      status: 'active',
      reward_xp: exp.xpReward,
      reward_gold: exp.goldReward,
      reward_chest: Math.random() < exp.chestChance,
    });
    if (!error) {
      addToast('success', `${exp.name} started!`);
      loadData();
    }
  }

  async function claimExpedition(exp: ExpeditionType) {
    if (!session) return;
    const isComplete = new Date(exp.completes_at).getTime() <= Date.now();
    if (!isComplete) {
      addToast('error', 'Expedition not yet complete.');
      return;
    }
    await addXp(exp.reward_xp);
    await addGold(exp.reward_gold);

    let rewards: { gold?: number; xp?: number; card?: string; item?: string } = {
      gold: exp.reward_gold,
      xp: exp.reward_xp,
    };

    if (exp.reward_chest) {
      const randomCard = CARDS[Math.floor(Math.random() * Math.min(CARDS.length, 10))];
      const { data: existingCard } = await supabase.from('user_cards').select('*').eq('user_id', session.user.id).eq('card_id', randomCard.id).maybeSingle();
      if (existingCard) {
        await supabase.from('user_cards').update({ count: existingCard.count + 1 }).eq('id', existingCard.id);
      } else {
        await supabase.from('user_cards').insert({ user_id: session.user.id, card_id: randomCard.id, count: 1 });
      }
      rewards.card = randomCard.id;
    }

    await supabase.from('expeditions').delete().eq('id', exp.id);
    setChestModal({ rewards });
    loadData();
  }

  async function toggleDeckCard(cardId: string) {
    if (!session) return;
    const inDeck = userDeck.find((d) => d.card_id === cardId);
    if (inDeck) {
      await supabase.from('user_decks').delete().eq('user_id', session.user.id).eq('card_id', cardId);
    } else {
      if (userDeck.length >= 10) {
        addToast('error', 'Deck is full (10 cards max).');
        return;
      }
      await supabase.from('user_decks').insert({ user_id: session.user.id, card_id: cardId, position: userDeck.length });
    }
    loadData();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Gamepad2 size={28} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">The Arcade</h1>
          {cls && <Badge color={cls.accent} variant="glow">{cls.name}</Badge>}
        </div>
        <p className="text-sm text-text-muted">Level {profile.level} · {profile.xp} XP · {profile.gold} Gold</p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-6 border-b border-border pb-3" />

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <Card elevated className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 hex-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center border-2"
                style={{ borderColor: `${cls?.accent}50`, background: `linear-gradient(135deg, ${cls?.accent}15, transparent)` }}
              >
                <Skull size={40} style={{ color: cls?.accent }} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-700 text-2xl text-text mb-1">{cls?.name || 'Unknown'}</h2>
                <p className="text-sm text-text-muted mb-3">{cls?.title}</p>
                <p className="text-sm text-text-muted leading-relaxed mb-4">{cls?.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cls && Object.entries(cls.stats).map(([key, val]) => (
                    <div key={key} className="p-2 bg-abyss rounded border border-border text-center">
                      <p className="text-xs text-text-muted capitalize">{key}</p>
                      <p className="text-lg font-display font-700" style={{ color: cls.accent }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-600 text-lg text-text">Progression</h3>
              <span className="text-xs text-text-muted font-mono">Level {profile.level}</span>
            </div>
            <ProgressBar value={pct} color={cls?.accent || '#A855F7'} height="h-3" showLabel />
            <p className="text-xs text-text-dim mt-2">{intoLevel} / {span} XP to level {profile.level + 1}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-abyss rounded-lg border border-border">
                <Coins size={18} className="text-warning mx-auto mb-1" />
                <p className="text-lg font-display font-700 text-text">{profile.gold}</p>
                <p className="text-xs text-text-muted">Gold</p>
              </div>
              <div className="text-center p-3 bg-abyss rounded-lg border border-border">
                <Layers size={18} className="text-primary mx-auto mb-1" />
                <p className="text-lg font-display font-700 text-text">{userCards.length}</p>
                <p className="text-xs text-text-muted">Cards</p>
              </div>
              <div className="text-center p-3 bg-abyss rounded-lg border border-border">
                <Swords size={18} className="text-primary-bright mx-auto mb-1" />
                <p className="text-lg font-display font-700 text-text">{userDeck.length}/10</p>
                <p className="text-xs text-text-muted">Deck</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover className="p-5 cursor-pointer" onClick={() => setTab('expeditions')}>
              <MapIcon size={24} className="text-primary mb-2" />
              <h3 className="font-600 text-sm text-text">Expeditions</h3>
              <p className="text-xs text-text-muted mt-1">Send your character on adventures</p>
              <ChevronRight size={16} className="text-text-dim mt-2" />
            </Card>
            <Card hover className="p-5 cursor-pointer" onClick={() => setTab('collection')}>
              <Layers size={24} className="text-primary mb-2" />
              <h3 className="font-600 text-sm text-text">Collection</h3>
              <p className="text-xs text-text-muted mt-1">{userCards.length} cards discovered</p>
              <ChevronRight size={16} className="text-text-dim mt-2" />
            </Card>
            <Card hover className="p-5 cursor-pointer" onClick={() => setTab('deck')}>
              <Swords size={24} className="text-primary mb-2" />
              <h3 className="font-600 text-sm text-text">Deck Builder</h3>
              <p className="text-xs text-text-muted mt-1">{userDeck.length}/10 cards in deck</p>
              <ChevronRight size={16} className="text-text-dim mt-2" />
            </Card>
          </div>
        </div>
      )}

      {/* Collection */}
      {tab === 'collection' && (
        <div className="animate-fade-in">
          {userCards.length === 0 ? (
            <EmptyState
              title="No cards collected yet"
              description="Complete expeditions to earn cards and fill your collection."
              icon={<Layers size={48} />}
              action={<Button variant="primary" onClick={() => setTab('expeditions')}>Start an Expedition</Button>}
            />
          ) : (
            <>
              <p className="text-sm text-text-muted mb-4">{userCards.length} / {CARDS.length} cards discovered</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userCards.map((uc) => {
                  const card = getCard(uc.card_id);
                  if (!card) return null;
                  return <GameCard key={uc.id} card={card} count={uc.count} onClick={() => setSelectedCard(card)} />;
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Deck Builder */}
      {tab === 'deck' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-600 text-lg text-text">Deck Builder</h2>
            <Badge color="#A855F7">{userDeck.length}/10</Badge>
          </div>
          {userCards.length === 0 ? (
            <EmptyState title="No cards available" description="Collect cards from expeditions first." icon={<Swords size={48} />} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userCards.map((uc) => {
                const card = getCard(uc.card_id);
                if (!card) return null;
                const inDeck = userDeck.some((d) => d.card_id === card.id);
                return (
                  <div key={uc.id} className="relative">
                    <GameCard card={card} count={uc.count} onClick={() => toggleDeckCard(card.id)} />
                    {inDeck && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <Badge color="#22C55E" variant="glow" size="sm">In Deck</Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inventory */}
      {tab === 'inventory' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Coins size={20} className="text-warning" />
            <span className="font-display font-600 text-lg text-text">{profile.gold} Gold</span>
          </div>
          {userInventory.length === 0 ? (
            <EmptyState title="Inventory empty" description="Items from expeditions and rewards will appear here." icon={<Backpack size={48} />} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userInventory.map((inv) => {
                const item = getItem(inv.item_id);
                if (!item) return null;
                return (
                  <Card key={inv.id} className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 border" style={{ borderColor: `${RARITY_COLORS[item.rarity]}40`, background: `linear-gradient(135deg, ${RARITY_COLORS[item.rarity]}10, transparent)` }}>
                      <Package size={20} style={{ color: RARITY_COLORS[item.rarity] }} />
                    </div>
                    <p className="text-xs font-600 text-text">{item.name}</p>
                    <p className="text-[10px] text-text-dim mt-0.5">x{inv.quantity}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expeditions */}
      {tab === 'expeditions' && (
        <div className="animate-fade-in">
          {/* Active expeditions */}
          {expeditions.filter((e) => e.status === 'active').length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-600 text-lg text-text mb-3">In Progress</h3>
              <div className="space-y-3">
                {expeditions.filter((e) => e.status === 'active').map((exp) => {
                  const expData = EXPEDITIONS.find((e) => e.id === exp.expedition_id);
                  if (!expData) return null;
                  const remaining = timeRemaining(exp.completes_at);
                  const isComplete = remaining === 'Complete';
                  return (
                    <Card key={exp.id} elevated className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/30">
                            <MapIcon size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-600 text-sm text-text">{expData.name}</p>
                            <p className="text-xs text-text-muted flex items-center gap-1">
                              <Clock size={10} />
                              {isComplete ? 'Ready to claim!' : remaining}
                            </p>
                          </div>
                        </div>
                        {isComplete ? (
                          <Button variant="primary" size="sm" icon={<Gift size={14} />} onClick={() => claimExpedition(exp)}>
                            Claim
                          </Button>
                        ) : (
                          <ProgressBar value={100 - (new Date(exp.completes_at).getTime() - Date.now()) / (expData.durationMinutes * 60 * 10)} height="h-1.5" className="w-32" animated={false} />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <h3 className="font-display font-600 text-lg text-text mb-3">Available Expeditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPEDITIONS.map((exp) => {
              const active = expeditions.find((e) => e.expedition_id === exp.id && e.status === 'active');
              return (
                <Card key={exp.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/30">
                        <MapIcon size={18} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-600 text-sm text-text">{exp.name}</h4>
                        <Badge color={exp.difficulty === 'easy' ? '#22C55E' : exp.difficulty === 'normal' ? '#F59E0B' : exp.difficulty === 'hard' ? '#EF4444' : '#F43F5E'} size="sm" className="mt-1">
                          {exp.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-text-dim flex items-center gap-1"><Clock size={10} /> {exp.durationMinutes}m</span>
                  </div>
                  <p className="text-xs text-text-muted mb-3 leading-relaxed">{exp.description}</p>
                  <div className="flex items-center gap-4 mb-3 text-xs">
                    <span className="flex items-center gap-1 text-text-muted"><Zap size={12} className="text-primary" /> {exp.xpReward} XP</span>
                    <span className="flex items-center gap-1 text-text-muted"><Coins size={12} className="text-warning" /> {exp.goldReward} Gold</span>
                    <span className="flex items-center gap-1 text-text-muted"><Gift size={12} className="text-primary-bright" /> {Math.round(exp.chestChance * 100)}% chest</span>
                  </div>
                  <Button
                    variant={active ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={!!active}
                    icon={<Play size={14} />}
                    onClick={() => startExpedition(exp)}
                    className="w-full"
                  >
                    {active ? 'In Progress' : 'Start Expedition'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      <Modal open={!!selectedCard} onClose={() => setSelectedCard(null)} title={selectedCard?.name} size="sm">
        {selectedCard && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge color={RARITY_COLORS[selectedCard.rarity]} variant="glow">{selectedCard.rarity}</Badge>
              <Badge color="#2D2A3E">{selectedCard.type}</Badge>
              <Badge color="#A855F7">Cost: {selectedCard.cost}</Badge>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-3">{selectedCard.description}</p>
            {selectedCard.attack !== undefined && (
              <div className="flex gap-4 mb-3">
                <div className="flex items-center gap-1.5"><Swords size={14} className="text-danger" /> <span className="font-mono text-text">{selectedCard.attack}</span></div>
                <div className="flex items-center gap-1.5"><Shield size={14} className="text-success" /> <span className="font-mono text-text">{selectedCard.defense}</span></div>
              </div>
            )}
            <div className="p-3 bg-abyss rounded-md border border-border">
              <p className="text-xs font-600 text-text-muted mb-1">Effect</p>
              <p className="text-sm text-text">{selectedCard.effect}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Chest Reward Modal */}
      <Modal open={!!chestModal} onClose={() => setChestModal(null)} title="Expedition Complete" size="sm">
        {chestModal && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-primary/10 border-2 border-primary/40 animate-reveal">
                <Gift size={36} className="text-primary" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {chestModal.rewards.xp && <p className="text-sm text-text flex items-center justify-center gap-2"><Zap size={14} className="text-primary" /> +{chestModal.rewards.xp} XP</p>}
              {chestModal.rewards.gold && <p className="text-sm text-text flex items-center justify-center gap-2"><Coins size={14} className="text-warning" /> +{chestModal.rewards.gold} Gold</p>}
              {chestModal.rewards.card && (() => {
                const card = getCard(chestModal.rewards.card!);
                return card ? (
                  <div className="mt-3">
                    <p className="text-xs text-text-muted mb-2">New card discovered!</p>
                    <div className="inline-block">
                      <GameCard card={card} onClick={() => {}} />
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
            <Button variant="primary" onClick={() => setChestModal(null)}>Collect</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Game Card Component
function GameCard({ card, count, onClick }: { card: CardData; count?: number; onClick: () => void }) {
  const rarityColor = RARITY_COLORS[card.rarity];
  const rarityGlow = RARITY_GLOW[card.rarity];

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group transition-all duration-300 hover:scale-105"
      style={{ filter: `drop-shadow(0 0 8px ${rarityGlow})` }}
    >
      <div
        className="relative rounded-lg overflow-hidden border-2 p-3 h-44 flex flex-col"
        style={{
          borderColor: `${rarityColor}60`,
          background: `linear-gradient(160deg, ${rarityColor}15, #12101A 60%)`,
        }}
      >
        <div className="absolute inset-0 rune-pattern opacity-20 pointer-events-none" />

        <div className="flex items-start justify-between mb-2 relative">
          <Badge color={rarityColor} size="sm">{card.rarity}</Badge>
          <span className="text-xs font-mono text-text-muted">Cost: {card.cost}</span>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center border"
            style={{ borderColor: `${rarityColor}40`, background: `${rarityColor}10` }}
          >
            {card.type === 'creature' ? <Skull size={24} style={{ color: rarityColor }} /> :
             card.type === 'spell' ? <Sparkles size={24} style={{ color: rarityColor }} /> :
             card.type === 'artifact' ? <Package size={24} style={{ color: rarityColor }} /> :
             <Zap size={24} style={{ color: rarityColor }} />}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs font-600 text-text line-clamp-1">{card.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {card.attack !== undefined && <span className="text-[10px] font-mono text-danger">ATK {card.attack}</span>}
            {card.defense !== undefined && <span className="text-[10px] font-mono text-success">DEF {card.defense}</span>}
          </div>
        </div>

        {count !== undefined && count > 1 && (
          <div className="absolute top-1 right-1 bg-void/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted">
            x{count}
          </div>
        )}
      </div>
    </div>
  );
}

// Class Selection Screen
function ClassSelection({ onSelected }: { onSelected: () => void }) {
  const { session, profile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function confirmClass() {
    if (!selected || !session) return;
    setConfirming(true);
    await updateProfile({ class_id: selected });
    addToast('success', `You are now a ${getClass(selected)?.name}!`);
    onSelected();
  }

  const icons: Record<string, typeof Swords> = {
    scythe: Skull, sparkles: Sparkles, swords: Swords, shield: Shield, eye: Eye,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4 animate-float">
          <SkullLogo size={56} />
        </div>
        <h1 className="font-display font-700 text-3xl md:text-4xl text-text mb-2">Choose Your Class</h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto">
          Your class defines your playstyle, your strengths, and your path through the darkness.
          Choose wisely — this decision echoes through eternity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CLASSES.map((cls) => {
          const Icon = icons[cls.icon] || Zap;
          const isSelected = selected === cls.id;
          return (
            <Card
              key={cls.id}
              elevated={isSelected}
              hover
              onClick={() => setSelected(cls.id)}
              className={`p-5 relative overflow-hidden transition-all duration-300 ${isSelected ? 'border-2 scale-105' : ''}`}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 0%, ${cls.accent}, transparent 70%)` }} />
              {isSelected && <div className="absolute inset-0 border-2 rounded-lg" style={{ borderColor: cls.accent, boxShadow: `0 0 20px ${cls.accent}40` }} />}

              <div className="relative">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-3 border-2"
                  style={{ borderColor: `${cls.accent}50`, background: `linear-gradient(135deg, ${cls.accent}20, transparent)` }}
                >
                  <Icon size={24} style={{ color: cls.accent }} />
                </div>
                <h3 className="font-display font-700 text-lg text-text">{cls.name}</h3>
                <p className="text-xs text-text-muted mb-2">{cls.title}</p>
                <p className="text-xs text-text-muted leading-relaxed mb-3">{cls.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cls.traits.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded font-500" style={{ background: `${cls.accent}15`, color: cls.accent }}>{t}</span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {Object.entries(cls.stats).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <p className="text-[10px] text-text-dim capitalize">{key.slice(0, 3)}</p>
                      <p className="text-sm font-display font-700" style={{ color: cls.accent }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="primary" size="lg" disabled={!selected} loading={confirming} onClick={confirmClass} icon={!confirming ? <Skull size={18} /> : undefined}>
          {selected ? `Become a ${getClass(selected)?.name}` : 'Select a class to continue'}
        </Button>
      </div>
    </div>
  );
}
