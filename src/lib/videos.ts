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
};

export type VideoFilters = {
  platform?: 'all' | 'twitch' | 'tiktok';
  featured?: boolean;
};

export type VideoSort = 'newest' | 'oldest' | 'most-viewed' | 'featured';

export interface VideosService {
  getAll(filters?: VideoFilters, sort?: VideoSort): Promise<VideoData[]>;
  getFeatured(limit?: number): Promise<VideoData[]>;
  getById(id: string): Promise<VideoData | null>;
  getPlatforms(): string[];
}

const MOCK_VIDEOS: VideoData[] = [
  { id: 'clip_001', title: 'The Play That Broke Chat', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-08', views: 24500, category: 'Gaming', duration: '0:47', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_002', title: 'Rage Quit Compilation', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-07', views: 18200, category: 'Highlights', duration: '2:13', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_003', title: 'When the Deck Draws Perfect', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-06', views: 31000, category: 'Gaming', duration: '1:05', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_004', title: 'Late Night Vibes', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-05', views: 89000, category: 'Chill', duration: '0:30', url: 'https://tiktok.com/@nicotinacat', featured: true },
  { id: 'clip_005', title: 'Speedrun Gone Wrong', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-04', views: 12700, category: 'Speedrun', duration: '3:22', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_006', title: 'TikTok Dance Challenge', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-03', views: 145000, category: 'Dance', duration: '0:15', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_007', title: 'Clutch 1v4 Play', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-02', views: 42100, category: 'Gaming', duration: '0:38', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_008', title: 'Reacting to Your Clips', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-01', views: 19800, category: 'Reaction', duration: '4:55', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_009', title: 'Best Moments This Week', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-31', views: 56300, category: 'Highlights', duration: '8:12', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_010', title: 'Short Compilation', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-30', views: 210000, category: 'Compilation', duration: '0:45', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_011', title: 'New Game First Impressions', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-29', views: 15400, category: 'First Look', duration: '12:30', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_012', title: 'Community Challenge Accepted', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-28', views: 78000, category: 'Challenge', duration: '0:22', url: 'https://tiktok.com/@nicotinacat' },
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

export const videosService: VideosService = {
  async getAll(filters?: VideoFilters, sort?: VideoSort) {
    await new Promise((r) => setTimeout(r, 300));
    const filtered = applyFilters(MOCK_VIDEOS, filters);
    return applySort(filtered, sort);
  },

  async getFeatured(limit = 3) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_VIDEOS.filter((v) => v.featured).slice(0, limit);
  },

  async getById(id: string) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_VIDEOS.find((v) => v.id === id) ?? null;
  },

  getPlatforms() {
    const platforms = new Set(MOCK_VIDEOS.map((v) => v.platform));
    return Array.from(platforms);
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
};