import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const SystemCube = () => {
  const cubeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-64 h-64 mx-auto perspective-1000">
      <motion.div
        ref={cubeRef}
        className="relative w-full h-full transform-style-preserve-3d"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Cube faces */}
        {[
          { transform: 'rotateY(0deg) translateZ(128px)', bg: 'from-indigo-500/20 to-purple-500/20' },
          { transform: 'rotateY(90deg) translateZ(128px)', bg: 'from-purple-500/20 to-blue-500/20' },
          { transform: 'rotateY(180deg) translateZ(128px)', bg: 'from-blue-500/20 to-indigo-500/20' },
          { transform: 'rotateY(-90deg) translateZ(128px)', bg: 'from-indigo-500/20 to-purple-500/20' },
          { transform: 'rotateX(90deg) translateZ(128px)', bg: 'from-purple-500/20 to-blue-500/20' },
          { transform: 'rotateX(-90deg) translateZ(128px)', bg: 'from-blue-500/20 to-indigo-500/20' },
        ].map((face, index) => (
          <div
            key={index}
            className={`absolute w-64 h-64 border border-indigo-500/30 bg-gradient-to-br ${face.bg} backdrop-blur-sm`}
            style={{ transform: face.transform }}
          >
            <div className="absolute inset-4 border border-indigo-400/20 rounded-lg">
              <div className="absolute inset-2 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-indigo-400/30 rounded-sm"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Orbital rings */}
      <motion.div
        className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-8 border border-purple-500/20 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default SystemCube;