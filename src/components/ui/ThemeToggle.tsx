import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow flex items-center gap-2 select-none transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-5 h-5 flex items-center justify-center"
          >
            {theme === 'light' ? (
              <Sun size={16} className="text-amber-500" />
            ) : theme === 'dark' ? (
              <Moon size={16} className="text-indigo-400" />
            ) : (
              <Monitor size={16} className="text-gray-600 dark:text-gray-400" />
            )}
          </motion.div>
        </AnimatePresence>
        
        <span className="hidden md:inline text-gray-700 dark:text-gray-300">
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="space-y-1 p-1">
              <ThemeOption 
                icon={Sun} 
                label="Light" 
                onClick={() => handleThemeChange('light')} 
                active={theme === 'light'}
                color="amber"
              />
              <ThemeOption 
                icon={Moon} 
                label="Dark" 
                onClick={() => handleThemeChange('dark')} 
                active={theme === 'dark'}
                color="indigo"
              />
              <ThemeOption 
                icon={Monitor} 
                label="System" 
                onClick={() => handleThemeChange('system')} 
                active={theme === 'system'}
                color="gray"
              />
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 px-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Theme preference is saved in your browser
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ThemeOptionProps {
  icon: any;
  label: string;
  onClick: () => void;
  active: boolean;
  color: string;
}

const ThemeOption = ({ icon: Icon, label, onClick, active, color }: ThemeOptionProps) => {
  const colorMap: Record<string, string> = {
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-500",
  };
  
  const bgColor = colorMap[color] || "bg-blue-500";
  
  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center w-full px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
        active
          ? `bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="w-7 h-7 flex items-center justify-center mr-2">
        <Icon size={18} className={active ? `text-${color}-500 dark:text-${color}-400` : "text-gray-500 dark:text-gray-400"} />
      </div>
      
      <span>{label}</span>
      
      {active && (
        <div className="ml-auto">
          <div className={`w-5 h-5 ${bgColor} rounded-full flex items-center justify-center`}>
            <Check size={12} className="text-white" />
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default ThemeToggle;