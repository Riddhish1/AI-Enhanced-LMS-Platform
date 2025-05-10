import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Loader2 } from 'lucide-react';

interface CertificateProps {
  courseName: string;
  studentName: string;
  completionDate: Date;
  certificateId: string;
  onClose?: () => void;
  hideButtons?: boolean;
}

const Certificate = ({ courseName, studentName, completionDate, certificateId, onClose, hideButtons = false }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      // Hide download buttons during capture
      const downloadButton = document.querySelector('.certificate-download-button');
      if (downloadButton instanceof HTMLElement) {
        downloadButton.style.display = 'none';
      }
      
      // Capture just the certificate element
      const certificate = certificateRef.current;
      const canvas = await html2canvas(certificate, {
        scale: 2.5,
        logging: false,
        useCORS: true,
        backgroundColor: '#121929',
        allowTaint: false,
        removeContainer: false,
        imageTimeout: 15000,
        onclone: (cloneDoc, cloneElement) => {
          // Make sure we're only capturing the certificate itself
          const modalBackdrop = cloneDoc.getElementById('certificate-modal-backdrop');
          if (modalBackdrop) modalBackdrop.style.display = 'none';
          
          const closeButton = cloneDoc.getElementById('certificate-close-button');
          if (closeButton) closeButton.style.display = 'none';
          
          return cloneElement;
        }
      });
      
      // Restore download button visibility
      if (downloadButton instanceof HTMLElement) {
        downloadButton.style.display = '';
      }
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions to fit the certificate properly
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add the certificate image centered on the page with margins
      const margin = 10;
      const marginTop = 15;
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, 
        marginTop, 
        pdfWidth - (margin * 2), 
        pdfHeight - (marginTop * 2)
      );
      
      // Add a subtle footer
      const footerText = `Certificate ID: ${certificateId}`;
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(footerText, pdfWidth / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
      
      // Save the PDF
      pdf.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(completionDate);

  // For display purposes, simplify the date format
  const shortDate = `${completionDate.toLocaleString('default', { month: 'long' })} ${completionDate.getDate()}, ${completionDate.getFullYear()}`;
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative mb-4 w-full max-w-3xl mx-auto">
        <div 
          ref={certificateRef}
          className="aspect-[16/9] p-6 md:p-10 rounded-lg bg-[#121929] border-2 border-[#f0a830] shadow-lg"
        >
          {/* Certificate Border Design */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#f0a830]"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#f0a830]"></div>
          
          {/* Certificate Content */}
          <div className="flex flex-col h-full justify-between items-center text-white">
            {/* Top Badge */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-full bg-[#3e2a1a] flex items-center justify-center border-2 border-[#f0a830]">
                <Award className="w-10 h-10 text-[#f0a830]" />
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center mb-2">
              <h1 className="text-xl md:text-3xl font-bold mb-1 text-[#f0a830]">Certificate of Completion</h1>
              <div className="h-0.5 w-32 bg-[#f0a830] mx-auto my-4"></div>
              <p className="text-sm md:text-base text-gray-300">
                This certifies that
              </p>
            </div>
            
            {/* Student Name */}
            <div className="text-center mb-2">
              <h2 className="text-lg md:text-2xl font-bold text-white italic mb-2">
                {studentName}
              </h2>
              <p className="text-xs md:text-sm text-gray-300">
                has successfully completed all modules of
              </p>
            </div>
            
            {/* Course Name */}
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-3xl font-bold text-[#f0a830]">
                {courseName}
              </h3>
            </div>
            
            {/* Certificate Info */}
            <div className="flex justify-between w-full text-xs md:text-sm text-gray-400">
              <div className="text-center">
                <p className="text-gray-400">Completed on</p>
                <p className="text-white font-semibold">{shortDate}</p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400">Certificate ID</p>
                <p className="text-white font-mono">{certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!hideButtons && (
        <motion.div 
          className="certificate-download-button mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={downloadCertificate}
            disabled={isGeneratingPDF}
            className="px-5 py-2.5 bg-[#f0a830] hover:bg-[#e09720] text-[#121929] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Download Certificate
              </>
            )}
          </button>
        </motion.div>
      )}
      
      {onClose && !hideButtons && (
        <button 
          onClick={onClose}
          disabled={isGeneratingPDF}
          className="mt-2 px-4 py-1.5 bg-transparent hover:bg-gray-700/20 text-gray-400 hover:text-gray-200 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default Certificate; 