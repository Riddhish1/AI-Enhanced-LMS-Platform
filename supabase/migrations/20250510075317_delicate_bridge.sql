/*
  # Seed Data for VFX Learning Platform

  This migration adds initial data for:
  1. Categories
  2. Software Tools
  3. Sample Courses
  4. Course Modules
*/

-- Seed Categories
INSERT INTO categories (name, description) VALUES
('3D Animation', 'Learn 3D animation techniques and principles'),
('VFX Pipeline', 'Understanding VFX production pipeline and tools'),
('Rendering', 'Advanced rendering techniques and optimization'),
('Scripting & Automation', 'Automation tools and script development'),
('Pipeline Development', 'Creating and maintaining VFX/Animation pipelines');

-- Seed Software Tools
INSERT INTO software_tools (name, version, description, website_url) VALUES
('Maya', '2024', 'Industry-standard 3D animation software', 'https://www.autodesk.com/maya'),
('Houdini', '19.5', 'Procedural VFX and animation software', 'https://www.sidefx.com'),
('Nuke', '14.0', 'Professional compositing software', 'https://www.foundry.com/nuke'),
('Python', '3.11', 'Programming language for automation', 'https://www.python.org'),
('USD', '23.11', 'Universal Scene Description framework', 'https://openusd.org');

-- Seed Sample Course
DO $$
DECLARE
  category_id uuid;
BEGIN
  -- Get Pipeline Development category ID
  SELECT id INTO category_id FROM categories WHERE name = 'Pipeline Development';
  
  -- Insert sample course
  INSERT INTO courses (title, description, thumbnail_url, difficulty, duration, category_id)
  VALUES (
    'Python for VFX Pipeline Development',
    'Learn to develop robust VFX pipelines using Python. Master automation, data management, and tool development for VFX studios.',
    'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    'intermediate',
    40,
    category_id
  );
END $$;

-- Seed Sample Modules
DO $$
DECLARE
  course_id uuid;
BEGIN
  -- Get the course ID
  SELECT id INTO course_id FROM courses WHERE title = 'Python for VFX Pipeline Development';
  
  -- Insert modules
  INSERT INTO modules (course_id, title, content, order_number)
  VALUES
    (course_id, 'Introduction to VFX Pipeline Development', 'Understanding the fundamentals of VFX pipeline development and the role of Python in automation.', 1),
    (course_id, 'Setting Up the Development Environment', 'Learn to set up a professional development environment for VFX pipeline work.', 2),
    (course_id, 'Basic Pipeline Tools with Python', 'Create your first pipeline tools using Python and industry-standard practices.', 3);
END $$;