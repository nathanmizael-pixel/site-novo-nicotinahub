import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TikTokPlayerProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: 'portrait' | 'video' | 'square';
}

export function TikTokPlayer({
  videoId,
  title,
  className = '',
  aspectRatio = 'portrait'
}: TikTokPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // postMessage event listener for TikTok player API
  const handleMessage = useCallback((event: MessageEvent) => {
    // Verify origin if needed, TikTok embeds communicate via postMessage
    if (!event.data || typeof event.data !== 'string') {
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        if (data && data.type) {
          switch (data.type) {
            case 'onPlayerReady':
              setIsLoaded(true);
              break;
            case 'onStateChange':
              if (data.state === 'PLAYING' || data.isPlaying === true) setIsPlaying(true);
              if (data.state === 'PAUSED' || data.isPlaying === false) setIsPlaying(false);
              break;
            case 'onCurrentTime':
              if (typeof data.currentTime === 'number') setCurrentTime(data.currentTime);
              break;
            case 'onMute':
              setIsMuted(Boolean(data.isMuted));
              break;
            case 'onPlayerError':
              setHasError(true);
              break;
          }
        }
      } catch {
        // Ignore non-JSON messages from other sources
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
          '*'
        );
      } catch {
        // Fallback if postMessage fails
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

  const aspectStyles = {
    portrait: 'aspect-[9/16]',
    video: 'aspect-video',
    square: 'aspect-square',
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-xl overflow-hidden bg-void border border-border group',
        'shadow-[0_0_24px_rgba(168,85,247,0.1)] hover:border-primary/40 transition-all duration-300',
        aspectStyles[aspectRatio],
        className
      )}
    >
      {!isVisible ? (
        // Placeholder before intersecting viewport
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-abyss text-text-dim">
          <Loader2 size={28} className="animate-spin text-primary/60 mb-2" />
          <span className="text-xs font-mono tracking-wider">NICOTINACAT TIKTOK PLAYER</span>
        </div>
      ) : hasError ? (
        // Error state if embed fails
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-abyss text-danger p-4 text-center">
          <AlertCircle size={32} className="mb-2" />
          <p className="text-xs font-500">Falha ao carregar player do TikTok</p>
          <a
            href={`https://www.tiktok.com/@nicotinaclipes/video/${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-primary-bright underline"
          >
            Abrir diretamente no TikTok ↗
          </a>
        </div>
      ) : (
        <>
          <iframe
            ref={iframeRef}
            src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=0&loop=0&music_info=1&description=1&rel=0`}
            className="w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />

          {/* Loading spinner overlay until loaded */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-void/80 backdrop-blur-sm pointer-events-none">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}

          {/* Custom Nicotinacat Player Shell Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-void/90 via-void/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 flex items-center justify-center text-primary-bright transition-colors"
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-surface/60 hover:bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
                aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-dim">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-full bg-surface/60 hover:bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
                aria-label="Tela cheia"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
