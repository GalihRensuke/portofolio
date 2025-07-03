import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, Zap, Network } from 'lucide-react';
import KnowledgeArsenalDemo from '../components/KnowledgeArsenalDemo';
import { useUserBehaviorStore } from '../store/userBehaviorStore';

const KnowledgeArsenalPage = () => {
  const { setCurrentPage } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/knowledge-arsenal');
  }, [setCurrentPage]);

  const capabilities = [
    {
      icon: Database,
      title: 'Unified Data Ingestion',
      desc: 'Converts all portfolio data sources into structured knowledge entities with rich metadata'
    },
    {
      icon: Brain,
      title: 'Semantic Understanding',
      desc: 'Vector embeddings enable semantic search and intelligent content relationships'
    },
    {
      icon: Network,
      title: 'Relationship Mapping',
      desc: 'Automatically detects and maps connections between projects, principles, and insights'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      desc: 'Continuous ingestion pipeline keeps knowledge base synchronized with source changes'
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
              <Database className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Knowledge Arsenal</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Centralized intelligence hub that transforms all portfolio data into a queryable, 
            semantic knowledge base. Experience the foundation of the autonomous intelligence engine.
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

        {/* Main Demo Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <KnowledgeArsenalDemo />
        </motion.div>

        {/* Technical Implementation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Implementation Architecture</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-indigo-400 mb-3">Data Layer</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Vector database with pgvector extension</li>
                <li>• Structured entity schemas with metadata</li>
                <li>• Relationship mapping and graph storage</li>
                <li>• Automated backup and versioning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-400 mb-3">Processing Pipeline</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Multi-source data connectors</li>
                <li>• Content normalization and enrichment</li>
                <li>• Vector embedding generation</li>
                <li>• Quality validation and scoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-400 mb-3">Intelligence Layer</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Semantic search with filtering</li>
                <li>• Relationship-based recommendations</li>
                <li>• Knowledge gap detection</li>
                <li>• Automated insight generation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowledgeArsenalPage;