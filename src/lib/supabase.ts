import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Use environment variables for the online Supabase instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the Supabase configuration for debugging (redact parts of the key for security)
console.log('Supabase Configuration:', { 
  supabaseUrl,
  supabaseAnonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : undefined
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure .env file is properly configured.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};