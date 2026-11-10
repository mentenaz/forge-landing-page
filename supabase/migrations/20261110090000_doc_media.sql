-- ============================================================
-- Docs media: the screenshots and clips shown inside a docs page.
-- Project: daquiwsaqffoxtqijwzo
--
-- The text of every docs page stays in the repo (src/content/docs/<slug>.md).
-- A page's steps are its `## N. Title` sections, and a row here attaches one
-- image or video to step N of a page, so a screenshot can be added or
-- replaced without a deploy: upload the file to the `doc-media` bucket and
-- add the row (scripts/upload-doc-media.mjs does both). A step with no row
-- simply shows no media.
--
-- step 0 is the text before the first numbered section.
-- ============================================================

CREATE TABLE doc_media (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_slug TEXT        NOT NULL,
  step          INTEGER     NOT NULL DEFAULT 0,
  -- Order within a step, lowest first.
  position      INTEGER     NOT NULL DEFAULT 0,
  kind          TEXT        NOT NULL CHECK (kind IN ('image', 'video')),
  -- Object path inside the `doc-media` bucket, e.g. first-flow/step-2-log.png
  path          TEXT        NOT NULL,
  -- Videos: a still shown before play, as a path in the same bucket.
  poster_path   TEXT,
  alt           TEXT        NOT NULL,
  caption       TEXT,
  -- Pixel size, so the page reserves the space and does not jump as the
  -- image loads. Optional for video.
  width         INTEGER,
  height        INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (tutorial_slug, path)
);

CREATE INDEX doc_media_page_idx
  ON doc_media (tutorial_slug, step, position);

-- Public, unauthenticated reads: the docs are public. Writes go through the
-- service-role key (the upload script) and never through this policy.
ALTER TABLE doc_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to doc_media"
  ON doc_media FOR SELECT
  USING (true);

-- A public bucket serves its files from a plain URL with no policy; uploads
-- need the service-role key.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'doc-media',
  'doc-media',
  true,
  52428800,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;
