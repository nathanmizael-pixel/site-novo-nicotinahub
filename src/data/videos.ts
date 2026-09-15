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

export const MOCK_VIDEOS: VideoData[] = [
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