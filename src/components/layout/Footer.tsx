import { Link } from 'react-router-dom';
import { SkullLogo } from '@/components/SkullLogo';
import { Twitch, Music2, MessageCircle, ShoppingBag } from 'lucide-react';
import { SOCIAL_LINKS } from '@/data/core';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-abyss/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <SkullLogo size={28} />
              <span className="font-display font-700 text-lg tracking-wider text-text">nicotinacat</span>
            </div>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              The central hub of the nicotinacat community. Connect and share
              in a dark fantasy world built for those who walk the edge between worlds.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-600 uppercase tracking-wider text-text-muted mb-3">Navigate</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-text hover:text-primary-bright transition-colors">Home</Link></li>
              <li><Link to="/community" className="text-sm text-text hover:text-primary-bright transition-colors">Community</Link></li>
              <li><Link to="/wishlist" className="text-sm text-text hover:text-primary-bright transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-600 uppercase tracking-wider text-text-muted mb-3">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <Twitch size={14} /> Twitch
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <Music2 size={14} /> TikTok
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <MessageCircle size={14} /> Discord
                </a>
              </li>
              <li>
                <Link to="/wishlist" className="flex items-center gap-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <ShoppingBag size={14} /> Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-dim">© 2026 nicotinacat Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-text-dim hover:text-text-muted transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-xs text-text-dim hover:text-text-muted transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
