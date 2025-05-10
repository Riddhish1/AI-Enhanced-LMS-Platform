import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  BarChart, 
  LineChart, 
  Clock, 
  Calendar, 
  BookOpen, 
  Award, 
  Target, 
  Star, 
  TrendingUp 
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingScreen from '../components/ui/LoadingScreen';

const ProgressAnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, fetchCourses, isLoading: isLoadingCourses } = useCourseStore();
  const { userProgress, fetchUserProgress, calculateCourseProgress, isLoading: isLoadingProgress } = useProgressStore();
  
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
  const [notStartedCourses, setNotStartedCourses] = useState<any[]>([]);
  const [learningStats, setLearningStats] = useState({
    totalHoursLearned: 0,
    averageCompletion: 0,
    activeDaysStreak: 0,
    certificatesEarned: 0,
    totalModulesCompleted: 0,
    totalCoursesStarted: 0
  });
  
  // Simulated weekly activity data (in a real app, this would come from actual user data)
  const [weeklyActivity, setWeeklyActivity] = useState<{day: string, hours: number}[]>([]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id);
    }
  }, [user?.id, fetchUserProgress]);
  
  useEffect(() => {
    // Generate simulated weekly activity data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const simulatedData = days.map(day => ({
      day,
      hours: Math.random() * 3 + 0.5 // Generate a random number between 0.5 and 3.5
    }));
    setWeeklyActivity(simulatedData);
  }, []);
  
  useEffect(() => {
    if (courses.length > 0 && userProgress.length > 0 && user?.id) {
      // Process course progress data
      const progressMap: { [key: string]: number } = {};
      
      // Calculate progress for each course
      courses.forEach(course => {
        progressMap[course.id] = calculateCourseProgress(user.id, course.id);
      });
      
      // Categorize courses based on progress
      const completed: any[] = [];
      const inProgress: any[] = [];
      const notStarted: any[] = [];
      
      courses.forEach(course => {
        const progress = progressMap[course.id] || 0;
        
        const enrichedCourse = {
          ...course,
          progress
        };
        
        if (progress === 100) {
          completed.push(enrichedCourse);
        } else if (progress > 0) {
          inProgress.push(enrichedCourse);
        } else {
          notStarted.push(enrichedCourse);
        }
      });
      
      setCompletedCourses(completed);
      setInProgressCourses(inProgress);
      setNotStartedCourses(notStarted);
      
      // Calculate learning statistics
      const completedModules = userProgress.filter(p => p.user_id === user.id && p.completed).length;
      const totalHours = completed.reduce((sum, course) => sum + (course.duration || 0), 0) +
                         inProgress.reduce((sum, course) => sum + ((course.progress / 100) * (course.duration || 0)), 0);
      
      const avgCompletion = courses.length > 0 
        ? (completed.length * 100 + inProgress.reduce((sum, c) => sum + c.progress, 0)) / courses.length 
        : 0;
        
      // Simulate an active streak between 1-14 days
      const streak = Math.floor(Math.random() * 14) + 1;
      
      setLearningStats({
        totalHoursLearned: parseFloat(totalHours.toFixed(1)),
        averageCompletion: parseFloat(avgCompletion.toFixed(2)),
        activeDaysStreak: streak,
        certificatesEarned: completed.length,
        totalModulesCompleted: completedModules,
        totalCoursesStarted: inProgress.length + completed.length
      });
    }
  }, [courses, userProgress, user?.id, calculateCourseProgress]);
  
  if (isLoadingCourses || isLoadingProgress) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Learning Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress, analyze your learning patterns, and set goals
        </p>
      </motion.div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</h3>
              <Clock size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {learningStats.totalHoursLearned}h
            </p>
          </div>
          
          {/* Active Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Streak</h3>
              <Calendar size={18} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {learningStats.activeDaysStreak} days
            </p>
          </div>
          
          {/* Courses Started */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Started</h3>
              <BookOpen size={18} className="text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {learningStats.totalCoursesStarted}
            </p>
          </div>
          
          {/* Completion Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
              <PieChart size={18} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {learningStats.averageCompletion}%
            </p>
          </div>
        </div>
        
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Learning Activity</h3>
            <BarChart size={18} className="text-blue-500" />
          </div>
          
          <div className="h-40 pt-5 flex items-end justify-between">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  style={{ height: `${(day.hours / 3.5) * 100}%` }}
                  className="w-6 bg-blue-500 dark:bg-blue-600 rounded-t-sm"
                ></div>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Course Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Progress Breakdown</h3>
            <PieChart size={18} className="text-purple-500" />
          </div>
          
          <div className="my-3 h-40 relative">
            {/* Simple pie chart visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '100%' }}>
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(completedCourses.length / Math.max(courses.length, 1)) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ 
                      width: `${(inProgressCourses.length / Math.max(courses.length, 1)) * 100}%`,
                      marginTop: `-${(completedCourses.length / Math.max(courses.length, 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <div className="h-2 w-full bg-green-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
              <p className="font-semibold text-sm">{completedCourses.length}</p>
            </div>
            <div>
              <div className="h-2 w-full bg-yellow-500 rounded mb-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">In Progress</span>
              <p className="font-semibold text-sm">{inProgressCourses.length}</p>
            </div>
            <div>
              <div className="h-2 w-full bg-blue-600 rounded mb-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Not Started</span>
              <p className="font-semibold text-sm">{notStartedCourses.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Completion Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Course Completion Status</h3>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${(completedCourses.length / Math.max(courses.length, 1)) * 100}%` }}
            >
              {completedCourses.length > 0 && `${completedCourses.length} Completed`}
            </div>
            <div 
              className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${(inProgressCourses.length / Math.max(courses.length, 1)) * 100}%` }}
            >
              {inProgressCourses.length > 0 && `${inProgressCourses.length} In Progress`}
            </div>
            <div 
              className="bg-blue-600 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${(notStartedCourses.length / Math.max(courses.length, 1)) * 100}%` }}
            >
              {notStartedCourses.length > 0 && 
                `${notStartedCourses.length} Not Started`}
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Achievements</h3>
            <Star size={18} className="text-amber-500" />
          </div>
          
          <ul className="space-y-4">
            {learningStats.certificatesEarned > 0 && (
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mt-0.5">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Certificate Collector
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earned {learningStats.certificatesEarned} certificate{learningStats.certificatesEarned > 1 ? 's' : ''}
                  </p>
                </div>
              </li>
            )}
            
            {learningStats.totalHoursLearned >= 10 && (
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Dedicated Learner
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Spent over {Math.floor(learningStats.totalHoursLearned)} hours learning
                  </p>
                </div>
              </li>
            )}
            
            {learningStats.activeDaysStreak >= 3 && (
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Consistent Learner
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {learningStats.activeDaysStreak} day learning streak
                  </p>
                </div>
              </li>
            )}
            
            {learningStats.totalModulesCompleted >= 5 && (
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Knowledge Hunter
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed {learningStats.totalModulesCompleted} learning modules
                  </p>
                </div>
              </li>
            )}
            
            {learningStats.totalCoursesStarted === 0 && (
              <li className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
                Complete courses to unlock achievements
              </li>
            )}
          </ul>
        </div>
        
        {/* Learning Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Learning Goals</h3>
            <Target size={18} className="text-red-500" />
          </div>
          
          <ul className="space-y-4">
            <li>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Complete an advanced course
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {learningStats.certificatesEarned > 0 ? '100%' : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: learningStats.certificatesEarned > 0 ? '100%' : '0%' }}
                ></div>
              </div>
            </li>
            
            <li>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Earn 5 certificates
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.min(learningStats.certificatesEarned * 20, 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(learningStats.certificatesEarned * 20, 100)}%` }}
                ></div>
              </div>
            </li>
            
            <li>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maintain a 7-day learning streak
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.min(Math.round((learningStats.activeDaysStreak / 7) * 100), 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.round((learningStats.activeDaysStreak / 7) * 100), 100)}%` }}
                ></div>
              </div>
            </li>
            
            <li>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Complete 20 learning modules
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.min(Math.round((learningStats.totalModulesCompleted / 20) * 100), 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.round((learningStats.totalModulesCompleted / 20) * 100), 100)}%` }}
                ></div>
              </div>
            </li>
          </ul>
          
          <button
            className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center"
            onClick={() => navigate('/dashboard')}
          >
            <Target size={16} className="mr-2" />
            Set Custom Learning Goals
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalyticsPage; 