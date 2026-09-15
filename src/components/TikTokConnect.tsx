import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Music2 } from 'lucide-react';
import { buildTikTokAuthUrl } from '@/lib/tiktok';

interface TikTokConnectProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TikTokConnect({
  variant = 'primary',
  size = 'md',
  className = '',
}: TikTokConnectProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  async function handleConnect() {
    setLoading(true);
    try {
      const authUrl = buildTikTokAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Erro ao iniciar autorização TikTok';
      addToast('error', msg);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      loading={loading}
      icon={!loading ? <Music2 size={18} /> : undefined}
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Conectando...' : 'Conectar TikTok'}
    </Button>
  );
}