import { motion } from 'framer-motion';
import { Module } from '../../types';
import { CheckCircle, Circle } from 'lucide-react';

interface ModuleNavigationProps {
  modules: Module[];
  currentModuleId: string;
  completedModules: string[];
  onSelectModule: (moduleId: string) => void;
}

const ModuleNavigation = ({ 
  modules, 
  currentModuleId, 
  completedModules, 
  onSelectModule 
}: ModuleNavigationProps) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Course Modules
      </h3>
      <div className="space-y-2">
        {modules.map((module) => {
          const isActive = module.id === currentModuleId;
          const isCompleted = completedModules.includes(module.id);
          
          return (
            <motion.button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`w-full flex items-center p-3 rounded-md text-left transition-colors duration-200 ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mr-3 text-indigo-600 dark:text-indigo-400">
                {isCompleted ? (
                  <CheckCircle size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">
                  {module.title}
                </h4>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ModuleNavigation;