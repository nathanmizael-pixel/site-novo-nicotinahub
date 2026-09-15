import { useState, useEffect } from 'react';
import { supabase, type WishlistItem } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Section, Container, Stack } from '@/components/layout/LayoutPrimitives';
import { SOCIAL_LINKS } from '@/data/core';
import { Heart, ShoppingBag, ExternalLink, Package } from 'lucide-react';

export function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('wishlist_items')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      setItems(data as WishlistItem[] || []);
      setLoading(false);
    })();
  }, []);

  return (
    <Section size="normal" background="atmosphere" className="vignette min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <Container size="xl">
        <Stack gap="sm" align="center" className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Heart size={14} className="text-primary" />
            <span className="font-display font-600 text-sm text-text">Lista Curada</span>
          </div>
          <h1 className="font-display font-800 text-display-lg text-text">Lista de Desejos</h1>
          <p className="text-body-md text-text-muted max-w-xl">
            Itens selecionados para a transmissão. Cada presente mantém o vórtice aberto.
          </p>
        </Stack>

        <div className="text-center mb-12">
          <a href={SOCIAL_LINKS.amazon} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg" icon={<ShoppingBag size={18} />} className="min-h-[44px]">
              Ver lista na Amazon
            </Button>
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Carregando itens">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="h-48 rounded-lg animate-shimmer" style={{ animationDelay: `${i * 60}ms` }} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="A forja está fria."
            description="Itens sendo escolhidos a dedo."
            icon={<Heart size={48} className="text-primary/50" />}
            className="py-16 animate-fade-in-up"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-slate to-abyss flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 hex-pattern opacity-20" />
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Package size={40} className="text-text-dim group-hover:text-primary transition-colors" />
                  )}
                  {item.status === 'fulfilled' && (
                    <div className="absolute top-2 right-2">
                      <Badge color="#22C55E" size="sm">Presenteado</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-600 text-sm text-text mb-1 line-clamp-1">{item.name}</h3>
                  {item.category && <p className="text-xs text-text-dim mb-2">{item.category}</p>}
                  <div className="flex items-center justify-between">
                    {item.price && <span className="text-sm font-display font-700 text-primary-bright">{item.price}</span>}
                    <a href={item.link || SOCIAL_LINKS.amazon} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-primary-bright flex items-center gap-1">
                      Ver <ExternalLink size={10} />
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