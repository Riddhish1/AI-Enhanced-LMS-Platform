import { motion } from 'framer-motion';
import { Clock, Book, Users, Trash2 } from 'lucide-react';
import { Course } from '../../types';
import { useCourseStore } from '../../stores/courseStore';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
  index: number;
  onClick: (courseId: string) => void;
}

const CourseCard = ({ course, index, onClick }: CourseCardProps) => {
  const { deleteCourse } = useCourseStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const difficultyColor = {
    'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }[course.difficulty];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteCourse(course.id);
      } catch (error) {
        console.error('Error deleting course:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer transform-gpu relative"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        layout: { duration: 0.3 } 
      }}
      layout
      onClick={() => onClick(course.id)}
    >
      {/* Delete button */}
      <button
        className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-md"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete course"
      >
        <Trash2 size={16} />
        {isDeleting && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          </span>
        )}
      </button>
      
      <div className="relative">
        <img 
          src={course.thumbnail_url} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{course.duration} hrs</span>
          </div>
          
          <div className="flex items-center">
            <Book size={16} className="mr-1" />
            <span>{course.modules?.length || '5'} modules</span>
          </div>
          
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>125 students</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;