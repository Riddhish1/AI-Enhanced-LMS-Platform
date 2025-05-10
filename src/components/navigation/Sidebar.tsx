import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  Settings, 
  Award, 
  Plus,
  Users,
  Bookmark,
  Clock,
  TrendingUp,
  Star,
  Calendar,
  Search
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const menuItems = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', icon: Home, path: '/dashboard', badge: '' },
      { name: 'Create Course', icon: Plus, path: '/create-course', badge: 'New' }
    ]
  },
  {
    title: 'Learning',
    items: [
      { name: 'My Courses', icon: BookOpen, path: '/my-courses', badge: '3' },
      { name: 'Certificates', icon: Award, path: '/certificates', badge: '2' },
      { name: 'Saved', icon: Bookmark, path: '/saved', badge: '' },
      { name: 'Recent', icon: Clock, path: '/recent', badge: '' }
    ]
  },
  {
    title: 'Analytics',
    items: [
      { name: 'Progress', icon: BarChart2, path: '/progress', badge: '' },
      { name: 'Learning Goals', icon: TrendingUp, path: '/goals', badge: '' }
    ]
  }
];

const Sidebar = () => {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  
  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    closed: { 
      x: -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    open: {
      x: 0,
      opacity: 1
    },
    closed: {
      x: -20,
      opacity: 0
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
    <motion.div 
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-[#1a1f2d]/95 backdrop-blur-sm shadow-xl z-10 border-r border-gray-800 overflow-hidden"
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
          style={{ position: 'fixed', zIndex: 40 }}
        >
          <div className="h-full flex flex-col">
            {/* User Profile Section */}
            <motion.div 
              variants={itemVariants}
              className="p-6 border-b border-gray-800"
    >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    Learning Explorer
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400">Courses</div>
                  <div className="text-lg font-semibold text-teal-400">12</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400">Hours</div>
                  <div className="text-lg font-semibold text-teal-400">48</div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for courses..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {menuItems.map((section, idx) => (
                <motion.div
                  key={section.title}
                  className="mb-8"
                  variants={itemVariants}
                >
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                    {section.title}
                  </h2>
                  <nav className="space-y-1">
                    {section.items.map((item) => (
            <NavLink 
                        key={item.path}
                        to={item.path}
              className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive 
                              ? 'bg-blue-500/10 text-blue-400' 
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                          }`
                        }
                      >
                        <item.icon size={18} className="mr-3 transition-transform group-hover:scale-110" />
                        <span className="font-medium flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.badge === 'New' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
            </NavLink>
                    ))}
          </nav>
                </motion.div>
              ))}
        </div>
        
            {/* Bottom Section */}
            <motion.div
              variants={itemVariants}
              className="p-4 border-t border-gray-800"
            >
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">
                    Daily Streak
                  </span>
                  <Calendar className="w-5 h-5 text-blue-400" />
        </div>
                <div className="flex items-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${
                        i < 5 
                          ? 'bg-gradient-to-r from-blue-500 to-teal-400'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
        </div>
                <p className="text-xs text-gray-400 mt-2">
                  5 days streak! Keep going!
                </p>
        </div>
            </motion.div>
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;