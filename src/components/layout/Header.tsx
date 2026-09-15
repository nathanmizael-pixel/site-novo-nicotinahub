import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SkullLogo } from '@/components/SkullLogo';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Home, Heart, Users, Bell, Menu, X, Film, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/videos', label: 'Vídeos', icon: Film },
  { path: '/community', label: 'Comunidade', icon: Users },
  { path: '/wishlist', label: 'Lista de Desejos', icon: Heart },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; content: string; type: string; read: boolean; created_at: string; actor?: Array<{ display_name: string; avatar_url: string }> | null }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  }

useEffect(() => {
    if (session) {
      supabase
        .from('notifications')
        .select('id, content, type, read, created_at, actor:profiles!notifications_actor_id_fkey(display_name, avatar_url)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) {
            setNotifications(data as Array<{ id: string; content: string; type: string; read: boolean; created_at: string; actor?: Array<{ display_name: string; avatar_url: string }> | null }>);
            setUnreadCount(data.filter((n) => !n.read).length);
          }
        });
    }
  }, [session, location.pathname]);

  async function markAllRead() {
    if (!session) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', session.user.id).eq('read', false);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-void/85 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <SkullLogo size={32} className="transition-transform group-hover:scale-110" />
              <span className="font-display font-700 text-lg tracking-wider text-text hidden sm:block">
                nicotinacat
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm font-500 rounded-md transition-all duration-200 min-h-[44px] ${
                      active
                        ? 'text-primary-bright bg-primary/10 border border-primary/20'
                        : 'text-text-muted hover:text-text hover:bg-surface/50'
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {session ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                      className="relative p-2 text-text-muted hover:text-text rounded-md hover:bg-surface/50 transition-all"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
                      )}
                    </button>
                    {notifOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-80 card-elevated rounded-lg shadow-elevated border border-border z-50 animate-fade-in-up">
                          <div className="px-4 py-3 border-b border-border">
                            <h3 className="font-display font-600 text-sm text-text">Notificações</h3>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="px-4 py-8 text-center text-sm text-text-muted">Nenhuma notificação ainda</p>
                            ) : (
                              notifications.map((n) => (
                                <div key={n.id} className="px-4 py-3 border-b border-border/50 hover:bg-surface/50 transition-colors">
                                  <p className="text-sm text-text">{n.content || 'Nova atividade na comunidade'}</p>
                                  <p className="text-xs text-text-dim mt-0.5">{timeAgo(n.created_at)}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-md hover:bg-surface/50 transition-all"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <Avatar profile={profile} size="sm" />
                    </button>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-48 card-elevated rounded-lg shadow-elevated border border-border z-50 animate-fade-in-up overflow-hidden">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-500 text-text hover:bg-surface/50 transition-colors"
                          >
                            <User size={16} />
                            Meu perfil
                          </Link>
                          <div className="border-t border-border/50" />
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-500 text-danger hover:bg-danger/10 transition-colors text-left"
                          >
                            <LogOut size={16} />
                            Sair
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-600 bg-primary text-void rounded-md hover:bg-primary-bright transition-all shadow-glow-sm clip-corner-sm"
                >
                  Entrar
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-3 text-text-muted hover:text-text min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-void/95 backdrop-blur-lg animate-fade-in">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-500 rounded-md transition-all min-h-[44px] ${
                      active ? 'text-primary-bright bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface/50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              {session && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-500 rounded-md transition-all min-h-[44px] ${
                      location.pathname === '/profile' ? 'text-primary-bright bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface/50'
                    }`}
                  >
                    <Avatar profile={profile} size="xs" />
                    Perfil
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-500 rounded-md transition-all min-h-[44px] text-danger hover:bg-danger/10 w-full text-left"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
