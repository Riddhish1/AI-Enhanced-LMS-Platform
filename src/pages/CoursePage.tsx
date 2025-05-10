import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { useProgressStore } from '../stores/progressStore';
import CourseHeader from '../components/courses/CourseHeader';
import ModuleNavigation from '../components/courses/ModuleNavigation';
import ModuleContent from '../components/courses/ModuleContent';
import LoadingScreen from '../components/ui/LoadingScreen';

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { currentCourse, currentModule, fetchCourseDetails, isLoading } = useCourseStore();
  const { 
    userProgress, 
    fetchUserProgress, 
    updateProgress, 
    calculateCourseProgress 
  } = useProgressStore();
  
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
    }
  }, [id, fetchCourseDetails]);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id);
    }
  }, [user?.id, fetchUserProgress]);
  
  useEffect(() => {
    if (user?.id && currentCourse?.id) {
      // Calculate course progress
      const progressPercentage = calculateCourseProgress(user.id, currentCourse.id);
      setProgress(progressPercentage);
      
      // Get completed modules
      const completed = userProgress
        .filter(p => p.user_id === user.id && p.course_id === currentCourse.id && p.completed)
        .map(p => p.module_id);
      
      setCompletedModules(completed);
    }
  }, [userProgress, user?.id, currentCourse?.id, calculateCourseProgress]);
  
  const handleSelectModule = (moduleId: string) => {
    if (currentCourse?.modules) {
      const module = currentCourse.modules.find(m => m.id === moduleId);
      if (module) {
        useCourseStore.setState({ currentModule: module });
      }
    }
  };
  
  const handleCompleteModule = () => {
    if (user?.id && currentCourse?.id && currentModule?.id) {
      updateProgress({
        user_id: user.id,
        course_id: currentCourse.id,
        module_id: currentModule.id,
        completed: true
      });
    }
  };
  
  if (isLoading || !currentCourse || !currentModule) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <CourseHeader 
        course={currentCourse} 
        progress={progress} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ModuleNavigation 
            modules={currentCourse.modules || []}
            currentModuleId={currentModule.id}
            completedModules={completedModules}
            onSelectModule={handleSelectModule}
          />
        </div>
        
        <div className="md:col-span-2">
          <ModuleContent 
            module={currentModule}
            onComplete={handleCompleteModule}
            isCompleted={completedModules.includes(currentModule.id)}
            currentModuleIndex={currentCourse.modules?.findIndex(m => m.id === currentModule.id) || 0}
            totalModules={currentCourse.modules?.length || 1}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;