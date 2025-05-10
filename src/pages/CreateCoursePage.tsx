import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, LayoutGrid, School, Clock, Image, Plus, Youtube, X, RefreshCw, Search } from 'lucide-react';
import { searchYouTubeVideos } from '../services/youtubeService';
import { useCourseStore } from '../stores/courseStore';
import type { YouTubeVideo as YouTubeVideoType } from '../types';

interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  description?: string;
  channelTitle?: string;
  duration?: string;
}

interface ModuleInput {
  id: string;
  title: string;
  content: string;
  order_number: number;
  videos?: YouTubeVideo[];
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { createCourse, isLoading, error } = useCourseStore();
  const [activeTab, setActiveTab] = useState('details');
  const [currentStep, setCurrentStep] = useState(1);
  
  // Basic form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.pexels.com/photos/6238100/pexels-photo-6238100.jpeg');
  const [difficulty, setDifficulty] = useState('beginner');
  const [duration, setDuration] = useState(1);
  const [modules, setModules] = useState<ModuleInput[]>([
    { id: '1', title: '', content: '', order_number: 0, videos: [] }
  ]);
  
  // New state for YouTube search functionality
  const [isSearchingVideos, setIsSearchingVideos] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState<{[key: string]: string}>({});
  const [searchResults, setSearchResults] = useState<{[key: string]: YouTubeVideo[]}>({});
  
  // Form validation
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    thumbnailUrl: ''
  });
  
  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate first step
      const newErrors = { ...errors };
      let valid = true;
      
      if (!title.trim()) {
        newErrors.title = 'Title is required';
        valid = false;
      }
      
      if (!description.trim()) {
        newErrors.description = 'Description is required';
        valid = false;
      }
      
      setErrors(newErrors);
      
      if (valid) {
        setCurrentStep(2);
        setActiveTab('modules');
      }
    } else {
      // Validate modules
      let valid = true;
      const validModules = modules.filter(module => module.title.trim() && module.content.trim());
      
      if (validModules.length === 0) {
        alert('Please add at least one module with title and content');
        valid = false;
      }
      
      if (valid) {
        try {
          // Auto-fetch videos for modules that don't have them
          await fetchVideosForModules(validModules);
          
          // Prepare course data
          const courseData = {
            title,
            description,
            thumbnail_url: thumbnailUrl,
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
            duration
          };
          
          // Prepare modules data (filtering out empty modules)
          const modulesData = validModules.map((module, index) => {
            // Convert our local video format to the type expected by the API
            const convertedVideos = module.videos?.map(video => ({
              id: video.id,
              title: video.title,
              url: video.url,
              description: video.description || '',
              thumbnail: video.thumbnail || '',
              channelTitle: video.channelTitle || '',
              publishedAt: new Date().toISOString(),
              duration: video.duration || '0:00',
              embedUrl: `https://www.youtube.com/embed/${video.id}`
            } as YouTubeVideoType));
            
            return {
              title: module.title,
              content: module.content,
              order_number: index,
              videos: convertedVideos || []
            };
          });
          
          console.log('Saving course:', courseData);
          console.log('With modules:', modulesData);
          
          // Call the createCourse function from the store
          await createCourse(courseData, modulesData);
          
          // Navigate to dashboard after successful creation
          navigate('/dashboard');
        } catch (err) {
          console.error('Error creating course:', err);
          alert('Failed to create course. Please try again.');
        }
      }
    }
  };
  
  // Function to fetch videos for modules that don't have them
  const fetchVideosForModules = async (validModules: ModuleInput[]) => {
    // Create a copy of the modules
    const updatedModules = [...modules];
    
    // For each valid module, check if it has videos
    for (let i = 0; i < validModules.length; i++) {
      const moduleIndex = modules.findIndex(m => m.id === validModules[i].id);
      if (moduleIndex === -1) continue;
      
      // If the module has no videos or fewer than 3, fetch some
      if (!modules[moduleIndex].videos || modules[moduleIndex].videos.length < 3) {
        try {
          // Create a search query based on module content
          const searchQuery = `${modules[moduleIndex].title} ${modules[moduleIndex].content.substring(0, 100)}`;
          console.log(`Auto-fetching videos for module ${moduleIndex + 1}`);
          
          // Set loading state for this module
          setIsSearchingVideos(prev => ({ ...prev, [moduleIndex]: true }));
          
          const videos = await searchYouTubeVideos(searchQuery, 3);
          
          if (videos.length > 0) {
            // If module already had some videos, merge them without duplicates
            if (modules[moduleIndex].videos && modules[moduleIndex].videos.length > 0) {
              const existingVideoIds = modules[moduleIndex].videos.map(v => v.id);
              const newVideos = videos.filter(v => !existingVideoIds.includes(v.id));
              updatedModules[moduleIndex].videos = [
                ...modules[moduleIndex].videos!,
                ...newVideos
              ].slice(0, 3);
            } else {
              // If no videos existed, use all new videos
              updatedModules[moduleIndex].videos = videos;
            }
          }
        } catch (error) {
          console.error(`Error fetching videos for module ${moduleIndex + 1}:`, error);
        } finally {
          setIsSearchingVideos(prev => ({ ...prev, [moduleIndex]: false }));
        }
      }
    }
    
    // Update modules with the fetched videos
    setModules(updatedModules);
  };
  
  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        id: (modules.length + 1).toString(),
        title: '',
        content: '',
        order_number: modules.length,
        videos: []
      }
    ]);
  };
  
  const handleAddVideo = (moduleIndex: number) => {
    const newModules = [...modules];
    if (!newModules[moduleIndex].videos) {
      newModules[moduleIndex].videos = [];
    }
    newModules[moduleIndex].videos?.push({
      id: Date.now().toString(),
      url: '',
      title: ''
    });
    setModules(newModules);
  };
  
  const handleRemoveVideo = (moduleIndex: number, videoIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].videos?.splice(videoIndex, 1);
    setModules(newModules);
  };
  
  const handleSearchVideos = async (moduleIndex: number) => {
    const module = modules[moduleIndex];
    if (!module.title && !module.content) {
      alert("Please add module title or content before searching for videos");
      return;
    }
    
    // Set loading state for this module's search
    setIsSearchingVideos(prev => ({ ...prev, [moduleIndex]: true }));
    
    try {
      // Create a search query based on module content
      const query = searchQuery[moduleIndex] || `${module.title} ${module.content.substring(0, 100)}`;
      const videos = await searchYouTubeVideos(query, 3);
      
      // Store search results
      setSearchResults(prev => ({ ...prev, [moduleIndex]: videos }));
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsSearchingVideos(prev => ({ ...prev, [moduleIndex]: false }));
    }
  };
  
  const handleAddSearchedVideo = (moduleIndex: number, video: YouTubeVideo) => {
    const newModules = [...modules];
    if (!newModules[moduleIndex].videos) {
      newModules[moduleIndex].videos = [];
      }
    
    // Avoid duplicates by checking if video is already added
    const isDuplicate = newModules[moduleIndex].videos?.some(v => v.id === video.id);
    if (!isDuplicate) {
      newModules[moduleIndex].videos?.push({
        id: video.id,
        url: video.url,
        title: video.title
      });
      setModules(newModules);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 mb-2">
          Create New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Fill in the details below to create an engaging learning experience
        </p>
      </motion.div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
            <motion.div 
              className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
              animate={{ width: currentStep === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>
            <div className="absolute left-0 top-0 flex items-center justify-center h-8 w-8 -mt-3 -ml-1 rounded-full bg-indigo-600 text-white font-bold text-sm">
              1
            </div>
            <div className={`absolute left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center h-8 w-8 -mt-3 rounded-full ${
              currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            } font-bold text-sm`}>
              2
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Course Details</span>
          <span>Course Modules</span>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Tabs */}
        <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 p-2">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => { setActiveTab('details'); setCurrentStep(1); }}
            >
              <div className="flex items-center">
                <Info size={16} className="mr-2" />
                Course Details
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'modules'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => { 
                const valid = !errors.title && !errors.description && title && description;
                if (valid) {
                  setActiveTab('modules');
                  setCurrentStep(2);
                }
              }}
            >
              <div className="flex items-center">
                <LayoutGrid size={16} className="mr-2" />
                Course Modules
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                <Info size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
            Course Details
          </h2>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {/* Course Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Introduction to Web Development"
          />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>
          
                  {/* Course Description */}
                  <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Course Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                      className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[120px]"
              placeholder="Provide a detailed description of your course"
            />
            {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
                  {/* Course Settings */}
                  <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level
              </label>
                      <div className="relative">
              <select
                value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
                        <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (hours)
              </label>
                      <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
            </div>
          </div>
        </div>
        
                <div>
                  {/* Thumbnail */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Thumbnail
                    </label>
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={thumbnailUrl} 
                        alt="Course thumbnail preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/6238100/pexels-photo-6238100.jpeg';
                        }}
                      />
          </div>
          
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Thumbnail URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          className="block w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="https://example.com/image.jpg"
                        />
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.thumbnailUrl && (
                        <p className="mt-1 text-sm text-red-600">{errors.thumbnailUrl}</p>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setThumbnailUrl('https://images.pexels.com/photos/6238100/pexels-photo-6238100.jpeg')}
                          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded px-2 py-1 transition-colors"
                        >
                          Default 1
                        </button>
                        <button
                    type="button"
                          onClick={() => setThumbnailUrl('https://images.pexels.com/photos/5905885/pexels-photo-5905885.jpeg')}
                          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded px-2 py-1 transition-colors"
                        >
                          Default 2
                        </button>
                        <button
                  type="button"
                          onClick={() => setThumbnailUrl('https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg')}
                          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded px-2 py-1 transition-colors"
                        >
                          Default 3
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <LayoutGrid size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Course Modules
                </h2>
                <button
                  onClick={handleAddModule}
                  className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <Plus size={16} className="mr-1.5" />
                  Add Module
                </button>
              </div>
              
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div 
                    key={module.id}
                    className="border dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <h3 className="font-medium flex items-center text-lg text-gray-900 dark:text-gray-100 mb-4">
                      Module {index + 1}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Module Title
                        </label>
                        <input
                          type="text"
                value={module.title}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[index].title = e.target.value;
                            setModules(newModules);
                          }}
                          className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="Module Title (e.g., Getting Started)"
                        />
                      </div>
                      
                      <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Module Content
                </label>
                <textarea
                  value={module.content}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[index].content = e.target.value;
                            setModules(newModules);
                          }}
                          className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[120px]"
                          placeholder="Describe the content of this module in detail..."
                />
              </div>
              
                      {/* YouTube Videos Section */}
                <div className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            YouTube Videos
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleSearchVideos(index)}
                              className={`px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md flex items-center text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors ${isSearchingVideos[index] ? 'opacity-75 cursor-wait' : ''}`}
                              disabled={isSearchingVideos[index]}
                            >
                              {isSearchingVideos[index] ? (
                                <RefreshCw size={14} className="mr-1 animate-spin" />
                              ) : (
                                <Search size={14} className="mr-1" />
                              )}
                              Search Videos
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddVideo(index)}
                              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md flex items-center text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                              <Plus size={14} className="mr-1" />
                              Add Manually
                            </button>
                          </div>
                        </div>
                        
                        {/* Video Search Results */}
                        {searchResults[index] && searchResults[index].length > 0 && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="mb-3 flex justify-between items-center">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Search Results
                  </h4>
                              <div className="relative flex-1 max-w-xs ml-4">
                                <input
                                  type="text"
                                  value={searchQuery[index] || ''}
                                  onChange={(e) => setSearchQuery(prev => ({ ...prev, [index]: e.target.value }))}
                                  placeholder="Refine search query..."
                                  className="w-full text-xs pl-8 pr-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                />
                                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <button
                                  onClick={() => handleSearchVideos(index)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                  <RefreshCw size={14} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {searchResults[index].map((video) => (
                      <div 
                        key={video.id} 
                                  className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                                  onClick={() => handleAddSearchedVideo(index, video)}
                      >
                                  {video.thumbnail && (
                                    <div className="relative">
                        <img 
                          src={video.thumbnail}
                          alt={video.title}
                                        className="w-full aspect-video object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-opacity">
                                        <div className="opacity-0 hover:opacity-100 bg-blue-600 text-white rounded-full p-1.5 transition-opacity">
                                          <Plus size={16} />
                                        </div>
                                      </div>
                                      {video.duration && (
                                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                                          {video.duration}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="p-2">
                                    <h5 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 text-xs">
                            {video.title}
                          </h5>
                                    {video.channelTitle && (
                                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {video.channelTitle}
                          </p>
                                    )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                        
                        {module.videos && module.videos.length > 0 ? (
                          <div className="space-y-3">
                            {module.videos.map((video, videoIndex) => (
                              <div key={video.id} className="relative p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveVideo(index, videoIndex)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                  <X size={16} />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Video Title
                                    </label>
                                    <input
                                      type="text"
                                      value={video.title}
                                      onChange={(e) => {
                                        const newModules = [...modules];
                                        if (newModules[index].videos) {
                                          newModules[index].videos![videoIndex].title = e.target.value;
                                        }
                                        setModules(newModules);
                                      }}
                                      className="block w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                      placeholder="Introduction to the topic"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      YouTube URL
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={video.url}
                                        onChange={(e) => {
                                          const newModules = [...modules];
                                          if (newModules[index].videos) {
                                            newModules[index].videos![videoIndex].url = e.target.value;
                                          }
                                          setModules(newModules);
                                        }}
                                        className="block w-full pl-8 pr-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                      />
                                      <Youtube className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No videos added yet</p>
                            <div className="mt-2 flex justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleSearchVideos(index)}
                                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                              >
                                <span className="flex items-center">
                                  <Search size={14} className="mr-1.5" />
                                  Search Videos
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddVideo(index)}
                                className="px-3 py-1.5 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                              >
                                <span className="flex items-center">
                                  <Youtube size={14} className="mr-1.5" />
                                  Add Manually
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
        
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6 space-x-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => { setCurrentStep(1); setActiveTab('details'); }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            disabled={isLoading}
          >
            Back
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        
        <button
          type="button"
          onClick={handleNextStep}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              {currentStep === 1 ? 'Next' : 'Creating...'}
            </>
          ) : (
            currentStep === 1 ? 'Next' : 'Create Course'
          )}
        </button>
        </div>
    </div>
  );
};

export default CreateCoursePage;