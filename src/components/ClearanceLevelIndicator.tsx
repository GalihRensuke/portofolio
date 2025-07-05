import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, Zap, ChevronDown, Info, Trophy, Target, Award, X } from 'lucide-react';
import { getClearanceLevel, getProgressToNextLevel, getEngagementScore, ClearanceLevelInfo } from '../utils/gamification';
import AscensionEvent from './AscensionEvent';
import { useThemeStore } from '../store/themeStore';

interface ClearanceLevelIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const ClearanceLevelIndicator: React.FC<ClearanceLevelIndicatorProps> = ({ 
  className = "",
  showDetails = false 
}) => {
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<ClearanceLevelInfo | null>(null);
  const [showAscension, setShowAscension] = useState(false);
  const [ascensionData, setAscensionData] = useState<{ from: string; to: string } | null>(null);
  const { setArchitectLevel } = useThemeStore();

  useEffect(() => {
    const currentScore = getEngagementScore();
    const currentLevel = getClearanceLevel(currentScore);
    const storedLevel = localStorage.getItem('galyarder_previous_level');
    
    setScore(currentScore);
    
    // Check for level up
    if (storedLevel && storedLevel !== currentLevel.level) {
      const prevLevel = getClearanceLevel(parseInt(localStorage.getItem('galyarder_previous_score') || '0', 10));
      setPreviousLevel(prevLevel);
      
      // Trigger Ascension Event instead of simple level up
      setAscensionData({ from: prevLevel.level, to: currentLevel.level });
      setShowAscension(true);
      
      // Check if reached Architect level
      if (currentLevel.level === 'Architect') {
        setArchitectLevel(true);
      }
    }
    
    // Store current level for future comparison
    localStorage.setItem('galyarder_previous_level', currentLevel.level);
    localStorage.setItem('galyarder_previous_score', currentScore.toString());
    
    // Update score every 5 seconds
    const interval = setInterval(() => {
      const newScore = getEngagementScore();
      setScore(newScore);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAscensionComplete = () => {
    setShowAscension(false);
    setShowLevelUp(true);
    
    // Hide level up notification after 3 seconds
    setTimeout(() => {
      setShowLevelUp(false);
      setPreviousLevel(null);
      setAscensionData(null);
    }, 3000);
  };
  const { current, next, progress, pointsNeeded } = getProgressToNextLevel(score);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Explorer': return Shield;
      case 'Analyst': return Star;
      case 'Architect': return Trophy;
      default: return Zap;
    }
  };

  const LevelIcon = getLevelIcon(current.level);

  return (
    <>
      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && previousLevel && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg shadow-2xl border border-indigo-400/30"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Trophy className="h-6 w-6 text-yellow-300" />
              </motion.div>
              <div>
                <div className="font-bold text-sm">Level Up!</div>
                <div className="text-xs opacity-90">
                  {previousLevel.level} → {current.level}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Ascension Event */}
      {showAscension && ascensionData && (
        <AscensionEvent
          isVisible={showAscension}
          fromLevel={ascensionData.from}
          toLevel={ascensionData.to}
          onComplete={handleAscensionComplete}
        />
      )}

      {/* Main Indicator - Compact Design */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative ${className}`}
      >
        <button
          onClick={() => !showDetails && setIsModalOpen(!isModalOpen)}
          className={`flex items-center space-x-2 px-3 py-2 ${current.bgColor} ${current.borderColor} border rounded-lg hover:bg-opacity-80 transition-all duration-200 ${
            showDetails ? 'cursor-default w-full' : 'cursor-pointer'
          } group`}
          disabled={showDetails}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex-shrink-0"
          >
            <LevelIcon className={`h-4 w-4 ${current.color}`} />
          </motion.div>
          
          <div className="flex items-center space-x-2 min-w-0">
            <span className={`text-sm font-semibold ${current.color} whitespace-nowrap`}>
              {current.level}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {score}
            </span>
          </div>
          
          {!showDetails && (
            <motion.div
              animate={{ rotate: isModalOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-300" />
            </motion.div>
          )}
        </button>

        {/* FULLSCREEN MODAL - FIXED VIEWPORT */}
        <AnimatePresence>
          {isModalOpen && !showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-gray-950"
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER - FIXED TOP */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                  <div className="flex items-center justify-between p-6 lg:p-8">
                    <div className="flex items-center space-x-4 lg:space-x-6">
                      <div className={`p-3 lg:p-4 ${current.bgColor} ${current.borderColor} border rounded-xl lg:rounded-2xl`}>
                        <LevelIcon className={`h-8 w-8 lg:h-12 lg:w-12 ${current.color}`} />
                      </div>
                      <div>
                        <h1 className={`text-3xl lg:text-5xl font-bold ${current.color}`}>
                          {current.level}
                        </h1>
                        <div className="text-gray-400 text-lg lg:text-2xl">
                          {score} points earned
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 lg:space-x-6">
                      {current.level === 'Architect' && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center space-x-2 lg:space-x-4 px-3 lg:px-6 py-2 lg:py-4 bg-yellow-400/10 border border-yellow-400/20 rounded-full"
                        >
                          <Award className="h-5 w-5 lg:h-8 lg:w-8 text-yellow-400" />
                          <span className="text-sm lg:text-2xl text-yellow-400 font-bold">MAX LEVEL</span>
                        </motion.div>
                      )}
                      
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-2 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-gray-800"
                      >
                        <X className="h-6 w-6 lg:h-10 lg:w-10" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* MAIN CONTENT - SCROLLABLE */}
                <div className="pt-24 lg:pt-32 pb-24 lg:pb-32 px-6 lg:px-12 overflow-y-auto h-full">
                  <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
                    {/* Level Description */}
                    <div className="text-center pt-8">
                      <p className="text-xl lg:text-3xl text-gray-300 leading-relaxed max-w-5xl mx-auto">
                        {current.description}
                      </p>
                    </div>

                    {/* Progress Section */}
                    {next && (
                      <div className="bg-gray-900/50 rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-gray-800">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
                          <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                            Progress to {next.level}
                          </h2>
                          <span className="text-lg lg:text-2xl text-gray-400">
                            {pointsNeeded} points needed
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-6 lg:h-8 mb-4 lg:mb-6">
                          <motion.div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-6 lg:h-8 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </motion.div>
                        </div>
                        <div className="text-center text-lg lg:text-2xl text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    )}

                    {/* Benefits Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                      {/* Current Benefits */}
                      <div className="bg-gray-900/30 rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-gray-800">
                        <div className="flex items-center space-x-4 lg:space-x-6 mb-8 lg:mb-10">
                          <Target className="h-8 w-8 lg:h-12 lg:w-12 text-indigo-400" />
                          <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                            Current Access
                          </h2>
                        </div>
                        <ul className="space-y-4 lg:space-y-6">
                          {current.benefits.map((benefit, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="flex items-start space-x-4 lg:space-x-6"
                            >
                              <span className="w-3 h-3 lg:w-4 lg:h-4 bg-indigo-400 rounded-full mt-2 lg:mt-3 flex-shrink-0" />
                              <span className="text-lg lg:text-xl text-gray-300 leading-relaxed">{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Level Benefits */}
                      {next ? (
                        <div className="bg-gray-900/30 rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-gray-800">
                          <div className="flex items-center space-x-4 lg:space-x-6 mb-8 lg:mb-10">
                            <Trophy className="h-8 w-8 lg:h-12 lg:w-12 text-yellow-400" />
                            <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                              Unlock at {next.level}
                            </h2>
                          </div>
                          <ul className="space-y-4 lg:space-y-6">
                            {next.benefits.slice(current.benefits.length).map((benefit, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start space-x-4 lg:space-x-6"
                              >
                                <span className="w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full mt-2 lg:mt-3 flex-shrink-0" />
                                <span className="text-lg lg:text-xl text-gray-400 leading-relaxed">{benefit}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-yellow-400/20">
                          <div className="text-center">
                            <Trophy className="h-16 w-16 lg:h-20 lg:w-20 text-yellow-400 mx-auto mb-4 lg:mb-6" />
                            <h2 className="text-2xl lg:text-4xl font-bold text-yellow-400 mb-3 lg:mb-4">
                              Maximum Level Achieved!
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-300">
                              You have unlocked all available features and benefits.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* How to Earn Points */}
                    <div className="bg-gray-900/30 rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-gray-800">
                      <div className="flex items-center space-x-4 lg:space-x-6 mb-8 lg:mb-10">
                        <Info className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400" />
                        <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                          How to Earn Points
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                        <div className="flex flex-col items-center text-center p-4 lg:p-8 bg-gray-800/50 rounded-xl lg:rounded-2xl">
                          <span className="w-4 h-4 lg:w-6 lg:h-6 bg-blue-400 rounded-full mb-3 lg:mb-4" />
                          <div className="text-sm lg:text-xl font-semibold text-gray-300 mb-1 lg:mb-2">Explore projects</div>
                          <div className="text-blue-400 font-bold text-lg lg:text-2xl">+2 points</div>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 lg:p-8 bg-gray-800/50 rounded-xl lg:rounded-2xl">
                          <span className="w-4 h-4 lg:w-6 lg:h-6 bg-green-400 rounded-full mb-3 lg:mb-4" />
                          <div className="text-sm lg:text-xl font-semibold text-gray-300 mb-1 lg:mb-2">Use sandbox</div>
                          <div className="text-green-400 font-bold text-lg lg:text-2xl">+10 points</div>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 lg:p-8 bg-gray-800/50 rounded-xl lg:rounded-2xl">
                          <span className="w-4 h-4 lg:w-6 lg:h-6 bg-purple-400 rounded-full mb-3 lg:mb-4" />
                          <div className="text-sm lg:text-xl font-semibold text-gray-300 mb-1 lg:mb-2">Click blueprint nodes</div>
                          <div className="text-purple-400 font-bold text-lg lg:text-2xl">+5 points</div>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 lg:p-8 bg-gray-800/50 rounded-xl lg:rounded-2xl">
                          <span className="w-4 h-4 lg:w-6 lg:h-6 bg-orange-400 rounded-full mb-3 lg:mb-4" />
                          <div className="text-sm lg:text-xl font-semibold text-gray-300 mb-1 lg:mb-2">Search knowledge</div>
                          <div className="text-orange-400 font-bold text-lg lg:text-2xl">+3 points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER - FIXED BOTTOM */}
                <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 lg:p-8 space-y-4 lg:space-y-0">
                    <div className="text-gray-400 text-lg lg:text-xl">
                      Gamification System • Portfolio V4
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 lg:px-8 py-3 lg:py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl lg:rounded-2xl font-semibold text-lg lg:text-xl transition-colors"
                    >
                      Continue Exploring
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline Details for showDetails prop */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 w-full bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-xl backdrop-blur-sm"
          >
            {/* Same content as modal but in inline format */}
            <div className="space-y-4">
              {/* Header with level badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${current.bgColor} ${current.borderColor} border rounded-lg`}>
                    <LevelIcon className={`h-5 w-5 ${current.color}`} />
                  </div>
                  <div>
                    <span className={`text-lg font-bold ${current.color}`}>
                      {current.level}
                    </span>
                    <div className="text-sm text-gray-400">
                      {score} points
                    </div>
                  </div>
                </div>
                
                {current.level === 'Architect' && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center space-x-1 px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full"
                  >
                    <Award className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">MAX</span>
                  </motion.div>
                )}
              </div>

              {/* Level Description */}
              <div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Progress to Next Level */}
              {next && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Progress to {next.level}
                    </span>
                    <span className="text-sm text-gray-400">
                      {pointsNeeded} points needed
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(progress)}% complete
                  </div>
                </div>
              )}

              {/* Current Benefits */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-gray-200">
                    Current Access
                  </span>
                </div>
                <ul className="space-y-1 mb-3">
                  {current.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-sm text-gray-300 flex items-start"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Next Level Benefits */}
              {next && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-200">
                      Unlock at {next.level}
                    </span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {next.benefits.slice(current.benefits.length).map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="text-sm text-gray-400 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Engagement Tips */}
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">
                    How to Earn Points
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span>Explore projects (+2)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span>Use sandbox (+10)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span>Click blueprint nodes (+5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span>Search knowledge (+3)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default ClearanceLevelIndicator;