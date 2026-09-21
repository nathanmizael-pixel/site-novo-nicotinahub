import { useState, useEffect, useCallback } from 'react';
import { Container, Section, Stack, Grid, Cluster } from '@/components/layout/LayoutPrimitives';
import { MediaCard, FeatureCard } from '@/components/ui/SemanticCards';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { videosRepository, type VideoData } from '@/lib/videos';
import { SOCIAL_LINKS } from '@/data/social';
import { Twitch, Music2, X, Sparkles, Zap, Plus } from 'lucide-react';

export function Videos() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    platform: 'all' as 'all' | 'twitch' | 'tiktok',
    featured: false,
    sort: 'newest' as 'newest' | 'oldest' | 'most-viewed' | 'featured',
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    url: '',
    title: '',
    category: 'TikTok',
    duration: '0:30',
    featured: false,
  });
  const [adding, setAdding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const handleSyncTikTok = async () => {
    if (!isAdmin) {
      addToast('error', 'Apenas administradores podem sincronizar o TikTok.');
      return;
    }

    setSyncing(true);
    try {
      const result = await videosRepository.syncTikTok();
      if (!result.success && result.errors && result.errors.length > 0) {
        addToast('error', `Sincronização concluída com erros: ${result.errors[0]}`);
      } else {
        const syncedCount = result.synced ?? 0;
        addToast('success', `TikTok sincronizado com sucesso! ${syncedCount} vídeo(s) processado(s).`);
      }
      loadVideos();
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erro ao sincronizar TikTok');
    } finally {
      setSyncing(false);
    }
  };

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allVideos, featured] = await Promise.all([
        videosRepository.findAll({ platform: filters.platform === 'all' ? undefined : filters.platform, featured: filters.featured || undefined }, filters.sort),
        videosRepository.findFeatured(1),
      ]);
      const feat = featured[0] ?? null;
      setFeaturedVideo(feat);
      if (feat) {
        setVideos(allVideos.filter(v => v.id !== feat.id));
      } else {
        setVideos(allVideos);
      }
    } catch {
      setError('Não foi possível carregar os vídeos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleFilterChange = (key: keyof typeof filters, value: 'all' | 'twitch' | 'tiktok' | boolean | 'newest' | 'oldest' | 'most-viewed' | 'featured') => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ platform: 'all', featured: false, sort: 'newest' });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      addToast('error', 'Apenas administradores podem adicionar vídeos.');
      return;
    }
    if (!addForm.url.trim()) {
      addToast('error', 'Informe a URL do TikTok');
      return;
    }

    setAdding(true);
    try {
      const result = await videosRepository.addTikTokVideo(addForm);
      if (!result.success) {
        addToast('error', result.error || 'Erro ao adicionar vídeo do TikTok');
      } else {
        addToast('success', 'Vídeo do TikTok adicionado com sucesso!');
        setIsAddModalOpen(false);
        setAddForm({ url: '', title: '', category: 'TikTok', duration: '0:30', featured: false });
        loadVideos();
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erro ao adicionar vídeo');
    } finally {
      setAdding(false);
    }
  };

  const handleVideoClick = (video: VideoData) => {
    if (video.platform === 'tiktok' && video.tiktok_video_id) {
      setSelectedVideo(video);
    } else {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
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
            {isAdmin && (
              <Cluster gap="sm" justify="center" className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => setIsAddModalOpen(true)}
                  icon={<Plus size={16} />}
                >
                  Adicionar Vídeo do TikTok
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSyncTikTok}
                  loading={syncing}
                  disabled={syncing}
                  icon={!syncing ? <Music2 size={16} /> : undefined}
                >
                  {syncing ? 'Sincronizando...' : 'Sincronizar TikTok'}
                </Button>
              </Cluster>
            )}
          </Stack>
        </Container>
      </Section>

      {/* Filters */}
      <Section size="tight" background="none">
        <Container size="xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filtrar por plataforma">
              <Button
                variant={filters.platform === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'all')}
                className="transition-all min-h-[44px]"
              >
                <Sparkles size={14} className="mr-1" />
                Todos
              </Button>
              <Button
                variant={filters.platform === 'twitch' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'twitch')}
                className="transition-all min-h-[44px]"
              >
                <Twitch size={14} className="mr-1 text-[#9146FF]" />
                Twitch
              </Button>
              <Button
                variant={filters.platform === 'tiktok' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('platform', 'tiktok')}
                className="transition-all min-h-[44px]"
              >
                <Music2 size={14} className="mr-1" />
                TikTok
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <label htmlFor="video-sort" className="sr-only">Ordenar por</label>
              <select
                id="video-sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value as 'newest' | 'oldest' | 'most-viewed' | 'featured')}
                className="px-3 py-2 bg-abyss border border-border rounded-lg text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all cursor-pointer min-h-[44px]"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="most-viewed">Mais vistos</option>
                <option value="featured">Destaque</option>
              </select>

              <label htmlFor="video-featured" className="flex items-center gap-2 px-3 py-2 bg-abyss border border-border rounded-lg text-sm text-text-muted cursor-pointer min-h-[44px]">
                <input
                  id="video-featured"
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                Apenas em destaque
              </label>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} icon={<X size={14} />} className="min-h-[44px]">
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
              image={featuredVideo.platform === 'tiktok' && featuredVideo.tiktok_video_id ? undefined : (featuredVideo.thumbnail || undefined)}
              title={featuredVideo.title}
              description={`${featuredVideo.views.toLocaleString()} visualizações · ${featuredVideo.category} · ${featuredVideo.duration}`}
              accent={featuredVideo.platform === 'twitch' ? '#9146FF' : '#FF0050'}
              badge={
                <Badge variant="glow" size="md" color={featuredVideo.platform === 'twitch' ? '#9146FF' : '#FF0050'}>
                  {featuredVideo.platform === 'twitch' ? <Twitch size={10} className="mr-1" /> : <Music2 size={10} className="mr-1" />}
                  Destaque
                </Badge>
              }
              action={
                <Button
                  variant="primary"
                  icon={<Zap size={16} />}
                  onClick={() => handleVideoClick(featuredVideo)}
                >
                  Assistir
                </Button>
              }
              className="group"
            >
              {featuredVideo.platform === 'tiktok' && featuredVideo.tiktok_video_id ? (
                <div className="mt-4 aspect-[9/16] max-h-[300px] rounded-xl overflow-hidden bg-void/60">
                  <iframe
                    src={`https://www.tiktok.com/player/v1/${featuredVideo.tiktok_video_id}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={featuredVideo.title}
                  />
                </div>
              ) : null}
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
              title="Nada por aqui."
              description="Ajuste os filtros e tente de novo."
              icon={<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles size={24} className="text-primary/50" /></div>}
              action={hasActiveFilters ? <Button variant="primary" size="sm" onClick={clearFilters} icon={<X size={14} />} className="min-h-[44px]">Limpar filtros</Button> : undefined}
              className="py-16 animate-fade-in-up"
            />
          ) : (
            <Grid cols={1} colsMd={2} colsLg={3} gap="lg" autoFit minItemWidth="320px">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="cursor-pointer"
                >
                  <MediaCard
                    image={video.platform === 'tiktok' && video.tiktok_video_id ? undefined : (video.thumbnail || undefined)}
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
                      <div className="w-14 h-14 rounded-full bg-void/80 backdrop-blur-sm flex items-center justify-center border border-primary/30 text-primary animate-scale-in">
                        <Zap size={20} />
                      </div>
                    }
                    className="animate-reveal-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                    titleAs="div"
                  >
                    {video.platform === 'tiktok' && video.tiktok_video_id && (
                      <div className="mt-3 aspect-[9/16] max-h-[220px] rounded-lg overflow-hidden bg-void/60 pointer-events-none">
                        <iframe
                          src={`https://www.tiktok.com/player/v1/${video.tiktok_video_id}`}
                          className="w-full h-full border-0"
                          title={video.title}
                        />
                      </div>
                    )}
                  </MediaCard>
                </div>
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* Add TikTok Video Modal */}
      {isAdmin && (
        <Modal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Adicionar Vídeo do TikTok"
          size="md"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-600 text-text mb-1">URL Pública do TikTok *</label>
              <input
                type="url"
                placeholder="https://www.tiktok.com/@usuario/video/1234567890"
                value={addForm.url}
                onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all"
                required
              />
              <p className="text-xs text-text-dim mt-1">Cole a URL completa do vídeo público do TikTok.</p>
            </div>

            <div>
              <label className="block text-sm font-600 text-text mb-1">Título (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Momento épico na live"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-600 text-text mb-1">Categoria</label>
                <input
                  type="text"
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-600 text-text mb-1">Duração</label>
                <input
                  type="text"
                  value={addForm.duration}
                  onChange={(e) => setAddForm({ ...addForm, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 focus:shadow-glow-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="add-featured"
                checked={addForm.featured}
                onChange={(e) => setAddForm({ ...addForm, featured: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <label htmlFor="add-featured" className="text-sm text-text cursor-pointer">Destacar este vídeo</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={adding}>
                {adding ? 'Adicionando...' : 'Adicionar Vídeo'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Play TikTok Video Modal */}
      {selectedVideo && selectedVideo.tiktok_video_id && (
        <Modal
          open={Boolean(selectedVideo)}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          size="lg"
        >
          <div className="space-y-4">
            <div className="aspect-[9/16] w-full max-h-[75vh] mx-auto rounded-xl overflow-hidden bg-void">
              <iframe
                src={`https://www.tiktok.com/player/v1/${selectedVideo.tiktok_video_id}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
            <div className="flex items-center justify-between pt-2 text-sm text-text-muted">
              <span>{selectedVideo.views.toLocaleString()} visualizações · {selectedVideo.category}</span>
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-bright hover:underline"
              >
                Abrir no TikTok ↗
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* CTA Section */}
      <Section size="loose" background="abyss" divider>
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-4">
              <Sparkles size={14} className="text-primary animate-float-slow" />
              <span className="font-display font-600 text-sm text-text">Novos vídeos toda semana</span>
            </div>
            <p className="text-body-md text-text-muted mb-6">
              A biblioteca está sempre crescendo. Siga nas plataformas para não perder nenhum momento.
            </p>
            <Cluster gap="md" justify="center">
              <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={<Twitch size={16} />} className="min-h-[44px]">Twitch</Button>
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" icon={<Music2 size={16} />} className="min-h-[44px]">TikTok</Button>
              </a>
            </Cluster>
          </div>
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
