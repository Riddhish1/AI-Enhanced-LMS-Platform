# 🚀 Modern Learning Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3-blueviolet)

A modern, feature-rich learning management system built with React, TypeScript, Supabase, and enhanced with Google's Gemini AI.

![App Screenshot](https://via.placeholder.com/800x400?text=Learning+Platform+Screenshot)

## ✨ Features

### Core Features
- **📚 Course Management** - Browse, enroll, and track progress in various courses
- **🎯 Learning Goals** - Set personal learning objectives with deadlines and track progress
- **🎓 Progress Tracking** - Detailed analytics to monitor your learning journey
- **🔄 Course Removal** - Easily remove courses from your dashboard
- **🎨 Dark/Light Mode** - Beautiful UI with theme support

### AI Integration
- **🤖 Gemini AI Assistant** - Get personalized learning recommendations
- **📝 AI-Generated Summaries** - Automatic content summaries for quick review
- **❓ Smart Quiz Generation** - AI-powered quizzes based on course content

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **AI**: Google Gemini API
- **Deployment**: Vercel

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

This project is configured for easy deployment to Vercel:

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`

Remember to add your environment variables in the Vercel dashboard.

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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini API](https://ai.google.dev/) 