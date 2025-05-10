import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Calendar, Search, Share2, Shield, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingScreen from '../components/ui/LoadingScreen';
import CertificateModal from '../components/certificates/CertificateModal';

const CertificatesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { courses, fetchCourses, isLoading: isLoadingCourses } = useCourseStore();
  const { userProgress, fetchUserProgress, calculateCourseProgress, isLoading: isLoadingProgress } = useProgressStore();
  
  const [certificateEligibleCourses, setCertificateEligibleCourses] = useState<any[]>([]);
  const [certificateIssuedCourses, setCertificateIssuedCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id);
    }
  }, [user?.id, fetchUserProgress]);
  
  useEffect(() => {
    if (courses.length > 0 && userProgress.length > 0 && user?.id) {
      // Get courses with 100% progress - eligible for certificate
      const completedCourseIds = new Set();
      
      // Group progress by course ID and calculate completion status
      const courseProgress: { [key: string]: { total: number, completed: number } } = {};
      
      userProgress.forEach(progress => {
        if (progress.user_id === user.id) {
          if (!courseProgress[progress.course_id]) {
            courseProgress[progress.course_id] = { total: 0, completed: 0 };
          }
          
          courseProgress[progress.course_id].total += 1;
          
          if (progress.completed) {
            courseProgress[progress.course_id].completed += 1;
          }
        }
      });
      
      // Check which courses are 100% complete
      Object.entries(courseProgress).forEach(([courseId, progress]) => {
        if (progress.total > 0 && progress.completed === progress.total) {
          completedCourseIds.add(courseId);
        }
      });
      
      // Get complete course details for certificates
      const completedCourses = courses
        .filter(course => completedCourseIds.has(course.id))
        .map(course => {
          // Generate a random date within the last 60 days for demo purposes
          // In a real app, this would come from your database
          const daysAgo = Math.floor(Math.random() * 60);
          const completionDate = new Date();
          completionDate.setDate(completionDate.getDate() - daysAgo);
          
          return {
            ...course,
            completionDate,
            certificateId: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          };
        });
      
      // For demo purposes, let's say half of the completed courses have already claimed certificates
      const halfIndex = Math.ceil(completedCourses.length / 2);
      
      setCertificateEligibleCourses(completedCourses.slice(0, halfIndex));
      setCertificateIssuedCourses(completedCourses.slice(halfIndex));
    }
  }, [courses, userProgress, user?.id]);
  
  const handleViewCertificate = (course: any) => {
    setSelectedCertificate(course);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const filteredCertificates = [
    ...certificateEligibleCourses, 
    ...certificateIssuedCourses
  ].filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoadingCourses || isLoadingProgress) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 mb-2">
          My Certificates
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          View, download, and share your certificates of achievement
        </p>
      </motion.div>
      
      {/* Search and filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search certificates by course title..."
            className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4">
              <Award size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredCertificates.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-4">
              <BadgeCheck size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ready to Claim</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{certificateEligibleCourses.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-4">
              <Shield size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Issued Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{certificateIssuedCourses.length}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {certificateEligibleCourses.length === 0 && certificateIssuedCourses.length === 0 ? (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            No certificates yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Complete your first course to earn a certificate of achievement!
          </p>
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Courses
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Certificates ready to claim section */}
          {certificateEligibleCourses.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <BadgeCheck size={20} className="mr-2 text-amber-500" />
                Certificates Ready to Claim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificateEligibleCourses
                  .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm overflow-hidden border border-amber-200 dark:border-amber-800/30 group"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{course.title}</h3>
                          <Award size={24} className="text-amber-500" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          Congratulations! You've completed this course and earned a certificate.
                        </p>
                        <motion.button
                          className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center"
                          onClick={() => handleViewCertificate(course)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BadgeCheck size={18} className="mr-2" />
                          View & Claim Certificate
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Issued certificates section */}
          {certificateIssuedCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Shield size={20} className="mr-2 text-teal-500" />
                Your Earned Certificates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificateIssuedCourses
                  .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 group hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                          <Award size={24} className="text-indigo-500" />
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <Calendar size={14} className="mr-1" />
                          <span>Issued on {course.completionDate.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Certificate ID: <span className="font-mono">{course.certificateId}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <motion.button
                            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
                            onClick={() => handleViewCertificate(course)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <ExternalLink size={15} className="mr-1.5" />
                            View
                          </motion.button>
                          <motion.button
                            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors flex items-center justify-center"
                            onClick={() => handleViewCertificate(course)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Share2 size={15} className="mr-1.5" />
                            Share
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          courseName={selectedCertificate.title}
          studentName={user?.displayName || "Learning Academy Student"}
          completionDate={selectedCertificate.completionDate}
          certificateId={selectedCertificate.certificateId}
        />
      )}
    </div>
  );
};

export default CertificatesPage; 