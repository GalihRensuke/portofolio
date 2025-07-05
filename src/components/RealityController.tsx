import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Monitor, Terminal, Cpu, Zap, Crown, Lock } from 'lucide-react';
import { useThemeStore, ThemeSkin } from '../store/themeStore';

interface RealityControllerProps {
  isVisible: boolean;
  onClose: () => void;
}

const RealityController: React.FC<RealityControllerProps> = ({ isVisible, onClose }) => {
  const { currentSkin, setSkin, hasUnlockedReality } = useThemeStore();
  const [selectedSkin, setSelectedSkin] = useState<ThemeSkin>(currentSkin);

  const skins = [
    {
      id: 'galyarderos' as ThemeSkin,
      name: 'GalyarderOS',
      description: 'Default system interface with indigo/purple aesthetics',
      icon: Cpu,
      preview: 'bg-gradient-to-br from-indigo-900 to-purple-900',
      textColor: 'text-indigo-300',
      isDefault: true,
    },
    {
      id: 'blueprint' as ThemeSkin,
      name: 'Blueprint',
      description: 'Wireframe cyan interface with technical schematics',
      icon: Monitor,
      preview: 'bg-gradient-to-br from-blue-900 to-cyan-900',
      textColor: 'text-cyan-300',
      isDefault: false,
    },
    {
      id: 'terminal' as ThemeSkin,
      name: 'Terminal',
      description: 'Classic green phosphor with retro scanlines',
      icon: Terminal,
      preview: 'bg-gradient-to-br from-black to-green-900',
      textColor: 'text-green-300',
      isDefault: false,
    },
    {
      id: 'quantum' as ThemeSkin,
      name: 'Quantum',
      description: 'Experimental reality distortion field',
      icon: Zap,
      preview: 'bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900',
      textColor: 'text-pink-300',
      isDefault: false,
    },
  ];

  const handleApplySkin = () => {
    setSkin(selectedSkin);
    onClose();
  };

  if (!hasUnlockedReality) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-gray-900 border border-yellow-400/30 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border-b border-yellow-400/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="p-3 bg-yellow-400/20 border border-yellow-400/30 rounded-lg"
                  >
                    <Crown className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-yellow-400">SYSTEM INTERFACE OVERRIDE</h2>
                    <p className="text-gray-300">Architect-Level Reality Control</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg mb-6"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">ARCHITECT PRIVILEGES ACTIVE</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    You have achieved the highest clearance level. You now have the power to reshape 
                    the visual reality of this system. Choose your interface skin to customize the 
                    entire experience.
                  </p>
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-4">Reality Skins</h3>
                <p className="text-gray-400 mb-6">
                  Transform the entire system interface. Your choice will be remembered across sessions.
                </p>
              </div>

              {/* Skin Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {skins.map((skin, index) => {
                  const IconComponent = skin.icon;
                  const isSelected = selectedSkin === skin.id;
                  const isCurrent = currentSkin === skin.id;
                  
                  return (
                    <motion.button
                      key={skin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedSkin(skin.id)}
                      className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      {/* Preview Background */}
                      <div className={`absolute inset-0 ${skin.preview} opacity-20 rounded-lg`} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`h-6 w-6 ${skin.textColor}`} />
                            <span className="font-semibold text-white">{skin.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {isCurrent && (
                              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                                ACTIVE
                              </span>
                            )}
                            {skin.isDefault && (
                              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                                DEFAULT
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4">{skin.description}</p>
                        
                        {/* Mini Preview */}
                        <div className="flex space-x-2">
                          <div className={`w-4 h-4 ${skin.preview} rounded border border-gray-600`} />
                          <div className={`w-6 h-4 ${skin.preview} rounded border border-gray-600 opacity-75`} />
                          <div className={`w-3 h-4 ${skin.preview} rounded border border-gray-600 opacity-50`} />
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 bg-black rounded-full"
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Changes apply instantly and persist across sessions
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleApplySkin}
                    disabled={selectedSkin === currentSkin}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-lg transition-colors"
                    whileHover={{ scale: selectedSkin !== currentSkin ? 1.05 : 1 }}
                    whileTap={{ scale: selectedSkin !== currentSkin ? 0.95 : 1 }}
                  >
                    {selectedSkin === currentSkin ? 'Already Active' : 'Apply Reality Skin'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealityController;