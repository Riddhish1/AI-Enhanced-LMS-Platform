/*
  # Fix RLS Policies for Course and Module Creation

  This migration adds necessary RLS policies to allow authenticated users
  to create courses and modules.
*/

-- Add policies for course creation
CREATE POLICY "Authenticated users can create courses"
  ON courses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Add policies for module creation
CREATE POLICY "Authenticated users can create modules"
  ON modules FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Add policies for course updates
CREATE POLICY "Authenticated users can update courses"
  ON courses FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Add policies for module updates
CREATE POLICY "Authenticated users can update modules"
  ON modules FOR UPDATE
  USING (auth.role() = 'authenticated'); 