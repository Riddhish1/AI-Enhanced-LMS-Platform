import { create } from 'zustand';
import { getGeminiResponse, generateCourseSummary, getPersonalizedRecommendations } from '../lib/gemini';
import type { AIMessage } from '../types';

interface AIState {
  chatMessages: AIMessage[];
  courseSummary: string | null;
  recommendations: string | null;
  isLoading: boolean;
  error: string | null;
  
  sendMessage: (message: string, courseContext: string) => Promise<void>;
  generateSummary: (courseContent: string) => Promise<void>;
  getRecommendations: (viewedCourses: string[], interests: string[]) => Promise<void>;
  clearChat: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  chatMessages: [],
  courseSummary: null,
  recommendations: null,
  isLoading: false,
  error: null,

  sendMessage: async (message, courseContext) => {
    try {
      set({ isLoading: true, error: null });
      
      // Add user message to chat
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      set(state => ({
        chatMessages: [...state.chatMessages, userMessage]
      }));
      
      // Create prompt with course context
      const prompt = `
        Based on this course content: "${courseContext}"
        
        Answer the following question from a student:
        "${message}"
        
        Provide a helpful, concise response that explains the concept clearly.
      `;
      
      // Get AI response
      const response = await getGeminiResponse(prompt);
      
      // Add AI response to chat
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      set(state => ({
        chatMessages: [...state.chatMessages, aiMessage],
        isLoading: false
      }));
      
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to get AI response' 
      });
    }
  },

  generateSummary: async (courseContent) => {
    try {
      set({ isLoading: true, error: null, courseSummary: null });
      
      const summary = await generateCourseSummary(courseContent);
      set({ courseSummary: summary, isLoading: false });
      
    } catch (error) {
      console.error('Error generating summary:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to generate course summary' 
      });
    }
  },

  getRecommendations: async (viewedCourses, interests) => {
    try {
      set({ isLoading: true, error: null, recommendations: null });
      
      const recommendations = await getPersonalizedRecommendations(viewedCourses, interests);
      set({ recommendations, isLoading: false });
      
    } catch (error) {
      console.error('Error getting recommendations:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to get recommendations' 
      });
    }
  },

  clearChat: () => {
    set({ chatMessages: [] });
  }
}));