import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Clock, Users, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingScreen from '../components/ui/LoadingScreen';

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, fetchCourses, isLoading: isLoadingCourses } = useCourseStore();
  const { userProgress, fetchUserProgress, calculateCourseProgress, removeCourseProgress, isLoading: isLoadingProgress } = useProgressStore();
  
  const [startedCourses, setStartedCourses] = useState<any[]>([]);
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
      // Get all unique course IDs from user progress
      const coursesStarted = [...new Set(userProgress
        .filter(p => p.user_id === user.id)
        .map(p => p.course_id))];
      
      // Get full course data for each started course
      const startedCoursesData = courses
        .filter(course => coursesStarted.includes(course.id))
        .map(course => {
          const progress = calculateCourseProgress(user.id, course.id);
          return {
            ...course,
            progress
          };
        });
      
      setStartedCourses(startedCoursesData);
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
      
      // Update local state by filtering out the removed course
      setStartedCourses(prev => prev.filter(course => course.id !== courseToRemove));
    }
  };
  
  const cancelRemoveCourse = () => {
    setShowConfirmation(false);
    setCourseToRemove(null);
  };
  
  if (isLoadingCourses || isLoadingProgress) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="max-w-7xl mx-auto">
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
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          All courses you've started or enrolled in
        </p>
      </motion.div>
      
      {startedCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Book size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            You haven't started any courses yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explore our course catalog and start learning today!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startedCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 group relative"
              onClick={() => handleCourseClick(course.id)}
            >
              {course.thumbnail_url && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <div className="flex items-center mb-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium mr-2 
                    ${course.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                  >
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1" />
                    <span>{course.duration || 5} hrs</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                
                <button
                  className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  {course.progress === 0 ? 'Start Course' :
                   course.progress === 100 ? 'View Certificate' :
                   'Continue Learning'}
                </button>
              </div>

              {/* Remove button for all courses */}
              <div 
                className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer z-10"
                onClick={(e) => handleRemoveCourse(e, course.id)}
              >
                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage; 