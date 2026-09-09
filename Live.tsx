import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CLIPS, SOCIAL_LINKS } from '@/data/arcade';
import { Link } from 'react-router-dom';
import { Radio, Twitch, MessageCircle, Film, Users, Heart } from 'lucide-react';

export function Live() {
  const isLive = false;
  const recentClips = CLIPS.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Radio size={28} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Live</h1>
          {isLive ? (
            <Badge color="#EF4444" variant="glow" size="md">
              <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" /> LIVE
            </Badge>
          ) : (
            <Badge color="#5C576E" size="md">Offline</Badge>
          )}
        </div>
        <p className="text-sm text-text-muted">Watch nicotinacat live on Twitch</p>
      </div>

      {/* Stream Area */}
      <Card elevated className="overflow-hidden mb-6">
        {isLive ? (
          <div className="aspect-video bg-void flex items-center justify-center">
            <div className="text-center">
              <div className="w-3 h-3 bg-danger rounded-full mx-auto mb-3 animate-pulse" />
              <p className="text-text-muted text-sm">Stream is live</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-slate to-abyss flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 hex-pattern opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void/50" />
            <div className="text-center relative">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center border border-border">
                  <Radio size={28} className="text-text-dim" />
                </div>
              </div>
              <h3 className="font-display font-600 text-lg text-text mb-1">Stream is Offline</h3>
              <p className="text-sm text-text-muted mb-4">nicotinacat is not streaming right now.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md" icon={<Twitch size={16} />}>
                    Visit Twitch Channel
                  </Button>
                </a>
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="md" icon={<MessageCircle size={16} />}>
                    Get Live Notifications
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Channel Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 text-center">
          <Twitch size={24} className="text-[#9146FF] mx-auto mb-2" />
          <p className="text-sm font-600 text-text">Twitch</p>
          <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-bright hover:underline mt-1 block">
            @nicotinacat
          </a>
        </Card>
        <Card className="p-5 text-center">
          <MessageCircle size={24} className="text-[#5865F2] mx-auto mb-2" />
          <p className="text-sm font-600 text-text">Discord</p>
          <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-bright hover:underline mt-1 block">
            Join the server
          </a>
        </Card>
        <Card className="p-5 text-center">
          <Users size={24} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-600 text-text">Community</p>
          <Link to="/community" className="text-xs text-primary-bright hover:underline mt-1 block">
            Join the coven
          </Link>
        </Card>
      </div>

      {/* Recent Clips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-600 text-lg text-text">Recent Clips</h2>
          <Link to="/clips" className="text-sm text-primary-bright hover:text-primary">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentClips.map((clip) => (
            <a key={clip.id} href={clip.url} target="_blank" rel="noopener noreferrer">
              <Card hover className="overflow-hidden group h-full">
                <div className="relative aspect-video bg-gradient-to-br from-slate to-abyss flex items-center justify-center">
                  <div className="absolute inset-0 rune-pattern opacity-30" />
                  <Film size={20} className="text-text-dim group-hover:text-primary transition-colors" />
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs text-text bg-void/80 px-1.5 py-0.5 rounded font-mono">{clip.duration}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-600 text-text line-clamp-1 group-hover:text-primary-bright transition-colors">{clip.title}</p>
                  <p className="text-[10px] text-text-dim mt-0.5">{clip.views.toLocaleString()} views</p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
