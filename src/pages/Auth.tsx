import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { SkullLogo } from '@/components/SkullLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 animate-float">
            <SkullLogo size={56} />
          </div>
          <h1 className="font-display font-700 text-2xl text-text">
            {mode === 'login' ? 'Welcome Back' : 'Join the Hub'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account and begin'}
          </p>
        </div>

        <div className="card-elevated rounded-xl p-6 border-glow">
          <div className="flex gap-1 mb-6 p-1 bg-abyss rounded-md border border-border">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-600 rounded transition-all ${mode === 'login' ? 'bg-primary/15 text-primary-bright' : 'text-text-muted hover:text-text'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-600 rounded transition-all ${mode === 'signup' ? 'bg-primary/15 text-primary-bright' : 'text-text-muted hover:text-text'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <Input
                    label="Display Name"
                    placeholder="Your name in the Hub"
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Username"
                    placeholder="your_username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="you@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="px-3 py-2 bg-danger/10 border border-danger/30 rounded-md text-xs text-danger">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full" icon={!loading ? <ArrowRight size={18} /> : undefined}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-xs text-text-dim text-center mt-4">
            By continuing, you agree to the{' '}
            <Link to="/terms" className="text-primary-bright hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-bright hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
