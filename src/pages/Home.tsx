import { Link } from 'react-router-dom';
import { Container, HeroSection, Section, Stack, Grid, Cluster } from '@/components/layout/LayoutPrimitives';
import { FeatureCard, MediaCard, NavigationCard } from '@/components/ui/SemanticCards';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkullLogo } from '@/components/SkullLogo';
import { Heart, Users, ArrowRight, Twitch, Music2, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { videosRepository } from '@/lib/videos';
import { SOCIAL_LINKS } from '@/data/social';
import { usePageEntry } from '@/hooks/useMotion';
import { useState, useEffect, useCallback } from 'react';

export function Home() {
  const isPageVisible = usePageEntry(0);
  const [featuredVideos, setFeaturedVideos] = useState<Array<{ id: string; title: string; platform: 'twitch' | 'tiktok'; thumbnail: string; author: string; date: string; views: number; category: string; duration: string; url: string; featured?: boolean }>>([]);
  const [videoDelays, setVideoDelays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const videos = await videosRepository.findFeatured(3);
      setFeaturedVideos(videos);
      setVideoDelays(videos.map((_, i) => i * 80));
    } catch {
      setError('Não foi possível carregar os vídeos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedVideos();
  }, [loadFeaturedVideos]);

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Hero — Asymmetric with storytelling */}
      <HeroSection variant="asymmetric" background="atmosphere" height="screen-75" className="vignette">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-void/80 to-transparent" />
        </div>

        <Container size="lg">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center min-h-[70vh]">
            {/* Left: Copy + CTA */}
            <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: isPageVisible ? '0ms' : '200ms' }}>
              <h1 className="font-display font-900 text-display-xl text-text mb-6 leading-tight tracking-tight animate-reveal-up" style={{ animationDelay: isPageVisible ? '150ms' : '350ms' }}>
                <span className="gradient-text">nicotinacat</span>
              </h1>

              <p className="text-body-lg text-text-muted/80 leading-relaxed max-w-xl mb-8 animate-reveal-up tracking-wide" style={{ animationDelay: isPageVisible ? '250ms' : '450ms' }}>
                oi eu tenho tres gatos e uma camiseta do korn :)
              </p>

              <Cluster gap="md" justify="start" className="animate-reveal-up" style={{ animationDelay: isPageVisible ? '350ms' : '550ms' }}>
                <Link to="/community">
                  <Button variant="primary" size="lg" icon={<Users size={18} />}>
                    Entrar na Comunidade
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" size="lg" icon={<Heart size={18} />}>
                    Apoiar a Stream
                  </Button>
                </Link>
              </Cluster>
            </div>

            {/* Right: Skull Hero — Brand centerpiece */}
            <div className="relative flex items-center justify-center lg:pl-8 animate-float-slow" style={{ animationDelay: isPageVisible ? '200ms' : '400ms' }}>
              <div className="relative w-full max-w-md aspect-square">
                {/* Atmospheric glow layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent rounded-full" />

                {/* Main skull */}
                <SkullLogo size={160} className="relative z-10 drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]" />

                {/* Rotating orbit rings */}
                <div className="absolute inset-0 -rotate-12 animate-spin-slow opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="url(#primary)" strokeWidth="0.5" strokeDasharray="8,12" />
                    <defs>
                      <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Floating particles (reduced to 3 for elegance) */}
                <div className="absolute inset-0 pointer-events-none">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 animate-float"
                      style={{
                        left: `${20 + i * 25}%`,
                        top: `${30 + (i * 15) % 40}%`,
                        animationDelay: `${i * 0.9}s`,
                        animationDuration: `${5 + i * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </HeroSection>

      {/* Featured Content — Editorial layout */}
      <Section size="normal" background="none">
        <Container size="lg">
          <Stack gap="md" align="start" className="mb-12">
            <div>
              <h2 className="font-display font-800 text-display-md text-text">Momentos em Destaque</h2>
            </div>
          </Stack>

          {loading ? (
            <div role="status" aria-label="Carregando vídeos em destaque">
              <Grid cols={1} colsMd={2} colsLg={3} gap="lg" autoFit minItemWidth="320px">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-shimmer" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="aspect-video rounded-xl bg-abyss" />
                  </div>
                ))}
              </Grid>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 border border-danger/30 text-danger mb-4">
                <span className="font-display font-600 text-sm">Erro ao carregar</span>
              </div>
              <p className="text-text-muted mb-6">{error}</p>
              <Button variant="primary" onClick={loadFeaturedVideos} icon={<Zap size={16} />}>
                Tentar novamente
              </Button>
            </div>
          ) : featuredVideos.length === 0 ? (
            <EmptyState
              title="Nada por aqui."
              description="Ainda não há vídeos em destaque."
              icon={<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles size={24} className="text-primary/50" /></div>}
              className="py-16 animate-fade-in-up"
            />
          ) : (
            <Grid cols={1} colsMd={2} colsLg={3} gap="lg" autoFit minItemWidth="320px">
              {featuredVideos.map((video, index) => (
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
                      style={{ animationDelay: `${videoDelays[index]}ms` }}
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
                      <ArrowRight size={20} />
                    </div>
                  }
                  onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(video.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer animate-reveal-up"
                  style={{ animationDelay: `${videoDelays[index]}ms` }}
                >
                </MediaCard>
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* Core Pillars */}
      <Section size="loose" background="atmosphere" className="vignette">
        <Container size="lg">
          <h2 className="font-display font-800 text-display-lg text-text mb-16">Duas formas de viver a nicotinacat</h2>

          <Grid cols={1} colsMd={2} gap="xl" autoFit minItemWidth="300px">
            <FeatureCard
              layout="vertical"
              icon={<Users size={36} />}
              title="Comunidade"
              description="Compartilhe seus pensamentos, siga outros viajantes e construa sua reputação na comunidade. Toda voz ecoa no escuro."
              accent="#A855F7"
              action={
                <Link to="/community">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    Entrar na Comunidade
                  </Button>
                </Link>
              }
              className="group"
            />

            <FeatureCard
              layout="vertical"
              icon={<Heart size={36} />}
              title="Lista de Desejos"
              description="Explore a lista de desejos e apoie a transmissão. Cada presente fortalece o conteúdo e mantém a comunidade viva."
              accent="#F43F5E"
              action={
                <Link to="/wishlist">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    Ver lista de desejos
                  </Button>
                </Link>
              }
              className="group"
            />
          </Grid>
        </Container>
      </Section>

      {/* Social Links */}
      <Section size="normal" background="none">
        <Container size="lg">
          <h2 className="font-display font-700 text-display-md text-text text-center mb-10">Encontre a nicotinacat por aí</h2>

          <Grid cols={1} colsMd={3} gap="lg" autoFit minItemWidth="260px">
            <NavigationCard
              icon={<Twitch size={24} />}
              label="Twitch"
              description="Streams ao vivo, VODs e replays"
              accent="#9146FF"
              href={SOCIAL_LINKS.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            />

            <NavigationCard
              icon={<Music2 size={24} />}
              label="TikTok"
              description="Cortes curtos e momentos épicos"
              accent="#FF0050"
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            />

            <NavigationCard
              icon={<MessageCircle size={24} />}
              label="Discord"
              description="Chat da comunidade e anúncios"
              accent="#5865F2"
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            />
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
