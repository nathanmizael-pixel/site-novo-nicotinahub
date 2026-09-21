import { useState, useEffect, useCallback } from 'react';
import { Container, Section, Stack, Grid, Cluster } from '@/components/layout/LayoutPrimitives';
import { MediaCard } from '@/components/ui/SemanticCards';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { videosRepository, type VideoData } from '@/lib/videos';
import { SOCIAL_LINKS } from '@/data/social';
import { Music2, Zap, Plus, ExternalLink, RefreshCw } from 'lucide-react';

export function Videos() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const tiktokVideos = await videosRepository.findTikTokVideos(10);
      setVideos(tiktokVideos);
    } catch {
      setError('Não foi possível carregar os vídeos do TikTok. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

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
    if (video.tiktok_video_id) {
      setSelectedVideo(video);
    } else {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animate-fade-in">
        <Section size="hero" background="atmosphere" className="vignette">
          <Container size="lg">
            <div className="text-center mb-12">
              <h1 className="font-display font-800 text-display-lg text-text mb-4">TikTok @nicotinaclipes</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                Carregando os melhores clipes e momentos...
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
              <h1 className="font-display font-800 text-display-lg text-text mb-4">TikTok @nicotinaclipes</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                Os melhores momentos do TikTok.
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
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF0050]/5 rounded-full blur-[150px]" />
        </div>
        <Container size="lg">
          <Stack gap="lg" align="center" className="mb-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF0050]/10 border border-[#FF0050]/20 animate-fade-in">
              <Music2 size={14} className="text-[#FF0050] animate-float-slow" />
              <span className="font-display font-600 text-sm text-text">Canal Oficial TikTok</span>
            </div>
            <h1 className="font-display font-800 text-display-xl text-text">@nicotinaclipes</h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Cortes, momentos épicos e clipes exclusivos do Nicotinacat.
              Cada frame conta uma história.
            </p>

            {/* Profile Card */}
            <div className="w-full max-w-xl card-elevated p-6 rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md shadow-elevated mt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF0050]/20 to-primary/20 border border-[#FF0050]/40 flex items-center justify-center shrink-0 shadow-glow-sm">
                  <img
                    src="/nicotinacat-app-icon.png"
                    alt="Nicotinacat"
                    className="w-14 h-14 object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display font-700 text-lg text-text truncate">@nicotinaclipes</h2>
                  <p className="text-sm text-text-muted mt-1">
                    Clipes, melhores momentos e cortes do Nicotinacat. Siga no TikTok para acompanhar em tempo real.
                  </p>
                </div>
                <div className="shrink-0 mt-2 sm:mt-0">
                  <a
                    href={SOCIAL_LINKS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" icon={<ExternalLink size={15} />} className="bg-[#FF0050] hover:bg-[#ff1a66] text-white border-0 shadow-glow-sm">
                      Ver no TikTok
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {isAdmin && (
              <Cluster gap="sm" justify="center" className="pt-4">
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
                  icon={!syncing ? <RefreshCw size={16} /> : undefined}
                >
                  {syncing ? 'Sincronizando...' : 'Sincronizar TikTok'}
                </Button>
              </Cluster>
            )}
          </Stack>
        </Container>
      </Section>

      {/* Videos Section (10 most recent TikTok videos) */}
      <Section size="normal" background="none">
        <Container size="xl">
          <Stack gap="md" align="start" className="mb-8">
            <div>
              <h2 className="font-display font-800 text-display-md text-text">
                Vídeos Recentes
              </h2>
              <p className="text-body-md text-text-muted mt-2">
                {videos.length} {videos.length === 1 ? 'vídeo exibido' : 'vídeos exibidos'} (máximo de 10 mais recentes)
              </p>
            </div>
          </Stack>

          {videos.length === 0 ? (
            <EmptyState
              title="Nenhum vídeo do TikTok encontrado."
              description="Adicione vídeos ou sincronize com a conta do TikTok para exibi-los aqui."
              icon={<div className="w-16 h-16 rounded-full bg-[#FF0050]/10 flex items-center justify-center"><Music2 size={24} className="text-[#FF0050]/60" /></div>}
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
                    image={undefined}
                    title={video.title}
                    subtitle={`${video.views.toLocaleString()} visualizações · ${video.category}`}
                    aspectRatio="video"
                    accent="#FF0050"
                    badge={
                      <Badge
                        variant="solid"
                        size="sm"
                        color="#FF0050"
                        className="animate-reveal"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <Music2 size={10} className="mr-1" />
                        TikTok
                      </Badge>
                    }
                    meta={
                      <span className="flex items-center gap-1.5 text-xs text-text/80">
                        <span className="font-mono">{video.duration}</span>
                      </span>
                    }
                    overlay={
                      <div className="w-14 h-14 rounded-full bg-void/80 backdrop-blur-sm flex items-center justify-center border border-[#FF0050]/30 text-[#FF0050] animate-scale-in">
                        <Zap size={20} />
                      </div>
                    }
                    className="animate-reveal-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                    titleAs="div"
                  >
                    {video.tiktok_video_id && (
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
                className="text-[#FF0050] hover:underline"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF0050]/10 border border-[#FF0050]/25 mb-4">
              <Music2 size={14} className="text-[#FF0050] animate-float-slow" />
              <span className="font-display font-600 text-sm text-text">Novos clipes toda semana</span>
            </div>
            <p className="text-body-md text-text-muted mb-6">
              Siga @nicotinaclipes no TikTok para não perder nenhum momento épico.
            </p>
            <Cluster gap="md" justify="center">
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={<Music2 size={16} />} className="bg-[#FF0050] hover:bg-[#ff1a66] text-white border-0 min-h-[44px]">
                  Seguir no TikTok
                </Button>
              </a>
            </Cluster>
          </div>
        </Container>
      </Section>
    </div>
  );
}
