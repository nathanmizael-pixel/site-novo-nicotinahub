import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { SkullLogo } from '@/components/SkullLogo';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Container, Section, Cluster } from '@/components/layout/LayoutPrimitives';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { validateState, getRedirectUri } from '@/lib/tiktok';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [status, setStatus] = useState<'validating' | 'exchanging' | 'success' | 'error'>('validating');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription || `TikTok OAuth error: ${error}`);
        addToast('error', `Falha na autorização: ${errorDescription || error}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Parâmetros de callback ausentes (code/state)');
        addToast('error', 'Callback inválido: parâmetros ausentes');
        return;
      }

      if (!validateState(state)) {
        setStatus('error');
        setErrorMessage('State inválido ou expirado. Tente novamente.');
        addToast('error', 'Sessão de autorização inválida. Tente conectar novamente.');
        return;
      }

      // Verify admin user
      if (!isAdmin || !session?.user.id) {
        setStatus('error');
        setErrorMessage('Apenas administradores podem conectar o TikTok editorial.');
        addToast('error', 'Permissão negada: apenas administradores autorizados.');
        return;
      }

      setStatus('exchanging');

      try {
        const redirectUri = getRedirectUri();

        const { data, error } = await supabase.functions.invoke('tiktok-oauth', {
          body: {
            code,
            redirect_uri: redirectUri,
            admin_user_id: session.user.id,
          },
        });

        if (error || !data?.success) {
          throw new Error(data?.error || error?.message || 'Falha na troca do código por tokens');
        }

        setStatus('success');
        addToast('success', `TikTok conectado como @${data.account_username || data.account_display_name || 'usuário'}`);

        setTimeout(() => {
          navigate('/videos');
        }, 2000);
      } catch (err) {
        setStatus('error');
        const msg = err instanceof Error ? err.message : 'Erro desconhecido ao trocar código por tokens';
        setErrorMessage(msg);
        addToast('error', msg);
      }
    }

    handleCallback();
  }, [searchParams, navigate, addToast, session, isAdmin]);

  const renderStatus = () => {
    switch (status) {
      case 'validating':
        return (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-text-muted">Validando autorização...</p>
          </div>
        );
      case 'exchanging':
        return (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <p className="mt-4 text-text-muted">Trocando código por tokens de acesso...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-12 animate-fade-in-up">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 animate-bounce-in" />
            <h2 className="mt-4 font-display font-700 text-text">TikTok Conectado!</h2>
            <p className="mt-2 text-text-muted">Redirecionando para a página de vídeos...</p>
            <Loader2 className="w-8 h-8 mx-auto mt-6 animate-spin text-primary" />
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-12 animate-shake">
            <AlertCircle className="w-16 h-16 mx-auto text-danger animate-bounce-in" />
            <h2 className="mt-4 font-display font-700 text-text">Erro na Autorização</h2>
            <p className="mt-2 text-text-dim max-w-md mx-auto">{errorMessage}</p>
            <Cluster gap="md" justify="center" className="mt-6">
              <Button variant="primary" icon={<ArrowRight size={18} />} onClick={() => navigate('/auth')}>
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => navigate('/videos')}>
                Ir para Vídeos
              </Button>
            </Cluster>
          </div>
        );
    }
  };

  return (
    <Section size="hero" background="atmosphere" className="vignette min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <Container size="sm">
        <div className="relative z-10 w-full">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6 animate-float">
              <SkullLogo size={64} className="relative drop-shadow-[0_0_24px_rgba(168,85,247,0.4)]" />
            </div>
            <h1 className="font-display font-800 text-display-lg text-text">Autorização TikTok</h1>
            <p className="text-body-md text-text-muted mt-2">Conectando sua conta @nicotinaclipes</p>
          </div>

          <Card variant="elevated" padding="lg" radius="xl" className="w-full max-w-md mx-auto">
            {renderStatus()}
          </Card>
        </div>
      </Container>
    </Section>
  );
}