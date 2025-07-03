import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Brain, ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlagshipMandate = () => {
  const archetypes = [
    {
      icon: Zap,
      title: 'The Autonomous Sales Engine',
      description: 'For businesses aiming to automate their lead qualification and sales funnels with intelligent, data-driven systems.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'The Enterprise AI Brain',
      description: 'For companies needing to transform their disorganized internal knowledge into a queryable, intelligent, and productive asset.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'The Operational Automation Core',
      description: 'For organizations looking to eliminate high-volume, repetitive manual work through robust, scalable automation.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-20 p-8 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/20 rounded-xl backdrop-blur-sm"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Current Mandate: Seeking Flagship Partner
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto"
        >
          The architecture and systems demonstrated in this portfolio are now fully operational. 
          The next phase is to deploy this capability for a flagship partner on a real-world, 
          high-impact project. I am currently seeking one organization with a complex challenge 
          that aligns with the following archetypes:
        </motion.p>
      </div>

      {/* Archetypes Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {archetypes.map((archetype, index) => (
          <motion.div
            key={archetype.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="p-6 bg-gray-900/80 border border-gray-700/50 rounded-lg hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${archetype.color} rounded-lg flex items-center justify-center mb-4`}>
              <archetype.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{archetype.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{archetype.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Sub-text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="text-center mb-8"
      >
        <p className="text-indigo-300 font-medium text-lg">
          My focus is to build a definitive case study that produces a massive, quantifiable ROI for your business.
        </p>
      </motion.div>

      {/* High-Priority CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center"
      >
        <Link
          to="/contact?intent=collaboration"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 group"
        >
          <Rocket className="mr-3 h-6 w-6 group-hover:animate-pulse" />
          Propose a Flagship Project
          <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <p className="text-sm text-gray-400 mt-3">
          Direct access to autonomous intake system • High-priority routing enabled
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FlagshipMandate;