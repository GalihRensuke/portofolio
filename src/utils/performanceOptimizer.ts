import { useEffect } from 'react';

interface PerformanceOptimizer {
  getOptimalParticleCount: () => number;
  cleanupParticles: () => void;
  simplifyAnimations: () => void;
}

export const performanceOptimizer = {
  // Optimize particles
  optimizeParticles: (): PerformanceOptimizer => {
    // Reduce particle count based on screen size
    const getOptimalParticleCount = (): number => {
      const width = window.innerWidth;
      if (width < 768) return 10; // Mobile
      if (width < 1024) return 15; // Tablet
      return 20; // Desktop
    };

    // Cleanup particles when not in view
    const cleanupParticles = (): void => {
      const particles = document.querySelectorAll<HTMLElement>('[class*="particle"]');
      particles.forEach(particle => {
        if (!particle.isConnected) {
          particle.remove();
        }
      });
    };

    // Simplify animations on mobile
    const simplifyAnimations = (): void => {
      const width = window.innerWidth;
      if (width < 768) { // Mobile devices
        // Simplify animations
        const animatedElements = document.querySelectorAll<HTMLElement>('[style*="transform"], [style*="animation"]');
        animatedElements.forEach(el => {
          el.style.animation = 'none';
          el.style.transition = 'none';
        });

        // Use mobile-specific animations
        const mobileElements = document.querySelectorAll<HTMLElement>('[class*="mobile"]');
        mobileElements.forEach(el => {
          el.style.animation = 'mobileFade 0.3s ease-in-out forwards';
        });
      }
    };

    return {
      getOptimalParticleCount,
      cleanupParticles,
      simplifyAnimations
    };
  },

  // Memory management
  manageMemory: () => {
    // Cleanup unused elements
    const cleanupUnusedElements = (): void => {
      // Cleanup unused canvas elements
      const canvases = document.querySelectorAll<HTMLCanvasElement>('canvas');
      canvases.forEach(canvas => {
        if (!canvas.isConnected) {
          canvas.remove();
        }
      });

      // Cleanup unused images
      const images = document.querySelectorAll<HTMLImageElement>('img');
      images.forEach(img => {
        if (!img.isConnected) {
          img.remove();
        }
      });
    };

    // Periodic cleanup
    const startMemoryCleanup = (): void => {
      setInterval(() => {
        cleanupUnusedElements();
      }, 30000); // Every 30 seconds
    };

    return { startMemoryCleanup };
  }
};

// Initialize performance optimizations
export const usePerformanceOptimizations = () => {
  const { optimizeParticles, manageMemory } = performanceOptimizer;
  const { getOptimalParticleCount, cleanupParticles, simplifyAnimations } = optimizeParticles();
  const { startMemoryCleanup } = manageMemory();

  useEffect(() => {
    // Initialize optimizations
    startMemoryCleanup();
    simplifyAnimations();
    
    // Cleanup on unmount
    return () => {
      cleanupParticles();
    };
  }, []);

  return {
    getOptimalParticleCount,
    cleanupParticles,
    simplifyAnimations
  };
};
