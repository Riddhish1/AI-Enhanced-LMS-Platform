import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { useAIStore } from '../../stores/aiStore';
import { useUIStore } from '../../stores/uiStore';
import { useCourseStore } from '../../stores/courseStore';
import { AIMessage } from '../../types';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { chatMessages, sendMessage, isLoading, clearChat } = useAIStore();
  const { toggleAIAssistant } = useUIStore();
  const { currentCourse, currentModule } = useCourseStore();
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  useEffect(() => {
    // Focus input when assistant opens
    inputRef.current?.focus();
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentModule) {
      sendMessage(message, currentModule.content);
      setMessage('');
    }
  };
  
  const handleClose = () => {
    toggleAIAssistant();
  };

  return (
    <motion.div 
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 md:w-96 bg-white dark:bg-gray-800 shadow-lg z-20 flex flex-col"
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-2">
            <MessageSquare size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-medium">AI Learning Assistant</h3>
        </div>
        
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
              <MessageSquare size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
              AI Learning Assistant
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Ask questions about the course content, request explanations, or get help with difficult concepts.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full">
              <button
                className="text-left p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  if (currentModule) {
                    setMessage("Can you explain this concept in simpler terms?");
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }
                }}
              >
                Can you explain this concept in simpler terms?
              </button>
              <button
                className="text-left p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  if (currentModule) {
                    setMessage("What are some practical applications of this?");
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }
                }}
              >
                What are some practical applications of this?
              </button>
              <button
                className="text-left p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => {
                  if (currentModule) {
                    setMessage("Can you provide some examples?");
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }
                }}
              >
                Can you provide some examples?
              </button>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {chatMessages.map((msg: AIMessage) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {chatMessages.length > 0 && (
          <div className="flex justify-center mb-2">
            <button
              onClick={clearChat}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear conversation
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask about ${currentCourse?.title || 'the course'}`}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!currentModule || isLoading}
          />
          <button
            type="submit"
            className={`p-2 bg-indigo-600 text-white rounded-r-md ${
              !message.trim() || !currentModule || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700'
            }`}
            disabled={!message.trim() || !currentModule || isLoading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIAssistant;