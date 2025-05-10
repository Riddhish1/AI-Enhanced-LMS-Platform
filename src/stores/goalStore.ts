import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { LearningGoal } from '../types';

interface GoalState {
  goals: LearningGoal[];
  isLoading: boolean;
  error: string | null;
  
  fetchGoals: (userId: string) => Promise<void>;
  createGoal: (goal: Omit<LearningGoal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<LearningGoal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        goals: data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching learning goals:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch learning goals',
        goals: []
      });
    }
  },

  createGoal: async (goal) => {
    try {
      set({ isLoading: true, error: null });
      
      // Generate ID locally to update state immediately
      const newGoalId = uuidv4();
      const timestamp = new Date().toISOString();
      
      const newGoal = {
        ...goal,
        id: newGoalId,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Update local state immediately for better UX
      set(state => ({
        goals: [newGoal, ...state.goals]
      }));
      
      // Send to the backend
      const { error } = await supabase
        .from('learning_goals')
        .insert([{
          ...goal,
          created_at: timestamp,
          updated_at: timestamp
        }]);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error creating learning goal:', error);
      
      // Revert optimistic update if there was an error
      await get().fetchGoals(goal.user_id);
      
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create learning goal' 
      });
    }
  },

  updateGoal: async (goalId, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      // Update timestamp
      updates.updated_at = new Date().toISOString();
      
      // Optimistic update
      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === goalId ? { ...goal, ...updates } : goal
        )
      }));
      
      // Update in backend
      const { error } = await supabase
        .from('learning_goals')
        .update(updates)
        .eq('id', goalId);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating learning goal:', error);
      
      // Revert optimistic update by refetching data
      const userId = get().goals.find(g => g.id === goalId)?.user_id;
      if (userId) {
        await get().fetchGoals(userId);
      }
      
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update learning goal' 
      });
    }
  },

  deleteGoal: async (goalId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Store user ID before removing from state
      const userId = get().goals.find(g => g.id === goalId)?.user_id;
      
      // Optimistic delete
      set(state => ({
        goals: state.goals.filter(goal => goal.id !== goalId)
      }));
      
      // Delete from backend
      const { error } = await supabase
        .from('learning_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error deleting learning goal:', error);
      
      // Revert optimistic delete by refetching if we have userId
      const userId = get().goals.find(g => g.id === goalId)?.user_id;
      if (userId) {
        await get().fetchGoals(userId);
      }
      
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete learning goal' 
      });
    }
  },
})); 