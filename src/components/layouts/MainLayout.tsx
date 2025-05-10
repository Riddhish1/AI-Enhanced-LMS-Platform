import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../navigation/Navbar';
import Sidebar from '../navigation/Sidebar';
import AIAssistant from '../ai/AIAssistant';
import { useUIStore } from '../../stores/uiStore';

const MainLayout = () => {
  const { sidebarOpen, aiAssistantOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10 pointer-events-none z-0" />
      
      <Navbar />
      <Sidebar />
      
      <AnimatePresence>
        {aiAssistantOpen && <AIAssistant />}
      </AnimatePresence>
        
        <motion.main 
        className={`pt-16 min-h-screen transition-all duration-300 relative z-10 ${
          sidebarOpen ? 'md:pl-72' : ''
          }`}
        animate={{ 
          paddingLeft: sidebarOpen ? '18rem' : '0rem',
          paddingRight: aiAssistantOpen ? '24rem' : '0rem'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
          </motion.div>
        </div>
        </motion.main>
        
      {/* Decorative elements */}
      <div className="fixed top-40 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-teal-400/10 dark:bg-teal-600/5 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
};

export default MainLayout;