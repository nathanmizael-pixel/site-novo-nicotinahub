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
}

export type SyncResult = {
  success: boolean;
  synced: number;
  errors: string[];
  last_sync_at: string;
};

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
  return {
    id: video.id as string,
    title: video.title as string,
    platform,
    thumbnail: video.thumbnail_url as string,
    author: platform === 'tiktok' ? 'nicotinaclipes' : 'nicotinacat',
    date: new Date(video.published_at as string).toISOString().split('T')[0],
    views: video.views as number,
    category: video.category as string,
    duration: video.duration as string,
    url: video.video_url as string,
    featured: video.featured as boolean,
    tiktok_video_id: video.tiktok_video_id as string | null,
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
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-tiktok`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync failed: ${response.status} ${errorText}`);
    }

    return response.json();
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
};