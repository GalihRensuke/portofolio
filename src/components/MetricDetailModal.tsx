import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, BarChart3, FileText } from 'lucide-react';

interface MetricDetail {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  details: MetricDetail[];
  projectContext?: string;
  verificationLevel?: 'verified' | 'calculated' | 'estimated';
}

const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  details,
  projectContext,
  verificationLevel = 'verified'
}) => {
  const getVerificationColor = () => {
    switch (verificationLevel) {
      case 'verified': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'calculated': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'estimated': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getVerificationIcon = () => {
    switch (verificationLevel) {
      case 'verified': return CheckCircle;
      case 'calculated': return BarChart3;
      case 'estimated': return Calendar;
      default: return FileText;
    }
  };

  const VerificationIcon = getVerificationIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <VerificationIcon className="h-6 w-6 text-indigo-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full border font-medium capitalize ${getVerificationColor()}`}>
                      {verificationLevel}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-300 leading-relaxed">{description}</p>
              </div>

              {/* Project Context */}
              {projectContext && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-indigo-400 mb-2">Project Context</h4>
                  <p className="text-sm text-gray-300">{projectContext}</p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Verification Details
                </h4>
                <div className="space-y-3">
                  {details.map((detail, index) => {
                    const DetailIcon = detail.icon || FileText;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg"
                      >
                        <DetailIcon className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-300 mb-1">
                            {detail.label}
                          </div>
                          <div className="text-sm text-gray-400">
                            {detail.value}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>All metrics are tracked and validated through automated systems</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MetricDetailModal;