import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import ThemeToggle from '../ui/ThemeToggle';
import { BookOpen, Award, BarChart2, User, Settings, LogOut, Sparkles } from 'lucide-react';

const Logo = () => (
  <motion.svg 
    className="w-8 h-8" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ rotate: 10 }}
    transition={{ duration: 0.3 }}
  >
    <path d="M16 2L4 8V24L16 30L28 24V8L16 2Z" className="fill-indigo-500 dark:fill-indigo-400" />
    <path d="M16 8L10 11V21L16 24L22 21V11L16 8Z" className="fill-teal-500 dark:fill-teal-400" />
  </motion.svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { sidebarOpen, toggleSidebar, toggleAIAssistant } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <motion.nav 
      className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm z-40 transition-colors duration-300 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="Toggle sidebar"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            
            <Link to="/dashboard" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Logo />
              </motion.div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent hidden sm:inline-block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                LearningHub
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* AI Assistant Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-900/30 dark:to-teal-900/30 hover:from-indigo-100 hover:to-teal-100 dark:hover:from-indigo-900/50 dark:hover:to-teal-900/50 transition-colors duration-200 shadow-sm"
              onClick={() => toggleAIAssistant()}
              aria-label="Toggle AI assistant"
            >
              <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </motion.button>
            
            {/* Notifications Button */}
            <div className="relative" ref={notificationsRef}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-900/30 dark:to-teal-900/30 hover:from-indigo-100 hover:to-teal-100 dark:hover:from-indigo-900/50 dark:hover:to-teal-900/50 transition-colors duration-200 shadow-sm"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </motion.button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">New course available</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Advanced Web Development is now available</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Your course is complete</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Congratulations on completing React Fundamentals</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 text-center">
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                        View all notifications
            </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <ThemeToggle />
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium shadow-lg">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
              </motion.button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Learning Explorer
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <NavItem 
                        icon={BookOpen} 
                        label="My Courses" 
                        onClick={() => navigateTo('/my-courses')} 
                      />
                      <NavItem 
                        icon={Award} 
                        label="Certificates" 
                        onClick={() => navigateTo('/certificates')} 
                      />
                      <NavItem 
                        icon={BarChart2} 
                        label="Progress Analytics" 
                        onClick={() => navigateTo('/progress')} 
                      />
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                      <NavItem 
                        icon={User} 
                        label="Profile" 
                        onClick={() => navigateTo('/profile')} 
                      />
                      <NavItem 
                        icon={Settings} 
                        label="Settings" 
                        onClick={() => navigateTo('/settings')} 
                      />
                      <NavItem 
                        icon={LogOut} 
                        label="Sign out" 
                  onClick={handleSignOut}
                        danger
                      />
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

interface NavItemProps {
  icon: any;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const NavItem = ({ icon: Icon, label, onClick, danger = false }: NavItemProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-sm ${
        danger 
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      } transition-colors duration-200`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </motion.button>
  );
};

export default Navbar;