import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SkullLogo } from '@/components/SkullLogo';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Home, Radio, Film, Gamepad2, Heart, Users, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { supabase, type Notification } from '@/lib/supabase';
import { useEffect } from 'react';
import { timeAgo } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/live', label: 'Live', icon: Radio },
  { path: '/clips', label: 'Clips', icon: Film },
  { path: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/community', label: 'Community', icon: Users },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session) {
      supabase
        .from('notifications')
        .select('*, actor:profiles!notifications_actor_id_fkey(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) {
            setNotifications(data as unknown as Notification[]);
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
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-500 rounded-md transition-all duration-200 ${
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
                            <h3 className="font-display font-600 text-sm text-text">Notifications</h3>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="px-4 py-8 text-center text-sm text-text-muted">No notifications yet</p>
                            ) : (
                              notifications.map((n) => (
                                <div key={n.id} className="px-4 py-3 border-b border-border/50 hover:bg-surface/50 transition-colors">
                                  <p className="text-sm text-text">{n.content || `${n.type} notification`}</p>
                                  <p className="text-xs text-text-dim mt-0.5">{timeAgo(n.created_at)}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <Link to="/profile" className="flex items-center gap-2 p-1 rounded-md hover:bg-surface/50 transition-all">
                    <Avatar profile={profile} size="sm" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-600 bg-primary text-void rounded-md hover:bg-primary-bright transition-all shadow-glow-sm clip-corner-sm"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-text-muted hover:text-text"
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
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-500 rounded-md transition-all ${
                      active ? 'text-primary-bright bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface/50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              {session && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-500 rounded-md transition-all ${
                    location.pathname === '/profile' ? 'text-primary-bright bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface/50'
                  }`}
                >
                  <Avatar profile={profile} size="xs" />
                  Profile
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
