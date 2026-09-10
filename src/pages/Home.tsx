import { Link } from 'react-router-dom';
import { Container, HeroSection, Section, Stack, Grid, Cluster } from '@/components/layout/LayoutPrimitives';
import { FeatureCard, MediaCard, NavigationCard, StatCard } from '@/components/ui/SemanticCards';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkullLogo } from '@/components/SkullLogo';
import { Heart, Users, ArrowRight, Twitch, Music2, MessageCircle, Sparkles, Zap, Coins, Shield, Crown, Ghost } from 'lucide-react';
import { CLIPS } from '@/data/arcade';
import { SOCIAL_LINKS } from '@/data/core';
import { usePageEntry, useStagger } from '@/hooks/useMotion';

export function Home() {
  const isPageVisible = usePageEntry(0);
  const featuredClips = CLIPS.filter((c) => c.featured).slice(0, 3);
  const clipDelays = useStagger(featuredClips.length, 80, 240);

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
              <div className="inline-flex items-center gap-2 mb-6">
                <Badge variant="glow" size="md" className="animate-fade-in" style={{ animationDelay: isPageVisible ? '100ms' : '300ms' }}>
                  <Sparkles size={12} className="animate-float-slow" />
                  <span className="font-display font-600">The Hub Awakens</span>
                </Badge>
              </div>

              <h1 className="font-display font-900 text-display-xl text-text mb-6 leading-tight tracking-tight animate-reveal-up" style={{ animationDelay: isPageVisible ? '150ms' : '350ms' }}>
                <span className="gradient-text">nicotinacat</span>
                <br />
                <span className="font-normal text-text-muted">Hub</span>
              </h1>

              <p className="text-body-lg text-text-muted max-w-xl mb-10 leading-relaxed animate-reveal-up" style={{ animationDelay: isPageVisible ? '250ms' : '450ms' }}>
                A dark fantasy sanctuary for the coven. Stream, share, collect, and forge your path
                through the veil. Every soul tells a story — what's yours?
              </p>

              <Cluster gap="md" justify="start" className="animate-reveal-up" style={{ animationDelay: isPageVisible ? '350ms' : '550ms' }}>
                <Link to="/community">
                  <Button variant="primary" size="lg" icon={<Users size={18} />}>
                    Join the Coven
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" size="lg" icon={<Heart size={18} />}>
                    Support the Stream
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

                {/* Main skull — larger, prominent */}
                <SkullLogo size={160} className="relative z-10 drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]" />

                {/* Rotating orbit rings */}
                <div className="absolute inset-0 -rotate-12 animate-spin-slow opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="url(#primary)" stroke-width="0.5" stroke-dasharray="8,12" />
                    <defs>
                      <linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="absolute inset-0 rotate-6 animate-spin-slow opacity-15" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#FBBF24" stroke-width="0.3" stroke-dasharray="4,20" opacity="0.4" />
                  </svg>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 animate-float"
                      style={{
                        left: `${15 + i * 12}%`,
                        top: `${20 + (i * 7) % 60}%`,
                        animationDelay: `${i * 0.7}s`,
                        animationDuration: `${4 + i * 0.5}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Bottom badge */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                  <Badge variant="glow" size="md" className="px-4 py-1.5">
                    <span className="font-display font-600 tracking-wider">ENTER THE VOID</span>
                  </Badge>
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
              <h2 className="font-display font-800 text-display-md text-text">Featured Moments</h2>
              <p className="text-body-md text-text-muted mt-2">Curated highlights from the streams</p>
            </div>
          </Stack>

          <Grid cols={1} colsMd={2} colsLg={3} gap="lg" autoFit minItemWidth="320px">
            {featuredClips.map((clip, index) => (
              <MediaCard
                key={clip.id}
                image={clip.thumbnail || undefined}
                title={clip.title}
                subtitle={`${clip.views.toLocaleString()} views · ${clip.category}`}
                aspectRatio="video"
                accent={clip.platform === 'twitch' ? '#9146FF' : '#FF0050'}
                badge={
                  <Badge
                    variant="solid"
                    size="sm"
                    color={clip.platform === 'twitch' ? '#9146FF' : '#FF0050'}
                    className="animate-reveal"
                    style={{ animationDelay: `${clipDelays[index]}ms` }}
                  >
                    {clip.platform === 'twitch' ? <Twitch size={10} /> : <Music2 size={10} />}
                    {clip.platform}
                  </Badge>
                }
                meta={
                  <span className="flex items-center gap-1.5 text-xs text-text/80">
                    <span className="font-mono">{clip.duration}</span>
                  </span>
                }
                overlay={
                  <div className="w-14 h-14 rounded-full bg-void/80 backdrop-blur-sm flex items-center justify-center border border-primary/30 text-primary animate-scale-in">
                    <ArrowRight size={20} />
                  </div>
                }
                onClick={() => window.open(clip.url, '_blank', 'noopener,noreferrer')}
                className="cursor-pointer animate-reveal-up"
                style={{ animationDelay: `${clipDelays[index]}ms` }}
              >
                <div className="absolute bottom-3 left-3">
                  <span className="font-mono text-xs text-text/80 bg-void/80 px-2 py-1 rounded">{clip.duration}</span>
                </div>
              </MediaCard>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Core Pillars — Feature cards with personality */}
      <Section size="loose" background="atmosphere" className="vignette">
        <Container size="lg">
          <Stack gap="md" align="start" className="mb-16">
            <div>
              <Badge variant="outline" size="md" className="mb-4">
                <Crown size={12} /> Core Pillars
              </Badge>
              <h2 className="font-display font-800 text-display-lg text-text">Three paths. One coven.</h2>
              <p className="text-body-lg text-text-muted mt-3 max-w-2xl">
                Each pillar offers a different way to engage. Choose your path or walk them all.
              </p>
            </div>
          </Stack>

          <Grid cols={1} colsMd={3} gap="xl" autoFit minItemWidth="300px">
            <FeatureCard
              layout="vertical"
              icon={<Users size={36} />}
              title="Community"
              description="Share your thoughts, follow fellow travelers, and build your reputation in the coven. Every voice echoes in the dark."
              accent="#A855F7"
              action={
                <Link to="/community">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    Enter Community
                  </Button>
                </Link>
              }
              badge={<Badge variant="glow" size="sm" color="#A855F7"><Sparkles size={10} /> Core</Badge>}
              className="group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 to-transparent" />
            </FeatureCard>

            <FeatureCard
              layout="vertical"
              icon={<Heart size={36} />}
              title="Wishlist"
              description="Browse the curated Amazon wishlist and support the stream. Every gift fuels the content and keeps the coven thriving."
              accent="#F43F5E"
              action={
                <Link to="/wishlist">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    View Wishlist
                  </Button>
                </Link>
              }
              badge={<Badge variant="glow" size="sm" color="#F43F5E"><Crown size={10} /> Support</Badge>}
              className="group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-secondary/10 to-transparent" />
            </FeatureCard>

            <FeatureCard
              layout="vertical"
              icon={<Ghost size={36} />}
              title="Journey"
              description="Track your progress, level up, earn gold, and unlock cosmetics. Your profile tells the story of your path through the veil."
              accent="#FBBF24"
              action={
                <Link to="/profile">
                  <Button variant="primary" icon={<ArrowRight size={16} />}>
                    View Profile
                  </Button>
                </Link>
              }
              badge={<Badge variant="glow" size="sm" color="#FBBF24"><Shield size={10} /> Progress</Badge>}
              className="group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold/10 to-transparent" />
            </FeatureCard>
          </Grid>
        </Container>
      </Section>

      {/* Social Links — Editorial presentation */}
      <Section size="normal" background="none">
        <Container size="lg">
          <Stack gap="md" align="start" className="mb-10">
            <div className="text-center">
              <h2 className="font-display font-700 text-display-md text-text">Find nicotinacat Across the Void</h2>
              <p className="text-body-md text-text-muted mt-2">Each platform offers a different window into the coven</p>
            </div>
          </Stack>

          <Grid cols={1} colsMd={3} gap="lg" autoFit minItemWidth="260px">
            <NavigationCard
              icon={<Twitch size={24} />}
              label="Twitch"
              description="Live streams, VODs, and chat replays"
              accent="#9146FF"
              href={SOCIAL_LINKS.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#9146FF]/10 to-transparent" />
            </NavigationCard>

            <NavigationCard
              icon={<Music2 size={24} />}
              label="TikTok"
              description="Short-form highlights, challenges, and behind-the-scenes"
              accent="#FF0050"
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#FF0050]/10 to-transparent" />
            </NavigationCard>

            <NavigationCard
              icon={<MessageCircle size={24} />}
              label="Discord"
              description="Community chat, announcements, and voice channels"
              accent="#5865F2"
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#5865F2]/10 to-transparent" />
            </NavigationCard>
          </Grid>
        </Container>
      </Section>

      {/* Stats Bar — Subtle credibility */}
      <Section size="tight" background="abyss" divider>
        <Container size="lg">
          <Grid cols={2} colsMd={4} gap="md">
            <StatCard
              layout="horizontal"
              icon={<Zap size={20} />}
              label="Active Members"
              value="1,247"
              accent="#A855F7"
              className="bg-surface/40 backdrop-blur-sm border border-border/50"
            />
            <StatCard
              layout="horizontal"
              icon={<MessageCircle size={20} />}
              label="Posts This Month"
              value="3,892"
              accent="#F43F5E"
              className="bg-surface/40 backdrop-blur-sm border border-border/50"
            />
            <StatCard
              layout="horizontal"
              icon={<Coins size={20} />}
              label="Gold Circulating"
              value="2.4M"
              accent="#FBBF24"
              className="bg-surface/40 backdrop-blur-sm border border-border/50"
            />
            <StatCard
              layout="horizontal"
              icon={<Shield size={20} />}
              label="Active Classes"
              value="6"
              accent="#FBBF24"
              className="bg-surface/40 backdrop-blur-sm border border-border/50"
            />
          </Grid>
        </Container>
      </Section>
    </div>
  );
}