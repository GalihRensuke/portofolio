import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FlagshipMandate from '../components/FlagshipMandate';
import PersonalizedProjectGrid from '../components/PersonalizedProjectGrid';
import PersonaSelector from '../components/PersonaSelector';
import InsightInjector from '../components/InsightInjector';
import { usePersonalization, Persona } from '../hooks/usePersonalization';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

const ProjectsPage = () => {
  const personalization = usePersonalization();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personalization.persona);
  const { setCurrentPage, setScrollDepth } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/projects');
    // Award points for visiting Projects page
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  // Track scroll depth with engagement scoring
  useEffect(() => {
    let hasScored75 = false;
    let hasScored100 = false;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollDepth(scrollPercent);

      // Award points for scroll milestones
      if (scrollPercent >= 75 && !hasScored75) {
        incrementEngagementScore(ENGAGEMENT_SCORING.SCROLL_DEPTH_75);
        hasScored75 = true;
      }
      if (scrollPercent >= 100 && !hasScored100) {
        incrementEngagementScore(ENGAGEMENT_SCORING.SCROLL_DEPTH_100);
        hasScored100 = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollDepth]);

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    localStorage.setItem('galyarder_persona', persona);
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">System Case Studies</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Architectural solutions with quantified outcomes. Each system demonstrates modular design, 
            async patterns, and measurable business impact.
          </p>
          
          {/* Persona Selector */}
          <div className="flex justify-center mb-8">
            <PersonaSelector 
              currentPersona={selectedPersona}
              onPersonaChange={handlePersonaChange}
            />
          </div>
        </motion.div>

        {/* Galyarder Insight */}
        <InsightInjector 
          pageContextKeywords={['projects', 'case-study', 'impact', 'roi', 'automation', 'ai', 'web3']}
          className="mb-16"
        />

        {/* Flagship Mandate Component */}
        <FlagshipMandate />

        {/* Existing Project Grid */}
        <PersonalizedProjectGrid persona={selectedPersona} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Architecture Philosophy</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="font-semibold mb-3 text-indigo-500">Modular Design</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Single-responsibility components with clear interfaces. Each module can be developed, 
                tested, and scaled independently.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-indigo-500">Async Architecture</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Event-driven communication patterns that eliminate blocking operations and enable 
                horizontal scaling.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-indigo-500">Quantified Outcomes</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Every system includes measurable success metrics. Architecture decisions are validated 
                through performance data.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;