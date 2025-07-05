import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Database, Settings, Crown, Palette } from 'lucide-react';
import IntelligenceDashboard from '../components/IntelligenceDashboard';
import KnowledgePipeline from '../components/KnowledgePipeline';
import RealityController from '../components/RealityController';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { useThemeStore } from '../store/themeStore';
import { getClearanceLevel, getEngagementScore } from '../utils/gamification';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'knowledge'>('intelligence');
  const [showRealityController, setShowRealityController] = useState(false);
  const { setCurrentPage } = useUserBehaviorStore();
  const { hasUnlockedReality } = useThemeStore();

  useEffect(() => {
    setCurrentPage('/dashboard');
  }, [setCurrentPage]);

  // Check if user is Architect level
  const currentScore = getEngagementScore();
  const currentLevel = getClearanceLevel(currentScore);
  const isArchitect = currentLevel.level === 'Architect';
  const tabs = [
    {
      id: 'intelligence' as const,
      label: 'Intelligence Dashboard',
      icon: BarChart3,
      description: 'V4.1 Core Metrics & Performance Analytics'
    },
    {
      id: 'knowledge' as const,
      label: 'Knowledge Pipeline',
      icon: Brain,
      description: 'Automated Learning & Intelligence Compounding'
    }
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Mission Control</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Single source of truth for protocol performance. Monitor autonomous systems, 
            track intelligence compounding, and optimize operational efficiency.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 space-y-4 lg:space-y-0">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-1 flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Reality Controller Access - Only for Architect Level */}
          {isArchitect && hasUnlockedReality && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center lg:justify-end"
            >
              <motion.button
                onClick={() => setShowRealityController(true)}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-400/30 transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(251, 191, 36, 0)",
                    "0 0 20px rgba(251, 191, 36, 0.3)",
                    "0 0 0px rgba(251, 191, 36, 0)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Crown className="h-5 w-5" />
                </motion.div>
                <span className="font-semibold">REALITY CONTROL</span>
                <Palette className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Architect Level Notification */}
        {isArchitect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 p-4 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-400" />
              <div>
                <div className="text-yellow-400 font-semibold">ARCHITECT CLEARANCE ACTIVE</div>
                <div className="text-gray-300 text-sm">
                  You have unlocked reality control. Access the System Interface Override to customize your experience.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Description */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {activeTab === 'intelligence' && <IntelligenceDashboard />}
          {activeTab === 'knowledge' && <KnowledgePipeline />}
        </motion.div>

        {/* System Status Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-6 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Database className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-white font-medium">All Systems Operational</div>
                <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Intake Funnel</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">AI Concierge</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Knowledge Pipeline</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reality Controller Modal */}
        <RealityController
          isVisible={showRealityController}
          onClose={() => setShowRealityController(false)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;