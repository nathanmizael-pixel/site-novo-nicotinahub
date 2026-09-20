import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TokenExchangeRequest {
  code: string;
  redirect_uri: string;
  admin_user_id: string;
}

interface TokenExchangeResponse {
  success: boolean;
  error?: string;
  account_username?: string;
  account_display_name?: string;
}

interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  open_id: string;
  error?: {
    code: number;
    message: string;
    log_id: string;
  };
}

interface TikTokUserInfoResponse {
  data: {
    user: {
      open_id: string;
      union_id: string;
      avatar_url: string;
      display_name: string;
      bio_description: string;
      is_verified: boolean;
      follower_count: number;
      following_count: number;
      video_count: number;
    };
  };
  error?: {
    code: number;
    message: string;
    log_id: string;
  };
}

function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function validateAdminUserId(adminUserId: string): boolean {
  const expectedAdminId = Deno.env.get('ADMIN_USER_ID');
  if (!expectedAdminId) {
    console.error('ADMIN_USER_ID not configured in Edge Function secrets');
    return false;
  }
  return adminUserId === expectedAdminId;
}

async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<TikTokTokenResponse> {
  const clientKey = getEnv('TIKTOK_CLIENT_KEY');
  const clientSecret = getEnv('TIKTOK_CLIENT_SECRET');

  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data: TikTokTokenResponse = await response.json();

  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `Token exchange failed: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function fetchUserInfo(accessToken: string): Promise<TikTokUserInfoResponse> {
  const response = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,is_verified,follower_count,following_count,video_count', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: TikTokUserInfoResponse = await response.json();

  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `User info fetch failed: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

async function storeTokens(
  supabase: ReturnType<typeof createClient>,
  tokenData: TikTokTokenResponse,
  userInfo: TikTokUserInfoResponse
): Promise<void> {
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
  const incomingOpenId = userInfo.data.user.open_id;

  // Check for existing tokens (first authorization vs re-authorization)
  const { data: existing, error: fetchError } = await supabase
    .from('tiktok_tokens')
    .select('tiktok_open_id')
    .eq('provider', 'tiktok')
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch existing tokens: ${fetchError.message}`);
  }

  // If tokens exist, validate open_id matches (allowlist)
  if (existing?.tiktok_open_id && existing.tiktok_open_id !== incomingOpenId) {
    throw new Error('Conta TikTok diferente da conta editorial vinculada. Reautorização rejeitada.');
  }

  const { error } = await supabase.from('tiktok_tokens').upsert(
    {
      provider: 'tiktok',
      tiktok_open_id: incomingOpenId,
      account_username: `tiktok_${incomingOpenId.slice(0, 8)}`,
      account_display_name: userInfo.data.user.display_name,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      scope: tokenData.scope || 'user.info.basic,video.list',
      token_type: tokenData.token_type || 'Bearer',
    },
    {
      onConflict: 'provider',
      ignoreDuplicates: false,
    }
  );

  if (error) {
    throw new Error(`Failed to store tokens: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get the user's JWT from the Authorization header (passed by supabase.functions.invoke)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ success: false, error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userJwt = authHeader.replace('Bearer ', '');

  try {
    const { code, redirect_uri, admin_user_id }: TokenExchangeRequest = await req.json();

    if (!code || !redirect_uri || !admin_user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing code, redirect_uri, or admin_user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const expectedRedirectUri = 'https://site-novo-nicotinahub.vercel.app/auth/tiktok/callback';
    if (redirect_uri !== expectedRedirectUri) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid redirect_uri' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the user's JWT to verify identity
    const supabaseUrl = getEnv('SUPABASE_URL');
    const userSupabase = createClient(supabaseUrl, getEnv('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: `Bearer ${userJwt}` } },
    });

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the admin_user_id matches the authenticated user
    if (user.id !== admin_user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: user ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side admin validation
    if (!validateAdminUserId(admin_user_id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: invalid admin user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role key for database operations (server-side only)
    const adminSupabase = createClient(supabaseUrl, getEnv('SUPABASE_SERVICE_ROLE_KEY'));

    const tokenData = await exchangeCodeForTokens(code, redirect_uri);
    const userInfo = await fetchUserInfo(tokenData.access_token);

    await storeTokens(adminSupabase, tokenData, userInfo);

    const result: TokenExchangeResponse = {
      success: true,
      account_username: userInfo.data.user.display_name,
      account_display_name: userInfo.data.user.display_name,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});