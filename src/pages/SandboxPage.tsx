import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Brain, Target } from 'lucide-react';
import PromptCodexSandbox from '../components/PromptCodexSandbox';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

const SandboxPage = () => {
  const { setCurrentPage } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/sandbox');
    // Award points for visiting Sandbox page
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  const handlePromptGenerated = () => {
    // This callback is triggered when a prompt is generated in the sandbox
    // The scoring is handled within the PromptCodexSandbox component
  };

  const capabilities = [
    {
      icon: Brain,
      title: 'Structured Reasoning',
      desc: 'Chain-of-thought analysis with systematic problem decomposition'
    },
    {
      icon: Code,
      title: 'System Architecture',
      desc: 'Generate comprehensive technical documentation and design patterns'
    },
    {
      icon: Target,
      title: 'Code Optimization',
      desc: 'Analyze and improve code for performance and maintainability'
    },
    {
      icon: Zap,
      title: 'DSL Composition',
      desc: 'Template-based prompt generation with variable injection'
    }
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Live Fire Sandbox</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the Prompt Codex system in action. This is not a demo—it's a functional tool 
            from the GalyarderOS toolkit, demonstrating structured AI engineering and DSL-based prompt composition.
          </p>
        </motion.div>

        {/* Capabilities Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="p-6 bg-gray-900 border border-gray-800 rounded-lg text-center"
            >
              <capability.icon className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">{capability.title}</h3>
              <p className="text-sm text-gray-400">{capability.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PromptCodexSandbox onPromptGenerated={handlePromptGenerated} />
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-6">System Implementation</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-indigo-400 mb-3">Architecture Patterns</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Template-based composition with variable injection</li>
                <li>• Type-safe validation using Zod schemas</li>
                <li>• Conditional rendering with Handlebars-style syntax</li>
                <li>• Modular prompt components with inheritance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-400 mb-3">Production Features</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Version control and A/B testing framework</li>
                <li>• Performance analytics and output validation</li>
                <li>• Multi-model support with fallback strategies</li>
                <li>• Automated prompt optimization based on feedback</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SandboxPage;