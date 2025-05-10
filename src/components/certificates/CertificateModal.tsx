import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Certificate from './Certificate';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  studentName: string;
  completionDate: Date;
  certificateId: string;
  hideButtons?: boolean;
}

const CertificateModal = ({
  isOpen,
  onClose,
  courseName,
  studentName,
  completionDate,
  certificateId,
  hideButtons = false
}: CertificateModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            id="certificate-modal-backdrop"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', damping: 20 }}
            className="relative bg-[#1a1f2e] dark:bg-[#111827] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
            id="certificate-modal-container"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors z-10"
              onClick={onClose}
              id="certificate-close-button"
              aria-label="Close certificate view"
            >
              <X size={20} className="text-gray-300" />
            </button>
            
            {/* Certificate Component */}
            <div className="certificate-content-wrapper">
              <Certificate
                courseName={courseName}
                studentName={studentName}
                completionDate={completionDate}
                certificateId={certificateId}
                onClose={onClose}
                hideButtons={hideButtons}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal; 