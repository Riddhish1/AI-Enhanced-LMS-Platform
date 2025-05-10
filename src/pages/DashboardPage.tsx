import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, Calendar, Filter, Settings, ChevronRight, TrendingUp, Award, BookMarked, Trash2, X, Target } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { useProgressStore } from '../stores/progressStore';
import { useUIStore } from '../stores/uiStore';
import LoadingScreen from '../components/ui/LoadingScreen';
import LearningGoalsList from '../components/goals/LearningGoalsList';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const { courses, fetchCourses, isLoading: isLoadingCourses } = useCourseStore();
  const { userProgress, fetchUserProgress, calculateCourseProgress, removeCourseProgress, isLoading: isLoadingProgress } = useProgressStore();
  
  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id);
    }
  }, [user?.id, fetchUserProgress]);
  
  useEffect(() => {
    if (courses.length > 0 && userProgress.length > 0 && user?.id) {
      // Get courses with progress
      const coursesWithProgress = courses.map(course => {
        const progress = calculateCourseProgress(user.id, course.id);
        return {
          ...course,
          progress
        };
      });
      
      // Get active courses (started but not completed)
      const active = coursesWithProgress.filter(course => course.progress > 0 && course.progress < 100);
      setActiveCourses(active);
      
      // For demo purposes, recommended courses are those not started yet
      const notStarted = coursesWithProgress.filter(course => course.progress === 0);
      setRecommendedCourses(notStarted);
    }
  }, [courses, userProgress, user?.id, calculateCourseProgress]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleRemoveCourse = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation(); // Prevent navigation to course
    setCourseToRemove(courseId);
    setShowConfirmation(true);
  };

  const confirmRemoveCourse = async () => {
    if (courseToRemove && user?.id) {
      await removeCourseProgress(user.id, courseToRemove);
      setShowConfirmation(false);
      setCourseToRemove(null);
    }
  };
  
  const cancelRemoveCourse = () => {
    setShowConfirmation(false);
    setCourseToRemove(null);
  };

  const filteredCourses = () => {
    if (activeTab === 'all') {
      return courses;
    } else if (activeTab === 'in-progress') {
      return activeCourses;
    } else if (activeTab === 'completed') {
      return courses.filter(course => 
        calculateCourseProgress(user?.id as string, course.id) === 100
  );
    }
    return courses;
  };
  
  if (isLoadingCourses || isLoadingProgress) {
    return <LoadingScreen />;
  }

  // Stats data (for demo purposes)
  const stats = [
    { 
      label: "Total Courses", 
      value: courses.length, 
      icon: BookOpen, 
      color: "bg-blue-500 dark:bg-blue-600" 
    },
    { 
      label: "In Progress", 
      value: activeCourses.length, 
      icon: TrendingUp, 
      color: "bg-teal-500 dark:bg-teal-600" 
    },
    { 
      label: "Completed", 
      value: courses.filter(course => 
        calculateCourseProgress(user?.id as string, course.id) === 100
      ).length, 
      icon: Award, 
      color: "bg-purple-500 dark:bg-purple-600" 
    },
  ];

  return (
    <div className={`transition-all duration-300`}>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Remove Course Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove this course? All your progress for this course will be deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelRemoveCourse}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveCourse}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
          >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 mb-2">
          My Learning Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Track your progress, manage certificates, and discover new courses
        </p>
      </motion.div>
      
      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Courses and Goals */}
        <div className="lg:col-span-2">
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200 overflow-hidden relative"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-6 flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm mb-8 border border-gray-100 dark:border-gray-700">
            <motion.button
              className={`px-4 py-2 font-medium text-sm rounded-md transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Courses
            </motion.button>
            <motion.button
              className={`px-4 py-2 font-medium text-sm rounded-md transition-all duration-200 ${
                activeTab === 'in-progress' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('in-progress')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              In Progress
            </motion.button>
            <motion.button
              className={`px-4 py-2 font-medium text-sm rounded-md transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setActiveTab('completed')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Completed
            </motion.button>
            
            <div className="ml-auto flex items-center gap-1">
              <motion.button 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Filter size={18} className="text-gray-500 dark:text-gray-400" />
              </motion.button>
              <motion.button 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings size={18} className="text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {filteredCourses().map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group relative"
                onClick={() => handleCourseClick(course.id)}
              >
                {course.thumbnail_url ? (
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {calculateCourseProgress(user?.id as string, course.id) > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-teal-500"
                          style={{ width: `${calculateCourseProgress(user?.id as string, course.id)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center relative">
                    <BookMarked size={48} className="text-white/70" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
                    {calculateCourseProgress(user?.id as string, course.id) > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/30">
                        <div 
                          className="h-full bg-white/50"
                          style={{ width: `${calculateCourseProgress(user?.id as string, course.id)}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    {calculateCourseProgress(user?.id as string, course.id) === 100 && (
                      <div className="flex-shrink-0 ml-2">
                        <Star size={18} className="text-yellow-400 drop-shadow" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Clock size={16} className="mr-1" />
                    <span>{course.duration || 5} hrs</span>
                    <span className="mx-2">•</span>
                    <Calendar size={16} className="mr-1" />
                    <span>Updated 2w ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      course.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : course.difficulty === 'intermediate' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                    >
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </span>
                    
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {calculateCourseProgress(user?.id as string, course.id)}% complete
                    </span>
                  </div>
                </div>
                
                <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 rounded-full p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />
                </div>

                {/* Remove button for all courses */}
                <div 
                  className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                  onClick={(e) => handleRemoveCourse(e, course.id)}
                >
                  <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredCourses().length === 0 && (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={36} className="text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                No courses found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "You haven't enrolled in any courses yet. Explore our catalog and start learning!" 
                  : activeTab === 'in-progress'
                    ? "You don't have any courses in progress. Continue learning or start a new course!"
                    : "You haven't completed any courses yet. Keep learning!"}
              </p>
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Courses
              </motion.button>
            </motion.div>
          )}
        </div>
        
        {/* Sidebar - Learning Goals */}
        <div className="lg:col-span-1">
          <LearningGoalsList />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;