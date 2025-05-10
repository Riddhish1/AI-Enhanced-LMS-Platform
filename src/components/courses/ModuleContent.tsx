import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Module, YouTubeVideo } from '../../types';
import Button from '../ui/Button';
import { useAIStore } from '../../stores/aiStore';
import { ArrowRight, Book, Youtube, Play, ExternalLink, CornerRightDown, Clock, Sparkles, RefreshCw, Award } from 'lucide-react';
import { generateVideoSummary, searchYouTubeVideos } from '../../services/youtubeService';
import { generateStudyQuestions, generateObjectiveQuestions } from '../../lib/gemini';

interface ModuleContentProps {
  module: Module;
  onComplete: () => void;
  isCompleted: boolean;
  currentModuleIndex?: number;
  totalModules?: number;
}

const ModuleContent = ({ module, onComplete, isCompleted, currentModuleIndex = 0, totalModules = 1 }: ModuleContentProps) => {
  const { generateSummary, courseSummary, isLoading } = useAIStore();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videoSummary, setVideoSummary] = useState<string>('');
  const [isGeneratingVideoSummary, setIsGeneratingVideoSummary] = useState(false);
  const [studyQuestions, setStudyQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isRefreshingVideos, setIsRefreshingVideos] = useState(false);
  const [moduleVideos, setModuleVideos] = useState<YouTubeVideo[]>(module.videos || []);
  const [showCertificate, setShowCertificate] = useState(false);
  const [objectiveAnswers, setObjectiveAnswers] = useState<{[key: string]: string}>({});
  const [objectiveQuestions, setObjectiveQuestions] = useState<{question: string, options: string[], answer: string}[]>([]);
  const [isGeneratingObjectiveQuestions, setIsGeneratingObjectiveQuestions] = useState(false);

  // Reset state when module changes
  useEffect(() => {
    // Clear previous content
    setSelectedVideo(null);
    setVideoSummary('');
    setStudyQuestions([]);
    setShowSummary(false);
    setModuleVideos(module.videos || []);
    setObjectiveQuestions([]);
    setObjectiveAnswers({});
    
    // Load videos for this module
    loadVideosForModule();
  }, [module.id]); // Dependency on module.id ensures it runs only when module changes

  // Function to load videos for the current module
  const loadVideosForModule = async () => {
    // If module already has videos, use them
    if (module.videos && module.videos.length >= 3) {
      console.log('Using existing videos for module:', module.id);
      setModuleVideos(module.videos);
      return;
    }
    
    // If module has no videos or fewer than 3, fetch some
    setIsRefreshingVideos(true);
    
    try {
      // Create a search query based on module content
      const searchQuery = `${module.title} ${module.content.substring(0, 100)}`;
      console.log('Auto-fetching videos for module:', module.id);
      const videos = await searchYouTubeVideos(searchQuery, 3);
      
      if (videos.length > 0) {
        // If module already had some videos, merge them
        if (module.videos && module.videos.length > 0) {
          // Get video IDs that already exist to avoid duplicates
          const existingVideoIds = module.videos.map(v => v.id);
          // Filter out videos that already exist in the module
          const newVideos = videos.filter(v => !existingVideoIds.includes(v.id));
          // Combine existing videos with new ones (up to 3 total)
          const combinedVideos = [...module.videos, ...newVideos].slice(0, 3);
          setModuleVideos(combinedVideos);
    } else {
          // If no existing videos, use all new videos
          setModuleVideos(videos);
    }
      }
    } catch (error) {
      console.error('Error auto-loading videos:', error);
    } finally {
      setIsRefreshingVideos(false);
    }
  };

  const handleGenerateSummary = () => {
    generateSummary(module.content);
    setShowSummary(true);
  };
  
  const handleRefreshVideos = async () => {
    setIsRefreshingVideos(true);
    try {
      // Create a search query based on module content
      const searchQuery = `${module.title} ${module.content.substring(0, 100)}`;
      const videos = await searchYouTubeVideos(searchQuery, 3);
      
      if (videos.length > 0) {
        setModuleVideos(videos);
      }
    } catch (error) {
      console.error('Error refreshing videos:', error);
    } finally {
      setIsRefreshingVideos(false);
    }
  };

  const playVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateVideoSummary = async () => {
    if (!selectedVideo) return;
    
    setIsGeneratingVideoSummary(true);
    try {
      const summary = await generateVideoSummary(selectedVideo.id, module.content);
      setVideoSummary(summary);
    } catch (error) {
      console.error('Error generating video summary:', error);
    } finally {
      setIsGeneratingVideoSummary(false);
    }
  };

  const handleRefreshQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const moduleText = module.content + (videoSummary ? '\n\n' + videoSummary : '');
      const questions = await generateStudyQuestions(moduleText);
      setStudyQuestions(questions);
      
      // Also generate objective questions at the same time
      await generateObjectiveQuestionsForModule();
    } catch (error) {
      console.error('Error refreshing study questions:', error);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const generateObjectiveQuestionsForModule = async () => {
    setIsGeneratingObjectiveQuestions(true);
    try {
      // Use the Gemini API to generate objective questions
      const content = module.content + (videoSummary ? '\n\n' + videoSummary : '');
      const questions = await generateObjectiveQuestions(content);
      
      if (questions && questions.length > 0) {
        setObjectiveQuestions(questions);
      } else {
        console.error('No valid questions generated');
        // Fallback to pre-defined questions if needed
      }
    } catch (error) {
      console.error('Error generating objective questions:', error);
    } finally {
      setIsGeneratingObjectiveQuestions(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setObjectiveAnswers({
      ...objectiveAnswers,
      [questionIndex]: answer
    });
  };

  const handleCompleteModule = () => {
    // Show certificate only if this is the last module AND all modules are completed
    if (currentModuleIndex === totalModules - 1) {
      // Add a slight delay to show the certificate for better UX
      setTimeout(() => {
        setShowCertificate(true);
      }, 500);
    }
    
    onComplete();
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={module.id}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {module.title}
      </h2>
      
      {/* Selected Video Player */}
      {selectedVideo && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden mb-4">
            <iframe
              src={`${selectedVideo.embedUrl}?autoplay=1`}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo.title}
            ></iframe>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedVideo.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedVideo.channelTitle} • Duration: {selectedVideo.duration}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateVideoSummary}
              leftIcon={<Book size={16} />}
              isLoading={isGeneratingVideoSummary}
            >
              {videoSummary ? 'Regenerate Summary' : 'Summarize Video'}
            </Button>
          </div>
          
          {/* Video Summary */}
          {videoSummary && (
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <Sparkles size={18} className="text-blue-600 dark:text-blue-400 mr-2" />
                <h4 className="text-md font-semibold text-blue-700 dark:text-blue-300">
                  Video Summary
                </h4>
              </div>
              <div className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none whitespace-pre-line">
                {videoSummary}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <div className="prose prose-indigo dark:prose-invert max-w-none mb-6">
        <p>{module.content}</p>
      </div>
      
      {/* Module Summary */}
      {showSummary && (
        <motion.div 
          className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-3">
            <Book size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
              Module Summary
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none">
              {courseSummary}
            </div>
          )}
        </motion.div>
      )}
      
      {/* Study Questions */}
      {studyQuestions.length > 0 && (
        <motion.div 
          className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CornerRightDown size={18} className="text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                Practice Questions
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshQuestions}
              leftIcon={<RefreshCw size={16} />}
              isLoading={isGeneratingQuestions || isGeneratingObjectiveQuestions}
            >
              Refresh
            </Button>
          </div>
          
          {/* Objective questions */}
          {objectiveQuestions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-purple-700 dark:text-purple-300 mb-3">
                Multiple Choice
              </h4>
              
              {objectiveQuestions.map((q, index) => (
                <div key={index} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                    {index + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`
                          flex items-center p-3 rounded-md cursor-pointer transition-colors
                          ${objectiveAnswers[index] === option ? 
                            'bg-purple-100 dark:bg-purple-800/40 border border-purple-300 dark:border-purple-700' : 
                            'hover:bg-gray-100 dark:hover:bg-gray-700/40 border border-transparent'}
                        `}
                        onClick={() => handleAnswerSelect(index, option)}
                      >
                        <div className={`
                          w-5 h-5 rounded-full mr-3 flex-shrink-0 border flex items-center justify-center
                          ${objectiveAnswers[index] === option ? 
                            'border-purple-500 bg-purple-500' : 
                            'border-gray-400'}
                        `}>
                          {objectiveAnswers[index] === option && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </div>
                    ))}
                  </div>
                  
                  {objectiveAnswers[index] && (
                    <div className={`mt-3 p-2 rounded-md ${
                      objectiveAnswers[index] === q.answer ? 
                      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {objectiveAnswers[index] === q.answer ? (
                        <p className="flex items-center">
                          <span className="mr-2">✓</span> Correct! Well done.
                        </p>
                      ) : (
                        <p className="flex items-center">
                          <span className="mr-2">✗</span> Try again. Hint: Review the module content for the answer.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Essay/study questions */}
          <h4 className="text-md font-medium text-purple-700 dark:text-purple-300 mb-3">
            Discussion Questions
          </h4>
          <ul className="space-y-3">
            {studyQuestions.map((question, index) => {
              // Clean up any Python-style formatting or quotes
              const cleanQuestion = question
                .replace(/^\s*['"]\s*|\s*['"]$/g, '') // Remove quotes at beginning/end
                .replace(/\\n/g, '') // Remove newline characters
                .replace(/^\s*python\s*\[\s*|\s*\]\s*$/g, '') // Remove python [] wrapper
                .replace(/^["']\s*|\s*["']$/g, ''); // Remove extra quotes
              
              return (
                <li key={index} className="text-gray-700 dark:text-gray-300 border-l-2 border-purple-300 dark:border-purple-700 pl-3 py-1">
                  {cleanQuestion}
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
      
      {/* YouTube Videos Section */}
      {moduleVideos.length > 0 && (
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Youtube size={20} className="text-red-600 dark:text-red-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Additional Learning Resources
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshVideos}
              leftIcon={<RefreshCw size={16} />}
              isLoading={isRefreshingVideos}
            >
              Refresh Videos
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {moduleVideos.map((video) => (
              <div 
                key={video.id}
                className={`${selectedVideo?.id === video.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''} bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => playVideo(video)}
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 text-white rounded-full p-2">
                      <Play size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    <Clock size={10} className="inline mr-1" />
                    {video.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 text-sm">
                    {video.title}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center">
                    {video.channelTitle}
                    <ExternalLink size={12} className="ml-1" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate of Completion - Enhanced Design */}
      {(showCertificate || (isCompleted && currentModuleIndex === totalModules - 1)) && (
        <motion.div
          className="mb-8 p-8 border-4 border-amber-500 rounded-lg bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-lg"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-amber-500 opacity-50"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-amber-500 opacity-50"></div>
            
            <div className="text-center z-10 relative py-8">
              {/* Seal/Badge */}
              <div className="inline-block p-6 bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900/40 dark:to-amber-800/60 rounded-full mb-6 shadow-md border-2 border-amber-500">
                <Award size={64} className="text-amber-600 dark:text-amber-400" />
              </div>
              
              {/* Heading */}
              <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300 mb-4 font-serif">Certificate of Completion</h2>
              
              {/* Gold line decorative element */}
              <div className="mx-auto w-32 h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 mb-6"></div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">This certifies that</p>
              
              {/* Student name placeholder - would be dynamic in real implementation */}
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-serif italic">
                Learning Academy Student
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">has successfully completed all modules of</p>
              
              {/* Course name */}
              <p className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-8 px-8">
                {module.title}
              </p>
              
              {/* Date section */}
              <div className="flex justify-center items-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed on</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Certificate ID</p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {`CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}
                  </p>
                </div>
              </div>
              
              {/* Download button */}
              <button 
                className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={() => window.print()} // Simple print for now, could be replaced with actual download
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Download Certificate</span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Modify the progress indicator component to not show if the course is completed */}
      {!showCertificate && !isCompleted && currentModuleIndex < totalModules && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Course Progress
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Module {currentModuleIndex + 1} of {totalModules}
              {currentModuleIndex === totalModules - 1 ? 
                <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                  (Certificate upon completion!)
                </span> 
                : ''
              }
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.round(((currentModuleIndex) / totalModules) * 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Start</span>
            <span className="flex items-center">
              {currentModuleIndex === totalModules - 1 ?
                <><Award size={14} className="mr-1 text-amber-500" /> Certificate!</>
                : 'Complete Course'
              }
            </span>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={handleGenerateSummary}
          isLoading={isLoading}
            leftIcon={<Book size={16} />}
        >
            {showSummary ? 'Refresh Summary' : 'Generate Summary'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRefreshQuestions}
            isLoading={isGeneratingQuestions || isGeneratingObjectiveQuestions}
            leftIcon={<RefreshCw size={16} />}
            disabled={!module.content}
          >
            {studyQuestions.length > 0 ? 'Refresh Questions' : 'Generate Questions'}
        </Button>
        </div>
        
        <Button
          variant="primary"
          onClick={handleCompleteModule}
          rightIcon={<ArrowRight size={16} />}
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ModuleContent;