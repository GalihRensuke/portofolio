import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import ProjectCaseStudy from './ProjectCaseStudy';
import { projectMetrics } from '../data/projectMetrics';
import { Persona, usePersonaPreferences } from '../hooks/usePersonalization';

interface PersonalizedProjectGridProps {
  persona: Persona;
}

const PersonalizedProjectGrid: React.FC<PersonalizedProjectGridProps> = ({ persona }) => {
  const [hoveredProject, setHoveredProject] = React.useState<string | null>(null);
  const preferences = usePersonaPreferences(persona);
  
  // Sort projects based on persona preferences
  const sortedProjects = [...projectMetrics].sort((a, b) => {
    switch (preferences.primarySort) {
      case 'roi':
        // Prioritize projects with strong ROI metrics
        const aHasROI = a.metrics.roi ? 1 : 0;
        const bHasROI = b.metrics.roi ? 1 : 0;
        return bHasROI - aHasROI;
      
      case 'technical':
        // Prioritize projects with complex tech stacks
        return b.tech_stack.length - a.tech_stack.length;
      
      case 'scalability':
        // Prioritize production systems with high transaction volumes
        const aTransactions = parseInt(a.metrics.transactions_processed?.replace(/[^\d]/g, '') || '0');
        const bTransactions = parseInt(b.metrics.transactions_processed?.replace(/[^\d]/g, '') || '0');
        return bTransactions - aTransactions;
      
      default:
        // Balanced view - production first, then by complexity
        if (a.status === 'production' && b.status !== 'production') return -1;
        if (b.status === 'production' && a.status !== 'production') return 1;
        return b.tech_stack.length - a.tech_stack.length;
    }
  });

  const getPersonaDescription = () => {
    switch (persona) {
      case 'founder':
        return 'Focused on business impact, ROI, and scalable solutions that drive measurable outcomes.';
      case 'developer':
        return 'Emphasizing technical architecture, implementation patterns, and engineering excellence.';
      case 'investor':
        return 'Highlighting market opportunity, scalability metrics, and production-ready systems.';
      default:
        return 'Comprehensive view of architectural solutions with quantified outcomes.';
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="text-gray-400 text-sm mb-8">
          {getPersonaDescription()}
        </p>
      </motion.div>

      <motion.div 
        className="grid lg:grid-cols-2 gap-8"
        style={{ perspective: '1000px' }}
      >
        {sortedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            onHoverStart={() => setHoveredProject(project.id)}
            onHoverEnd={() => setHoveredProject(null)}
            animate={{
              z: hoveredProject === project.id ? 50 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ProjectCaseStudy 
              project={project} 
              index={index}
              showMetrics={preferences.showMetrics}
              emphasizeTechnical={preferences.emphasizeTechnical}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PersonalizedProjectGrid;