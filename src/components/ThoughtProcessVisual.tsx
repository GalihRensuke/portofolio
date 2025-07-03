import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Circle, Brain, Zap, Target, CheckCircle } from 'lucide-react';

const ThoughtProcessVisual = () => {
  const steps = [
    {
      id: 'problem',
      label: 'Problem',
      description: 'Complex challenge identification',
      icon: Circle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/30'
    },
    {
      id: 'deconstruct',
      label: 'Deconstruct',
      description: 'Break into components',
      icon: Brain,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30'
    },
    {
      id: 'principles',
      label: 'First Principles',
      description: 'Identify core truths',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'synthesize',
      label: 'Synthesize',
      description: 'Combine insights',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'solution',
      label: 'Solution',
      description: 'Elegant implementation',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-2">Thought Process Framework</h3>
        <p className="text-gray-400 text-sm">
          How complex problems are systematically deconstructed and solved
        </p>
      </motion.div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                className="flex flex-col items-center space-y-3"
              >
                <motion.div
                  className={`relative w-16 h-16 ${step.bgColor} ${step.borderColor} border-2 rounded-full flex items-center justify-center`}
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(99, 102, 241, 0)",
                      "0 0 0 8px rgba(99, 102, 241, 0.1)",
                      "0 0 0 0 rgba(99, 102, 241, 0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4
                  }}
                >
                  <IconComponent className={`h-6 w-6 ${step.color}`} />
                  
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 border-2 border-indigo-400/30 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.4
                    }}
                  />
                </motion.div>
                
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    className={`font-semibold text-sm ${step.color}`}
                  >
                    {step.label}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                    className="text-xs text-gray-400 max-w-20"
                  >
                    {step.description}
                  </motion.div>
                </div>
              </motion.div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.2 + 0.5,
                    ease: "easeOut"
                  }}
                  className="flex-1 flex items-center justify-center mx-4"
                >
                  <motion.div
                    animate={{
                      x: [0, 10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="h-5 w-5 text-indigo-400/60" />
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                className={`w-12 h-12 ${step.bgColor} ${step.borderColor} border-2 rounded-full flex items-center justify-center flex-shrink-0`}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(99, 102, 241, 0)",
                    "0 0 0 6px rgba(99, 102, 241, 0.1)",
                    "0 0 0 0 rgba(99, 102, 241, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                <IconComponent className={`h-5 w-5 ${step.color}`} />
              </motion.div>
              
              <div className="flex-1">
                <div className={`font-semibold ${step.color} mb-1`}>
                  {step.label}
                </div>
                <div className="text-sm text-gray-400">
                  {step.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Process Flow Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="mt-8 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg"
      >
        <p className="text-sm text-gray-300 text-center leading-relaxed">
          This systematic approach ensures that complex challenges are broken down into manageable components, 
          analyzed from first principles, and synthesized into elegant solutions that address root causes 
          rather than symptoms.
        </p>
      </motion.div>
    </div>
  );
};

export default ThoughtProcessVisual;