-- Fix RLS Policies for Course and Module Creation

-- Drop existing RLS policies for courses (if any)
DROP POLICY IF EXISTS "Authenticated users can create courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can update courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can read courses" ON courses;

-- Drop existing RLS policies for modules (if any)
DROP POLICY IF EXISTS "Authenticated users can create modules" ON modules;
DROP POLICY IF EXISTS "Authenticated users can update modules" ON modules;
DROP POLICY IF EXISTS "Authenticated users can read modules" ON modules;

-- Add policies for course operations
CREATE POLICY "Authenticated users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  USING (true);

-- Add policies for module operations
CREATE POLICY "Authenticated users can create modules"
  ON modules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update modules"
  ON modules FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read modules"
  ON modules FOR SELECT
  USING (true); 