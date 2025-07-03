import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Quote, Sparkles } from 'lucide-react';
import { getRelevantInsights, GalyarderInsight } from '../data/galyarderInsights';

interface InsightInjectorProps {
  pageContextKeywords: string[];
  className?: string;
}

const InsightInjector: React.FC<InsightInjectorProps> = ({ 
  pageContextKeywords, 
  className = "" 
}) => {
  const [currentInsight, setCurrentInsight] = useState<GalyarderInsight | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get a relevant insight based on page context
    const relevantInsights = getRelevantInsights(pageContextKeywords, 1);
    if (relevantInsights.length > 0) {
      setCurrentInsight(relevantInsights[0]);
      
      // Delay showing the insight for a more natural feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pageContextKeywords]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'principle': return Lightbulb;
      case 'observation': return Quote;
      case 'methodology': return Sparkles;
      case 'philosophy': return Quote;
      default: return Lightbulb;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'principle': return 'text-yellow-400';
      case 'observation': return 'text-blue-400';
      case 'methodology': return 'text-green-400';
      case 'philosophy': return 'text-purple-400';
      default: return 'text-indigo-400';
    }
  };

  if (!currentInsight || !isVisible) {
    return null;
  }

  const IconComponent = getCategoryIcon(currentInsight.category);
  const iconColor = getCategoryColor(currentInsight.category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative p-6 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-lg backdrop-blur-sm ${className}`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg" />
        
        <div className="relative flex items-start space-x-4">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <IconComponent className={`h-6 w-6 ${iconColor}`} />
          </motion.div>
          
          <div className="flex-1">
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-200 italic leading-relaxed mb-3"
            >
              "{currentInsight.text}"
            </motion.blockquote>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Galyarder</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{currentInsight.category}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {currentInsight.contextKeywords.slice(0, 2).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-400 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle animation border */}
        <motion.div
          className="absolute inset-0 border border-indigo-500/20 rounded-lg"
          animate={{
            borderColor: [
              "rgba(99, 102, 241, 0.2)",
              "rgba(99, 102, 241, 0.4)",
              "rgba(99, 102, 241, 0.2)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default InsightInjector;