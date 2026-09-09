import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkullLogo } from '@/components/SkullLogo';
import { Radio, Film, Gamepad2, Heart, Users, ArrowRight, Twitch, Music2, MessageCircle, Sparkles, Swords, Skull, Shield, Eye, Zap } from 'lucide-react';
import { CLIPS, CLASSES, SOCIAL_LINKS } from '@/data/arcade';
import { useAuth } from '@/context/AuthContext';

export function Home() {
  const { profile } = useAuth();
  const featuredClips = CLIPS.filter((c) => c.featured).slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/10 via-transparent to-void" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
          <div className="flex justify-center mb-6 animate-float">
            <SkullLogo size={80} />
          </div>
          <Badge color="#A855F7" variant="glow" size="md" className="mb-6">
            <Sparkles size={12} /> The Hub Awakens
          </Badge>
          <h1 className="font-display font-800 text-5xl md:text-7xl text-text mb-4 tracking-wide">
            <span className="gradient-text">nicotinacat</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter the dark. Join the community, collect the cards, climb the Arcade.
            A world where every soul tells a story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/live">
              <Button variant="primary" size="lg" icon={<Radio size={18} />}>
                Watch Live
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg" icon={<Users size={18} />}>
                Join Community
              </Button>
            </Link>
            <Link to="/arcade">
              <Button variant="secondary" size="lg" icon={<Gamepad2 size={18} />}>
                Enter Arcade
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card elevated className="overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div className="w-3 h-3 bg-text-dim rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-text-dim rounded-full animate-ping opacity-30" />
              </div>
              <div>
                <h3 className="font-display font-600 text-lg text-text">Stream Offline</h3>
                <p className="text-sm text-text-muted">nicotinacat is currently resting. Check back soon.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="md" icon={<Twitch size={16} />}>
                  Twitch Channel
                </Button>
              </a>
              <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="md" icon={<MessageCircle size={16} />}>
                  Get Notified
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Featured Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-2xl text-text">Featured Content</h2>
          <Link to="/clips" className="flex items-center gap-1 text-sm text-primary-bright hover:text-primary transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredClips.map((clip) => (
            <Link key={clip.id} to="/clips">
              <Card hover className="overflow-hidden h-full group">
                <div className="relative aspect-video bg-gradient-to-br from-slate to-abyss flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 rune-pattern opacity-30" />
                  <Film size={32} className="text-text-dim group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2">
                    <Badge color={clip.platform === 'twitch' ? '#9146FF' : '#FF0050'} size="sm">
                      {clip.platform === 'twitch' ? <Twitch size={10} /> : <Music2 size={10} />}
                      {clip.platform}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs text-text bg-void/80 px-2 py-0.5 rounded font-mono">{clip.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-600 text-sm text-text mb-1 line-clamp-1">{clip.title}</h3>
                  <p className="text-xs text-text-muted">{clip.views.toLocaleString()} views · {clip.category}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Arcade Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card elevated className="overflow-hidden relative">
          <div className="absolute inset-0 hex-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 size={20} className="text-primary" />
              <Badge color="#A855F7" variant="glow">The Arcade</Badge>
            </div>
            <h2 className="font-display font-700 text-3xl text-text mb-3">Choose Your Path</h2>
            <p className="text-text-muted max-w-xl mb-8 leading-relaxed">
              Six classes. Twenty-five cards. Endless expeditions. Build your deck, harvest souls,
              and climb through the darkness to become legend.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {CLASSES.map((cls) => {
                const icons: Record<string, typeof Swords> = { scythe: Skull, sparkles: Sparkles, swords: Swords, shield: Shield, eye: Eye };
                const Icon = icons[cls.icon] || Zap;
                return (
                  <div key={cls.id} className="text-center group cursor-pointer">
                    <div
                      className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{
                        borderColor: `${cls.accent}40`,
                        background: `linear-gradient(135deg, ${cls.accent}15, transparent)`,
                      }}
                    >
                      <Icon size={24} style={{ color: cls.accent }} />
                    </div>
                    <p className="mt-2 text-xs font-600 text-text">{cls.name}</p>
                  </div>
                );
              })}
            </div>
            <Link to="/arcade">
              <Button variant="primary" size="lg" icon={<Gamepad2 size={18} />}>
                {profile?.class_id ? 'Continue Your Journey' : 'Choose Your Class'}
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Community + Wishlist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute inset-0 rune-pattern opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Users size={20} className="text-primary" />
                <Badge color="#A855F7">Community</Badge>
              </div>
              <h3 className="font-display font-600 text-xl text-text mb-2">Join the Coven</h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                Share your thoughts, follow other members, and be part of the growing
                nicotinacat community. Every voice matters in the dark.
              </p>
              <Link to="/community">
                <Button variant="secondary" size="md" icon={<ArrowRight size={16} />}>
                  Enter Community
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden group">
            <div className="absolute inset-0 hex-pattern opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} className="text-primary" />
                <Badge color="#A855F7">Wishlist</Badge>
              </div>
              <h3 className="font-display font-600 text-xl text-text mb-2">Support the Stream</h3>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                Browse the Amazon wishlist and help keep the stream alive. Every gift
                fuels the content and the community.
              </p>
              <Link to="/wishlist">
                <Button variant="secondary" size="md" icon={<Heart size={16} />}>
                  View Wishlist
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Social Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-6">
          <h2 className="font-display font-600 text-xl text-text-muted">Find nicotinacat Across the Void</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer">
            <Card hover className="flex items-center gap-3 px-6 py-4">
              <Twitch size={24} className="text-[#9146FF]" />
              <span className="font-600 text-sm text-text">Twitch</span>
            </Card>
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
            <Card hover className="flex items-center gap-3 px-6 py-4">
              <Music2 size={24} className="text-text" />
              <span className="font-600 text-sm text-text">TikTok</span>
            </Card>
          </a>
          <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
            <Card hover className="flex items-center gap-3 px-6 py-4">
              <MessageCircle size={24} className="text-[#5865F2]" />
              <span className="font-600 text-sm text-text">Discord</span>
            </Card>
          </a>
        </div>
      </section>
    </div>
  );
}
