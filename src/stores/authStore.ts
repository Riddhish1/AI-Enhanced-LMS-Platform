import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  checkSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        set({ 
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            avatar_url: data.session.user.user_metadata.avatar_url,
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ user: null, isLoading: false, error: 'Failed to check session' });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email,
            avatar_url: data.user.user_metadata.avatar_url,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to sign in' 
      });
    }
  },

  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email,
            avatar_url: data.user.user_metadata.avatar_url,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to sign up' 
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to sign out' 
      });
    }
  },
}));