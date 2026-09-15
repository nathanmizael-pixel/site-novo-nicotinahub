-- Add tiktok_open_id to tiktok_tokens for stable account identification
-- open_id is the stable, immutable identifier from TikTok (per app+user pair)
-- Used as allowlist to prevent unauthorized account re-authorization

ALTER TABLE tiktok_tokens
ADD COLUMN IF NOT EXISTS tiktok_open_id text UNIQUE;

-- Index for open_id lookups
CREATE INDEX IF NOT EXISTS idx_tiktok_tokens_open_id ON tiktok_tokens (tiktok_open_id) WHERE tiktok_open_id IS NOT NULL;