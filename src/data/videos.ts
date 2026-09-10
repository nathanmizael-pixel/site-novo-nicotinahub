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

export const VIDEOS: VideoData[] = [
  { id: 'clip_001', title: 'The Play That Broke Chat', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-08', views: 24500, category: 'Gaming', duration: '0:47', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_002', title: 'Rage Quit Compilation', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-07', views: 18200, category: 'Highlights', duration: '2:13', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_003', title: 'When the Deck Draws Perfect', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-06', views: 31000, category: 'Gaming', duration: '1:05', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'clip_004', title: 'Late Night Vibes', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-05', views: 89000, category: 'Chill', duration: '0:30', url: 'https://tiktok.com/@nicotinacat', featured: true },
  { id: 'clip_005', title: 'Speedrun Gone Wrong', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-04', views: 12700, category: 'Speedrun', duration: '3:22', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_006', title: 'TikTok Dance Challenge', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-03', views: 145000, category: 'Dance', duration: '0:15', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_007', title: 'Clutch 1v4 Play', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-02', views: 42100, category: 'Gaming', duration: '0:38', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_008', title: 'Reacting to Your Clips', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-01', views: 19800, category: 'Reaction', duration: '4:55', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_009', title: 'Best Moments This Week', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-31', views: 56300, category: 'Highlights', duration: '8:12', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_009', title: 'Short Compilation', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-30', views: 210000, category: 'Compilation', duration: '0:45', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'clip_011', title: 'New Game First Impressions', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-29', views: 15400, category: 'First Look', duration: '12:30', url: 'https://twitch.tv/nicotinacat' },
  { id: 'clip_012', title: 'Community Challenge Accepted', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-28', views: 78000, category: 'Challenge', duration: '0:22', url: 'https://tiktok.com/@nicotinacat' },
];