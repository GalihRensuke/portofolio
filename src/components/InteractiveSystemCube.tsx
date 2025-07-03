import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Coins, Zap, X } from 'lucide-react';

const InteractiveSystemCube = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const systemNodes = {
    'ai-layer': {
      icon: Brain,
      label: 'AI Layer',
      description: 'LLM orchestration, embeddings, and intelligent automation',
      color: 'from-purple-500 to-pink-500'
    },
    'web3-infra': {
      icon: Coins,
      label: 'Web3 Infra',
      description: 'Smart contracts, DeFi protocols, and blockchain automation',
      color: 'from-blue-500 to-cyan-500'
    },
    'automation-core': {
      icon: Zap,
      label: 'Automation Core',
      description: 'Workflow orchestration, event processing, and system integration',
      color: 'from-green-500 to-emerald-500'
    }
  };

  return (
    <div className="relative w-64 h-64 mx-auto perspective-1000">
      <motion.div
        className="relative w-full h-full transform-style-preserve-3d cursor-pointer"
        animate={{
          rotateX: isHovered ? 15 : 0,
          rotateY: isHovered ? 15 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setSelectedNode(selectedNode ? null : 'overview')}
      >
        {/* Main cube */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg backdrop-blur-sm"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
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
        </motion.div>

        {/* System nodes */}
        <AnimatePresence>
          {isHovered && (
            <>
              {Object.entries(systemNodes).map(([key, node], index) => {
                const angle = (index * 120) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(key);
                    }}
                  >
                    <div className={`p-3 bg-gradient-to-r ${node.color} rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                      <node.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded">
                        {node.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Node details modal */}
      <AnimatePresence>
        {selectedNode && selectedNode !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 w-80 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {(() => {
                  const currentNode = systemNodes[selectedNode as keyof typeof systemNodes];
                  if (currentNode) {
                    const IconComponent = currentNode.icon;
                    return (
                      <>
                        <IconComponent className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-semibold text-white">
                          {currentNode.label}
                        </h3>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-300 text-sm">
              {systemNodes[selectedNode as keyof typeof systemNodes]?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveSystemCube;