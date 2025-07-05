import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import InteractiveSystemCube from '../components/InteractiveSystemCube';
import ProjectCaseStudy from '../components/ProjectCaseStudy';
import AutonomousIntake from '../components/AutonomousIntake';
import { useUserBehaviorStore } from '../store/userBehaviorStore';
import { projectMetrics } from '../data/projectMetrics';
import { galyarderInsights } from '../data/galyarderInsights';
import { incrementEngagementScore, ENGAGEMENT_SCORING } from '../utils/gamification';
import { Terminal, Zap, Brain, Code, Database, Shield, Eye, Cpu, Network, BarChart3, Users, Coins, ArrowRight, ExternalLink, Github, Star, Crown, Rocket } from 'lucide-react';

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [currentAct, setCurrentAct] = useState(1);
  const { setCurrentPage, setScrollDepth } = useUserBehaviorStore();

  // Scroll tracking for the entire odyssey
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setCurrentPage('/');
    incrementEngagementScore(ENGAGEMENT_SCORING.PAGE_VISIT);
  }, [setCurrentPage]);

  // Track scroll depth and current act
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      setScrollDepth(latest * 100);
      
      // Determine current act based on scroll progress
      if (latest < 0.33) setCurrentAct(1);      // Genesis
      else if (latest < 0.66) setCurrentAct(2); // Forging
      else setCurrentAct(3);                    // Ascendancy
    });
    return unsubscribe;
  }, [smoothProgress, setScrollDepth]);

  // ACT 1: GENESIS - Philosophical awakening (0-33%)
  const act1Opacity = useTransform(smoothProgress, [0, 0.1, 0.25, 0.33], [1, 1, 1, 0]);
  const act1Scale = useTransform(smoothProgress, [0, 0.33], [1, 0.8]);

  // Genesis text animations
  const genesis1Opacity = useTransform(smoothProgress, [0, 0.05, 0.12, 0.15], [0, 1, 1, 0]);
  const genesis1Y = useTransform(smoothProgress, [0, 0.05, 0.15], [100, 0, -100]);

  const genesis2Opacity = useTransform(smoothProgress, [0.08, 0.13, 0.20, 0.23], [0, 1, 1, 0]);
  const genesis2Y = useTransform(smoothProgress, [0.08, 0.13, 0.23], [100, 0, -100]);

  const genesis3Opacity = useTransform(smoothProgress, [0.16, 0.21, 0.28, 0.31], [0, 1, 1, 0]);
  const genesis3Y = useTransform(smoothProgress, [0.16, 0.21, 0.31], [100, 0, -100]);

  // System Cube revelation
  const cubeOpacity = useTransform(smoothProgress, [0.24, 0.30], [0, 1]);
  const cubeScale = useTransform(smoothProgress, [0.24, 0.30], [0.5, 1]);
  const cubeRotation = useTransform(smoothProgress, [0.24, 0.33], [0, 360]);

  // ACT 2: FORGING - Project showcase (33-66%)
  const act2Opacity = useTransform(smoothProgress, [0.30, 0.35, 0.60, 0.66], [0, 1, 1, 0]);
  const act2Y = useTransform(smoothProgress, [0.33, 0.66], [100, -100]);

  // Project animations
  const project1Opacity = useTransform(smoothProgress, [0.35, 0.40, 0.48, 0.52], [0, 1, 1, 0]);
  const project1X = useTransform(smoothProgress, [0.35, 0.40, 0.52], [-200, 0, 200]);

  const project2Opacity = useTransform(smoothProgress, [0.42, 0.47, 0.55, 0.59], [0, 1, 1, 0]);
  const project2X = useTransform(smoothProgress, [0.42, 0.47, 0.59], [200, 0, -200]);

  const project3Opacity = useTransform(smoothProgress, [0.50, 0.55, 0.62, 0.66], [0, 1, 1, 0]);
  const project3X = useTransform(smoothProgress, [0.50, 0.55, 0.66], [-200, 0, 200]);

  // ACT 3: ASCENDANCY - Vision and action (66-100%)
  const act3Opacity = useTransform(smoothProgress, [0.63, 0.68], [0, 1]);
  const act3Scale = useTransform(smoothProgress, [0.66, 1], [0.8, 1]);

  // Vision text
  const visionOpacity = useTransform(smoothProgress, [0.68, 0.73, 0.85, 0.90], [0, 1, 1, 0]);
  const visionY = useTransform(smoothProgress, [0.68, 0.73, 0.90], [100, 0, -100]);

  // Intake form
  const intakeOpacity = useTransform(smoothProgress, [0.85, 0.90], [0, 1]);
  const intakeY = useTransform(smoothProgress, [0.85, 0.90], [100, 0]);

  // Select key insights for Genesis
  const genesisInsights = [
    "Clear > Clever. The most elegant solution is often the one that can be understood by your future self at 3 AM.",
    "The best automation eliminates decisions, not just tasks. Reduce cognitive overhead, not just manual work.",
    "Build systems that compound intelligence over time. Each interaction should make the system smarter."
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* The Odyssey Canvas - 900vh for full narrative */}
      <div className="h-[900vh] relative">
        
        {/* Dynamic Particle Background */}
        <div className="fixed inset-0 z-0">
          <ParticleBackground isAITyping={currentAct > 1} />
        </div>

        {/* Dynamic Background Gradient */}
        <motion.div 
          className="fixed inset-0 z-5"
          animate={{
            background: currentAct === 1 
              ? `radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`
              : currentAct === 2
              ? `radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)`
              : `radial-gradient(ellipse at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)`
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Cinematic Grid Overlay */}
        <div className="fixed inset-0 z-10 pointer-events-none opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%), linear-gradient(0deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* ACT 1: GENESIS - The Philosophical Awakening */}
        <motion.div
          style={{ 
            opacity: act1Opacity,
            scale: act1Scale
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="text-center max-w-7xl mx-auto px-6">
            {/* Genesis Text Sequence */}
            <motion.div
              style={{ 
                opacity: genesis1Opacity,
                y: genesis1Y
              }}
              className="mb-16"
            >
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 text-white"
                style={{
                  textShadow: "0 0 40px rgba(99, 102, 241, 0.5)"
                }}
              >
                GALYARDER
              </motion.h1>
              <motion.div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Systems Architect • AI Engineer • Web3 Builder
              </motion.div>
            </motion.div>

            <motion.div
              style={{ 
                opacity: genesis2Opacity,
                y: genesis2Y
              }}
              className="mb-16"
            >
              <blockquote className="text-3xl md:text-4xl text-gray-200 italic leading-relaxed max-w-5xl mx-auto">
                "{genesisInsights[0]}"
              </blockquote>
              <div className="text-indigo-400 mt-4">— Galyarder Principle #1</div>
            </motion.div>

            <motion.div
              style={{ 
                opacity: genesis3Opacity,
                y: genesis3Y
              }}
              className="mb-16"
            >
              <blockquote className="text-3xl md:text-4xl text-gray-200 italic leading-relaxed max-w-5xl mx-auto">
                "{genesisInsights[1]}"
              </blockquote>
              <div className="text-purple-400 mt-4">— Automation Philosophy</div>
            </motion.div>

            {/* System Cube Revelation */}
            <motion.div
              style={{
                opacity: cubeOpacity,
                scale: cubeScale,
                rotateY: cubeRotation
              }}
              className="relative"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                THE UNIFIED SYSTEM
              </motion.h2>
              
              <div className="relative">
                <InteractiveSystemCube />
                
                {/* Epic Glow Effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-blue-500/40 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              <motion.p
                className="text-xl text-gray-300 mt-12 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                AI + Web3 + Automation unified in a single, intelligent architecture
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* ACT 2: FORGING - The Project Showcase */}
        <motion.div
          style={{ 
            opacity: act2Opacity,
            y: act2Y
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-bold mb-8 text-white">
                FORGED IN PRODUCTION
              </h2>
              <p className="text-2xl text-gray-300 mb-12">
                Systems that transform operations and deliver quantified results
              </p>
            </motion.div>

            {/* Cinematic Project Showcase */}
            <div className="space-y-32">
              {/* Project 1 - AirdropOps */}
              <motion.div
                style={{ 
                  opacity: project1Opacity,
                  x: project1X
                }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 lg:order-1">
                  <ProjectCaseStudy 
                    project={projectMetrics[1]} // AirdropOps
                    index={0}
                    showMetrics={true}
                    emphasizeTechnical={true}
                  />
                </div>
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <motion.div
                    className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    PRODUCTION SYSTEM
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-4">Web3 Automation Engine</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Intelligent pipeline processing 50,000+ opportunities with 92% accuracy. 
                    Event-driven architecture delivering 200% ROI improvement through systematic automation.
                  </p>
                </div>
              </motion.div>

              {/* Project 2 - GalyarderOS */}
              <motion.div
                style={{ 
                  opacity: project2Opacity,
                  x: project2X
                }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="text-center lg:text-left">
                  <motion.div
                    className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    COGNITIVE SYSTEM
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-4">Personal AI Operating System</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Unified architecture eliminating 85% of decision fatigue. 
                    Modular microservices with AI-powered automation saving 2.5 hours daily.
                  </p>
                </div>
                <div>
                  <ProjectCaseStudy 
                    project={projectMetrics[0]} // GalyarderOS
                    index={1}
                    showMetrics={true}
                    emphasizeTechnical={true}
                  />
                </div>
              </motion.div>

              {/* Project 3 - Prompt Codex */}
              <motion.div
                style={{ 
                  opacity: project3Opacity,
                  x: project3X
                }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 lg:order-1">
                  <ProjectCaseStudy 
                    project={projectMetrics[2]} // Prompt Codex
                    index={2}
                    showMetrics={true}
                    emphasizeTechnical={true}
                  />
                </div>
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <motion.div
                    className="inline-flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    AI WORKFLOW ENGINE
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-4">Structured AI Engineering</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    DSL-based prompt composition reducing development time by 70%. 
                    Template inheritance and performance analytics for consistent AI workflows.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ACT 3: ASCENDANCY - Vision and Call to Action */}
        <motion.div
          style={{ 
            opacity: act3Opacity,
            scale: act3Scale
          }}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center"
        >
          <div className="text-center max-w-6xl mx-auto px-6">
            {/* Vision Statement */}
            <motion.div
              style={{ 
                opacity: visionOpacity,
                y: visionY
              }}
              className="mb-16"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-black mb-8 text-white"
                animate={{
                  textShadow: [
                    "0 0 30px rgba(99, 102, 241, 0.8)",
                    "0 0 60px rgba(139, 92, 246, 1)",
                    "0 0 30px rgba(99, 102, 241, 0.8)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                THE ASCENDANCY
              </motion.h1>
              
              <motion.p
                className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Where intelligent systems meet human ambition.<br />
                Where automation amplifies capability.<br />
                Where the future is architected today.
              </motion.p>

              <motion.blockquote
                className="text-xl md:text-2xl text-indigo-300 italic mb-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                "{genesisInsights[2]}"
              </motion.blockquote>
            </motion.div>

            {/* Autonomous Intake Integration */}
            <motion.div
              style={{ 
                opacity: intakeOpacity,
                y: intakeY
              }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-900/80 border border-indigo-500/30 rounded-xl p-8 backdrop-blur-sm"
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full text-indigo-300 font-semibold mb-4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    FLAGSHIP PARTNER MANDATE ACTIVE
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">Join the Ascendancy</h3>
                  <p className="text-gray-300 text-lg">
                    Seeking one organization with a complex challenge that aligns with the three core archetypes.
                    Let's build a definitive case study that produces massive, quantifiable ROI.
                  </p>
                </div>
                
                <AutonomousIntake />
              </motion.div>

              {/* Navigation to Other Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12 grid md:grid-cols-2 gap-6"
              >
                <motion.button
                  onClick={() => navigate('/blueprint')}
                  className="group p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-indigo-500 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Database className="h-8 w-8 text-indigo-400" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">System Blueprint</h4>
                  <p className="text-gray-400 text-sm">Explore the architectural principles and mental models</p>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/sandbox')}
                  className="group p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Zap className="h-8 w-8 text-purple-400" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Live Fire Sandbox</h4>
                  <p className="text-gray-400 text-sm">Experience the Prompt Codex system in action</p>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Scroll Progress Indicator */}
        <motion.div
          className="fixed bottom-8 right-8 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <div className="relative">
            <div className="w-4 h-48 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700/50">
              <motion.div
                className="w-full bg-gradient-to-t from-indigo-500 via-purple-500 to-blue-500 rounded-full relative overflow-hidden"
                style={{
                  height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/40"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            
            <motion.div
              className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 font-mono bg-gray-900/80 px-2 py-1 rounded"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
              }}
            >
              {Math.round(scrollYProgress.get() * 100)}%
            </motion.div>
          </div>
        </motion.div>

        {/* Act Indicator */}
        <motion.div
          className="fixed top-1/2 left-8 transform -translate-y-1/2 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <div className="space-y-6">
            {[
              { act: 1, label: "Genesis", color: "text-blue-400" },
              { act: 2, label: "Forging", color: "text-purple-400" },
              { act: 3, label: "Ascendancy", color: "text-green-400" }
            ].map((actInfo) => (
              <motion.div
                key={actInfo.act}
                className={`text-center ${currentAct === actInfo.act ? 'scale-125' : 'scale-100'} transition-all duration-500`}
              >
                <motion.div
                  className={`w-4 h-4 rounded-full mb-2 mx-auto ${
                    currentAct === actInfo.act ? 'bg-white' : 'bg-gray-600'
                  }`}
                  animate={{
                    boxShadow: currentAct === actInfo.act 
                      ? "0 0 20px rgba(255, 255, 255, 0.8)" 
                      : "0 0 0px rgba(255, 255, 255, 0)"
                  }}
                />
                <div className={`text-xs font-mono ${
                  currentAct === actInfo.act ? actInfo.color : 'text-gray-500'
                }`}>
                  {actInfo.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;