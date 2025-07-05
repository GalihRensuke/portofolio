import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
import { Terminal, Zap, Brain, Code, Database, Shield } from 'lucide-react';

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const personalization = usePersonalization();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personalization.persona);
  const [currentPhase, setCurrentPhase] = useState(0);
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

  // Track scroll depth and current phase
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      setScrollDepth(latest * 100);
      
      // Determine current phase
      if (latest < 0.15) setCurrentPhase(0);
      else if (latest < 0.3) setCurrentPhase(1);
      else if (latest < 0.45) setCurrentPhase(2);
      else if (latest < 0.6) setCurrentPhase(3);
      else if (latest < 0.75) setCurrentPhase(4);
      else if (latest < 0.9) setCurrentPhase(5);
      else setCurrentPhase(6);
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

  // Enhanced narrative phases with icons and better content
  const narrativePhases = [
    {
      id: 0,
      range: [0, 0.15],
      icon: Terminal,
      title: "SYSTEM INITIALIZATION",
      subtitle: "In the beginning, there was chaos...",
      description: "Disconnected processes. Fragmented workflows. Manual operations consuming infinite cycles.",
      color: "from-red-500 to-orange-500"
    },
    {
      id: 1,
      range: [0.15, 0.3],
      icon: Brain,
      title: "FIRST PRINCIPLES",
      subtitle: "Clear > Clever",
      description: "The most elegant solution is often the one that can be understood by your future self at 3 AM.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      range: [0.3, 0.45],
      icon: Zap,
      title: "SYSTEMS THINKING",
      subtitle: "The bottleneck is rarely where you think it is.",
      description: "Look for the constraint that constrains the constraint. Understand the interconnections.",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      range: [0.45, 0.6],
      icon: Code,
      title: "ASYNC ARCHITECTURE",
      subtitle: "Build systems that evolve without breaking",
      description: "Event-driven patterns. Non-blocking operations. Horizontal scaling from day one.",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      range: [0.6, 0.75],
      icon: Database,
      title: "INTELLIGENT AUTOMATION",
      subtitle: "Eliminate decisions, not just tasks",
      description: "Reduce cognitive overhead. Build systems that compound intelligence over time.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: 5,
      range: [0.75, 0.9],
      icon: Shield,
      title: "AUTONOMOUS SYSTEMS",
      subtitle: "Self-improving, self-healing, self-scaling",
      description: "Each interaction makes the system smarter. Intelligence compounds exponentially.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  // Get current active phase
  const activePhase = narrativePhases[currentPhase] || narrativePhases[0];

  // Transform functions for smooth transitions
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.85, 0.9],
    [1, 1, 1, 0]
  );

  const cubeOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const cubeScale = useTransform(smoothProgress, [0.85, 0.95], [0.5, 1]);

  const finalOpacity = useTransform(smoothProgress, [0.9, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Narrative Canvas */}
      <div className="h-[600vh] relative">
        
        {/* Dynamic Particle Background */}
        <div className="fixed inset-0 z-0">
          <ParticleBackground isAITyping={currentPhase > 3} />
        </div>

        {/* Dynamic Background Gradient */}
        <motion.div 
          className="fixed inset-0 z-5"
          animate={{
            background: `radial-gradient(ellipse at center, ${activePhase.color.replace('from-', '').replace(' to-', ', ')}/10 0%, transparent 70%)`
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Matrix Grid Overlay */}
        <div className="fixed inset-0 z-10 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Sticky Narrative Container */}
        <div className="sticky top-0 h-screen flex items-center justify-center z-20">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Opening Status Badge */}
            <motion.div
              style={{ opacity: titleOpacity }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
            >
              <StatusBadge />
            </motion.div>

            {/* Main Narrative Display */}
            <AnimatePresence mode="wait">
              {currentPhase < 6 && (
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center"
                >
                  {/* Phase Icon */}
                  <motion.div
                    className="flex justify-center mb-8"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className={`p-6 rounded-full bg-gradient-to-r ${activePhase.color} shadow-2xl`}>
                      <activePhase.icon className="h-12 w-12 text-white" />
                    </div>
                  </motion.div>

                  {/* Phase Title */}
                  <motion.div
                    className="mb-6"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                        "0 0 40px rgba(99, 102, 241, 0.8)",
                        "0 0 20px rgba(99, 102, 241, 0.5)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-2 tracking-wider">
                      {activePhase.title}
                    </h2>
                  </motion.div>

                  {/* Phase Content */}
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {activePhase.subtitle}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {activePhase.description}
                  </motion.p>

                  {/* Progress Indicator */}
                  <motion.div
                    className="mt-12 flex justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    {narrativePhases.map((phase, index) => (
                      <motion.div
                        key={phase.id}
                        className={`w-3 h-3 rounded-full ${
                          index === currentPhase ? 'bg-white' : 'bg-gray-600'
                        }`}
                        animate={{
                          scale: index === currentPhase ? [1, 1.3, 1] : 1,
                          opacity: index === currentPhase ? 1 : 0.5
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* System Cube Emergence */}
            <motion.div
              style={{
                opacity: cubeOpacity,
                scale: cubeScale
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  BEHOLD: THE SYSTEM
                </motion.h2>
                
                <div className="relative">
                  <InteractiveSystemCube />
                  
                  {/* Epic Glow Effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Orbital Rings */}
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className={`absolute inset-${ring * -4} border border-indigo-400/20 rounded-full`}
                      animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                      transition={{
                        duration: 10 + ring * 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Final Revelation */}
            <motion.div
              style={{ opacity: finalOpacity }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 text-white"
                animate={{
                  textShadow: [
                    "0 0 30px rgba(99, 102, 241, 0.8)",
                    "0 0 60px rgba(139, 92, 246, 1)",
                    "0 0 30px rgba(99, 102, 241, 0.8)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                GALYARDER
              </motion.h1>
              
              <motion.div
                className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                AUTONOMOUS SYSTEMS ARCHITECT
              </motion.div>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl text-center leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Engineering intelligent systems that qualify opportunities, demonstrate capability, 
                and generate authority autonomously.
              </motion.p>

              {/* Interactive Elements */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-8 w-full max-w-4xl"
              >
                <DynamicCTA personalization={personalization} />
                
                <div className="flex flex-col items-center space-y-6">
                  <MissionControl additionalText="Building Galyarder Ascendancy" />
                  
                  <div className="w-full max-w-md">
                    <SemanticQuery />
                  </div>
                  
                  <PersonaSelector 
                    currentPersona={selectedPersona}
                    onPersonaChange={handlePersonaChange}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Progress Indicator */}
        <motion.div
          className="fixed bottom-8 right-8 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <div className="relative">
            <div className="w-3 h-40 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700/50">
              <motion.div
                className="w-full bg-gradient-to-t from-indigo-500 via-purple-500 to-blue-500 rounded-full relative overflow-hidden"
                style={{
                  height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            
            {/* Progress Percentage */}
            <motion.div
              className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-mono"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
              }}
            >
              {Math.round(scrollYProgress.get() * 100)}%
            </motion.div>
          </div>
        </motion.div>

        {/* Atmospheric Floating Elements */}
        <div className="fixed inset-0 z-15 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/60 rounded-full"
              animate={{
                x: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                ],
                y: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                ],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 12,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Proactive AI Concierge */}
      <ProactiveAIConcierge />
    </div>
  );
};

export default HomePage;