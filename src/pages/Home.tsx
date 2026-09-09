import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SkullLogo } from '@/components/SkullLogo';
import { Heart, Users, ArrowRight, Twitch, Music2, MessageCircle, Sparkles } from 'lucide-react';
import { CLIPS } from '@/data/arcade';
import { SOCIAL_LINKS } from '@/data/core';

export function Home() {
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
            Enter the dark. Join the community and share your journey.
            A world where every soul tells a story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/community">
              <Button variant="primary" size="lg" icon={<Users size={18} />}>
                Join Community
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="outline" size="lg" icon={<Heart size={18} />}>
                Support the Stream
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-2xl text-text">Featured Clips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredClips.map((clip) => (
            <a key={clip.id} href={clip.url} target="_blank" rel="noopener noreferrer">
              <Card hover className="overflow-hidden h-full group">
                <div className="relative aspect-video bg-gradient-to-br from-slate to-abyss flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 rune-pattern opacity-30" />
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
            </a>
          ))}
        </div>
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
