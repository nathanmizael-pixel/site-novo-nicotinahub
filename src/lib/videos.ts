import { supabase } from './supabase';
import type { VideoFilters, VideoSort } from './supabase';

export type VideoData = {
  id: string;
  title: string;
  platform: 'twitch' | 'tiktok';
  thumbnail: string;
  author: string;
  date: string;
  views: number;
  category: string;
  duration: string;
  url: string;
  featured?: boolean;
  tiktok_video_id?: string | null;
};

export type { VideoFilters, VideoSort } from './supabase';

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

// Mock data as development fallback
const MOCK_VIDEOS: VideoData[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', title: 'A jogada que quebrou o chat', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-08', views: 24500, category: 'Jogos', duration: '0:47', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', title: 'Compilado de rage quits', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-07', views: 18200, category: 'Destaques', duration: '2:13', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'c3d4e5f6-a7b8-9012-cdef-345678901234', title: 'Quando o deck sai perfeito', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-06', views: 31000, category: 'Jogos', duration: '1:05', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'd4e5f6a7-b8c9-0123-defa-456789012345', title: 'Momentos da madrugada', platform: 'tiktok', thumbnail: '', author: 'nicotinaclipes', date: '2026-09-05', views: 89000, category: 'Relax', duration: '0:30', url: 'https://tiktok.com/@nicotinaclipes', featured: true },
  { id: 'e5f6a7b8-c9d0-1234-efab-567890123456', title: 'Speedrun que deu errado', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-04', views: 12700, category: 'Speedrun', duration: '3:22', url: 'https://twitch.tv/nicotinacat' },
  { id: 'f6a7b8c9-d0e1-2345-fabc-678901234567', title: 'Desafio de dança do TikTok', platform: 'tiktok', thumbnail: '', author: 'nicotinaclipes', date: '2026-09-03', views: 145000, category: 'Dança', duration: '0:15', url: 'https://tiktok.com/@nicotinaclipes' },
  { id: 'a7b8c9d0-e1f2-3456-abcd-789012345678', title: 'Jogada clutch 1v4', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-02', views: 42100, category: 'Jogos', duration: '0:38', url: 'https://twitch.tv/nicotinacat' },
  { id: 'b8c9d0e1-f2a3-4567-bcde-890123456789', title: 'Reagindo aos seus destaques', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-01', views: 19800, category: 'Reação', duration: '4:55', url: 'https://twitch.tv/nicotinacat' },
  { id: 'c9d0e1f2-a3b4-5678-cdef-901234567890', title: 'Melhores momentos da semana', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-31', views: 56300, category: 'Destaques', duration: '8:12', url: 'https://twitch.tv/nicotinacat' },
  { id: 'd0e1f2a3-b4c5-6789-defa-012345678901', title: 'Compilado curto', platform: 'tiktok', thumbnail: '', author: 'nicotinaclipes', date: '2026-08-30', views: 210000, category: 'Compilado', duration: '0:45', url: 'https://tiktok.com/@nicotinaclipes' },
  { id: 'e1f2a3b4-c5d6-7890-efab-123456789012', title: 'Primeiras impressões do novo jogo', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-29', views: 15400, category: 'Primeiro olhar', duration: '12:30', url: 'https://twitch.tv/nicotinacat' },
  { id: 'f2a3b4c5-d6e7-8901-fabc-234567890123', title: 'Desafio da comunidade aceito', platform: 'tiktok', thumbnail: '', author: 'nicotinaclipes', date: '2026-08-28', views: 78000, category: 'Desafio', duration: '0:22', url: 'https://tiktok.com/@nicotinaclipes' },
];

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