/*
  # Add RLS policies for course and module deletion

  This migration adds policies to allow authenticated users to delete their courses and modules.
*/

-- Add policy for course deletion
CREATE POLICY "Authenticated users can delete courses"
  ON courses FOR DELETE
  TO authenticated
  USING (true);

-- Add policy for module deletion  
CREATE POLICY "Authenticated users can delete modules"
  ON modules FOR DELETE
  TO authenticated
  USING (true); 