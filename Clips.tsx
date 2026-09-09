import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { CLIPS } from '@/data/arcade';
import { formatNumber } from '@/lib/utils';
import { Film, Twitch, Music2, Eye, Clock } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'twitch', label: 'Twitch' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'featured', label: 'Highlights' },
];

export function Clips() {
  const [filter, setFilter] = useState('all');

  const filtered = CLIPS.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'featured') return c.featured;
    return c.platform === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Film size={28} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Clips & Videos</h1>
        </div>
        <p className="text-sm text-text-muted">Best moments from streams and socials</p>
      </div>

      <Tabs tabs={FILTERS.map(f => ({ id: f.id, label: f.label }))} active={filter} onChange={setFilter} className="mb-6" />

      {filtered.length === 0 ? (
        <EmptyState title="No clips found" description="Try a different filter." icon={<Film size={48} />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((clip) => (
            <a key={clip.id} href={clip.url} target="_blank" rel="noopener noreferrer">
              <Card hover className="overflow-hidden group h-full">
                <div className="relative aspect-video bg-gradient-to-br from-slate to-abyss flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 rune-pattern opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <Film size={28} className="text-text-dim group-hover:text-primary group-hover:scale-110 transition-all duration-300" />

                  <div className="absolute top-2 left-2">
                    <Badge color={clip.platform === 'twitch' ? '#9146FF' : '#FF0050'} size="sm">
                      {clip.platform === 'twitch' ? <Twitch size={10} /> : <Music2 size={10} />}
                      {clip.platform}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs text-text bg-void/80 px-2 py-0.5 rounded font-mono">{clip.duration}</span>
                  </div>
                  {clip.featured && (
                    <div className="absolute bottom-2 left-2">
                      <Badge color="#FBBF24" size="sm">Featured</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-600 text-sm text-text mb-1 line-clamp-1 group-hover:text-primary-bright transition-colors">{clip.title}</h3>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{clip.category}</span>
                    <span className="flex items-center gap-1"><Eye size={10} /> {formatNumber(clip.views)}</span>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
