import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Crown, Star, Sparkles } from 'lucide-react';

interface AscensionEventProps {
  isVisible: boolean;
  fromLevel: string;
  toLevel: string;
  onComplete: () => void;
}

const AscensionEvent: React.FC<AscensionEventProps> = ({
  isVisible,
  fromLevel,
  toLevel,
  onComplete
}) => {
  const [phase, setPhase] = useState<'cube-fly' | 'explosion' | 'reconstruction' | 'revelation'>('cube-fly');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!isVisible) return;

    const sequence = async () => {
      // Phase 1: Cube flies to center (2s)
      setPhase('cube-fly');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Phase 2: Explosion (1s)
      setPhase('explosion');
      generateParticles();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 3: Reconstruction (2s)
      setPhase('reconstruction');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Phase 4: Revelation (2s)
      setPhase('revelation');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete
      onComplete();
    };

    sequence();
  }, [isVisible, onComplete]);

  const generateParticles = () => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setParticles(newParticles);
  };

  const getTesseractFaces = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      rotation: i * 45,
      scale: 1 + (i % 3) * 0.2,
      delay: i * 0.1,
    }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Background Matrix Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
          
          {/* Particle System */}
          {phase === 'explosion' && (
            <div className="absolute inset-0">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                  initial={{ 
                    x: window.innerWidth / 2, 
                    y: window.innerHeight / 2,
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    scale: [0, 1, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Animation Container */}
          <div className="relative w-96 h-96 flex items-center justify-center">
            
            {/* Phase 1: Flying Cube */}
            {phase === 'cube-fly' && (
              <motion.div
                initial={{ 
                  x: -window.innerWidth,
                  y: window.innerHeight / 4,
                  scale: 0.5,
                  rotateX: 0,
                  rotateY: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1.5,
                  rotateX: [0, 360, 720],
                  rotateY: [0, 360, 720],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="relative w-32 h-32 transform-style-preserve-3d"
                style={{ perspective: '1000px' }}
              >
                {/* Simple Cube */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg border-2 border-indigo-400 shadow-2xl shadow-indigo-500/50">
                  <div className="absolute inset-2 border border-indigo-300/30 rounded-lg">
                    <div className="absolute inset-1 grid grid-cols-2 gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-indigo-300/50 rounded-sm"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Explosion Flash */}
            {phase === 'explosion' && (
              <motion.div
                initial={{ scale: 1.5, opacity: 1 }}
                animate={{ 
                  scale: [1.5, 8, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-radial from-white via-indigo-400 to-transparent rounded-full"
              />
            )}

            {/* Phase 3: Tesseract Reconstruction */}
            {phase === 'reconstruction' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="relative w-64 h-64 transform-style-preserve-3d"
                style={{ perspective: '1000px' }}
              >
                {getTesseractFaces().map((face) => (
                  <motion.div
                    key={face.id}
                    className="absolute inset-0 border-2 border-indigo-400/60 rounded-lg"
                    initial={{ 
                      scale: 0,
                      rotateX: 0,
                      rotateY: 0,
                      rotateZ: 0,
                    }}
                    animate={{
                      scale: face.scale,
                      rotateX: [0, face.rotation],
                      rotateY: [0, face.rotation * 1.5],
                      rotateZ: [0, face.rotation * 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: face.delay,
                      ease: "easeOut",
                    }}
                    style={{
                      transformOrigin: 'center',
                      boxShadow: `0 0 20px rgba(99, 102, 241, ${0.3 + face.id * 0.1})`,
                    }}
                  >
                    {/* Inner geometric patterns */}
                    <div className="absolute inset-4 border border-purple-400/40 rounded-lg">
                      <div className="absolute inset-2 border border-cyan-400/30 rounded-lg">
                        <motion.div
                          className="absolute inset-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg"
                          animate={{
                            opacity: [0.2, 0.8, 0.2],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: face.delay,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Phase 4: Level Revelation */}
            {phase === 'revelation' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-8"
                >
                  {toLevel === 'Architect' ? (
                    <Crown className="h-24 w-24 text-yellow-400 mx-auto" />
                  ) : toLevel === 'Analyst' ? (
                    <Star className="h-24 w-24 text-purple-400 mx-auto" />
                  ) : (
                    <Sparkles className="h-24 w-24 text-blue-400 mx-auto" />
                  )}
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-bold text-white mb-4"
                >
                  ASCENSION
                </motion.h1>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl text-indigo-400 mb-2"
                >
                  {fromLevel} → {toLevel}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-lg text-gray-300"
                >
                  {toLevel === 'Architect' ? 'REALITY CONTROL UNLOCKED' : 'NEW CLEARANCE LEVEL ACHIEVED'}
                </motion.div>

                {/* Floating particles around the revelation */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 30 * Math.PI / 180) * 100],
                      y: [0, Math.sin(i * 30 * Math.PI / 180) * 100],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Epic Text Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
          >
            <motion.div
              animate={{
                textShadow: [
                  "0 0 0px rgba(99, 102, 241, 0)",
                  "0 0 20px rgba(99, 102, 241, 0.8)",
                  "0 0 0px rgba(99, 102, 241, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-indigo-400 font-mono text-xl tracking-wider"
            >
              CONSCIOUSNESS EXPANDING...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AscensionEvent;