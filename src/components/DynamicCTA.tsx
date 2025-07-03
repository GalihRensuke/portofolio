import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Coins, Brain, GitBranch } from 'lucide-react';
import { PersonalizationData } from '../hooks/usePersonalization';

interface DynamicCTAProps {
  personalization: PersonalizationData;
}

const iconMap = {
  Zap,
  Coins,
  Brain,
  GitBranch
};

const DynamicCTA: React.FC<DynamicCTAProps> = ({ personalization }) => {
  const { primaryCTA, secondaryCTA, campaign, source } = personalization;
  
  const PrimaryIcon = iconMap[primaryCTA.icon as keyof typeof iconMap] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 mb-8"
    >
      <Link
        to={primaryCTA.href}
        className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
      >
        <PrimaryIcon className="mr-2 h-5 w-5" />
        {primaryCTA.text}
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <Link
        to={secondaryCTA.href}
        className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-300 hover:text-white hover:bg-indigo-500/10 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
      >
        {secondaryCTA.text}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>

      {/* Campaign Attribution */}
      {(campaign || source) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden sm:flex items-center text-xs text-gray-500 ml-4"
        >
          {campaign && (
            <span className="px-2 py-1 bg-gray-800 rounded">
              {campaign.replace(/_/g, ' ')}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DynamicCTA;