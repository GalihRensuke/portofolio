import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import RotatingYinYang from '../components/RotatingYinYang';
import ProjectCaseStudy from '../components/ProjectCaseStudy';
import AutonomousIntake from '../components/AutonomousIntake';
import FlagshipMandate from '../components/FlagshipMandate';
import StatusBadge from '../components/StatusBadge';
import MissionControl from '../components/MissionControl';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { projectMetrics } from '../data/projectMetrics';
import { galyarderInsights } from '../data/galyarderInsights';
import { incrementEngagementScore, ENGAGEMENT_SCORING, getClearanceLevel } from '../utils/gamification';
import { Terminal, Zap, Brain, Code, Database, Shield, Eye, Cpu, Network, BarChart3, Users, Coins, ArrowRight, ExternalLink, Github, Star, Crown, Rocket } from 'lucide-react';

// Animation variants for scroll-triggered animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const HomePage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentPage, setScrollDepth } = useUserBehaviorStore();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  useEffect(() => {
    setCurrentPage('/');
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  // Track scroll depth
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const scrollPercent = latest * 100;
      setScrollDepth(scrollPercent);
      
      // Hide scroll indicator after scrolling
      if (scrollPercent > 10) {
        setShowScrollIndicator(false);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, setScrollDepth]);

  // Rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % galyarderInsights.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentLevel = getClearanceLevel(0);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-950 text-white overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{ opacity, scale, y }}
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              GALYARDER
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Systems Architect • Reality Shaper • Intelligence Engineer
            </p>
            <StatusBadge />
          </motion.div>

          {/* Mission Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <MissionControl additionalText="V4.1 OPERATIONAL" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => navigate('/projects')}
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Explore Systems
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-300 hover:text-white hover:bg-indigo-500/10 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Autonomous Intake
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>

          {/* Rotating Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="max-w-2xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={currentInsight}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-gray-400 italic text-lg leading-relaxed"
              >
                "{galyarderInsights[currentInsight]?.text}"
              </motion.blockquote>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center text-gray-400"
              >
                <span className="text-sm mb-2">Scroll to explore the ecosystem</span>
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* System Architecture Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">System Architecture</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Modular, scalable systems built with async-first patterns and quantified outcomes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <RotatingYinYang imageSrc="/assets/image.png" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  icon: Brain,
                  title: 'AI Layer',
                  desc: 'LLM orchestration, embeddings, and intelligent automation'
                },
                {
                  icon: Coins,
                  title: 'Web3 Infrastructure',
                  desc: 'Smart contracts, DeFi protocols, and blockchain automation'
                },
                {
                  icon: Zap,
                  title: 'Automation Core',
                  desc: 'Workflow orchestration, event processing, and system integration'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-900/50 transition-colors"
                >
                  <item.icon className="h-8 w-8 text-indigo-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Flagship Mandate Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <FlagshipMandate />
        </div>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Systems</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Production systems demonstrating architectural principles with quantified business outcomes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projectMetrics.slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <ProjectCaseStudy 
                  project={project} 
                  index={index}
                  showMetrics={true}
                  emphasizeTechnical={true}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="relative py-20 px-6"
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Autonomous Intake</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Intelligent client qualification system. High-value opportunities are fast-tracked.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AutonomousIntake />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;