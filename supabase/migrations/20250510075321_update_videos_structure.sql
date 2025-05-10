/*
  # Update videos JSONB column structure

  This migration ensures the videos JSONB column can store additional properties
  including duration and embedUrl.
*/

-- No schema changes needed since we're using JSONB which can store any structure.
-- But we can add a comment to document the expected structure:

COMMENT ON COLUMN modules.videos IS 'Array of YouTube videos with properties: id, title, description, thumbnail, channelTitle, publishedAt, url, duration, embedUrl'; 