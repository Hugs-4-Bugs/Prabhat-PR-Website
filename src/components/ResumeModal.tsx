import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const resumeUrl = 'https://prabhat-codes.vercel.app/Prabhat%20Experience%20Profile.pdf';

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Prabhat_Kumar_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(resumeUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-20 z-[101] bg-card border border-primary-foreground/10 rounded-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-primary-foreground/10">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-display text-lg sm:text-xl text-primary-foreground">
                  Resume Preview
                </h3>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-body tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full hover:bg-primary-foreground/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-hover
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden sm:inline">Open</span>
                </motion.button>
                
                <motion.button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-body tracking-wider uppercase bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-hover
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Download</span>
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-hover
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 relative bg-muted">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="font-body text-sm text-primary-foreground/60">Loading resume...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                title="Resume Preview"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
