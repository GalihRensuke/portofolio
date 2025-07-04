import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import InteractiveSystemCube from '../components/InteractiveSystemCube';
import StatusBadge from '../components/StatusBadge';
import MissionControl from '../components/MissionControl';
import SemanticQuery from '../components/SemanticQuery';
import DynamicCTA from '../components/DynamicCTA';
import PersonaSelector from '../components/PersonaSelector';
import ProactiveAIConcierge from '../components/ProactiveAIConcierge';
import { usePersonalization, Persona } from '../hooks/usePersonalization';
import { useUserBehaviorStore } from '../store/userBehaviorStore';

const HomePage = () => {
  const personalization = usePersonalization();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personalization.persona);
  const { setCurrentPage, setScrollDepth } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/');
  }, [setCurrentPage]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollDepth(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollDepth]);

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    localStorage.setItem('galyarder_persona', persona);
  };

  return (
    <div className="pt-16">
      {/* Hero Section - Mission Control */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
        <ParticleBackground />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <StatusBadge />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black mb-4 text-white"
            >
              Galyarder
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              Autonomous Systems Architect
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              Engineering intelligent systems that qualify opportunities, demonstrate capability, 
              and generate authority autonomously.
            </motion.p>

            {/* Dynamic CTAs */}
            <DynamicCTA personalization={personalization} />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-sm text-gray-400 space-y-4"
            >
              <MissionControl />
              
              <div className="flex flex-col space-y-2">
                <SemanticQuery />
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-500">
                  <Search className="h-4 w-4" />
                  <span>Query my knowledge base with <code className="px-1 py-0.5 bg-gray-800 rounded text-indigo-300">⌘K</code></span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-400">
                  <span className="text-sm font-medium">Building Galyarder Ascendancy</span>
                </div>
              </div>

              {/* Persona Selector */}
              <div className="flex justify-center lg:justify-start">
                <PersonaSelector 
                  currentPersona={selectedPersona}
                  onPersonaChange={handlePersonaChange}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Side - Interactive 3D System */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.4, delay: 0.6, type: "spring", stiffness: 100 }}
            className="relative flex items-center justify-center"
          >
            <InteractiveSystemCube />
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>

      {/* Core Capabilities - V4 Features */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Portfolio V4: Adaptive Intelligence Engine</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              This portfolio dynamically adapts to each visitor's context, persona, and intent. 
              Every interaction is personalized to maximize relevance and conversion potential.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dynamic CTA Engine</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Primary actions morph based on UTM parameters and visitor context. DeFi campaigns see 
                "Analyze DeFi Strategy," AI campaigns see "Deploy AI Agent."
              </p>
              <div className="text-sm text-indigo-500 font-medium">
                UTM detection → Context mapping → Personalized CTA
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Persona-Based Routing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Content adapts to visitor persona. Founders see ROI metrics first, developers see 
                technical architecture, investors see scalability data.
              </p>
              <div className="text-sm text-indigo-500 font-medium">
                Persona detection → Content prioritization → Optimized presentation
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Proactive AI Concierge</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Conversational AI agent powered by the vector knowledge base. Proactively engages 
                on exit-intent, answers questions, and guides users to conversion.
              </p>
              <div className="text-sm text-indigo-500 font-medium">
                Behavioral triggers → AI engagement → Guided conversion
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* System Metrics */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8">V4 Performance Metrics</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Portfolio V4 operates as an intelligent sales agent, not a static presentation.
            </p>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Personalization Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">3x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">60%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Intelligent Operation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proactive AI Concierge */}
      <ProactiveAIConcierge />
    </div>
  );
};

export default HomePage;