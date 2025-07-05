import React, { useCallback } from 'react';
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
  
  // Get page-specific colors
  const getPageColors = () => {
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
  };

  const pageColors = getPageColors();
  const particleCount = isAITyping ? 120 : 60;
  const particleSpeed = isAITyping ? 1.5 : 0.5;
  const linkOpacity = isAITyping ? 0.4 : 0.2;

  return (
    <>
      {/* Aurora/Nebula background effect */}
      <div className="absolute inset-0 -z-20">
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${pageColors[0]}15 0%, transparent 50%), 
                        radial-gradient(ellipse at 80% 20%, ${pageColors[1]}10 0%, transparent 50%), 
                        radial-gradient(ellipse at 40% 80%, ${pageColors[2]}08 0%, transparent 50%)`
          },
        />
      </div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
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
                distance: isAITyping ? 150 : 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: pageColors,
            },
            links: {
              color: pageColors[0],
              distance: 150,
              enable: true,
              opacity: linkOpacity,
              width: isAITyping ? 1.5 : 1,
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
                area: 800,
              },
              value: particleCount,
            },
            opacity: {
              value: isAITyping ? 0.5 : 0.3,
              animation: {
                enable: isAITyping,
                speed: 2,
                minimumValue: 0.1,
                sync: false,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: isAITyping ? 4 : 3 },
              animation: {
                enable: isAITyping,
                speed: 3,
                minimumValue: 0.5,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />
    </>
  );
};

export default ParticleBackground;