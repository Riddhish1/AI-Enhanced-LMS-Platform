import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="text-9xl font-bold text-indigo-600 dark:text-indigo-400">
            404
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button 
            variant="primary" 
            leftIcon={<Home size={16} />}
          >
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;