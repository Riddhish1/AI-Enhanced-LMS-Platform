export interface User {
  id: string;
  email?: string;
  avatar_url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  created_at: string;
  modules?: Module[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_number: number;
  created_at: string;
  videos?: YouTubeVideo[];
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  completed: boolean;
  last_accessed: string;
}

export interface LearningGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
  duration: string;
  embedUrl: string;
}