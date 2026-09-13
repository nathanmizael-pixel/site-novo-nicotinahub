import { useState, useEffect, useCallback } from 'react';
import { Container, Section, Stack, Grid, Cluster } from '@/components/layout/LayoutPrimitives';
import { MediaCard, FeatureCard } from '@/components/ui/SemanticCards';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { videosRepository } from '@/lib/videos';
import { Twitch, Music2, X, Sparkles, Zap } from 'lucide-react';

export function Videos() {
  const [videos, setVideos] = useState<Array<{ id: string; title: string; platform: 'twitch' | 'tiktok'; thumbnail: string; author: string; date: string; views: number; category: string; duration: string; url: string; featured?: boolean }>>([]);
  const [featuredVideo, setFeaturedVideo] = useState<{ id: string; title: string; platform: 'twitch' | 'tiktok'; thumbnail: string; author: string; date: string; views: number; category: string; duration: string; url: string; featured?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platform: 'all' as 'all' | 'twitch' | 'tiktok',
    featured: false,
    sort: 'newest' as 'newest' | 'oldest' | 'most-viewed' | 'featured',
  });

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allVideos, featured] = await Promise.all([
        videosRepository.findAll({ platform: filters.platform === 'all' ? undefined : filters.platform, featured: filters.featured || undefined }, filters.sort),
        videosRepository.findFeatured(1),
      ]);
      setVideos(allVideos);
      setFeaturedVideo(featured[0] ?? null);
    } catch {
      setError('Não foi possível carregar os vídeos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleFilterChange = (key: keyof typeof filters, value: 'all' | 'twitch' | 'tiktok' | boolean | 'newest' | 'oldest' | 'most-viewed' | 'featured') => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ platform: 'all', featured: false, sort: 'newest' });
  };

  const hasActiveFilters = filters.platform !== 'all' || filters.featured || filters.sort !== 'newest';

  if (loading) {
    return (
      <div className="min-h-screen animate-fade-in">
        <Section size="hero" background="atmosphere" className="vignette">
          <Container size="lg">
            <div className="text-center mb-12">
              <h1 className="font-display font-800 text-display-lg text-text mb-4">Vídeos</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                A biblioteca completa de streams, destaques e momentos da comunidade.
              </p>
            </div>
          </Container>
        </Section>
        <Section size="normal">
          <Container size="xl">
            <div className="space-y-4" role="status" aria-label="Carregando vídeos">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-shimmer" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="aspect-video rounded-xl bg-abyss" />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animate-fade-in">
        <Section size="hero" background="atmosphere" className="vignette">
          <Container size="lg">
            <div className="text-center mb-12">
              <h1 className="font-display font-800 text-display-lg text-text mb-4">Vídeos</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                A biblioteca completa de streams, destaques e momentos da comunidade.
              </p>
            </div>
          </Container>
        </Section>
        <Section size="normal">
          <Container size="xl">
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 border border-danger/30 text-danger mb-4">
                <span className="font-display font-600 text-sm">Erro ao carregar</span>
              </div>
              <p className="text-text-muted mb-6">{error}</p>
              <Button variant="primary" onClick={loadVideos} icon={<Zap size={16} />}>
                Tentar novamente
              </Button>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Page Header */}
      <Section size="hero" background="atmosphere" className="vignette">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <Container size="lg">
          <Stack gap="md" align="center" className="mb-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
              <Sparkles size={14} className="text-primary animate-float-slow" />
              <span className="font-display font-600 text-sm text-text">Biblioteca de Vídeos</span>
            </div>
            <h1 className="font-display font-800 text-display-xl text-text">Vídeos</h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              A biblioteca completa de streams, destaques e momentos da comunidade.
              Cada frame conta uma história.
            </p>
          </Stack>
        </Container>
      </Section>

      {/* Filters */}
      <Section size="tight" background="none">
        <Container size="xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={filters.platform === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'all')}
                className="transition-all"
              >
                <Sparkles size={14} className="mr-1" />
                Todos
              </Button>
              <Button
                variant={filters.platform === 'twitch' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'twitch')}
                className="transition-all"
              >
                <Twitch size={14} className="mr-1 text-[#9146FF]" />
                Twitch
              </Button>
              <Button
                variant={filters.platform === 'tiktok' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'tiktok')}
                className="transition-all"
              >
                <Music2 size={14} className="mr-1" />
                TikTok
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value as 'newest' | 'oldest' | 'most-viewed' | 'featured')}
                className="px-3 py-2 bg-abyss border border-border rounded-lg text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all cursor-pointer"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="most-viewed">Mais vistos</option>
                <option value="featured">Destaque</option>
              </select>

              <label className="flex items-center gap-2 px-3 py-2 bg-abyss border border-border rounded-lg text-sm text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                Apenas em destaque
              </label>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} icon={<X size={14} />}>
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Video */}
      {featuredVideo && (
        <Section size="normal" background="atmosphere" className="vignette">
          <Container size="xl">
            <FeatureCard
              layout="horizontal"
              image={featuredVideo.thumbnail || undefined}
              title={featuredVideo.title}
              description={`${featuredVideo.views.toLocaleString()} visualizações · ${featuredVideo.category} · ${featuredVideo.duration}`}
              accent={featuredVideo.platform === 'twitch' ? '#9146FF' : '#FF0050'}
              badge={
                <Badge variant="glow" size="md" color={featuredVideo.platform === 'twitch' ? '#9146FF' : '#FF0050'}>
                  <Twitch size={10} className="mr-1" />
                  Destaque
                </Badge>
              }
              action={
                <a href={featuredVideo.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" icon={<Zap size={16} />}>
                    Assistir
                  </Button>
                </a>
              }
              className="group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 to-transparent" />
            </FeatureCard>
          </Container>
        </Section>
      )}

      {/* Video Grid */}
      <Section size="normal" background="none">
        <Container size="xl">
          <Stack gap="md" align="start" className="mb-8">
            <div>
              <h2 className="font-display font-800 text-display-md text-text">
                {filters.featured ? 'Vídeos em Destaque' : filters.platform !== 'all' ? `Vídeos ${platformLabels[filters.platform]}` : 'Todos os Vídeos'}
              </h2>
              <p className="text-body-md text-text-muted mt-2">
                {videos.length} vídeo{videos.length !== 1 ? 's' : ''} encontrado{videos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Stack>

          {videos.length === 0 ? (
            <EmptyState
              title="O vazio está silencioso"
              description="Nenhum vídeo encontrado com estes filtros. Tente ajustar sua busca."
              icon={<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles size={24} className="text-primary/50" /></div>}
              action={hasActiveFilters ? <Button variant="primary" size="sm" onClick={clearFilters} icon={<X size={14} />}>Limpar filtros</Button> : undefined}
              className="py-16 animate-fade-in-up"
            />
          ) : (
            <Grid cols={1} colsMd={2} colsLg={3} gap="lg" autoFit minItemWidth="320px">
              {videos.map((video, index) => (
                <MediaCard
                  key={video.id}
                  image={video.thumbnail || undefined}
                  title={video.title}
                  subtitle={`${video.views.toLocaleString()} visualizações · ${video.category}`}
                  aspectRatio="video"
                  accent={video.platform === 'twitch' ? '#9146FF' : '#FF0050'}
                  badge={
                    <Badge
                      variant="solid"
                      size="sm"
                      color={video.platform === 'twitch' ? '#9146FF' : '#FF0050'}
                      className="animate-reveal"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {video.platform === 'twitch' ? <Twitch size={10} /> : <Music2 size={10} />}
                      {video.platform}
                    </Badge>
                  }
                  meta={
                    <span className="flex items-center gap-1.5 text-xs text-text/80">
                      <span className="font-mono">{video.duration}</span>
                    </span>
                  }
                  overlay={
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      <div className="w-14 h-14 rounded-full bg-void/80 backdrop-blur-sm flex items-center justify-center border border-primary/30 text-primary animate-scale-in">
                        <Zap size={20} />
                      </div>
                    </a>
                  }
                  onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
                  className="cursor-pointer animate-reveal-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="absolute bottom-3 left-3">
                    <span className="font-mono text-xs text-text/80 bg-void/80 px-2 py-1 rounded">{video.duration}</span>
                  </div>
                </MediaCard>
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section size="loose" background="abyss" divider>
        <Container size="lg">
          <FeatureCard
            layout="vertical"
            icon={<Zap size={36} />}
            title="Quer ver mais?"
            description="A biblioteca está sempre crescendo. Siga a nicotinacat nas plataformas para não perder nenhum momento."
            accent="#A855F7"
            action={
              <Cluster gap="md" justify="center">
                <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" icon={<Twitch size={16} />}>
                    Twitch
                  </Button>
                </a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" icon={<Music2 size={16} />}>
                    TikTok
                  </Button>
                </a>
              </Cluster>
            }
            badge={<Badge variant="glow" size="sm" color="#A855F7"><Sparkles size={10} /> Novos vídeos toda semana</Badge>}
            className="group max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 to-transparent" />
          </FeatureCard>
        </Container>
      </Section>
    </div>
  );
}

const platformLabels: Record<string, string> = {
  all: 'Todos',
  twitch: 'Twitch',
  tiktok: 'TikTok',
};

const SOCIAL_LINKS = {
  twitch: 'https://twitch.tv/nicotinacat',
  tiktok: 'https://tiktok.com/@nicotinacat',
  discord: 'https://discord.gg/nicotinacat',
  amazon: 'https://www.amazon.com/hz/wishlist/ls/nicotinacat',
};