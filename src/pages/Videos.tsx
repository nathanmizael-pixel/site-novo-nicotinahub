import { useState, useEffect, useCallback } from 'react';
import { Container, Section, Stack, Grid } from '@/components/layout/LayoutPrimitives';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { videosRepository, type VideoData } from '@/lib/videos';
import { SOCIAL_LINKS } from '@/data/social';
import { Music2, Plus, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { TikTokPlayer } from '@/components/TikTokPlayer';
import { Modal } from '@/components/ui/Modal';

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

  if (loading) {
    return (
      <div className="min-h-screen animate-fade-in">
        <Section size="hero" background="atmosphere" className="vignette">
          <Container size="lg">
            <div className="text-center mb-12">
              <h1 className="font-display font-800 text-display-lg text-text mb-4">@nicotinaclipes</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                Carregando os melhores clipes...
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
              <h1 className="font-display font-800 text-display-lg text-text mb-4">@nicotinaclipes</h1>
              <p className="text-body-md text-text-muted max-w-xl mx-auto">
                Momentos do TikTok.
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

  const featuredVideo = videos[0];
  const dropVideos = videos.slice(1);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* 1. Minimalist Profile Header */}
      <Section size="hero" background="atmosphere" className="vignette pb-8">
        <Container size="lg">
          <Stack gap="md" align="center" className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border">
              <Music2 size={13} className="text-primary-bright" />
              <span className="font-display font-600 text-xs tracking-wider text-text">TikTok Creator</span>
            </div>
            <h1 className="font-display font-900 text-display-xl text-text tracking-tight">@nicotinaclipes</h1>
            <p className="text-body-md text-text-muted max-w-md mx-auto">
              Clipes e momentos do Nicotinacat.
            </p>
            <div>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" icon={<ExternalLink size={14} />} className="bg-primary hover:bg-primary-bright text-void font-600 border-0 shadow-glow-sm">
                  Ver no TikTok
                </Button>
              </a>
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  icon={<Plus size={14} />}
                >
                  Adicionar Vídeo
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSyncTikTok}
                  loading={syncing}
                  disabled={syncing}
                  icon={!syncing ? <RefreshCw size={14} /> : undefined}
                >
                  {syncing ? 'Sincronizando...' : 'Sincronizar'}
                </Button>
              </div>
            )}
          </Stack>
        </Container>
      </Section>

      {/* Videos Section with Hierarchy */}
      <Section size="normal" background="none">
        <Container size="xl">
          {videos.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              Nenhum vídeo encontrado.
            </div>
          ) : (
            <div className="space-y-16">
              {/* 2. Featured Video */}
              {featuredVideo && featuredVideo.tiktok_video_id && (
                <div className="max-w-3xl mx-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display font-700 text-sm uppercase tracking-wider text-primary-bright">Destaque Principal</span>
                    <span className="text-xs text-text-dim font-mono">{featuredVideo.views.toLocaleString()} visualizações</span>
                  </div>
                  <TikTokPlayer
                    videoId={featuredVideo.tiktok_video_id}
                    title={featuredVideo.title}
                    aspectRatio="portrait"
                  />
                  <h2 className="font-display font-700 text-lg text-text mt-3">{featuredVideo.title}</h2>
                </div>
              )}

              {/* 3. TikTok Drops (9 remaining videos in 2-column grid on desktop) */}
              {dropVideos.length > 0 && (
                <div>
                  <div className="mb-6 pb-2 border-b border-border">
                    <h2 className="font-display font-700 text-display-sm text-text">TikTok Drops</h2>
                    <p className="text-xs text-text-muted">Últimos momentos publicados</p>
                  </div>

                  <Grid cols={1} colsMd={2} gap="xl">
                    {dropVideos.map((video, index) => (
                      video.tiktok_video_id ? (
                        <div key={video.id} className="space-y-2 animate-reveal-up" style={{ animationDelay: `${index * 60}ms` }}>
                          <TikTokPlayer
                            videoId={video.tiktok_video_id}
                            title={video.title}
                            aspectRatio="portrait"
                          />
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-600 text-sm text-text truncate max-w-[70%]">{video.title}</h3>
                            <span className="text-xs text-text-dim font-mono">{video.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      ) : null
                    ))}
                  </Grid>
                </div>
              )}
            </div>
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
                className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-600 text-text mb-1">Título (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: Momento épico"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-abyss border border-border rounded-xl text-sm text-text placeholder:text-text-dim focus:border-primary/50 outline-none"
              />
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
    </div>
  );
}
