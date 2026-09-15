-- tiktok_tokens
-- Secure server-side storage for TikTok OAuth tokens
-- Only accessible via service role (backend), never exposed to frontend

CREATE TABLE IF NOT EXISTS tiktok_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'tiktok',
  account_username text,
  account_display_name text,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  scope text NOT NULL DEFAULT 'user.info.basic,video.list',
  token_type text NOT NULL DEFAULT 'Bearer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (provider)
);

ALTER TABLE tiktok_tokens ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write
DROP POLICY IF EXISTS "tiktok_tokens_service_role" ON tiktok_tokens;
CREATE POLICY "tiktok_tokens_service_role" ON tiktok_tokens FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Index for token lookup
CREATE INDEX IF NOT EXISTS idx_tiktok_tokens_provider ON tiktok_tokens (provider);

-- Trigger to update updated_at on change
CREATE OR REPLACE FUNCTION update_tiktok_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tiktok_tokens_updated_at ON tiktok_tokens;
CREATE TRIGGER trigger_update_tiktok_tokens_updated_at
  BEFORE UPDATE ON tiktok_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_tiktok_tokens_updated_at();