-- ============================================================
-- Newsletter system tables
-- Project: Forge (daquiwsaqffoxtqijwzo)
-- ============================================================

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, unsubscribed
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Newsletter configuration (singleton row)
CREATE TABLE IF NOT EXISTS newsletter_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frequency TEXT NOT NULL DEFAULT 'weekly', -- daily, weekly, monthly
  next_send_at TIMESTAMPTZ,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletter send history
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' -- sent, failed
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_subscriber ON newsletter_sends(subscriber_id);

-- RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Public can insert (subscribe)
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access subscribers" ON newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access config" ON newsletter_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access sends" ON newsletter_sends FOR ALL USING (auth.role() = 'service_role');

-- Insert default config
INSERT INTO newsletter_config (frequency, next_send_at)
VALUES ('weekly', now() + interval '7 days')
ON CONFLICT DO NOTHING;
