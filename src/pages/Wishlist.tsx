import { useState, useEffect } from 'react';
import { supabase, type WishlistItem } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Heart size={28} className="text-primary" />
          <h1 className="font-display font-700 text-3xl text-text">Lista de Desejos</h1>
        </div>
        <p className="text-sm text-text-muted max-w-lg mx-auto">
          Apoie a nicotinacat presenteando itens da lista de desejos da Amazon. Cada presente ajuda a manter a transmissão e a comunidade vivas.
        </p>
      </div>

      <div className="text-center mb-8">
        <a href={SOCIAL_LINKS.amazon} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg" icon={<ShoppingBag size={18} />}>
            Ver lista de desejos na Amazon
          </Button>
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Lista de desejos em breve"
          description="Os itens estão sendo selecionados. Enquanto isso, confira diretamente a lista de desejos da Amazon."
          icon={<Heart size={48} />}
          action={
            <a href={SOCIAL_LINKS.amazon} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" icon={<ExternalLink size={16} />}>Ir para a lista da Amazon</Button>
            </a>
          }
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
    </div>
  );
}
