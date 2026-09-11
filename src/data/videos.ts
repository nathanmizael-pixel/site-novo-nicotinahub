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
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', title: 'The Play That Broke Chat', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-08', views: 24500, category: 'Gaming', duration: '0:47', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', title: 'Rage Quit Compilation', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-07', views: 18200, category: 'Highlights', duration: '2:13', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'c3d4e5f6-a7b8-9012-cdef-345678901234', title: 'When the Deck Draws Perfect', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-06', views: 31000, category: 'Gaming', duration: '1:05', url: 'https://twitch.tv/nicotinacat', featured: true },
  { id: 'd4e5f6a7-b8c9-0123-defa-456789012345', title: 'Late Night Vibes', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-05', views: 89000, category: 'Chill', duration: '0:30', url: 'https://tiktok.com/@nicotinacat', featured: true },
  { id: 'e5f6a7b8-c9d0-1234-efab-567890123456', title: 'Speedrun Gone Wrong', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-04', views: 12700, category: 'Speedrun', duration: '3:22', url: 'https://twitch.tv/nicotinacat' },
  { id: 'f6a7b8c9-d0e1-2345-fabc-678901234567', title: 'TikTok Dance Challenge', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-09-03', views: 145000, category: 'Dance', duration: '0:15', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'a7b8c9d0-e1f2-3456-abcd-789012345678', title: 'Clutch 1v4 Play', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-02', views: 42100, category: 'Gaming', duration: '0:38', url: 'https://twitch.tv/nicotinacat' },
  { id: 'b8c9d0e1-f2a3-4567-bcde-890123456789', title: 'Reacting to Your Clips', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-09-01', views: 19800, category: 'Reaction', duration: '4:55', url: 'https://twitch.tv/nicotinacat' },
  { id: 'c9d0e1f2-a3b4-5678-cdef-901234567890', title: 'Best Moments This Week', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-31', views: 56300, category: 'Highlights', duration: '8:12', url: 'https://twitch.tv/nicotinacat' },
  { id: 'd0e1f2a3-b4c5-6789-defa-012345678901', title: 'Short Compilation', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-30', views: 210000, category: 'Compilation', duration: '0:45', url: 'https://tiktok.com/@nicotinacat' },
  { id: 'e1f2a3b4-c5d6-7890-efab-123456789012', title: 'New Game First Impressions', platform: 'twitch', thumbnail: '', author: 'nicotinacat', date: '2026-08-29', views: 15400, category: 'First Look', duration: '12:30', url: 'https://twitch.tv/nicotinacat' },
  { id: 'f2a3b4c5-d6e7-8901-fabc-234567890123', title: 'Community Challenge Accepted', platform: 'tiktok', thumbnail: '', author: 'nicotinacat', date: '2026-08-28', views: 78000, category: 'Challenge', duration: '0:22', url: 'https://tiktok.com/@nicotinacat' },
];