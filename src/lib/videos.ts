import { supabase } from './supabase';
import type { VideoFilters, VideoSort } from './supabase';
import { MOCK_VIDEOS, type VideoData } from '@/data/videos';

export type { VideoFilters, VideoSort } from './supabase';
export type { VideoData } from '@/data/videos';

export interface VideosService {
  getAll(filters?: VideoFilters, sort?: VideoSort): Promise<VideoData[]>;
  getFeatured(limit?: number): Promise<VideoData[]>;
  getById(id: string): Promise<VideoData | null>;
  getPlatforms(): string[];
  syncTikTokVideos(): Promise<SyncResult>;
  addTikTokVideo(input: {
    url: string;
    title?: string;
    category?: string;
    duration?: string;
    featured?: boolean;
  }): Promise<{ success: boolean; error?: string; video?: VideoData }>;
}

export type SyncResult = {
  success: boolean;
  synced: number;
  total?: number;
  new_count?: number;
  updated_count?: number;
  errors: string[];
  last_sync_at: string;
};

export function parseTikTokUrl(urlStr: string): { success: boolean; videoId?: string; error?: string } {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.endsWith('tiktok.com') && hostname !== 'tiktok.com') {
      return { success: false, error: 'URL inválida: deve pertencer a tiktok.com' };
    }

    const path = parsed.pathname;

    // Check /video/{ID} format
    const videoMatch = path.match(/\/video\/(\d+)/);
    if (videoMatch && videoMatch[1]) {
      return { success: true, videoId: videoMatch[1] };
    }

    // Check short link format like vm.tiktok.com/{ID} or vt.tiktok.com/{ID}
    const shortMatch = path.match(/^\/([0-9]{10,25})/);
    if (shortMatch && shortMatch[1]) {
      return { success: true, videoId: shortMatch[1] };
    }

    // General numeric ID fallback in pathname
    const numMatch = path.match(/(\d{15,25})/);
    if (numMatch && numMatch[1]) {
      return { success: true, videoId: numMatch[1] };
    }

    return { success: false, error: 'URL do TikTok não contém um ID numérico de vídeo válido (ex: /video/{ID})' };
  } catch {
    return { success: false, error: 'URL inválida ou malformada' };
  }
}

function applyFilters(videos: VideoData[], filters?: VideoFilters): VideoData[] {
  if (!filters) return videos;
  return videos.filter((v) => {
    if (filters.platform && filters.platform !== 'all' && v.platform !== filters.platform) return false;
    if (filters.featured !== undefined && v.featured !== filters.featured) return false;
    return true;
  });
}

function applySort(videos: VideoData[], sort?: VideoSort): VideoData[] {
  if (!sort) return videos;
  const sorted = [...videos];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'most-viewed':
      return sorted.sort((a, b) => b.views - a.views);
    case 'featured':
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    default:
      return sorted;
  }
}

function mapSupabaseToVideoData(video: Record<string, unknown>): VideoData {
  const platform = video.platform as 'twitch' | 'tiktok';
  const tiktokVideoId = video.tiktok_video_id as string | null;
  return {
    id: video.id as string,
    title: video.title as string,
    platform,
    thumbnail: (video.thumbnail_url as string) || (tiktokVideoId ? `https://www.tiktok.com/player/v1/${tiktokVideoId}` : ''),
    author: platform === 'tiktok' ? 'nicotinaclipes' : 'nicotinacat',
    date: new Date((video.published_at as string) || Date.now()).toISOString().split('T')[0],
    views: (video.views as number) || 0,
    category: (video.category as string) || 'TikTok',
    duration: (video.duration as string) || '0:30',
    url: (video.video_url as string) || (tiktokVideoId ? `https://www.tiktok.com/@nicotinaclipes/video/${tiktokVideoId}` : 'https://tiktok.com'),
    featured: Boolean(video.featured),
    tiktok_video_id: tiktokVideoId,
  };
}

function isSupabaseExplicitlyConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

async function isSupabaseAccessible(): Promise<boolean> {
  try {
    const { error } = await supabase.from('videos').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

async function isSupabaseConfiguredAndAccessible(): Promise<boolean> {
  if (!isSupabaseExplicitlyConfigured()) return false;
  return isSupabaseAccessible();
}

function fallbackGetAll(filters?: VideoFilters, sort?: VideoSort): VideoData[] {
  const filtered = applyFilters(MOCK_VIDEOS, filters);
  return applySort(filtered, sort);
}

function fallbackGetFeatured(limit = 3): VideoData[] {
  return MOCK_VIDEOS.filter((v) => v.featured).slice(0, limit);
}

function fallbackGetById(id: string): VideoData | null {
  return MOCK_VIDEOS.find((v) => v.id === id) ?? null;
}

export const videosService = {
  async getAll(filters?: VideoFilters, sort?: VideoSort): Promise<VideoData[]> {
    if (await isSupabaseConfiguredAndAccessible()) {
      try {
        let query = supabase.from('videos').select('*');

        if (filters?.platform && filters.platform !== 'all') {
          query = query.eq('platform', filters.platform);
        }
        if (filters?.featured !== undefined) {
          query = query.eq('featured', filters.featured);
        }

        switch (sort) {
          case 'newest':
            query = query.order('published_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('published_at', { ascending: true });
            break;
          case 'most-viewed':
            query = query.order('views', { ascending: false });
            break;
          case 'featured':
            query = query.order('featured', { ascending: false });
            break;
          default:
            query = query.order('published_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(`Falha na consulta ao Supabase: ${error.message}`);
        }

        return (data || []).map(mapSupabaseToVideoData);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Erro desconhecido no Supabase');
      }
    }

    return fallbackGetAll(filters, sort);
  },

  async getFeatured(limit = 3): Promise<VideoData[]> {
    if (await isSupabaseConfiguredAndAccessible()) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('featured', true)
          .order('published_at', { ascending: false })
          .limit(limit);

        if (error) {
          throw new Error(`Falha na consulta ao Supabase: ${error.message}`);
        }

        return (data || []).map(mapSupabaseToVideoData);
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Erro desconhecido no Supabase');
      }
    }

    return fallbackGetFeatured(limit);
  },

  async getById(id: string): Promise<VideoData | null> {
    if (await isSupabaseConfiguredAndAccessible()) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return null; // Not found
          }
          throw new Error(`Falha na consulta ao Supabase: ${error.message}`);
        }

        return data ? mapSupabaseToVideoData(data) : null;
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Erro desconhecido no Supabase');
      }
    }

    return fallbackGetById(id);
  },

  getPlatforms(): string[] {
    return ['twitch', 'tiktok'];
  },

  async syncTikTokVideos(): Promise<SyncResult> {
    const { data, error } = await supabase.functions.invoke('sync-tiktok', {
      body: {},
    });

    if (error) {
      throw new Error(`Sync failed: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('Sync failed: No response data returned from function');
    }

    return data as SyncResult;
  },

  async addTikTokVideo(input: {
    url: string;
    title?: string;
    category?: string;
    duration?: string;
    featured?: boolean;
  }): Promise<{ success: boolean; error?: string; video?: VideoData }> {
    const validation = parseTikTokUrl(input.url);
    if (!validation.success || !validation.videoId) {
      return { success: false, error: validation.error || 'URL do TikTok inválida' };
    }

    const videoId = validation.videoId;
    const title = input.title?.trim() || `Vídeo TikTok #${videoId.slice(-4)}`;
    const category = input.category?.trim() || 'TikTok';
    const duration = input.duration?.trim() || '0:30';
    const featured = Boolean(input.featured);

    if (await isSupabaseConfiguredAndAccessible()) {
      try {
        const { data, error } = await supabase
          .from('videos')
          .insert({
            title,
            platform: 'tiktok',
            video_url: input.url,
            tiktok_video_id: videoId,
            thumbnail_url: '',
            category,
            duration,
            views: 0,
            featured,
            published_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          return { success: false, error: `Erro ao salvar no Supabase: ${error.message}` };
        }

        return { success: true, video: mapSupabaseToVideoData(data) };
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
      }
    } else {
      const newVideo: VideoData = {
        id: `local-tiktok-${Date.now()}`,
        title,
        platform: 'tiktok',
        thumbnail: '',
        author: 'nicotinaclipes',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        category,
        duration,
        url: input.url,
        featured,
        tiktok_video_id: videoId,
      };
      MOCK_VIDEOS.unshift(newVideo);
      return { success: true, video: newVideo };
    }
  },
};

export const videosRepository = {
  async findAll(filters?: VideoFilters, sort?: VideoSort) {
    return videosService.getAll(filters, sort);
  },
  async findFeatured(limit?: number) {
    return videosService.getFeatured(limit);
  },
  async findById(id: string) {
    return videosService.getById(id);
  },
  async syncTikTok() {
    return videosService.syncTikTokVideos();
  },
  async addTikTokVideo(input: {
    url: string;
    title?: string;
    category?: string;
    duration?: string;
    featured?: boolean;
  }) {
    return videosService.addTikTokVideo(input);
  },
};
