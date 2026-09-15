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
              O ponto central da comunidade nicotinacat. Conecte e compartilhe
              em um mundo dark fantasy feito para quem caminha na fronteira entre mundos.
            </p>
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm text-text-muted leading-relaxed font-light">
                oi eu tenho tres gatos<br />
                e uma camiseta do korn :)
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-600 uppercase tracking-wider text-text-muted mb-3">Navegar</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="flex items-center py-2 text-sm text-text hover:text-primary-bright transition-colors">Início</Link></li>
              <li><Link to="/community" className="flex items-center py-2 text-sm text-text hover:text-primary-bright transition-colors">Comunidade</Link></li>
              <li><Link to="/wishlist" className="flex items-center py-2 text-sm text-text hover:text-primary-bright transition-colors">Lista de Desejos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-600 uppercase tracking-wider text-text-muted mb-3">Conectar</h4>
            <ul className="space-y-1">
              <li>
                <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <Twitch size={14} /> Twitch
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <Music2 size={14} /> TikTok
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <MessageCircle size={14} /> Discord
                </a>
              </li>
              <li>
                <Link to="/wishlist" className="flex items-center gap-2 py-2 text-sm text-text hover:text-primary-bright transition-colors">
                  <ShoppingBag size={14} /> Lista de Desejos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-dim">© 2026 nicotinacat. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-text-dim hover:text-text-muted transition-colors">Termos de Serviço</Link>
            <Link to="/privacy" className="text-xs text-text-dim hover:text-text-muted transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}