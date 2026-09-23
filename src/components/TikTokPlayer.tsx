import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatSkullIcon } from '@/components/ui/CatSkullIcon';

export interface TikTokPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: 'portrait' | 'video' | 'square';
  priority?: boolean;
  thumbnail?: string;
}

const ASPECT_STYLES: Record<NonNullable<TikTokPlayerProps['aspectRatio']>, string> = {
  portrait: 'aspect-[9/16]',
  video: 'aspect-video',
  square: 'aspect-square',
};

const PLAYER_SRC = (videoId: string) =>
  `https://www.tiktok.com/player/v1/${videoId}?autoplay=0&loop=0&music_info=1&description=1&rel=0`;

function VideoPoster({
  title,
  thumbnail,
  onClick,
}: {
  title: string;
  thumbnail?: string;
  onClick: () => void;
}) {
  const hasThumb = Boolean(thumbnail);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Assistir ${title}`}
      className={cn(
        'absolute inset-0 w-full h-full flex items-center justify-center rounded-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        hasThumb
          ? 'bg-center bg-cover bg-no-repeat'
          : 'bg-gradient-to-br from-primary/15 via-void to-abyss'
      )}
      style={hasThumb ? { backgroundImage: `url("${thumbnail}")` } : undefined}
    >
      <span className="absolute inset-0 pointer-events-none rounded-xl" aria-hidden="true">
        {!hasThumb && (
          <span className="absolute inset-0 flex items-center justify-center opacity-12">
            <CatSkullIcon size={120} />
          </span>
        )}
      </span>

      <span
        className={cn(
          'relative z-10 flex items-center justify-center',
          'w-14 h-14 rounded-full bg-primary text-void shadow-[0_0_16px_rgba(168,85,247,0.45)]',
          'hover:bg-primary-bright hover:scale-105 transition-transform duration-200 motion-reduce'
        )}
        aria-hidden="true"
      >
        <Play size={22} className="ml-0.5" />
      </span>

      <span className="absolute bottom-2 left-0 right-0 text-center">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-tl-sm rounded-br-sm bg-primary/80 text-[9px] font-mono font-600 tracking-wider text-void uppercase">
          tiktok
        </span>
      </span>
    </button>
  );
}

function ErrorState({ videoId }: { videoId: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-abyss text-danger p-4 text-center rounded-xl">
      <AlertCircle size={32} className="mb-2" />
      <p className="text-xs font-500">Falha ao carregar player do TikTok</p>
      <a
        href={`https://www.tiktok.com/@nicotinaclipes/video/${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-xs text-primary underline"
      >
        Abrir diretamente no TikTok ↗
      </a>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-void/70 backdrop-blur-sm rounded-xl">
      <Loader2 size={24} className="animate-spin text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
    </div>
  );
}

function ControlsOverlay({
  isPlaying,
  isMuted,
  currentTime,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  alwaysVisible,
}: {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  alwaysVisible: boolean;
}) {
  const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');
  const minutes = pad(currentTime / 60);
  const seconds = pad(currentTime % 60);

  const baseBtn =
    'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:scale-105 motion-reduce';

  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5',
        'bg-gradient-to-t from-black/65 via-black/30 to-transparent',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200 motion-reduce',
        alwaysVisible && 'opacity-100 group-hover:opacity-100',
      )}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onTogglePlay}
          className={cn(baseBtn, 'bg-primary/25 border border-primary/40 text-white hover:bg-primary/40')}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={onToggleMute}
          className={cn(baseBtn, 'bg-white/15 border border-border text-white hover:bg-white/25')}
          aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-white/80">{minutes}:{seconds}</span>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={cn(baseBtn, 'bg-white/15 border border-border text-white hover:bg-white/25')}
          aria-label="Tela cheia"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
}

export function TikTokPlayer({
  videoId,
  title,
  className = '',
  aspectRatio = 'portrait',
  priority = false,
  thumbnail = '',
}: TikTokPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showIframe, setShowIframe] = useState(priority);

  useEffect(() => {
    if (!priority || showIframe) return;

    const node = containerRef.current;
    if (!node) return;

    const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setShowIframe(true);
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.1,
      rootMargin: '400px',
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [priority, showIframe]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== 'https://www.tiktok.com') return;
    if (!event.data) return;

    let data: unknown;
    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    if (data && typeof data === 'object' && 'type' in (data as Record<string, unknown>)) {
      const d = data as Record<string, unknown>;
      switch (d.type) {
        case 'onPlayerReady':
          setIsLoaded(true);
          break;
        case 'onStateChange':
          if (d.state === 'PLAYING' || d.isPlaying === true) setIsPlaying(true);
          if (d.state === 'PAUSED' || d.isPlaying === false) setIsPlaying(false);
          break;
        case 'onCurrentTime':
          if (typeof d.currentTime === 'number') setCurrentTime(d.currentTime);
          break;
        case 'onMute':
          setIsMuted(Boolean(d.isMuted));
          break;
        case 'onPlayerError':
          setHasError(true);
          break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const sendCommand = (action: string, value?: unknown) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ type: 'command', func: action, args: value !== undefined ? [value] : [] }),
          'https://www.tiktok.com'
        );
      } catch {
        // cross-origin postMessage can fail silently in some browsers
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      sendCommand('pause');
      setIsPlaying(false);
    } else {
      sendCommand('play');
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handlePosterClick = () => {
    setShowIframe(true);
  };

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative w-full overflow-hidden rounded-xl',
          ASPECT_STYLES[aspectRatio],
          className
        )}
      >
        <ErrorState videoId={videoId} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-xl group',
        ASPECT_STYLES[aspectRatio],
        className
      )}
    >
      {!showIframe ? (
        <VideoPoster title={title} thumbnail={thumbnail} onClick={handlePosterClick} />
      ) : (
        <>
          <iframe
            ref={iframeRef}
            src={PLAYER_SRC(videoId)}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />

          {!isLoaded && <LoadingOverlay />}

          <ControlsOverlay
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentTime={currentTime}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onToggleFullscreen={toggleFullscreen}
            alwaysVisible={priority}
          />
        </>
      )}
    </div>
  );
}
