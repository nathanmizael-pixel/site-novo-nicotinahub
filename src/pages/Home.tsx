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
import { usePageEntry, useParallax, useReducedMotion, useStagger } from '@/hooks/useMotion';
import { useState, useEffect, useCallback } from 'react';

export function Home() {
  const isPageVisible = usePageEntry(0);
  const parallaxOffset = useParallax(0.15);
  const reducedMotion = useReducedMotion();
  const [featuredVideos, setFeaturedVideos] = useState<Array<{ id: string; title: string; platform: 'twitch' | 'tiktok'; thumbnail: string; author: string; date: string; views: number; category: string; duration: string; url: string; featured?: boolean }>>([]);
  const videoStagger = useStagger(featuredVideos.length, 80, 400);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const videos = await videosRepository.findFeatured(3);
      setFeaturedVideos(videos);
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

            {/* Right: Skull Hero — Brand centerpiece with parallax */}
            <div className="relative flex items-center justify-center lg:pl-8">
              <div
                className="relative w-full max-w-md aspect-square"
                style={{
                  transform: parallaxOffset ? `translateY(${parallaxOffset * 0.3}px)` : undefined,
                }}
              >
                {/* Depth: outer nebula aura with soft pulse */}
                <div
                  className="absolute -inset-[8%] bg-gradient-to-br from-primary/15 via-secondary/8 to-transparent rounded-full blur-[110px] opacity-40"
                  style={{ animation: reducedMotion ? undefined : 'pulse-soft 3.5s ease-in-out infinite' }}
                />

                {/* Depth: atmospheric glow layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent rounded-full" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(168,85,247,0.08)]" />

                {/* Orbital ring 1 — outer (slow CCW) */}
                <div
                  className="absolute inset-0 -rotate-12 opacity-20"
                  style={{ animation: reducedMotion ? undefined : 'orbit-slow 32s linear infinite' }}
                >
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="86" fill="none" stroke="url(#orb-primary)" strokeWidth="0.75" strokeDasharray="6,12" />
                    <defs>
                      <linearGradient id="orb-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Orbital ring 2 — inner (slow CW, reverse direction) */}
                <div
                  className="absolute inset-0 rotate-3 opacity-12"
                  style={{ animation: reducedMotion ? undefined : 'orbit-reverse 26s linear infinite' }}
                >
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="66" fill="none" stroke="url(#orb-secondary)" strokeWidth="0.5" strokeDasharray="4,8" />
                    <defs>
                      <linearGradient id="orb-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Main skull with float + glow */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ animation: reducedMotion ? undefined : 'float 6s ease-in-out infinite' }}
                >
                  <SkullLogo
                    size={160}
                    className="drop-shadow-[0_0_50px_rgba(168,85,247,0.4)] drop-shadow-[0_0_25px_rgba(244,63,94,0.3)]"
                  />
                </div>

                {/* Constellation of orbital particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angleDeg = i * 30;
                    const angleRad = (angleDeg * Math.PI) / 180;
                    const radius = 64 + (i % 3) * 6;
                    const relX = Math.cos(angleRad) * radius;
                    const relY = Math.sin(angleRad) * radius;
                    const sizes = [1, 1.5, 2];
                    const opacities = [0.3, 0.45, 0.6];
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full bg-primary"
                        style={{
                          width: `${sizes[i % 3]}px`,
                          height: `${sizes[i % 3]}px`,
                          left: `calc(50% + ${relX}px)`,
                          top: `calc(50% + ${relY}px)`,
                          transform: 'translate(-50%, -50%)',
                          opacity: opacities[i % 3],
                          animationDelay: `${i * 0.12}s`,
                          animation: reducedMotion ? undefined : `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                        }}
                      />
                    );
                  })}
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
              <h2 className="font-display font-800 text-display-md text-text animate-reveal-up" style={{ animationDelay: isPageVisible ? '100ms' : '0ms' }}>Momentos em Destaque</h2>
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
                      style={{ animationDelay: `${videoStagger[index] ?? 0}ms` }}
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
                style={{ animationDelay: `${videoStagger[index] ?? 0}ms` }}
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
          <h2 className="font-display font-800 text-display-lg text-text mb-16 animate-reveal-up" style={{ animationDelay: isPageVisible ? '100ms' : '0ms' }}>Duas formas de viver a nicotinacat</h2>

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
              className="group animate-reveal-up"
              style={{ animationDelay: isPageVisible ? '200ms' : '0ms' }}
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
              className="group animate-reveal-up"
              style={{ animationDelay: isPageVisible ? '300ms' : '0ms' }}
            />
          </Grid>
        </Container>
      </Section>

      {/* Social Links */}
      <Section size="normal" background="none">
        <Container size="lg">
          <h2 className="font-display font-700 text-display-md text-text text-center mb-10 animate-reveal-up" style={{ animationDelay: isPageVisible ? '100ms' : '0ms' }}>Encontre a nicotinacat por aí</h2>

          <Grid cols={1} colsMd={3} gap="lg" autoFit minItemWidth="260px">
            <NavigationCard
              icon={<Twitch size={24} />}
              label="Twitch"
              description="Streams ao vivo, VODs e replays"
              accent="#9146FF"
              href={SOCIAL_LINKS.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full animate-reveal-up"
              style={{ animationDelay: isPageVisible ? '200ms' : '0ms' }}
            />

            <NavigationCard
              icon={<Music2 size={24} />}
              label="TikTok"
              description="Cortes curtos e momentos épicos"
              accent="#FF0050"
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full animate-reveal-up"
              style={{ animationDelay: isPageVisible ? '300ms' : '0ms' }}
            />

            <NavigationCard
              icon={<MessageCircle size={24} />}
              label="Discord"
              description="Chat da comunidade e anúncios"
              accent="#5865F2"
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full animate-reveal-up"
              style={{ animationDelay: isPageVisible ? '400ms' : '0ms' }}
            />
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
