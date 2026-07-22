-- ============================================================
-- Set up pg_cron for newsletter scheduling
-- Project: Forge (daquiwsaqffoxtqijwzo)
-- NOTE: pg_cron extension must be enabled in Supabase dashboard
-- ============================================================

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to check and send newsletters based on schedule
CREATE OR REPLACE FUNCTION check_newsletter_schedule()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config_record RECORD;
  should_send BOOLEAN := FALSE;
BEGIN
  -- Get the newsletter config
  SELECT * INTO config_record
  FROM newsletter_config
  LIMIT 1;

  -- Check if we should send based on frequency
  IF config_record.next_send_at IS NOT NULL AND config_record.next_send_at <= now() THEN
    should_send := TRUE;
  END IF;

  -- If we should send, update next_send_at based on frequency
  IF should_send THEN
    -- Update next_send_at
    UPDATE newsletter_config
    SET next_send_at = CASE
      WHEN frequency = 'daily' THEN now() + interval '1 day'
      WHEN frequency = 'weekly' THEN now() + interval '7 days'
      WHEN frequency = 'monthly' THEN now() + interval '1 month'
      ELSE now() + interval '7 days'
    END
    WHERE id = config_record.id;

    -- Call the Edge Function to send batch emails
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/newsletter-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'type', 'batch',
        'subject', 'Mentenaz Forge Update',
        'content', '<p>Stay tuned for exciting updates from Mentenaz Forge!</p>'
      )
    );
  END IF;
END;
$$;

-- Schedule the cron job to run every hour
SELECT cron.schedule(
  'check-newsletter-schedule',
  '0 * * * *',  -- Every hour
  'SELECT check_newsletter_schedule()'
);
