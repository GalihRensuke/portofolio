import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import InteractiveBlueprint from '../components/InteractiveBlueprint';
import BlueprintSidebar from '../components/BlueprintSidebar';
import ThoughtProcessVisual from '../components/ThoughtProcessVisual';
import InsightInjector from '../components/InsightInjector';
import { 
  blueprintData, 
  getSectionHeaders, 
  getSubPrinciples, 
  getIconComponent, 
  getCategoryTextColor 
} from '../data/blueprintData';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

const BlueprintPage = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const { setCurrentPage, setScrollDepth, addClickedNode } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/blueprint');
    // Award points for visiting Blueprint page
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  // Initialize expanded sections with all section headers
  useEffect(() => {
    const sectionHeaders = getSectionHeaders();
    setExpandedSections(sectionHeaders.map(section => section.id));
  }, []);

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

  // Intersection Observer for tracking active sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const yOffset = -100; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleNodeClickNavigate = (nodeId: string) => {
    // Track the node click for behavior analysis and award points
    addClickedNode(nodeId);
    incrementEngagementScore(ENGAGEMENT_SCORING.BLUEPRINT_NODE_CLICK);
    // Navigate to the section
    scrollToSection(nodeId);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sectionHeaders = getSectionHeaders();

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">System Blueprint</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Interactive exploration of architectural principles, mental models, and system design patterns.
          </p>
        </motion.div>

        {/* Galyarder Insight */}
        <InsightInjector 
          pageContextKeywords={['blueprint', 'design', 'patterns', 'systems-thinking', 'mental-models']}
          className="mb-16"
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <BlueprintSidebar
              activeSectionId={activeSectionId}
              onSelectSection={scrollToSection}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-20">
            {/* Thought Process Visual */}
            <section 
              id="thought-process-visual"
              ref={(el) => sectionRefs.current['thought-process-visual'] = el}
            >
              <ThoughtProcessVisual />
            </section>

            {/* Interactive System Map */}
            <section 
              id="interactive-system-map"
              ref={(el) => sectionRefs.current['interactive-system-map'] = el}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold mb-8"
              >
                Interactive System Map
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4"
              >
                <InteractiveBlueprint onNodeClickNavigate={handleNodeClickNavigate} />
              </motion.div>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Click nodes to explore details. Drag to rearrange. Zoom and pan to navigate.
              </p>
            </section>

            {/* Blueprint Sections */}
            {sectionHeaders.map((section, sectionIndex) => {
              const subPrinciples = getSubPrinciples(section.id);
              const SectionIcon = getIconComponent(section.icon);
              
              return (
                <motion.section
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="scroll-mt-24"
                  id={section.id}
                  ref={(el) => sectionRefs.current[section.id] = el}
                >
                  <div className="flex items-center mb-8">
                    <SectionIcon className="h-8 w-8 text-indigo-500 mr-4" />
                    <h2 className="text-3xl font-bold">{section.label}</h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                    {section.description}
                  </p>
                  
                  {/* Sub-principles Grid */}
                  {subPrinciples.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-8">
                      {subPrinciples.map((principle, index) => {
                        const PrincipleIcon = getIconComponent(principle.icon);
                        const textColor = getCategoryTextColor(principle.category);
                        
                        return (
                          <motion.div
                            key={principle.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors scroll-mt-24"
                            id={principle.id}
                            ref={(el) => sectionRefs.current[principle.id] = el}
                          >
                            <div className="flex items-center mb-4">
                              <PrincipleIcon className={`h-6 w-6 ${textColor} mr-3`} />
                              <h3 className="text-xl font-semibold">{principle.label}</h3>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{principle.description}</p>
                            
                            {principle.implementation && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">Implementation</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{principle.implementation}</p>
                              </div>
                            )}
                            
                            {principle.examples && principle.examples.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">Examples</h4>
                                <ul className="space-y-1">
                                  {principle.examples.map((example, i) => (
                                    <li key={i} className={`text-sm ${textColor}`}>• {example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.section>
              );
            })}

            {/* Decision Framework */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-gray-50 dark:bg-gray-900 rounded-lg scroll-mt-24"
              id="decision-framework"
              ref={(el) => sectionRefs.current['decision-framework'] = el}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Decision Framework</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-indigo-500">Problem Analysis</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li>• First principles decomposition</li>
                    <li>• Constraint identification</li>
                    <li>• Success metric definition</li>
                    <li>• Risk assessment matrix</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4 text-indigo-500">System Design</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li>• Modular decomposition</li>
                    <li>• Interface specification</li>
                    <li>• Failure mode analysis</li>
                    <li>• Performance modeling</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4 text-indigo-500">Implementation</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li>• Incremental delivery</li>
                    <li>• Continuous validation</li>
                    <li>• Performance monitoring</li>
                    <li>• Iterative optimization</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintPage;