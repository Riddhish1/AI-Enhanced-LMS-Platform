import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProgress } from '../types';

interface ProgressState {
  userProgress: UserProgress[];
  isLoading: boolean;
  error: string | null;
  
  fetchUserProgress: (userId: string) => Promise<void>;
  updateProgress: (progressData: Partial<UserProgress>) => Promise<void>;
  calculateCourseProgress: (userId: string, courseId: string) => number;
  removeCourseProgress: (userId: string, courseId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userProgress: [],
  isLoading: false,
  error: null,

  fetchUserProgress: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      set({ userProgress: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user progress' 
      });
    }
  },

  updateProgress: async (progressData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if progress record exists
      const { data: existingData, error: checkError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', progressData.user_id!)
        .eq('module_id', progressData.module_id!)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update({
            ...progressData,
            last_accessed: new Date().toISOString(),
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
        result = { ...existingData, ...progressData };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('user_progress')
          .insert([{
            ...progressData,
            completed: progressData.completed || false,
            last_accessed: new Date().toISOString(),
          }])
          .select();
          
        if (error) throw error;
        result = data?.[0];
      }

      // Update local state
      const updatedProgress = get().userProgress.filter(p => p.id !== result.id);
      set({ 
        userProgress: [...updatedProgress, result],
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Error updating progress:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update progress' 
      });
    }
  },

  calculateCourseProgress: (userId, courseId) => {
    const { userProgress } = get();
    const courseProgress = userProgress.filter(
      p => p.user_id === userId && p.course_id === courseId
    );
    
    if (courseProgress.length === 0) return 0;
    
    const completedModules = courseProgress.filter(p => p.completed).length;
    return Math.round((completedModules / courseProgress.length) * 100);
  },

  removeCourseProgress: async (userId, courseId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Delete all progress records for this user and course
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .match({ user_id: userId, course_id: courseId });

      if (error) throw error;
      
      // Update local state
      const filteredProgress = get().userProgress.filter(
        p => !(p.user_id === userId && p.course_id === courseId)
      );
      
      set({ 
        userProgress: filteredProgress,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Error removing course progress:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to remove course progress' 
      });
    }
  },
}));