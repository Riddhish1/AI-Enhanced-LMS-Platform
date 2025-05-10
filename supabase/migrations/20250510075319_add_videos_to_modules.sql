/*
  # Add YouTube videos support to modules

  This migration adds a JSONB column to store YouTube videos for each module.
*/
 
-- Add videos column to modules table
ALTER TABLE modules
ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb; 