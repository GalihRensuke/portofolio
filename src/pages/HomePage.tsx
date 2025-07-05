import React, { useRef, useEffect } from 'react';
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
import { galyarderInsights } from '../data/galyarderInsights';

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const personalization = usePersonalization();
  const [selectedPersona, setSelectedPersona] = React.useState<Persona>(personalization.persona);
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

  // Track scroll depth
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollDepth(latest * 100);
    });
    return unsubscribe;
  }, [scrollYProgress, setScrollDepth]);

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

  // Narrative phases with scroll-based transforms
  const narrativePhases = [
    {
      range: [0, 0.15],
      text: "In the beginning, there was chaos...",
      subtitle: "Systems without structure. Processes without purpose.",
      position: "top-1/4"
    },
    {
      range: [0.15, 0.3],
      text: "Clear > Clever",
      subtitle: "The most elegant solution is often the one that can be understood by your future self at 3 AM.",
      position: "top-1/3"
    },
    {
      range: [0.3, 0.45],
      text: "Systems thinking reveals the truth:",
      subtitle: "The bottleneck is rarely where you think it is. Look for the constraint that constrains the constraint.",
      position: "top-2/5"
    },
    {
      range: [0.45, 0.6],
      text: "Async-first architecture",
      subtitle: "isn't just about performance—it's about building systems that can evolve without breaking.",
      position: "top-1/2"
    },
    {
      range: [0.6, 0.75],
      text: "The best automation eliminates decisions,",
      subtitle: "not just tasks. Reduce cognitive overhead, not just manual work.",
      position: "top-3/5"
    },
    {
      range: [0.75, 0.9],
      text: "Build systems that compound intelligence over time.",
      subtitle: "Each interaction should make the system smarter.",
      position: "top-2/3"
    }
  ];

  // Transform functions for each narrative phase
  const createPhaseTransforms = (phase: typeof narrativePhases[0]) => {
    const opacity = useTransform(
      smoothProgress,
      [phase.range[0] - 0.05, phase.range[0], phase.range[1], phase.range[1] + 0.05],
      [0, 1, 1, 0]
    );
    
    const y = useTransform(
      smoothProgress,
      [phase.range[0] - 0.05, phase.range[0], phase.range[1], phase.range[1] + 0.05],
      [50, 0, 0, -50]
    );

    const scale = useTransform(
      smoothProgress,
      [phase.range[0], phase.range[0] + 0.02, phase.range[1] - 0.02, phase.range[1]],
      [0.8, 1, 1, 0.8]
    );

    return { opacity, y, scale };
  };

  // System Cube emergence transforms
  const cubeOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const cubeScale = useTransform(smoothProgress, [0.85, 0.95], [0.3, 1]);
  const cubeY = useTransform(smoothProgress, [0.85, 0.95], [100, 0]);

  // Final revelation transforms
  const finalOpacity = useTransform(smoothProgress, [0.9, 1], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.9, 1], [50, 0]);

  // Background intensity based on scroll
  const backgroundIntensity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.8, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Narrative Canvas - Very tall for long scrolling */}
      <div className="h-[500vh] relative">
        
        {/* Dynamic Particle Background */}
        <div className="fixed inset-0 z-0">
          <motion.div
            style={{ opacity: backgroundIntensity }}
            className="w-full h-full"
          >
            <ParticleBackground isAITyping={false} />
          </motion.div>
        </div>

        {/* Atmospheric Grid Overlay */}
        <motion.div 
          className="fixed inset-0 z-10 pointer-events-none"
          style={{ 
            opacity: useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.1, 0.3, 0.2, 0.4])
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </motion.div>

        {/* Sticky Narrative Container */}
        <div className="sticky top-0 h-screen flex items-center justify-center z-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            
            {/* Opening Status Badge */}
            <motion.div
              style={{
                opacity: useTransform(smoothProgress, [0, 0.1, 0.15], [1, 1, 0]),
                y: useTransform(smoothProgress, [0, 0.1, 0.15], [0, 0, -50])
              }}
              className="mb-8"
            >
              <StatusBadge />
            </motion.div>

            {/* Narrative Phases */}
            {narrativePhases.map((phase, index) => {
              const transforms = createPhaseTransforms(phase);
              
              return (
                <motion.div
                  key={index}
                  style={{
                    opacity: transforms.opacity,
                    y: transforms.y,
                    scale: transforms.scale
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight"
                    style={{
                      textShadow: "0 0 30px rgba(99, 102, 241, 0.5)"
                    }}
                  >
                    {phase.text}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl text-gray-300 max-w-4xl leading-relaxed"
                    style={{
                      opacity: useTransform(
                        smoothProgress,
                        [phase.range[0] + 0.02, phase.range[0] + 0.05],
                        [0, 1]
                      )
                    }}
                  >
                    {phase.subtitle}
                  </motion.p>
                </motion.div>
              );
            })}

            {/* System Cube Emergence - The Climax */}
            <motion.div
              style={{
                opacity: cubeOpacity,
                scale: cubeScale,
                y: cubeY
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                  style={{
                    opacity: useTransform(smoothProgress, [0.87, 0.92], [0, 1])
                  }}
                >
                  Behold: The System
                </motion.h2>
                
                <div className="relative">
                  <InteractiveSystemCube />
                  
                  {/* Mystical Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Final Revelation */}
            <motion.div
              style={{
                opacity: finalOpacity,
                y: finalY
              }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.h1
                className="text-6xl md:text-8xl font-black mb-6 text-white"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(99, 102, 241, 0.5)",
                    "0 0 40px rgba(99, 102, 241, 0.8)",
                    "0 0 20px rgba(99, 102, 241, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Galyarder
              </motion.h1>
              
              <motion.div
                className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                style={{
                  opacity: useTransform(smoothProgress, [0.92, 0.96], [0, 1])
                }}
              >
                Autonomous Systems Architect
              </motion.div>

              <motion.p
                className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed"
                style={{
                  opacity: useTransform(smoothProgress, [0.94, 0.98], [0, 1])
                }}
              >
                Engineering intelligent systems that qualify opportunities, demonstrate capability, 
                and generate authority autonomously.
              </motion.p>

              {/* Interactive Elements */}
              <motion.div
                style={{
                  opacity: useTransform(smoothProgress, [0.96, 1], [0, 1])
                }}
                className="space-y-6"
              >
                <DynamicCTA personalization={personalization} />
                
                <div className="flex flex-col space-y-4">
                  <MissionControl additionalText="Building Galyarder Ascendancy" />
                  
                  <div className="flex flex-col space-y-2">
                    <SemanticQuery />
                    <div className="flex justify-center">
                      <PersonaSelector 
                        currentPersona={selectedPersona}
                        onPersonaChange={handlePersonaChange}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div
          className="fixed bottom-8 right-8 z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          <div className="w-2 h-32 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
              style={{
                height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
              }}
            />
          </div>
        </motion.div>

        {/* Mystical Particles for Atmosphere */}
        <div className="fixed inset-0 z-15 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full"
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
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