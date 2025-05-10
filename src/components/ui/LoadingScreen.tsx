import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10 pointer-events-none z-0" />
      
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center max-w-lg px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center justify-center mb-8 relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-10 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-xl" />
          
          <svg className="w-20 h-20 relative" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M16 2L4 8V24L16 30L28 24V8L16 2Z"
              className="fill-indigo-500 dark:fill-indigo-400"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity
              }}
            />
            <motion.path
              d="M16 8L10 11V21L16 24L22 21V11L16 8Z"
              className="fill-teal-500 dark:fill-teal-400"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: "easeOut"
              }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="space-y-3 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
            LearningHub
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loading amazing content for you...
          </p>
        </motion.div>

        <motion.div
          className="mt-10 w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center space-x-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 shadow-md"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="fixed top-40 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-teal-400/10 dark:bg-teal-600/5 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
    </div>
  );
};

export default LoadingScreen;