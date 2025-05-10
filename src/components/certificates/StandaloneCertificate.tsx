import React from 'react';
import { Award, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Certificate from './Certificate';

interface StandaloneCertificateProps {
  courseName: string;
  studentName: string;
  completionDate: Date;
  certificateId: string;
  onDownload: () => void;
  onComplete?: () => void;
}

const StandaloneCertificate: React.FC<StandaloneCertificateProps> = ({
  courseName,
  studentName,
  completionDate,
  certificateId,
  onDownload,
  onComplete
}) => {
  return (
    <div className="flex flex-col items-center py-8 px-4 bg-[#0f1625] min-h-screen">
      <div className="max-w-3xl w-full">
        <Certificate
          courseName={courseName}
          studentName={studentName}
          completionDate={completionDate}
          certificateId={certificateId}
          hideButtons={true}
        />
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDownload}
            className="w-full md:w-auto px-6 py-3 bg-[#f0a830] hover:bg-[#e09720] text-[#121929] rounded-lg flex items-center justify-center font-medium text-base"
          >
            <Download className="mr-2 w-5 h-5" />
            Download Certificate
          </motion.button>
          
          {onComplete && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onComplete}
              className="w-full md:w-auto px-6 py-3 bg-[#1e293b] hover:bg-[#283548] text-white rounded-lg flex items-center justify-center font-medium text-base"
            >
              Completed →
            </motion.button>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b]">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f1625]">
              <Award className="w-5 h-5 text-[#f0a830]" />
            </div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] -ml-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f1625]">
              <Award className="w-5 h-5 text-[#f0a830]" />
            </div>
          </div>
        </div>
        
        <div className="mt-10 mb-4 flex justify-between">
          <button 
            onClick={() => {}}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#283548] text-gray-300 rounded-lg text-sm"
          >
            Generate Summary
          </button>
          
          <button 
            onClick={() => {}}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#283548] text-gray-300 rounded-lg text-sm"
          >
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCertificate; 