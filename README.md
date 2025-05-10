# 🚀 Modern Learning Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blueviolet)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Powered-orange)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://lmsplatform-tan.vercel.app)

## 🌟 [Live Demo](https://lmsplatform-tan.vercel.app/login)

A cutting-edge learning management system designed for the modern educational landscape. This platform seamlessly integrates traditional course management with AI-powered features, creating an intuitive and personalized learning experience.

Built with a responsive design and performance-focused architecture, this platform enables learners to track their progress, set meaningful goals, and receive AI-enhanced content summaries—all within a beautiful, accessible interface that adapts to any device.

![App Screenshot](https://via.placeholder.com/800x400?text=Learning+Platform+Screenshot)

## ✨ Features

### Core Features
- **📚 Comprehensive Course Management** 
  - Browse an extensive library of courses
  - Enroll and progress tracking with detailed analytics
  - Interactive module navigation with completion tracking
  - Easily remove unwanted courses from your dashboard

- **🎯 Smart Learning Goals System**
  - Set personalized learning objectives with target dates
  - Track progress across your educational journey
  - Organize and prioritize goals with intuitive status indicators
  - Receive achievement notifications upon completion

- **🎓 Advanced Progress Analytics**
  - Visualize your learning journey with detailed charts and metrics
  - Identify strengths and areas for improvement
  - Track time spent on different subject areas
  - Export progress reports for personal records

- **🎨 Responsive UI with Dark/Light Mode**
  - Beautiful, accessibility-focused interface
  - Seamless device adaptation from mobile to desktop
  - Eye-friendly dark mode for night-time learning
  - Motion animations for engaging user experience

### AI Integration
- **🤖 Gemini AI Assistant**
  - Get personalized course recommendations based on learning patterns
  - Receive instant answers to course-related questions
  - Adaptive support tailored to individual learning styles
  - Natural language interaction for intuitive experience

- **📝 AI-Generated Content Enhancement**
  - Automatic summaries of complex topics for quick review
  - Key concept extraction from course materials
  - Supplementary explanations for challenging concepts
  - Visual concept mapping for better understanding

- **❓ Intelligent Assessment Generation**
  - AI-powered quizzes that adapt to your knowledge level
  - Diverse question formats to test comprehensive understanding
  - Detailed explanations for incorrect answers
  - Spaced repetition suggestions based on performance

## 🛠️ Tech Stack

- **Frontend**: 
  - React 18 with TypeScript for type-safe development
  - Tailwind CSS for responsive, utility-first styling
  - Framer Motion for fluid animations and transitions
  - Vite for lightning-fast builds and development

- **State Management**: 
  - Zustand for lightweight, hook-based state management
  - Optimized stores with automatic persistence

- **Backend**: 
  - Supabase for serverless PostgreSQL database
  - Real-time data subscriptions
  - Row-level security policies for data protection
  - Built-in authentication and storage solutions

- **AI Integration**: 
  - Google Gemini API for advanced natural language processing
  - Custom prompting techniques for education-specific outputs
  - Efficient context handling for relevant responses

- **Deployment**: 
  - Vercel for global CDN distribution
  - Automatic previews for pull requests
  - Environment variable management for secure configuration

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Google Cloud account (for Gemini API)

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Riddhish1/LMS-PLATFORM.git
   cd LMS-PLATFORM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5174](http://localhost:5174) to view the app in your browser.

## 📊 Database Setup

The project uses Supabase as the backend. Database migrations are located in `src/db/migrations/`.

To apply migrations:
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Apply migrations: `supabase db push`

## 🌍 Deployment

This project is deployed at: [https://lmsplatform-tan.vercel.app](https://lmsplatform-tan.vercel.app/login)

To deploy your own instance:

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`

Remember to add your environment variables in the Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

## 🧩 Project Structure

```
/src
  /components     # Reusable UI components
    /ai           # AI-related components
    /auth         # Authentication components
    /courses      # Course-related components
    /goals        # Learning goals components
    /layouts      # Layout components
    /ui           # Generic UI components
  /db             # Database migrations and schemas
  /lib            # Utility libraries
  /pages          # Main application pages
  /stores         # Zustand stores for state management
  /types          # TypeScript type definitions
```

## 🔒 Security

- Row-Level Security policies in Supabase ensure data privacy
- Environment variables protect API keys and sensitive data
- User authentication with Supabase Auth
- API key restrictions for Gemini API access

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini API](https://ai.google.dev/) 