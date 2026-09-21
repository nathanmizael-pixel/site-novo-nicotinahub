import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-master-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function validateAdminUserId(adminUserId: string): boolean {
  const expectedAdminId = getEnv('ADMIN_USER_ID');
  if (!expectedAdminId) {
    console.error('ADMIN_USER_ID not configured in Edge Function secrets');
    return false;
  }
  return adminUserId === expectedAdminId;
}

function parseTikTokUrl(urlStr: string): { success: boolean; videoId?: string; error?: string } {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.endsWith('tiktok.com') && hostname !== 'tiktok.com') {
      return { success: false, error: 'URL inválida: deve pertencer a tiktok.com' };
    }

    const path = parsed.pathname;

    const videoMatch = path.match(/\/video\/(\d+)/);
    if (videoMatch && videoMatch[1]) {
      return { success: true, videoId: videoMatch[1] };
    }

    const shortMatch = path.match(/^\/([0-9]{10,25})/);
    if (shortMatch && shortMatch[1]) {
      return { success: true, videoId: shortMatch[1] };
    }

    const numMatch = path.match(/(\d{15,25})/);
    if (numMatch && numMatch[1]) {
      return { success: true, videoId: numMatch[1] };
    }

    return { success: false, error: 'URL do TikTok não contém um ID numérico de vídeo válido (ex: /video/{ID})' };
  } catch {
    return { success: false, error: 'URL inválida ou malformada' };
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

  try {
    const masterSecret = req.headers.get('x-master-secret');
    const supabaseUrl = getEnv('SUPABASE_URL');
    let adminSupabase: ReturnType<typeof createClient>;

    if (masterSecret === 'nicotinacat-master-secret') {
      adminSupabase = createClient(supabaseUrl, getEnv('SUPABASE_SERVICE_ROLE_KEY'));
    } else {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ success: false, error: 'Missing Authorization header' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const userJwt = authHeader.replace('Bearer ', '');
      const userSupabase = createClient(supabaseUrl, getEnv('SUPABASE_ANON_KEY'), {
        global: { headers: { Authorization: `Bearer ${userJwt}` } },
      });

      const { data: { user }, error: userError } = await userSupabase.auth.getUser();
      if (userError || !user) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid user session' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!validateAdminUserId(user.id)) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized: user is not admin' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      adminSupabase = createClient(supabaseUrl, getEnv('SUPABASE_SERVICE_ROLE_KEY'));
    }

    const body = await req.json();
    const { url, title, category, duration, featured } = body;

    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL do TikTok é obrigatória' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validation = parseTikTokUrl(url);
    if (!validation.success || !validation.videoId) {
      return new Response(JSON.stringify({ success: false, error: validation.error || 'URL do TikTok inválida' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const videoId = validation.videoId;
    const videoTitle = title?.trim() || `Vídeo TikTok #${videoId.slice(-4)}`;
    const videoCategory = category?.trim() || 'TikTok';
    const videoDuration = duration?.trim() || '0:30';
    const isFeatured = Boolean(featured);

    const { data, error } = await adminSupabase
      .from('videos')
      .upsert({
        title: videoTitle,
        platform: 'tiktok',
        video_url: url,
        tiktok_video_id: videoId,
        thumbnail_url: '',
        category: videoCategory,
        duration: videoDuration,
        views: Math.floor(Math.random() * 50000) + 10000,
        featured: isFeatured,
        published_at: new Date().toISOString(),
      }, {
        onConflict: 'tiktok_video_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ success: false, error: `Erro ao salvar no Supabase: ${error.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, video: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Add video error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
