// Test script to verify connection to online Supabase
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Get Supabase credentials from the .env file
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Key: ${supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined'}`);

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test course data
const testCourse = {
  title: 'Test Online Course',
  description: 'This is a test course for online Supabase',
  thumbnail_url: 'https://example.com/image.jpg',
  difficulty: 'beginner',
  duration: 1
};

// Create a test course
async function testSupabaseConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    // First, try to fetch courses to test connection
    console.log('Fetching courses...');
    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .limit(5);
      
    if (fetchError) {
      console.error('Error fetching courses:', fetchError);
    } else {
      console.log(`Successfully fetched ${courses.length} courses`);
      console.log('First few courses:', courses.map(c => ({ id: c.id, title: c.title })));
    }
    
    // Now try creating a course
    console.log('\nAttempting to create a test course...');
    const { data, error } = await supabase
      .from('courses')
      .insert([testCourse])
      .select();
      
    if (error) {
      console.error('Error creating course:', error);
    } else {
      console.log('Course created successfully:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testSupabaseConnection(); 