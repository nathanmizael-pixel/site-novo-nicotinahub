const TIKTOK_AUTH_BASE = 'https://www.tiktok.com/v2/auth/authorize/';
const REDIRECT_URI = 'https://site-novo-nicotinahub.vercel.app/auth/tiktok/callback';
const SCOPES = 'user.info.basic,video.list';
const CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY;

function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function getStoredState(): string | null {
  return sessionStorage.getItem('tiktok_oauth_state');
}

function setStoredState(state: string): void {
  sessionStorage.setItem('tiktok_oauth_state', state);
}

function clearStoredState(): void {
  sessionStorage.removeItem('tiktok_oauth_state');
}

export function buildTikTokAuthUrl(): string {
  if (!CLIENT_KEY) {
    throw new Error('VITE_TIKTOK_CLIENT_KEY not configured');
  }
  const state = generateState();
  setStoredState(state);

  const params = new URLSearchParams({
    client_key: CLIENT_KEY,
    scope: SCOPES,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
  });

  return `${TIKTOK_AUTH_BASE}?${params.toString()}`;
}

export function validateState(returnedState: string): boolean {
  const storedState = getStoredState();
  clearStoredState();
  return storedState === returnedState && storedState !== null;
}

export function getRedirectUri(): string {
  return REDIRECT_URI;
}

export function getScopes(): string {
  return SCOPES;
}