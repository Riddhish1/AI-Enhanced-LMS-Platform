import { motion } from 'framer-motion';
import { Clock, Award, Calendar } from 'lucide-react';
import { Course } from '../../types';
import Button from '../ui/Button';

interface CourseHeaderProps {
  course: Course;
  progress: number;
}

const CourseHeader = ({ course, progress }: CourseHeaderProps) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64">
        <img 
          src={course.thumbnail_url} 
          alt={course.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 w-full p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {course.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90 text-sm">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center">
                <Award size={16} className="mr-1" />
                <span>
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>
                  {new Date(course.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
          
          <Button variant="primary" size="sm">
            Continue Learning
          </Button>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300">
          {course.description}
        </p>
      </div>
    </motion.div>
  );
};

export default CourseHeader;