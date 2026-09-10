import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { SkullLogo } from '@/components/SkullLogo';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Mail, Lock, User, AtSign } from 'lucide-react';
import { usePageEntry } from '@/hooks/useMotion';
import { Container, Section, Stack } from '@/components/layout/LayoutPrimitives';
import { Card } from '@/components/ui/Card';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isPageVisible = usePageEntry(0);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (form.username.length < 3) {
        setError('O nome de usuário deve ter pelo menos 3 caracteres');
        setLoading(false);
        return;
      }
      if (form.displayName.length < 2) {
        setError('O nome de exibição deve ter pelo menos 2 caracteres');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(form.email, form.password, form.username, form.displayName);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      addToast('success', 'Bem-vindo à nicotinacat. Sua jornada começa.');
      navigate('/');
    } else {
      const { error: err } = await signIn(form.email, form.password);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      addToast('success', 'Bem-vindo de volta.');
      navigate('/');
    }
    setLoading(false);
  }

  return (
    <Section size="hero" background="atmosphere" className="vignette min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <Container size="sm">
        <div className="relative z-10 w-full">
          <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: isPageVisible ? '0ms' : '200ms' }}>
            <div className="flex justify-center mb-6 animate-float">
              <SkullLogo size={64} className="relative drop-shadow-[0_0_24px_rgba(168,85,247,0.4)]" />
            </div>

            <h1 className="font-display font-800 text-display-lg text-text mb-2 animate-reveal-up" style={{ animationDelay: '100ms' }}>
              {mode === 'login' ? 'Bem-vindo de Volta' : 'Entre na nicotinacat'}
            </h1>
            <p className="text-body-md text-text-muted animate-reveal-up" style={{ animationDelay: '200ms' }}>
              {mode === 'login' ? 'Entre para continuar sua jornada' : 'Crie sua conta e comece'}
            </p>
          </div>

          <Card variant="elevated" padding="lg" radius="xl" className="animate-reveal-up w-full max-w-sm mx-auto" style={{ animationDelay: '300ms' }}>
            <Stack gap="md" align="start" className="mb-6">
              <div className="flex gap-1 w-full p-1 bg-abyss rounded-lg border border-border">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 text-sm font-600 rounded-md transition-all ${mode === 'login' ? 'bg-primary/15 text-primary-bright shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-600 rounded-md transition-all ${mode === 'signup' ? 'bg-primary/15 text-primary-bright shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  Cadastrar
                </button>
              </div>
            </Stack>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Stack gap="md">
                  <div className="relative">
                    <label className="block text-label-sm text-text-muted mb-2">Nome de Exibição</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                      <input
                        type="text"
                        placeholder="Seu nome na nicotinacat"
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-label-sm text-text-muted mb-2">Nome de Usuário</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                      <input
                        type="text"
                        placeholder="seu_usuario"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </Stack>
              )}

              <Stack gap="md">
                <div className="relative">
                  <label className="block text-label-sm text-text-muted mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                      type="email"
                      placeholder="voce@dominio.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-label-sm text-text-muted mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                    />
                  </div>
                </div>
              </Stack>

              {error && (
                <div className="px-4 py-3 bg-danger/10 border border-danger/30 rounded-lg text-sm text-danger animate-shake">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                icon={!loading ? <ArrowRight size={18} /> : undefined}
              >
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            <p className="text-xs text-text-dim text-center mt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              Ao continuar, você concorda com os{' '}
              <Link to="/terms" className="text-primary-bright hover:underline font-500">Termos</Link>
              {' '}e a{' '}
              <Link to="/privacy" className="text-primary-bright hover:underline font-500">Política de Privacidade</Link>
            </p>
          </Card>

          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-sm text-text-muted">
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
              {' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary-bright hover:text-primary font-600 ml-1 transition-colors"
              >
                {mode === 'login' ? 'Cadastrar' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}