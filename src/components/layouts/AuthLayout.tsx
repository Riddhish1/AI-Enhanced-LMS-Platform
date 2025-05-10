import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Left side - Brand & Info */}
      <motion.div 
        className="md:w-1/2 bg-indigo-600 dark:bg-indigo-800 p-8 flex flex-col justify-center items-center text-white"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Lightbulb size={36} className="mr-2" />
            <h1 className="text-3xl font-bold">LearningHub</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">AI-Powered Learning Platform</h2>
          <p className="text-lg mb-6 opacity-90">
            Discover courses, track your progress, and get personalized recommendations with our Gemini AI assistant.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">Interactive Learning</h3>
              <p className="text-sm opacity-90">Engage with content through interactive exercises</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">AI Assistance</h3>
              <p className="text-sm opacity-90">Get help and explanations from our Gemini AI</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm opacity-90">Monitor your learning journey with detailed analytics</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <h3 className="font-semibold mb-2">Certificate</h3>
              <p className="text-sm opacity-90">Earn certificates upon course completion</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Right side - Auth forms */}
      <motion.div 
        className="md:w-1/2 p-8 flex flex-col justify-center"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="max-w-md w-full mx-auto">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;