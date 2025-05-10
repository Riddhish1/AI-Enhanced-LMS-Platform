import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Filter, Award, ChevronDown } from 'lucide-react';
import { useGoalStore } from '../../stores/goalStore';
import { useAuthStore } from '../../stores/authStore';
import LearningGoalItem from './LearningGoalItem';
import CreateGoalModal from './CreateGoalModal';

const LearningGoalsList = () => {
  const { user } = useAuthStore();
  const { goals, fetchGoals, isLoading } = useGoalStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      fetchGoals(user.id);
    }
  }, [user?.id, fetchGoals]);
  
  const filteredGoals = filterStatus === 'all' 
    ? goals 
    : goals.filter(goal => goal.status === filterStatus);
  
  const statusCounts = {
    total: goals.length,
    not_started: goals.filter(goal => goal.status === 'not_started').length,
    in_progress: goals.filter(goal => goal.status === 'in_progress').length,
    completed: goals.filter(goal => goal.status === 'completed').length
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Target size={20} className="mr-2 text-blue-500 dark:text-blue-400" />
          Learning Goals
        </h2>
        
        <div className="flex items-center space-x-2">
          <motion.button
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            {showFilters && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-44">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Filter by status
                </div>
                <div>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm ${
                      filterStatus === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { setFilterStatus('all'); setShowFilters(false); }}
                  >
                    All Goals ({statusCounts.total})
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm ${
                      filterStatus === 'in_progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { setFilterStatus('in_progress'); setShowFilters(false); }}
                  >
                    In Progress ({statusCounts.in_progress})
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm ${
                      filterStatus === 'not_started' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { setFilterStatus('not_started'); setShowFilters(false); }}
                  >
                    Not Started ({statusCounts.not_started})
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm ${
                      filterStatus === 'completed' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { setFilterStatus('completed'); setShowFilters(false); }}
                  >
                    Completed ({statusCounts.completed})
                  </button>
                </div>
              </div>
            )}
          </motion.button>
          
          <motion.button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </motion.button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Progress</span>
          <span>
            {statusCounts.completed} of {statusCounts.total} goals completed ({
              statusCounts.total > 0 
                ? Math.round((statusCounts.completed / statusCounts.total) * 100) 
                : 0
            }%)
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
            style={{ 
              width: `${statusCounts.total > 0 ? (statusCounts.completed / statusCounts.total) * 100 : 0}%` 
            }}
          />
        </div>
      </div>
      
      {/* Goals List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
        
        {!isLoading && filteredGoals.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
              <Target size={24} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No learning goals found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {filterStatus === 'all' 
                ? "You haven't set any learning goals yet. Create your first goal to track your learning progress." 
                : `You don't have any goals with "${filterStatus}" status.`}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Create First Goal
            </button>
          </div>
        )}
        
        {!isLoading && filteredGoals.length > 0 && (
          <div>
            {filteredGoals.map(goal => (
              <LearningGoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
      
      {user && (
        <CreateGoalModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          userId={user.id} 
        />
      )}
    </div>
  );
};

export default LearningGoalsList; 