import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar } from 'lucide-react';
import { useGoalStore } from '../../stores/goalStore';
import { LearningGoal } from '../../types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CreateGoalModal = ({ isOpen, onClose, userId }: CreateGoalModalProps) => {
  const { createGoal } = useGoalStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setTargetDate('');
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newGoal: Omit<LearningGoal, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      title: title.trim(),
      description: description.trim() || undefined,
      target_date: targetDate ? new Date(targetDate).toISOString() : undefined,
      status: 'not_started'
    };
    
    createGoal(newGoal);
    onClose();
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Target size={18} className="mr-2 text-blue-500 dark:text-blue-400" />
                Create Learning Goal
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="E.g., Learn React fundamentals"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[80px]"
                  placeholder="Provide additional details about your goal"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={14} className="inline mr-1" />
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    title.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                  }`}
                >
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGoalModal; 