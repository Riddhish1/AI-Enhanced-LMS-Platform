/*
  # Initial Schema Setup for VFX Learning Platform

  1. Tables Created:
    - courses (Main course information)
    - modules (Course content modules)
    - user_progress (Track learning progress)
    - categories (Course categorization)
    - software_tools (Related software/tools)
    
  2. Security:
    - RLS policies for authenticated access
    - Protected user data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Software Tools Table
CREATE TABLE IF NOT EXISTS software_tools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  version text,
  description text,
  website_url text,
  created_at timestamptz DEFAULT now()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration integer NOT NULL CHECK (duration > 0),
  category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules Table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  order_number integer NOT NULL,
  software_tools uuid[] DEFAULT array[]::uuid[],
  created_at timestamptz DEFAULT now()
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  last_accessed timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Modules are viewable by everyone"
  ON modules FOR SELECT
  USING (true);

CREATE POLICY "Users can only view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON user_progress(course_id);