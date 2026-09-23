import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type WishlistItem } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Section, Container, Stack } from '@/components/layout/LayoutPrimitives';
import { SOCIAL_LINKS } from '@/data/social';
import { Heart, ShoppingBag, ExternalLink, Package } from 'lucide-react';

export function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('wishlist_items')
          .select('*')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });

        if (cancelled) return;

        setItems((data as WishlistItem[] | null) ?? []);
        setError(queryError ? 'Não foi possível carregar a Wishlist.' : null);
      } catch {
        if (!cancelled) {
          setItems([]);
          setError('Não foi possível carregar a Wishlist.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section size="tight" background="atmosphere" className="vignette min-h-screen py-6 md:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Container size="xl">
        <Stack gap="xs" align="center" className="mb-8 text-center animate-fade-in-up">
          <h1 className="font-display font-800 text-display-lg text-text">Wishlist</h1>
          <p className="text-body-md text-text-muted max-w-xl">
            Itens selecionados para apoiar a transmissão.
          </p>
        </Stack>

        <div className="text-center mb-8">
          <Link to="/wishlist" className="inline-flex">
            <Button variant="primary" size="lg" icon={<ShoppingBag size={18} />} className="min-h-[44px]">
              Ver Wishlist
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="status" aria-label="Carregando itens">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} className="h-40 rounded-lg animate-shimmer" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="A wishlist ficou indisponível."
            description="Tente novamente em instantes."
            icon={<Heart size={48} className="text-primary/50" />}
            className="py-12 animate-fade-in-up"
          />
        ) : items.length === 0 ? (
          <EmptyState
            title="A forja está fria."
            description="Itens sendo escolhidos a dedo."
            icon={<Heart size={48} className="text-primary/50" />}
            className="py-12 animate-fade-in-up"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden group" hover>
                <div className="aspect-square bg-gradient-to-br from-slate to-abyss flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 hex-pattern opacity-20" />
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Package size={40} className="text-text-dim group-hover:text-primary transition-colors" />
                  )}
                  {item.status === 'fulfilled' && (
                    <div className="absolute top-2 right-2">
                      <Badge color="#22C55E" size="sm">Presenteado</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-600 text-sm text-text mb-1 line-clamp-1">{item.name}</h3>
                  {item.category && <p className="text-xs text-text-dim mb-2">{item.category}</p>}
                  <div className="flex items-center justify-between gap-2">
                    {item.price && <span className="text-sm font-display font-700 text-primary-bright">{item.price}</span>}
                    <a
                      href={item.link || SOCIAL_LINKS.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-muted hover:text-primary-bright flex items-center gap-1 shrink-0"
                    >
                      Ver produto <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
