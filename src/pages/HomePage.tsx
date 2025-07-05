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
import { Terminal, Zap, Brain, Code, Database, Shield, Eye, Cpu, Network } from 'lucide-react';

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
      
      // Determine current phase based on scroll progress
      if (latest < 0.12) setCurrentPhase(0);
      else if (latest < 0.24) setCurrentPhase(1);
      else if (latest < 0.36) setCurrentPhase(2);
      else if (latest < 0.48) setCurrentPhase(3);
      else if (latest < 0.60) setCurrentPhase(4);
      else if (latest < 0.72) setCurrentPhase(5);
      else if (latest < 0.84) setCurrentPhase(6);
      else setCurrentPhase(7);
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

  // Epic narrative phases with real Galyarder insights
  const narrativePhases = [
    {
      id: 0,
      range: [0, 0.12],
      icon: Eye,
      title: "OBSERVATION",
      subtitle: "In the chaos of manual operations...",
      description: "Every system starts with a problem. Disconnected processes. Fragmented workflows. Human cycles consumed by repetitive tasks that machines should handle.",
      color: "from-red-500 to-orange-500",
      bgGradient: "from-red-900/20 via-black to-black"
    },
    {
      id: 1,
      range: [0.12, 0.24],
      icon: Brain,
      title: "FIRST PRINCIPLES",
      subtitle: "Clear > Clever",
      description: "The most elegant solution is often the one that can be understood by your future self at 3 AM. Strip away assumptions until you reach the irreducible core.",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-900/20 via-black to-black"
    },
    {
      id: 2,
      range: [0.24, 0.36],
      icon: Network,
      title: "SYSTEMS THINKING",
      subtitle: "The bottleneck is rarely where you think it is",
      description: "Look for the constraint that constrains the constraint. Complex systems fail in complex ways. Design for graceful degradation, not perfect operation.",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-900/20 via-black to-black"
    },
    {
      id: 3,
      range: [0.36, 0.48],
      icon: Zap,
      title: "ASYNC ARCHITECTURE",
      subtitle: "Build systems that evolve without breaking",
      description: "Async-first architecture isn't just about performance—it's about building systems that can evolve without breaking. Event-driven patterns enable independent evolution.",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-900/20 via-black to-black"
    },
    {
      id: 4,
      range: [0.48, 0.60],
      icon: Code,
      title: "MODULAR DESIGN",
      subtitle: "Modularity enables independent evolution",
      description: "Modularity is not about code organization—it's about enabling independent evolution of system components. Single responsibilities with clear interfaces.",
      color: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-900/20 via-black to-black"
    },
    {
      id: 5,
      range: [0.60, 0.72],
      icon: Database,
      title: "INTELLIGENT AUTOMATION",
      subtitle: "Eliminate decisions, not just tasks",
      description: "The best automation eliminates decisions, not just tasks. Reduce cognitive overhead, not just manual work. Build systems that compound intelligence over time.",
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-900/20 via-black to-black"
    },
    {
      id: 6,
      range: [0.72, 0.84],
      icon: Cpu,
      title: "AUTONOMOUS SYSTEMS",
      subtitle: "Each interaction makes the system smarter",
      description: "Build systems that compound intelligence over time. Each interaction should make the system smarter. The highest leverage comes from making others more effective.",
      color: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-900/20 via-black to-black"
    }
  ];

  // Get current active phase
  const activePhase = narrativePhases[currentPhase] || narrativePhases[0];

  // Transform functions for smooth cinematic transitions
  const narrativeOpacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.80, 0.85],
    [1, 1, 1, 0]
  );

  const cubeOpacity = useTransform(smoothProgress, [0.80, 0.90], [0, 1]);
  const cubeScale = useTransform(smoothProgress, [0.80, 0.90], [0.3, 1]);
  const cubeRotateY = useTransform(smoothProgress, [0.80, 0.90], [-180, 0]);

  const finalOpacity = useTransform(scrollYProgress, [0.90, 1], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.90, 1], [0.8, 1]);

  // Dynamic background based on current phase
  const backgroundOpacity = useTransform(
    smoothProgress,
    activePhase.range,
    [0, 1]
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Narrative Canvas - Extended for better pacing */}
      <div className="h-[800vh] relative">
        
        {/* Dynamic Particle Background */}
        <div className="fixed inset-0 z-0">
          <ParticleBackground isAITyping={currentPhase > 4} />
        </div>

        {/* Dynamic Phase Background */}
        <motion.div 
          className="fixed inset-0 z-5"
          style={{ opacity: backgroundOpacity }}
          animate={{
            background: `radial-gradient(ellipse at center, ${activePhase.color.replace('from-', '').replace(' to-', ', ')}/15 0%, transparent 70%)`
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Cinematic Grid Overlay */}
        <div className="fixed inset-0 z-10 pointer-events-none">
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundImage: [
                'linear-gradient(90deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%), linear-gradient(0deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%)',
                'linear-gradient(90deg, transparent 98%, rgba(139, 92, 246, 0.3) 100%), linear-gradient(0deg, transparent 98%, rgba(139, 92, 246, 0.3) 100%)',
                'linear-gradient(90deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%), linear-gradient(0deg, transparent 98%, rgba(99, 102, 241, 0.3) 100%)'
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* Scanning Line Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent h-1"
            animate={{
              y: ['-100%', '100vh'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        {/* Sticky Narrative Container */}
        <div className="sticky top-0 h-screen flex items-center justify-center z-20">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Opening Status Badge */}
            <motion.div
              style={{ opacity: narrativeOpacity }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
            >
              <StatusBadge />
            </motion.div>

            {/* Main Narrative Display */}
            <AnimatePresence mode="wait">
              {currentPhase < 7 && (
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, scale: 0.9, y: 100, rotateX: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -100, rotateX: 15 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-center relative"
                  style={{ perspective: '1000px' }}
                >
                  {/* Phase Icon with Epic Glow */}
                  <motion.div
                    className="flex justify-center mb-12"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className={`relative p-8 rounded-full bg-gradient-to-r ${activePhase.color} shadow-2xl`}>
                      <activePhase.icon className="h-16 w-16 text-white relative z-10" />
                      
                      {/* Epic Glow Effects */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            `0 0 30px ${activePhase.color.includes('red') ? '#ef4444' : 
                                       activePhase.color.includes('blue') ? '#3b82f6' :
                                       activePhase.color.includes('purple') ? '#8b5cf6' :
                                       activePhase.color.includes('green') ? '#10b981' :
                                       activePhase.color.includes('yellow') ? '#f59e0b' :
                                       activePhase.color.includes('cyan') ? '#06b6d4' : '#6366f1'}`,
                            `0 0 60px ${activePhase.color.includes('red') ? '#ef4444' : 
                                       activePhase.color.includes('blue') ? '#3b82f6' :
                                       activePhase.color.includes('purple') ? '#8b5cf6' :
                                       activePhase.color.includes('green') ? '#10b981' :
                                       activePhase.color.includes('yellow') ? '#f59e0b' :
                                       activePhase.color.includes('cyan') ? '#06b6d4' : '#6366f1'}`,
                            `0 0 30px ${activePhase.color.includes('red') ? '#ef4444' : 
                                       activePhase.color.includes('blue') ? '#3b82f6' :
                                       activePhase.color.includes('purple') ? '#8b5cf6' :
                                       activePhase.color.includes('green') ? '#10b981' :
                                       activePhase.color.includes('yellow') ? '#f59e0b' :
                                       activePhase.color.includes('cyan') ? '#06b6d4' : '#6366f1'}`
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      
                      {/* Orbital Rings */}
                      {[1, 2].map((ring) => (
                        <motion.div
                          key={ring}
                          className={`absolute inset-${ring * -6} border-2 border-white/20 rounded-full`}
                          animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                          transition={{
                            duration: 15 + ring * 5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Phase Title with Epic Typography */}
                  <motion.div
                    className="mb-8"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                        "0 0 40px rgba(99, 102, 241, 0.8)",
                        "0 0 20px rgba(99, 102, 241, 0.5)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-4 tracking-[0.2em] uppercase">
                      {activePhase.title}
                    </h2>
                  </motion.div>

                  {/* Phase Subtitle - Main Impact */}
                  <motion.h1 
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-white leading-tight"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    style={{
                      textShadow: "0 0 40px rgba(255, 255, 255, 0.3)"
                    }}
                  >
                    {activePhase.subtitle}
                  </motion.h1>
                  
                  {/* Phase Description */}
                  <motion.p 
                    className="text-xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    {activePhase.description}
                  </motion.p>

                  {/* Enhanced Progress Indicator */}
                  <motion.div
                    className="mt-16 flex justify-center items-center space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {narrativePhases.map((phase, index) => (
                      <motion.div
                        key={phase.id}
                        className={`relative ${
                          index === currentPhase ? 'w-12 h-4' : 'w-4 h-4'
                        } rounded-full transition-all duration-500`}
                        animate={{
                          backgroundColor: index === currentPhase ? '#ffffff' : '#4b5563',
                          scale: index === currentPhase ? [1, 1.2, 1] : 1,
                          opacity: index === currentPhase ? 1 : 0.6
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {index === currentPhase && (
                          <motion.div
                            className="absolute inset-0 bg-white rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.5)",
                                "0 0 20px rgba(255, 255, 255, 0.8)",
                                "0 0 10px rgba(255, 255, 255, 0.5)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Phase Counter */}
                  <motion.div
                    className="absolute top-4 right-4 text-indigo-400 font-mono text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.2 }}
                  >
                    {String(currentPhase + 1).padStart(2, '0')} / {String(narrativePhases.length).padStart(2, '0')}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* System Cube Emergence - Epic Reveal */}
            <motion.div
              style={{
                opacity: cubeOpacity,
                scale: cubeScale,
                rotateY: cubeRotateY
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center relative">
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold mb-16 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  BEHOLD: THE SYSTEM
                </motion.h2>
                
                <div className="relative">
                  <InteractiveSystemCube />
                  
                  {/* Epic Multi-Layer Glow Effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-blue-500/40 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.4, 0.8, 0.4],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-pink-500/30 to-yellow-500/30 rounded-full blur-2xl"
                    animate={{
                      scale: [1.5, 1, 1.5],
                      opacity: [0.2, 0.6, 0.2],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Orbital Rings with Different Speeds */}
                  {[1, 2, 3, 4].map((ring) => (
                    <motion.div
                      key={ring}
                      className={`absolute inset-${ring * -8} border border-indigo-400/30 rounded-full`}
                      animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                      transition={{
                        duration: 8 + ring * 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Final Revelation - Grand Finale */}
            <motion.div
              style={{ 
                opacity: finalOpacity,
                scale: finalScale
              }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.h1
                className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 text-white"
                animate={{
                  textShadow: [
                    "0 0 30px rgba(99, 102, 241, 0.8)",
                    "0 0 60px rgba(139, 92, 246, 1)",
                    "0 0 90px rgba(59, 130, 246, 0.8)",
                    "0 0 60px rgba(139, 92, 246, 1)",
                    "0 0 30px rgba(99, 102, 241, 0.8)"
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                style={{
                  letterSpacing: "0.1em"
                }}
              >
                GALYARDER
              </motion.h1>
              
              <motion.div
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  AUTONOMOUS SYSTEMS ARCHITECT
                </motion.span>
              </motion.div>

              <motion.p
                className="text-xl md:text-3xl text-gray-300 mb-16 max-w-6xl text-center leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Engineering intelligent systems that qualify opportunities, demonstrate capability, 
                and generate authority autonomously.
              </motion.p>

              {/* Interactive Elements */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="space-y-12 w-full max-w-6xl"
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
            
            {/* Progress Percentage */}
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

        {/* Atmospheric Floating Elements - Enhanced */}
        <div className="fixed inset-0 z-15 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
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
                scale: [0, 2, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 10,
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