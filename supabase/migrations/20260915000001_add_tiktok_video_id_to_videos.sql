-- Add tiktok_video_id to videos table for stable TikTok video identification
-- Enables idempotent UPSERT based on TikTok's native video ID

ALTER TABLE videos
ADD COLUMN IF NOT EXISTS tiktok_video_id text UNIQUE;

-- Index for TikTok video ID lookups
CREATE INDEX IF NOT EXISTS idx_videos_tiktok_video_id ON videos (tiktok_video_id) WHERE tiktok_video_id IS NOT NULL;