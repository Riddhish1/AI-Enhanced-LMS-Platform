export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      software_tools: {
        Row: {
          id: string
          name: string
          version: string | null
          description: string | null
          website_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          version?: string | null
          description?: string | null
          website_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          version?: string | null
          description?: string | null
          website_url?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: number
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration: number
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration?: number
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string
          order_number: number
          software_tools: string[]
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content: string
          order_number: number
          software_tools?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string
          order_number?: number
          software_tools?: string[]
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          module_id: string
          completed: boolean
          last_accessed: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          module_id: string
          completed?: boolean
          last_accessed?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          module_id?: string
          completed?: boolean
          last_accessed?: string
          notes?: string | null
          created_at?: string
        }
      }
      learning_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}