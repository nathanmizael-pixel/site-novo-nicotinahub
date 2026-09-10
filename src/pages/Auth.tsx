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
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }
      if (form.displayName.length < 2) {
        setError('Display name must be at least 2 characters');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(form.email, form.password, form.username, form.displayName);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      addToast('success', 'Welcome to the Hub. Your journey begins.');
      navigate('/');
    } else {
      const { error: err } = await signIn(form.email, form.password);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      addToast('success', 'Welcome back.');
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
              {mode === 'login' ? 'Welcome Back' : 'Join the Hub'}
            </h1>
            <p className="text-body-md text-text-muted animate-reveal-up" style={{ animationDelay: '200ms' }}>
              {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account and begin'}
            </p>
          </div>

          <Card variant="elevated" padding="lg" radius="xl" className="animate-reveal-up w-full max-w-sm mx-auto" style={{ animationDelay: '300ms' }}>
            <Stack gap="md" align="start" className="mb-6">
              <div className="flex gap-1 w-full p-1 bg-abyss rounded-lg border border-border">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 text-sm font-600 rounded-md transition-all ${mode === 'login' ? 'bg-primary/15 text-primary-bright shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-600 rounded-md transition-all ${mode === 'signup' ? 'bg-primary/15 text-primary-bright shadow-sm' : 'text-text-muted hover:text-text'}`}
                >
                  Sign Up
                </button>
              </div>
            </Stack>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Stack gap="md">
                  <div className="relative">
                    <label className="block text-label-sm text-text-muted mb-2">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                      <input
                        type="text"
                        placeholder="Your name in the Hub"
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-label-sm text-text-muted mb-2">Username</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                      <input
                        type="text"
                        placeholder="your_username"
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
                  <label className="block text-label-sm text-text-muted mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-abyss border border-border rounded-lg text-text placeholder:text-text-dim text-sm transition-all duration-200 focus:border-primary/50 focus:shadow-glow-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-label-sm text-text-muted mb-2">Password</label>
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
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <p className="text-xs text-text-dim text-center mt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              By continuing, you agree to the{' '}
              <Link to="/terms" className="text-primary-bright hover:underline font-500">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-bright hover:underline font-500">Privacy Policy</Link>
            </p>
          </Card>

          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-sm text-text-muted">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary-bright hover:text-primary font-600 ml-1 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}