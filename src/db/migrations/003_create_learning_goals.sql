-- Create the learning_goals table
CREATE TABLE IF NOT EXISTS learning_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  course_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster querying of goals by user
CREATE INDEX IF NOT EXISTS idx_learning_goals_user_id ON learning_goals(user_id);

-- Create RLS policies
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own goals
CREATE POLICY learning_goals_select_policy ON learning_goals 
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own goals
CREATE POLICY learning_goals_insert_policy ON learning_goals 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update only their own goals
CREATE POLICY learning_goals_update_policy ON learning_goals 
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete only their own goals
CREATE POLICY learning_goals_delete_policy ON learning_goals 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on changes
CREATE TRIGGER update_learning_goals_updated_at
  BEFORE UPDATE ON learning_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column(); 