import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
import { projectMetrics } from '../data/projectMetrics';
import { Terminal, Zap, Brain, Code, Database, Shield, Eye, Cpu, Network, BarChart3, Users, Coins, ArrowRight, ExternalLink, Github } from 'lucide-react';

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const personalization = usePersonalization();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personalization.persona);
  const [currentSection, setCurrentSection] = useState(0);
  const { setCurrentPage, setScrollDepth } = useUserBehaviorStore();
  const navigate = useNavigate();

  // Scroll tracking for the entire narrative
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setCurrentPage('/');
  }, [setCurrentPage]);

  // Track scroll depth and current section
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      setScrollDepth(latest * 100);
      
      // Determine current section based on scroll progress
      if (latest < 0.15) setCurrentSection(0);      // Hero
      else if (latest < 0.35) setCurrentSection(1); // Projects
      else if (latest < 0.55) setCurrentSection(2); // Architecture
      else if (latest < 0.75) setCurrentSection(3); // Metrics
      else if (latest < 0.90) setCurrentSection(4); // System Cube
      else setCurrentSection(5);                    // Final CTA
    });
    return unsubscribe;
  }, [smoothProgress, setScrollDepth]);

  const handlePersonaChange = (persona: Persona) => {
    setSelectedPersona(persona);
    localStorage.setItem('galyarder_persona', persona);
    
    switch (persona) {
      case 'founder':
        navigate('/about');
        break;
      case 'developer':
        navigate('/stack');
        break;
      case 'investor':
        navigate('/blueprint');
        break;
      default:
        break;
    }
  };

  // Portfolio sections with REAL content
  const portfolioSections = [
    {
      id: 0,
      range: [0, 0.15],
      title: "GALYARDER",
      subtitle: "Autonomous Systems Architect",
      description: "Engineering intelligent infrastructure with quantified outcomes and architectural precision.",
      bgGradient: "from-indigo-900/30 via-black to-black"
    },
    {
      id: 1,
      range: [0.15, 0.35],
      title: "FLAGSHIP PROJECTS",
      subtitle: "Production Systems with Measurable Impact",
      description: "3 major systems in production, processing 50,000+ transactions with 200% ROI improvement",
      bgGradient: "from-blue-900/30 via-black to-black"
    },
    {
      id: 2,
      range: [0.35, 0.55],
      title: "SYSTEM ARCHITECTURE",
      subtitle: "Async-First, Modular, Scalable",
      description: "Event-driven microservices with horizontal scaling patterns and fault-tolerant design",
      bgGradient: "from-purple-900/30 via-black to-black"
    },
    {
      id: 3,
      range: [0.55, 0.75],
      title: "QUANTIFIED RESULTS",
      subtitle: "15+ Smart Contracts • 10,000+ Automated Processes",
      description: "90% reduction in manual operations with comprehensive testing and security audits",
      bgGradient: "from-green-900/30 via-black to-black"
    },
    {
      id: 4,
      range: [0.75, 0.90],
      title: "INTELLIGENT SYSTEMS",
      subtitle: "AI + Web3 + Automation",
      description: "Unified architecture powering autonomous operations and intelligent decision-making",
      bgGradient: "from-cyan-900/30 via-black to-black"
    }
  ];

  // Get current active section
  const activeSection = portfolioSections[currentSection] || portfolioSections[0];

  // Transform functions for smooth cinematic transitions
  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.8]);

  const projectsOpacity = useTransform(smoothProgress, [0.10, 0.15, 0.30, 0.35], [0, 1, 1, 0]);
  const projectsY = useTransform(smoothProgress, [0.15, 0.35], [100, -100]);

  const architectureOpacity = useTransform(smoothProgress, [0.30, 0.35, 0.50, 0.55], [0, 1, 1, 0]);
  const architectureY = useTransform(smoothProgress, [0.35, 0.55], [100, -100]);

  const metricsOpacity = useTransform(smoothProgress, [0.50, 0.55, 0.70, 0.75], [0, 1, 1, 0]);
  const metricsY = useTransform(smoothProgress, [0.55, 0.75], [100, -100]);

  const cubeOpacity = useTransform(smoothProgress, [0.70, 0.75, 0.85, 0.90], [0, 1, 1, 0]);
  const cubeScale = useTransform(smoothProgress, [0.75, 0.85], [0.5, 1]);

  const finalOpacity = useTransform(smoothProgress, [0.85, 0.90], [0, 1]);
  const finalScale = useTransform(smoothProgress, [0.90, 1], [0.8, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Portfolio Canvas - Optimized height */}
      <div className="h-[600vh] relative">
        
        {/* Dynamic Particle Background */}
        <div className="fixed inset-0 z-0">
          <ParticleBackground isAITyping={currentSection > 2} />
        </div>

        {/* Dynamic Section Background */}
        <motion.div 
          className="fixed inset-0 z-5"
          animate={{
            background: `radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`
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

        {/* SECTION 1: HERO - Opening Statement */}
        <motion.div
          style={{ 
            opacity: heroOpacity,
            scale: heroScale
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="text-center max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <StatusBadge />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-8 text-white"
              style={{
                textShadow: "0 0 40px rgba(99, 102, 241, 0.5)"
              }}
            >
              GALYARDER
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              Autonomous Systems Architect
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
            >
              Engineering intelligent systems that qualify opportunities, demonstrate capability, 
              and generate authority autonomously.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-indigo-400 text-lg animate-pulse"
            >
              ↓ Scroll to explore the portfolio ↓
            </motion.div>
          </div>
        </motion.div>

        {/* SECTION 2: FLAGSHIP PROJECTS */}
        <motion.div
          style={{ 
            opacity: projectsOpacity,
            y: projectsY
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-bold mb-8 text-white">
                FLAGSHIP PROJECTS
              </h2>
              <p className="text-2xl text-gray-300 mb-12">
                Production systems with quantified business impact
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {projectMetrics.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 100, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-gray-900/80 border border-gray-700 rounded-lg p-8 backdrop-blur-sm hover:border-indigo-500 transition-all duration-300 group"
                  style={{ perspective: '1000px' }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      {project.project_name}
                    </h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      project.status === 'production' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {project.objective}
                  </p>

                  <div className="space-y-3 mb-6">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-400 capitalize text-sm">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="text-green-400 font-semibold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-400">
                        +{project.tech_stack.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">View Details</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                      <Github className="h-4 w-4" />
                      <span className="text-sm">Code</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SECTION 3: SYSTEM ARCHITECTURE */}
        <motion.div
          style={{ 
            opacity: architectureOpacity,
            y: architectureY
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-bold mb-8 text-white">
                SYSTEM ARCHITECTURE
              </h2>
              <p className="text-2xl text-gray-300 mb-12">
                Async-first, modular, horizontally scalable
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Async Architecture</h3>
                <p className="text-gray-300 leading-relaxed">
                  Event-driven systems with non-blocking operations using message queues, 
                  event sourcing, and circuit breakers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Modular Design</h3>
                <p className="text-gray-300 leading-relaxed">
                  Composable components with single responsibilities using microservices, 
                  plugin architectures, and dependency injection.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">Horizontal Scaling</h3>
                <p className="text-gray-300 leading-relaxed">
                  Built-to-scale patterns from day one with load balancing, 
                  database sharding, and CDN optimization.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 4: QUANTIFIED METRICS */}
        <motion.div
          style={{ 
            opacity: metricsOpacity,
            y: metricsY
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-bold mb-8 text-white">
                QUANTIFIED RESULTS
              </h2>
              <p className="text-2xl text-gray-300 mb-12">
                Measurable impact across all systems
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="text-5xl font-bold text-green-400 mb-4">15+</div>
                <div className="text-lg text-gray-300">Smart Contracts</div>
                <div className="text-sm text-gray-400 mt-2">Deployed & Audited</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="text-5xl font-bold text-blue-400 mb-4">50K+</div>
                <div className="text-lg text-gray-300">Transactions</div>
                <div className="text-sm text-gray-400 mt-2">Processed Daily</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="text-5xl font-bold text-purple-400 mb-4">90%</div>
                <div className="text-lg text-gray-300">Automation</div>
                <div className="text-sm text-gray-400 mt-2">Manual Reduction</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-8 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm"
              >
                <div className="text-5xl font-bold text-yellow-400 mb-4">200%</div>
                <div className="text-lg text-gray-300">ROI Improvement</div>
                <div className="text-sm text-gray-400 mt-2">Average Gain</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* SECTION 5: SYSTEM CUBE - The Centerpiece */}
        <motion.div
          style={{
            opacity: cubeOpacity,
            scale: cubeScale
          }}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="text-center relative">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-16 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
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
          </div>
        </motion.div>

        {/* SECTION 6: FINAL CTA - Call to Action */}
        <motion.div
          style={{ 
            opacity: finalOpacity,
            scale: finalScale
          }}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center"
        >
          <div className="text-center max-w-6xl mx-auto px-6">
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
              READY TO BUILD?
            </motion.h1>
            
            <motion.p
              className="text-2xl md:text-3xl text-gray-300 mb-16 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Let's engineer intelligent systems that transform your operations
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-12 w-full"
            >
              <DynamicCTA personalization={personalization} />
              
              <div className="flex flex-col items-center space-y-8">
                <MissionControl additionalText="Building Galyarder Ascendancy" />
                
                <div className="w-full max-w-lg">
                  <SemanticQuery />
                </div>
                
                <PersonaSelector 
                  currentPersona={selectedPersona}
                  onPersonaChange={handlePersonaChange}
                />
              </div>
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

        {/* Section Indicator */}
        <motion.div
          className="fixed top-1/2 left-8 transform -translate-y-1/2 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <div className="space-y-4">
            {portfolioSections.map((section, index) => (
              <motion.div
                key={section.id}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentSection ? 'bg-white scale-150' : 'bg-gray-600'
                }`}
                animate={{
                  boxShadow: index === currentSection 
                    ? "0 0 20px rgba(255, 255, 255, 0.8)" 
                    : "0 0 0px rgba(255, 255, 255, 0)"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Proactive AI Concierge */}
      <ProactiveAIConcierge />
    </div>
  );
};

export default HomePage;