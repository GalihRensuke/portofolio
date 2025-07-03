import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, Zap, Target, BarChart3, Users, Quote } from 'lucide-react';
import { getTestimonialsByExpertise } from '../data/testimonials';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import InsightInjector from '../components/InsightInjector';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';

const AboutPage = () => {
  const { setCurrentPage } = useUserBehaviorStore();

  useEffect(() => {
    setCurrentPage('/about');
    // Award points for visiting About page
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  const quantifiedExpertise = [
    {
      id: 'smart-contracts',
      icon: Code,
      title: 'Smart Contracts & Audits',
      metric: '15+ contracts deployed',
      desc: 'Solidity development with comprehensive testing via Foundry. Security-first approach with formal verification patterns.'
    },
    {
      id: 'ai-automation',
      icon: Brain,
      title: 'AI Workflow Automation',
      metric: '10,000+ processes automated',
      desc: 'LLM integration for decision-making, content generation, and workflow orchestration. Reduced manual operations by 90%.'
    },
    {
      id: 'architecture',
      icon: Zap,
      title: 'System Architecture',
      metric: '200% efficiency gains',
      desc: 'Event-driven microservices with async patterns. Horizontal scaling and fault-tolerant design principles.'
    },
    {
      id: 'execution',
      icon: Target,
      title: 'Execution & Delivery',
      metric: '3+ production systems',
      desc: 'End-to-end system delivery with quantified business outcomes. Focus on measurable impact over feature count.'
    }
  ];

  const operatingPrinciples = [
    'Clear > Clever — Prioritize readability and maintainability over clever solutions',
    'Substance > Style — Focus on functionality and performance over aesthetics', 
    'Systems > Stories — Build scalable architecture over one-off solutions',
    'Structure > Personality — Consistent patterns over individual preferences',
    'Utility > Trend — Proven tools over the latest frameworks'
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Systems Architect</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Engineering intelligent infrastructure with quantified outcomes and architectural precision.
          </p>
        </motion.div>

        {/* Galyarder Insight */}
        <InsightInjector 
          pageContextKeywords={['principles', 'philosophy', 'architecture', 'expertise']}
          className="mb-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-16"
        >
          <p>
            Independent systems architect specializing in AI automation, Web3 infrastructure, and scalable tooling. 
            Operates with architectural precision, async-first design patterns, and quantified delivery outcomes.
          </p>
          
          <p>
            Core focus: building modular systems that eliminate manual operations, scale horizontally, 
            and deliver measurable business impact. Every architecture decision is validated through 
            performance metrics and real-world usage patterns.
          </p>

          <p>
            Approach: First principles thinking, systematic problem decomposition, and evidence-based 
            optimization. Prioritize system reliability and maintainability over complexity or novelty.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Quantified Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {quantifiedExpertise.map((item, index) => {
              const expertiseTestimonials = getTestimonialsByExpertise(item.id);
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <item.icon className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <div className="text-green-500 font-medium text-sm mb-2">{item.metric}</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.desc}</p>
                    
                    {/* Expertise Testimonials */}
                    {expertiseTestimonials.length > 0 && (
                      <div className="space-y-2">
                        {expertiseTestimonials.slice(0, 1).map((testimonial) => (
                          <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                            className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-start space-x-2 mb-2">
                              <Quote className="h-3 w-3 text-indigo-400 mt-1 flex-shrink-0" />
                              <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                "{testimonial.quote.length > 120 ? testimonial.quote.substring(0, 120) + '...' : testimonial.quote}"
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{testimonial.author}</span>
                                <span className="mx-1">•</span>
                                <span>{testimonial.company}</span>
                              </div>
                              {testimonial.impact && (
                                <div className="text-xs text-indigo-500 font-medium">
                                  {testimonial.impact}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <h3 className="text-2xl font-bold mb-6">Operating Principles</h3>
          <ul className="space-y-4 text-gray-600 dark:text-gray-300">
            {operatingPrinciples.map((principle, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                className="flex items-center"
              >
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-4 flex-shrink-0"></span>
                <span>{principle}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-indigo-500 mr-3" />
              <h3 className="font-semibold text-lg">Performance Metrics</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• 50,000+ automated transactions processed</li>
              <li>• 85% average efficiency improvement</li>
              <li>• 200% ROI on automation investments</li>
              <li>• 99.9% system uptime maintained</li>
            </ul>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-indigo-500 mr-3" />
              <h3 className="font-semibold text-lg">Collaboration Focus</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• High-value technical partnerships</li>
              <li>• Async-first communication patterns</li>
              <li>• Documentation-driven development</li>
              <li>• Measurable outcome agreements</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;