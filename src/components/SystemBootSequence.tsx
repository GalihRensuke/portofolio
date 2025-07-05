import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Code, Database, Brain, Shield } from 'lucide-react';
import { getClearanceLevel, getEngagementScore } from '../utils/gamification';

interface BootSequenceProps {
  onBootComplete: () => void;
}

const SystemBootSequence: React.FC<BootSequenceProps> = ({ onBootComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gamificationStats, setGamificationStats] = useState({
    score: 0,
    level: 'Explorer',
    color: 'text-blue-400'
  });

  useEffect(() => {
    // Load current gamification stats
    const currentScore = getEngagementScore();
    const currentLevel = getClearanceLevel(currentScore);
    setGamificationStats({
      score: currentScore,
      level: currentLevel.level,
      color: currentLevel.color
    });
  }, []);

  const bootSteps = [
    { text: "LOADING PORTFOLIO INTERFACE...", icon: User, delay: 0 },
    { text: "INITIALIZING PROJECT MODULES...", icon: Briefcase, delay: 400 },
    { text: `ACCESS LEVEL: ${gamificationStats.level.toUpperCase()} [${gamificationStats.score} POINTS]`, icon: Shield, delay: 800 },
    { text: "AI CONCIERGE... [READY]", icon: Brain, delay: 800 },
    { text: "SECURITY PROTOCOLS... [ACTIVE]", icon: Shield, delay: 1200 },
    { text: "KNOWLEDGE BASE... [ONLINE]", icon: Database, delay: 1600 },
    { text: "RENDERING INTERFACE...", icon: Code, delay: 2000 },
    { text: `WELCOME TO GALYARDER'S PORTFOLIO.`, icon: User, delay: 2400 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < bootSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          onBootComplete();
        }, 800);
      }
    }, bootSteps[currentStep]?.delay || 400);

    return () => clearTimeout(timer);
  }, [currentStep, onBootComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Professional background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
          
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

          <div className="relative z-10 max-w-2xl mx-auto px-6">
            {/* Logo/Portfolio Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="text-center mb-12"
            >
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-indigo-500/30">
                <img 
                  src="/logo.png" 
                  alt="Galyarder Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl font-bold text-white font-mono tracking-wider"
              >
                GALYARDER
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-lg text-indigo-400 font-mono tracking-wide mt-2"
              >
                SYSTEMS ARCHITECT
              </motion.p>
            </motion.div>

            {/* Boot sequence steps */}
            <div className="space-y-4 font-mono">
              {bootSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      x: isActive ? 0 : -50,
                      scale: isCurrent ? 1.02 : 1
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.1
                    }}
                    className={`flex items-center space-x-4 p-3 rounded-lg ${
                      isCurrent ? 'bg-indigo-500/20 border border-indigo-500/30' : ''
                    }`}
                  >
                    <motion.div
                      animate={isCurrent ? { 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ 
                        duration: isCurrent ? 2 : 0,
                        repeat: isCurrent ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <IconComponent className={`h-5 w-5 ${
                        isActive ? 'text-green-400' : 'text-gray-600'
                      }`} />
                    </motion.div>
                    
                    <motion.span
                      className={`text-sm ${
                        isActive ? (index === 2 ? gamificationStats.color : 'text-green-400') : 'text-gray-600'
                      }`}
                      animate={isCurrent && index !== 2 ? {
                        textShadow: [
                          "0 0 0px rgba(34, 197, 94, 0)",
                          "0 0 10px rgba(34, 197, 94, 0.8)",
                          "0 0 0px rgba(34, 197, 94, 0)"
                        ]
                      } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {step.text}
                    </motion.span>

                    {isActive && index < currentStep && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-400 text-xs"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / bootSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-center mt-2 text-xs text-gray-400 font-mono">
                {Math.round(((currentStep + 1) / bootSteps.length) * 100)}% COMPLETE
              </div>
            </motion.div>

            {/* Completion message */}
            {currentStep === bootSteps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className={`mb-4 p-4 border rounded-lg ${
                    gamificationStats.level === 'Architect' ? 'border-yellow-400/30 bg-yellow-400/10' :
                    gamificationStats.level === 'Analyst' ? 'border-purple-400/30 bg-purple-400/10' :
                    'border-blue-400/30 bg-blue-400/10'
                  }`}
                >
                  <div className={`text-lg font-bold ${gamificationStats.color} mb-2`}>
                    ACCESS LEVEL: {gamificationStats.level.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-400">
                    Portfolio Score: {gamificationStats.score} points
                  </div>
                  {gamificationStats.level === 'Architect' && (
                    <div className="text-xs text-yellow-400 mt-2">
                      ★ MAXIMUM ACCESS ACHIEVED ★
                    </div>
                  )}
                </motion.div>
                
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    textShadow: [
                      "0 0 0px rgba(99, 102, 241, 0)",
                      "0 0 20px rgba(99, 102, 241, 0.8)",
                      "0 0 0px rgba(99, 102, 241, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-indigo-400 font-mono text-lg"
                >
                  ENTERING PORTFOLIO INTERFACE...
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemBootSequence;