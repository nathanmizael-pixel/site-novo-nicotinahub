import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TikTokTokenRecord {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string;
  account_username: string | null;
  account_display_name: string | null;
}

interface TikTokVideo {
  id: string;
  title: string;
  video_description: string;
  cover_image_url: string[];
  share_url: string;
  embed_link: string;
  duration: number;
  create_time: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  privacy_level: string;
}

interface TikTokVideoListResponse {
  data: {
    videos: TikTokVideo[];
    cursor: number;
    has_more: boolean;
  };
  error: {
    code: number;
    message: string;
    log_id: string;
  };
}

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  last_sync_at: string;
}

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

async function getTikTokTokens(supabase: ReturnType<typeof createClient>): Promise<TikTokTokenRecord | null> {
  const { data, error } = await supabase
    .from('tiktok_tokens')
    .select('*')
    .eq('provider', 'tiktok')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch TikTok tokens: ${error.message}`);
  }
  return data;
}

async function refreshAccessToken(supabase: ReturnType<typeof createClient>, refreshToken: string): Promise<TikTokTokenRecord> {
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
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh TikTok access token: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

  const { data, error } = await supabase
    .from('tiktok_tokens')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      scope: tokenData.scope || 'user.info.basic,video.list',
      token_type: tokenData.token_type || 'Bearer',
      updated_at: new Date().toISOString(),
    })
    .eq('provider', 'tiktok')
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update TikTok tokens: ${error.message}`);
  }

  return data;
}

async function ensureValidAccessToken(supabase: ReturnType<typeof createClient>): Promise<string> {
  const tokens = await getTikTokTokens(supabase);
  
  if (!tokens) {
    throw new Error('TikTok tokens not configured. Complete OAuth flow first.');
  }

  const expiresAt = new Date(tokens.expires_at);
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer

  if (expiresAt.getTime() - now.getTime() < bufferMs) {
    console.log('Access token expired or expiring soon, refreshing...');
    const refreshed = await refreshAccessToken(supabase, tokens.refresh_token);
    return refreshed.access_token;
  }

  return tokens.access_token;
}

async function fetchUserInfo(accessToken: string): Promise<{ username: string; display_name: string }> {
  const response = await fetch(`${TIKTOK_API_BASE}/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,is_verified,follower_count,following_count,video_count`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch TikTok user info: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  
  if (data.error?.code) {
    throw new Error(`TikTok API error: ${data.error.message}`);
  }

  return {
    username: `tiktok_${data.data?.user?.open_id?.slice(0, 8) || 'unknown'}`,
    display_name: data.data?.user?.display_name || 'Unknown',
  };
}

async function fetchAllVideos(accessToken: string): Promise<TikTokVideo[]> {
  const allVideos: TikTokVideo[] = [];
  let cursor: number | undefined = undefined;
  let hasMore = true;
  let previousCursor: number | undefined = undefined;

  while (hasMore) {
    const requestBody: Record<string, unknown> = {
      max_count: 20,
    };

    if (cursor !== undefined) {
      requestBody.cursor = cursor;
    }

    // fields can be passed as query parameter or body depending on TikTok API specs, but typically fields is a query param while pagination/body parameters are in JSON body.
    // Let's keep fields in query string as it is standard for TikTok API v2 filtering, or check requirement: "Os parâmetros de paginação devem ser enviados no JSON body: max_count, cursor".
    const fieldsParam = 'fields=id,title,video_description,cover_image_url,share_url,embed_link,duration,create_time,view_count,like_count,comment_count,share_count,privacy_level';

    const response = await fetch(`${TIKTOK_API_BASE}/video/list/?${fieldsParam}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch TikTok videos: ${response.status} ${errorText}`);
    }

    const data: TikTokVideoListResponse = await response.json();

    if (data.error?.code) {
      if (data.error.code === 10005) {
        throw new Error('TikTok access token expired or invalid');
      }
      throw new Error(`TikTok API error: ${data.error.message} (code: ${data.error.code})`);
    }

    if (data.data?.videos) {
      const publicVideos = data.data.videos.filter(v => v.privacy_level === 'PUBLIC');
      allVideos.push(...publicVideos);
    }

    const nextCursor = data.data?.cursor;
    hasMore = data.data?.has_more || false;

    // Protection against infinite loop: if hasMore is true but cursor is missing or unchanged
    if (hasMore) {
      if (nextCursor === undefined || nextCursor === previousCursor) {
        console.warn('Infinite pagination loop detected: has_more is true but cursor is missing or unchanged.');
        break;
      }
    }

    previousCursor = cursor;
    cursor = nextCursor;

    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return allVideos;
}

function mapTikTokToVideo(video: TikTokVideo): Record<string, unknown> {
  return {
    tiktok_video_id: video.id,
    title: video.title || 'Sem título',
    description: video.video_description || '',
    thumbnail_url: video.cover_image_url?.[0] || '',
    video_url: video.share_url || video.embed_link || `https://www.tiktok.com/@nicotinaclips/video/${video.id}`,
    platform: 'tiktok',
    category: 'TikTok', // Could be enhanced by parsing hashtags from description
    duration: formatDuration(video.duration),
    views: video.view_count || 0,
    published_at: new Date(video.create_time * 1000).toISOString(),
    featured: false,
  };
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function upsertVideos(supabase: ReturnType<typeof createClient>, videos: TikTokVideo[]): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];

  for (const video of videos) {
    try {
      const videoData = mapTikTokToVideo(video);

      // UPSERT by tiktok_video_id (unique constraint)
      const { error } = await supabase
        .from('videos')
        .upsert(videoData, {
          onConflict: 'tiktok_video_id',
          ignoreDuplicates: false,
        });

      if (error) {
        errors.push(`Failed to upsert video ${video.id}: ${error.message}`);
      } else {
        synced++;
      }
    } catch (err) {
      errors.push(`Error processing video ${video.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return { synced, errors };
}

// Helper function to validate admin user ID (same as tiktok-oauth)
function validateAdminUserId(adminUserId: string): boolean {
  const expectedAdminId = getEnv('ADMIN_USER_ID');
  if (!expectedAdminId) {
    console.error('ADMIN_USER_ID not configured in Edge Function secrets');
    return false;
  }
  return adminUserId === expectedAdminId;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Get the user's JWT from the Authorization header (passed by supabase.functions.invoke)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const userJwt = authHeader.replace('Bearer ', '');

  try {
    // Create a Supabase client with the user's JWT to verify identity
    const supabaseUrl = getEnv('SUPABASE_URL');
    const userSupabase = createClient(supabaseUrl, getEnv('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: `Bearer ${userJwt}` } },
    });

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user is the admin authorized
    if (!validateAdminUserId(user.id)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: user is not admin' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role key for privileged database operations (server-side only)
    const adminSupabase = createClient(
      getEnv('SUPABASE_URL'),
      getEnv('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Ensure we have a valid access token
    const accessToken = await ensureValidAccessToken(adminSupabase);

    // Fetch user info (to update account info in tokens table)
    let accountUsername: string | null = null;
    let accountDisplayName: string | null = null;
    try {
      const userInfo = await fetchUserInfo(accessToken);
      accountUsername = userInfo.username;
      accountDisplayName = userInfo.display_name;
    } catch (err) {
      console.warn('Could not fetch user info:', err instanceof Error ? err.message : 'Unknown error');
    }

    // Fetch all public videos from TikTok
    const videos = await fetchAllVideos(accessToken);
    console.log(`Fetched ${videos.length} public videos from TikTok`);

    // Upsert videos to Supabase
    const { synced, errors } = await upsertVideos(adminSupabase, videos);

    // Update account info in tokens table if we got it
    if (accountUsername || accountDisplayName) {
      await adminSupabase
        .from('tiktok_tokens')
        .update({
          account_username: accountUsername,
          account_display_name: accountDisplayName,
          updated_at: new Date().toISOString(),
        })
        .eq('provider', 'tiktok');
    }

    const result: SyncResult = {
      success: errors.length === 0,
      synced,
      errors,
      last_sync_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      status: errors.length === 0 ? 200 : 207, // 207 Multi-Status for partial success
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({
      success: false,
      synced: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      last_sync_at: new Date().toISOString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});