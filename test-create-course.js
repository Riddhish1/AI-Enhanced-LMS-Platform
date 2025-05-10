// Simple script to test course creation
const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client
const supabaseUrl = 'http://localhost:54321'; // Local Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'; // Local anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Test course data
const testCourse = {
  title: 'Test Course',
  description: 'This is a test course',
  thumbnail_url: 'https://example.com/image.jpg',
  difficulty: 'beginner',
  duration: 1
};

// Create a test course
async function createTestCourse() {
  try {
    console.log('Attempting to create a test course...');
    
    const { data, error } = await supabase
      .from('courses')
      .insert([testCourse])
      .select();
      
    if (error) {
      console.error('Error creating course:', error);
      return;
    }
    
    console.log('Course created successfully:', data);
    
    // Test if we can fetch this course
    const { data: fetchedCourses, error: fetchError } = await supabase
      .from('courses')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching courses:', fetchError);
      return;
    }
    
    console.log('Fetched courses:', fetchedCourses);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
createTestCourse(); 