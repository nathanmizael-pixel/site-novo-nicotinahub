-- videos
-- Public video content for the nicotinacat platform
-- Supports Twitch and TikTok videos with thumbnails, metadata, and featured flag

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  video_url text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('twitch', 'tiktok')),
  category text DEFAULT '',
  duration text DEFAULT '',
  views int NOT NULL DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access for published/visible videos
DROP POLICY IF EXISTS "videos_select_public" ON videos;
CREATE POLICY "videos_select_public" ON videos FOR SELECT
  TO anon, authenticated USING (true);

-- Insert: only authenticated users with admin role (or service role via backend)
-- For now, no public insert policy - videos are managed via backend/admin
DROP POLICY IF EXISTS "videos_insert_admin" ON videos;
CREATE POLICY "videos_insert_admin" ON videos FOR INSERT
  TO authenticated WITH CHECK (false);

-- Update: only authenticated users with admin role
DROP POLICY IF EXISTS "videos_update_admin" ON videos;
CREATE POLICY "videos_update_admin" ON videos FOR UPDATE
  TO authenticated USING (false) WITH CHECK (false);

-- Delete: only authenticated users with admin role
DROP POLICY IF EXISTS "videos_delete_admin" ON videos;
CREATE POLICY "videos_delete_admin" ON videos FOR DELETE
  TO authenticated USING (false);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_videos_platform ON videos (platform);
CREATE INDEX IF NOT EXISTS idx_videos_published_at_featured ON videos (published_at DESC) WHERE featured = true;

-- Trigger to update updated_at on change
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_videos_updated_at ON videos;
CREATE TRIGGER trigger_update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_videos_updated_at();