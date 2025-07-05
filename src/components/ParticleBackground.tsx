import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';
import { useLocation } from 'react-router-dom';
import { useProactiveAITrigger } from '../hooks/useProactiveAITrigger';

interface ParticleBackgroundProps {
  isAITyping?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ isAITyping = false }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const location = useLocation();
  
  // Memoized page colors to prevent recalculation
  const pageColors = useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ["#6366f1", "#8b5cf6", "#3b82f6"];
      case '/blueprint':
        return ["#8b5cf6", "#a855f7", "#c084fc"];
      case '/projects':
        return ["#3b82f6", "#1d4ed8", "#2563eb"];
      case '/sandbox':
        return ["#10b981", "#059669", "#047857"];
      case '/dashboard':
        return ["#f59e0b", "#d97706", "#b45309"];
      default:
        return ["#6366f1", "#8b5cf6", "#3b82f6"];
    }
  }, [location.pathname]);

  // Optimized particle configuration - reduced counts and FPS
  const particleCount = useMemo(() => isAITyping ? 60 : 30, [isAITyping]); // Reduced from 120/60
  const particleSpeed = useMemo(() => isAITyping ? 1.2 : 0.4, [isAITyping]); // Slightly reduced
  const linkOpacity = useMemo(() => isAITyping ? 0.3 : 0.15, [isAITyping]); // Reduced opacity

  // Memoized particle configuration to prevent recreation
  const particleConfig = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60, // Reduced from 120
    interactivity: {
      events: {
        onClick: {
          enable: false,
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100, // Reduced from 150
          duration: 0.3, // Reduced from 0.4
        },
      },
    },
    particles: {
      color: {
        value: pageColors,
      },
      links: {
        color: pageColors[0],
        distance: 120, // Reduced from 150
        enable: true,
        opacity: linkOpacity,
        width: isAITyping ? 1.2 : 0.8, // Reduced width
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: particleSpeed,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000, // Increased area to spread particles more
        },
        value: particleCount,
      },
      opacity: {
        value: isAITyping ? 0.4 : 0.25, // Reduced opacity
        animation: {
          enable: isAITyping,
          speed: 1.5, // Reduced from 2
          minimumValue: 0.1,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: isAITyping ? 3 : 2 }, // Reduced max size
        animation: {
          enable: isAITyping,
          speed: 2, // Reduced from 3
          minimumValue: 0.5,
          sync: false,
        },
      },
    },
    detectRetina: true,
  }), [pageColors, particleCount, particleSpeed, linkOpacity, isAITyping]);

  return (
    <>
      {/* Optimized Aurora/Nebula background effect */}
      <div className="absolute inset-0 -z-20">
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000" // Reduced opacity from 30
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${pageColors[0]}10 0%, transparent 50%), 
                        radial-gradient(ellipse at 80% 20%, ${pageColors[1]}08 0%, transparent 50%), 
                        radial-gradient(ellipse at 40% 80%, ${pageColors[2]}06 0%, transparent 50%)` // Reduced opacity values
          }}
        />
      </div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleConfig}
        className="absolute inset-0 -z-10"
      />
    </>
  );
};

export default ParticleBackground;