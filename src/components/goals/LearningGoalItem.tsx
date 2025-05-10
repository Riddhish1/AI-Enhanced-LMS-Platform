import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { useGoalStore } from '../../stores/goalStore';
import { LearningGoal } from '../../types';

interface LearningGoalItemProps {
  goal: LearningGoal;
}

const LearningGoalItem = ({ goal }: LearningGoalItemProps) => {
  const { updateGoal, deleteGoal } = useGoalStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);
  const [editedDescription, setEditedDescription] = useState(goal.description || '');
  const [editedDate, setEditedDate] = useState(goal.target_date?.substring(0, 10) || '');
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleStatus = () => {
    let newStatus: 'not_started' | 'in_progress' | 'completed';
    
    if (goal.status === 'not_started') {
      newStatus = 'in_progress';
    } else if (goal.status === 'in_progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'not_started';
    }
    
    updateGoal(goal.id, { status: newStatus });
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };
  
  const handleSave = () => {
    updateGoal(goal.id, {
      title: editedTitle,
      description: editedDescription,
      target_date: editedDate ? new Date(editedDate).toISOString() : undefined
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTitle(goal.title);
    setEditedDescription(goal.description || '');
    setEditedDate(goal.target_date?.substring(0, 10) || '');
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this learning goal?')) {
      deleteGoal(goal.id);
    }
  };
  
  const statusClasses = {
    not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };
  
  const statusLabels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
                placeholder="Goal title"
              />
            ) : (
              <div className="flex items-center">
                <button
                  onClick={toggleStatus}
                  className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                    goal.status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : goal.status === 'in_progress'
                        ? 'bg-blue-500 text-white'
                        : 'border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {goal.status === 'completed' && <Check size={14} />}
                </button>
                <h3 className={`text-lg font-medium ${
                  goal.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {goal.title}
                </h3>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[goal.status]}`}>
              {statusLabels[goal.status]}
            </span>
            
            <motion.button
              onClick={toggleExpanded}
              className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div 
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>
          </div>
        </div>
        
        {goal.target_date && !isEditing && (
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center ml-9">
            <Calendar size={14} className="mr-1" />
            Target: {new Date(goal.target_date).toLocaleDateString()}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="ml-9">
            {isEditing ? (
              <>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2 min-h-[80px]"
                  placeholder="Add description (optional)"
                />
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {goal.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {goal.description}
                  </p>
                )}
                
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleEdit}
                    className="flex items-center text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Edit2 size={12} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={12} className="mr-1" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LearningGoalItem; 